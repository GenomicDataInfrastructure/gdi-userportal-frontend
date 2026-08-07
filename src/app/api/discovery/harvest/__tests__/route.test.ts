// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { jest } from "@jest/globals";

const mockHarvestLocalIndexFromDcatUrlApi =
  jest.fn<(url: string, options?: { mode?: string }) => Promise<number>>();
const mockHarvestLocalIndexFromDcatFileApi =
  jest.fn<(path: string, options?: { mode?: string }) => Promise<number>>();

jest.mock("@/app/api/discovery/local-index", () => ({
  harvestLocalIndexFromDcatUrlApi: mockHarvestLocalIndexFromDcatUrlApi,
  harvestLocalIndexFromDcatFileApi: mockHarvestLocalIndexFromDcatFileApi,
}));

import { POST } from "@/app/api/discovery/harvest/route";

describe("POST /api/discovery/harvest", () => {
  const originalSecret = process.env.HARVEST_INTERNAL_SECRET;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    if (originalSecret === undefined) {
      delete process.env.HARVEST_INTERNAL_SECRET;
    } else {
      process.env.HARVEST_INTERNAL_SECRET = originalSecret;
    }
  });

  test("returns 404 when the shared secret is not configured", async () => {
    delete process.env.HARVEST_INTERNAL_SECRET;

    const response = await POST(
      new Request("http://localhost/api/discovery/harvest", {
        method: "POST",
        body: JSON.stringify({ url: "https://example.org/catalogue.rdf" }),
      })
    );

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({ error: "Not found" });
  });

  test("returns 401 when the provided secret is missing", async () => {
    process.env.HARVEST_INTERNAL_SECRET = "top-secret";

    const response = await POST(
      new Request("http://localhost/api/discovery/harvest", {
        method: "POST",
        body: JSON.stringify({ url: "https://example.org/catalogue.rdf" }),
      })
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "Unauthorized" });
  });

  test("returns 400 when both url and path are missing", async () => {
    process.env.HARVEST_INTERNAL_SECRET = "top-secret";

    const response = await POST(
      new Request("http://localhost/api/discovery/harvest", {
        method: "POST",
        headers: {
          "x-harvest-secret": "top-secret",
        },
        body: JSON.stringify({}),
      })
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: 'Missing required field "url" or "path"',
    });
  });

  test("returns 400 when the JSON body is null", async () => {
    process.env.HARVEST_INTERNAL_SECRET = "top-secret";

    const response = await POST(
      new Request("http://localhost/api/discovery/harvest", {
        method: "POST",
        headers: {
          "x-harvest-secret": "top-secret",
        },
        body: JSON.stringify(null),
      })
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: 'Missing required field "url" or "path"',
    });
  });

  test("returns 200 with count when harvesting from a file path", async () => {
    process.env.HARVEST_INTERNAL_SECRET = "top-secret";
    mockHarvestLocalIndexFromDcatFileApi.mockResolvedValueOnce(7);

    const response = await POST(
      new Request("http://localhost/api/discovery/harvest", {
        method: "POST",
        headers: {
          "x-harvest-secret": "top-secret",
        },
        body: JSON.stringify({ path: "no-data-dict.rdf" }),
      })
    );

    expect(mockHarvestLocalIndexFromDcatFileApi).toHaveBeenCalledWith(
      "no-data-dict.rdf",
      { mode: "replace" }
    );
    expect(mockHarvestLocalIndexFromDcatUrlApi).not.toHaveBeenCalled();
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ count: 7 });
  });

  test("prefers the file path over the url when both are provided", async () => {
    process.env.HARVEST_INTERNAL_SECRET = "top-secret";
    mockHarvestLocalIndexFromDcatFileApi.mockResolvedValueOnce(2);

    const response = await POST(
      new Request("http://localhost/api/discovery/harvest", {
        method: "POST",
        headers: {
          "x-harvest-secret": "top-secret",
        },
        body: JSON.stringify({
          url: "https://example.org/catalogue.rdf",
          path: "no-data-dict.rdf",
        }),
      })
    );

    expect(mockHarvestLocalIndexFromDcatFileApi).toHaveBeenCalledWith(
      "no-data-dict.rdf",
      { mode: "replace" }
    );
    expect(mockHarvestLocalIndexFromDcatUrlApi).not.toHaveBeenCalled();
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ count: 2 });
  });

  test("returns 200 with count when harvest succeeds", async () => {
    process.env.HARVEST_INTERNAL_SECRET = "top-secret";
    mockHarvestLocalIndexFromDcatUrlApi.mockResolvedValueOnce(12);

    const response = await POST(
      new Request("http://localhost/api/discovery/harvest", {
        method: "POST",
        headers: {
          authorization: "Bearer top-secret",
        },
        body: JSON.stringify({ url: "https://example.org/catalogue.rdf" }),
      })
    );

    expect(mockHarvestLocalIndexFromDcatUrlApi).toHaveBeenCalledWith(
      "https://example.org/catalogue.rdf",
      { mode: "replace" }
    );
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ count: 12 });
  });

  test("passes append mode to the harvester", async () => {
    process.env.HARVEST_INTERNAL_SECRET = "top-secret";
    mockHarvestLocalIndexFromDcatUrlApi.mockResolvedValueOnce(4);

    const response = await POST(
      new Request("http://localhost/api/discovery/harvest", {
        method: "POST",
        headers: {
          "x-harvest-secret": "top-secret",
        },
        body: JSON.stringify({
          url: "https://example.org/catalogue.rdf",
          mode: "append",
        }),
      })
    );

    expect(mockHarvestLocalIndexFromDcatUrlApi).toHaveBeenCalledWith(
      "https://example.org/catalogue.rdf",
      { mode: "append" }
    );
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ count: 4 });
  });

  test("returns 400 when mode is invalid", async () => {
    process.env.HARVEST_INTERNAL_SECRET = "top-secret";

    const response = await POST(
      new Request("http://localhost/api/discovery/harvest", {
        method: "POST",
        headers: {
          "x-harvest-secret": "top-secret",
        },
        body: JSON.stringify({
          url: "https://example.org/catalogue.rdf",
          mode: "merge",
        }),
      })
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: 'Invalid field "mode". Expected "replace" or "append".',
    });
    expect(mockHarvestLocalIndexFromDcatUrlApi).not.toHaveBeenCalled();
  });

  test("returns 500 with error message when harvest throws", async () => {
    process.env.HARVEST_INTERNAL_SECRET = "top-secret";
    mockHarvestLocalIndexFromDcatUrlApi.mockRejectedValueOnce(
      new Error("harvest failed")
    );

    const response = await POST(
      new Request("http://localhost/api/discovery/harvest", {
        method: "POST",
        headers: {
          "x-harvest-secret": "top-secret",
        },
        body: JSON.stringify({ url: "https://example.org/catalogue.rdf" }),
      })
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ error: "harvest failed" });
  });
});
