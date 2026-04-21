// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { jest } from "@jest/globals";

const mockHarvestLocalIndexFromDcatUrlApi =
  jest.fn<(url: string) => Promise<number>>();

jest.mock("@/app/api/discovery/local-index", () => ({
  harvestLocalIndexFromDcatUrlApi: mockHarvestLocalIndexFromDcatUrlApi,
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

  test("returns 400 when url is missing", async () => {
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
      error: 'Missing required field "url"',
    });
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
      "https://example.org/catalogue.rdf"
    );
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ count: 12 });
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
