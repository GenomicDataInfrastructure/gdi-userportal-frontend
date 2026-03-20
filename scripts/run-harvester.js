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

function formatErrorDetails(error) {
  if (!(error instanceof Error)) {
    return String(error);
  }

  const details = [error.message];
  let currentCause = error.cause;

  while (currentCause instanceof Error) {
    const context = [
      typeof currentCause.code === "string"
        ? `code=${currentCause.code}`
        : null,
      typeof currentCause.errno === "string" ||
      typeof currentCause.errno === "number"
        ? `errno=${currentCause.errno}`
        : null,
      typeof currentCause.syscall === "string"
        ? `syscall=${currentCause.syscall}`
        : null,
      typeof currentCause.hostname === "string"
        ? `hostname=${currentCause.hostname}`
        : null,
      typeof currentCause.host === "string"
        ? `host=${currentCause.host}`
        : null,
      typeof currentCause.port === "string" ||
      typeof currentCause.port === "number"
        ? `port=${currentCause.port}`
        : null,
    ].filter(Boolean);

    const causeText = context.length
      ? `${currentCause.message} (${context.join(", ")})`
      : currentCause.message;

    if (causeText) {
      details.push(`cause: ${causeText}`);
    }

    currentCause = currentCause.cause;
  }

  return details.join(" | ");
}

function truncateText(value, limit = 400) {
  if (typeof value !== "string") {
    return "";
  }

  const compact = value.replace(/\s+/g, " ").trim();
  if (!compact) {
    return "";
  }

  return compact.length > limit ? `${compact.slice(0, limit)}...` : compact;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help || !args.url) {
    printUsage();
    process.exit(args.help ? 0 : 1);
  }

  const endpoint = "http://localhost:3000/api/discovery/harvest";
  let response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: args.url }),
    });
  } catch (error) {
    throw new Error(
      [
        `Failed to call local harvest API at ${endpoint}`,
        `requested catalogue URL: ${args.url}`,
        `details: ${formatErrorDetails(error)}`,
        "Make sure the Next.js dev server is running and reachable on localhost:3000.",
      ].join("\n")
    );
  }

  let responseText = "";
  try {
    responseText = await response.text();
  } catch (error) {
    throw new Error(
      [
        `Failed to read harvest API response from ${endpoint}`,
        `status: ${response.status} ${response.statusText}`,
        `requested catalogue URL: ${args.url}`,
        `details: ${formatErrorDetails(error)}`,
      ].join("\n")
    );
  }

  let payload = {};
  try {
    payload = responseText ? JSON.parse(responseText) : {};
  } catch (error) {
    throw new Error(
      [
        `Harvest API at ${endpoint} returned invalid JSON`,
        `status: ${response.status} ${response.statusText}`,
        `requested catalogue URL: ${args.url}`,
        `body: ${truncateText(responseText) || "<empty>"}`,
        `details: ${formatErrorDetails(error)}`,
      ].join("\n")
    );
  }

  if (!response.ok) {
    const responseError =
      typeof payload?.error === "string" && payload.error.trim()
        ? payload.error.trim()
        : truncateText(responseText);
    throw new Error(
      [
        `Harvest failed via ${endpoint}`,
        `status: ${response.status} ${response.statusText}`,
        `requested catalogue URL: ${args.url}`,
        `error: ${responseError || response.statusText}`,
      ].join("\n")
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
