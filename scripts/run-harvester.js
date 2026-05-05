// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

const { buildHarvestApiUrl, requestHarvest } = require("./harvest-http");

function parseArgs(argv) {
  const args = { url: "" };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--url") {
      args.url = argv[i + 1] || "";
      i += 1;
    } else if (token === "--secret") {
      args.secret = argv[i + 1] || "";
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
      "  npm run harvest:dcat -- --url <catalogue-rdf-url> --secret <shared-secret>",
      "",
      "Example:",
      "  npm run harvest:dcat -- \\",
      "    --url https://letzdata.public.lu/content/dam/dga/ctie/c/catalogue.rdf",
    ].join("\n")
  );
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const endpoint = buildHarvestApiUrl(
    process.env.HARVEST_BASE_URL || "http://localhost:3000"
  );
  const secret = String(
    args.secret || process.env.HARVEST_INTERNAL_SECRET || ""
  ).trim();

  if (args.help || !args.url) {
    printUsage();
    process.exit(args.help ? 0 : 1);
  }

  if (!secret) {
    throw new Error(
      "Missing harvest shared secret. Provide HARVEST_INTERNAL_SECRET or pass --secret."
    );
  }

  try {
    const count = await requestHarvest({
      apiUrl: endpoint,
      sourceUrl: args.url,
      secret,
    });

    console.log(
      `Harvest completed: ${count} datasets indexed from ${args.url}`
    );
  } catch (error) {
    throw new Error(
      [
        error instanceof Error ? error.message : String(error),
        "Make sure the Next.js server is running and HARVEST_BASE_URL points to the correct host.",
      ].join("\n")
    );
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
