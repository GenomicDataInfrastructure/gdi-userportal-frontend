// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

const {
  buildHarvestApiUrl,
  createHarvestWorker,
  resolveWorkerConfig,
  triggerHarvest,
} = require("../harvest-worker");
const HARVEST_ENDPOINT = buildHarvestApiUrl(
  "http://gdi-userportal-frontend:3000"
);

describe("harvest-worker", () => {
  test("resolveWorkerConfig supports one-shot mode without a schedule", () => {
    const config = resolveWorkerConfig(["--once"], {
      HARVEST_SOURCE_URL: "https://example.org/catalogue.rdf",
      HARVEST_INTERNAL_SECRET: "top-secret",
    });

    expect(config).toMatchObject({
      once: true,
      sourceUrl: "https://example.org/catalogue.rdf",
      apiUrl: HARVEST_ENDPOINT,
      secret: "top-secret",
    });
  });

  test("resolveWorkerConfig uses HARVEST_BASE_URL when provided", () => {
    const config = resolveWorkerConfig(["--once"], {
      HARVEST_SOURCE_URL: "https://example.org/catalogue.rdf",
      HARVEST_BASE_URL: "http://localhost:3000/",
      HARVEST_INTERNAL_SECRET: "top-secret",
    });

    expect(config.apiUrl).toBe(buildHarvestApiUrl("http://localhost:3000/"));
  });

  test("resolveWorkerConfig rejects an invalid recurring cron expression", () => {
    expect(() =>
      resolveWorkerConfig([], {
        HARVEST_SOURCE_URL: "https://example.org/catalogue.rdf",
        HARVEST_INTERNAL_SECRET: "top-secret",
        HARVEST_SCHEDULE: "not-a-cron",
      })
    ).toThrow("Invalid harvest cron expression: not-a-cron");
  });

  test("triggerHarvest posts the expected payload and returns the count", async () => {
    const fetchImpl = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      text: jest.fn().mockResolvedValue('{"count":12}'),
    });

    await expect(
      triggerHarvest(
        {
          apiUrl: HARVEST_ENDPOINT,
          sourceUrl: "https://example.org/catalogue.rdf",
          secret: "top-secret",
        },
        { fetchImpl }
      )
    ).resolves.toBe(12);

    expect(fetchImpl).toHaveBeenCalledWith(
      HARVEST_ENDPOINT,
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          "x-harvest-secret": "top-secret",
        }),
        body: JSON.stringify({ url: "https://example.org/catalogue.rdf" }),
      })
    );
  });

  test("triggerHarvest surfaces API response failures", async () => {
    const fetchImpl = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
      text: jest.fn().mockResolvedValue('{"error":"Unauthorized"}'),
    });

    await expect(
      triggerHarvest(
        {
          apiUrl: HARVEST_ENDPOINT,
          sourceUrl: "https://example.org/catalogue.rdf",
          secret: "top-secret",
        },
        { fetchImpl }
      )
    ).rejects.toThrow(`Harvest trigger failed via ${HARVEST_ENDPOINT}`);
  });

  test("createHarvestWorker schedules recurring jobs", async () => {
    const fetchImpl = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      text: jest.fn().mockResolvedValue('{"count":3}'),
    });
    const schedule = jest.fn().mockReturnValue({ stop: jest.fn() });
    const cronModule = { schedule };
    const logger = {
      log: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };

    const worker = createHarvestWorker(
      {
        once: false,
        sourceUrl: "https://example.org/catalogue.rdf",
        apiUrl: HARVEST_ENDPOINT,
        secret: "top-secret",
        schedule: "*/15 * * * *",
      },
      { cronModule, fetchImpl, logger }
    );

    await worker.start();

    expect(schedule).toHaveBeenCalledWith("*/15 * * * *", expect.any(Function));
    expect(fetchImpl).not.toHaveBeenCalled();
    expect(logger.log).toHaveBeenCalledWith(
      'Scheduling harvest for https://example.org/catalogue.rdf with cron expression "*/15 * * * *"'
    );
  });
});
