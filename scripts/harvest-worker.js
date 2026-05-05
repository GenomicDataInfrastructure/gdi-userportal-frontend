// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

const cron = require("node-cron");
const loadProperties = require("./generate-env");
const { buildHarvestApiUrl, requestHarvest } = require("./harvest-http");
const DEFAULT_HARVEST_BASE_URL = "http://gdi-userportal-frontend:3000";

function parseArgs(argv) {
  const args = { once: false };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--url") {
      args.url = argv[i + 1] || "";
      i += 1;
    } else if (token === "--schedule") {
      args.schedule = argv[i + 1] || "";
      i += 1;
    } else if (token === "--secret") {
      args.secret = argv[i + 1] || "";
      i += 1;
    } else if (token === "--once") {
      args.once = true;
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
      "  npm run harvest:worker",
      "  npm run harvest:worker:once -- --url <catalogue-rdf-url> --secret <shared-secret>",
      "",
      "Environment variables:",
      "  HARVEST_SOURCE_URL           Source DCAT catalogue URL",
      "  HARVEST_BASE_URL             Base URL for the frontend app (default: http://gdi-userportal-frontend:3000)",
      "  HARVEST_INTERNAL_SECRET      Shared secret sent as x-harvest-secret",
      "  HARVEST_SCHEDULE             Cron expression for recurring runs",
      "",
      "Flags:",
      "  --once                Run a single harvest and exit",
    ].join("\n")
  );
}

function resolveWorkerConfig(argv = process.argv.slice(2), env = process.env) {
  const args = parseArgs(argv);
  if (args.help) {
    return { help: true };
  }

  const once = args.once;
  const sourceUrl = String(args.url || env.HARVEST_SOURCE_URL || "").trim();
  const baseUrl = String(
    env.HARVEST_BASE_URL || DEFAULT_HARVEST_BASE_URL
  ).trim();
  const secret = String(
    args.secret || env.HARVEST_INTERNAL_SECRET || ""
  ).trim();
  const schedule = String(args.schedule || env.HARVEST_SCHEDULE || "").trim();

  if (!sourceUrl) {
    throw new Error(
      "Missing harvest source URL. Provide HARVEST_SOURCE_URL or pass --url."
    );
  }

  if (!secret) {
    throw new Error(
      "Missing harvest shared secret. Provide HARVEST_INTERNAL_SECRET or pass --secret."
    );
  }

  if (!once) {
    if (!schedule) {
      throw new Error(
        "Missing harvest schedule. Provide HARVEST_SCHEDULE or pass --schedule."
      );
    }

    if (!cron.validate(schedule)) {
      throw new Error(`Invalid harvest cron expression: ${schedule}`);
    }
  }

  return {
    once,
    sourceUrl,
    apiUrl: buildHarvestApiUrl(baseUrl),
    secret,
    schedule,
  };
}

async function triggerHarvest(config, dependencies = {}) {
  return requestHarvest(config, dependencies);
}

function createHarvestWorker(config, dependencies = {}) {
  const cronModule = dependencies.cronModule || cron;
  const fetchImpl = dependencies.fetchImpl || fetch;
  const logger = dependencies.logger || console;
  let runInProgress = false;

  const run = async () => {
    if (runInProgress) {
      logger.warn(
        `Skipping harvest for ${config.sourceUrl} because a previous run is still in progress.`
      );
      return null;
    }

    runInProgress = true;
    const startedAt = Date.now();
    logger.log(`Starting harvest for ${config.sourceUrl}`);

    try {
      const count = await triggerHarvest(config, { fetchImpl });
      const durationMs = Date.now() - startedAt;
      logger.log(
        `Harvest completed for ${config.sourceUrl}: ${count} datasets indexed in ${durationMs}ms`
      );
      return count;
    } finally {
      runInProgress = false;
    }
  };

  const start = async () => {
    if (config.once) {
      await run();
      return null;
    }

    logger.log(
      `Scheduling harvest for ${config.sourceUrl} with cron expression "${config.schedule}"`
    );

    const task = cronModule.schedule(config.schedule, () => {
      run().catch((error) => {
        logger.error(error instanceof Error ? error.message : String(error));
      });
    });

    return task;
  };

  return {
    run,
    start,
  };
}

async function main() {
  loadProperties();
  const config = resolveWorkerConfig();

  if (config.help) {
    printUsage();
    return;
  }

  const worker = createHarvestWorker(config);
  await worker.start();
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}

module.exports = {
  createHarvestWorker,
  buildHarvestApiUrl,
  parseArgs,
  printUsage,
  resolveWorkerConfig,
  triggerHarvest,
};
