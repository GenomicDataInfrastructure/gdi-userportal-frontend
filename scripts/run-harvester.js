// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

function parseArgs(argv) {
  const args = { url: "" };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--url") {
      args.url = argv[i + 1] || "";
      i += 1;
    } else if (token === "--help" || token === "-h") {
      args.help = true;
    }
  }

  return args;
}

function printUsage() {
  console.log(
    [
      "Usage:",
      "  npm run harvest:dcat -- --url <catalogue-rdf-url>",
      "",
      "Example:",
      "  npm run harvest:dcat -- \\",
      "    --url https://letzdata.public.lu/content/dam/dga/ctie/c/catalogue.rdf",
    ].join("\n")
  );
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help || !args.url) {
    printUsage();
    process.exit(args.help ? 0 : 1);
  }

  const endpoint = "http://localhost:3000/api/discovery/harvest";
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: args.url }),
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(
      `Harvest failed (${response.status}): ${payload?.error || response.statusText}`
    );
  }

  console.log(
    `Harvest completed: ${payload.count} datasets indexed from ${args.url}`
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
