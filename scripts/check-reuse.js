// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

/**
 * Pre-commit REUSE check for the files lint-staged passes in.
 *
 * A file is compliant when it contains both an `SPDX-FileCopyrightText` and an
 * `SPDX-License-Identifier` tag, when a `<file>.license` sidecar holds them,
 * or when an `[[annotations]]` entry in a REUSE.toml in the same or a parent
 * directory covers it with both tags. This covers the REUSE features this
 * repository uses; the full `reuse lint` still runs in CI.
 *
 * Usage: node scripts/check-reuse.js <file>...
 */

const fs = require("fs");
const path = require("path");

const COPYRIGHT_TAG = "SPDX-FileCopyrightText";
const LICENSE_TAG = "SPDX-License-Identifier";

// Paths the REUSE specification does not require to carry licensing info.
const isIgnored = (file) => {
  const normalized = file.split(path.sep).join("/");
  const base = path.posix.basename(normalized);
  return (
    normalized.startsWith("LICENSES/") ||
    normalized.startsWith(".reuse/") ||
    normalized.includes("/.reuse/") ||
    base.endsWith(".license") ||
    /^(LICENSE|LICENCE|COPYING)(\..*)?$/.test(base) ||
    base === "REUSE.toml"
  );
};

const hasTags = (file) => {
  try {
    const content = fs.readFileSync(file, "latin1");
    return content.includes(COPYRIGHT_TAG) && content.includes(LICENSE_TAG);
  } catch {
    return false;
  }
};

// REUSE.toml globs: `**` matches across directories, `*` within one, `\*` is
// a literal asterisk. Paths are relative to the REUSE.toml's directory.
const globToRegExp = (glob) => {
  let source = "";
  for (let i = 0; i < glob.length; i++) {
    const char = glob[i];
    if (char === "\\" && glob[i + 1] === "*") {
      source += "\\*";
      i++;
    } else if (char === "*" && glob[i + 1] === "*") {
      source += ".*";
      i++;
    } else if (char === "*") {
      source += "[^/]*";
    } else {
      source += char.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
    }
  }
  return new RegExp(`^${source}$`);
};

// Minimal parser for the [[annotations]] tables of a REUSE.toml file.
const reuseTomlCache = new Map();
const readReuseToml = (dir) => {
  if (reuseTomlCache.has(dir)) {
    return reuseTomlCache.get(dir);
  }
  let annotations = [];
  try {
    const content = fs.readFileSync(path.join(dir, "REUSE.toml"), "utf8");
    annotations = content
      .split(/^\s*\[\[annotations\]\]\s*$/m)
      .slice(1)
      .map((block) => {
        const pathValue = block.match(/^\s*path\s*=\s*(\[[\s\S]*?\]|"[^"]*")/m);
        const globs = pathValue
          ? [...pathValue[1].matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((m) =>
              globToRegExp(m[1].replace(/\\\\/g, "\\"))
            )
          : [];
        const complete =
          new RegExp(`^\\s*"?${COPYRIGHT_TAG}"?\\s*=`, "m").test(block) &&
          new RegExp(`^\\s*"?${LICENSE_TAG}"?\\s*=`, "m").test(block);
        return { globs, complete };
      })
      .filter(({ globs, complete }) => complete && globs.length > 0);
  } catch {
    // No REUSE.toml in this directory.
  }
  reuseTomlCache.set(dir, annotations);
  return annotations;
};

const coveredByReuseToml = (file) => {
  let dir = path.dirname(path.resolve(file));
  const root = process.cwd();
  while (dir.startsWith(root)) {
    const relative = path.relative(dir, path.resolve(file));
    const posixRelative = relative.split(path.sep).join("/");
    if (
      readReuseToml(dir).some(({ globs }) =>
        globs.some((glob) => glob.test(posixRelative))
      )
    ) {
      return true;
    }
    if (dir === root) break;
    dir = path.dirname(dir);
  }
  return false;
};

const isCompliant = (file) => {
  const sidecar = `${file}.license`;
  if (fs.existsSync(sidecar)) {
    return hasTags(sidecar);
  }
  return hasTags(file) || coveredByReuseToml(file);
};

const files = process.argv
  .slice(2)
  .map((file) => path.relative(process.cwd(), path.resolve(file)))
  .filter((file) => {
    try {
      const stat = fs.lstatSync(file);
      return stat.isFile() && !stat.isSymbolicLink();
    } catch {
      return false; // deleted or renamed away
    }
  })
  .filter((file) => !isIgnored(file));

const missing = files.filter((file) => !isCompliant(file));

if (missing.length > 0) {
  console.error(
    "REUSE: these files have no copyright and licence information:\n"
  );
  for (const file of missing) {
    console.error(`  - ${file}`);
  }
  console.error(`
Add a header to each file, for example:

  // SPDX-FileCopyrightText: ${new Date().getFullYear()} PNED G.I.E.
  //
  // SPDX-License-Identifier: Apache-2.0

or, for files that cannot hold a comment (images, JSON, generated files),
create a "<file>.license" file next to it with those two lines.
See https://reuse.software/tutorial/ and CONTRIBUTING.md.`);
  process.exit(1);
}
