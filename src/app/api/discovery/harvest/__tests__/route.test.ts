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
  const originalNodeEnv = process.env.NODE_ENV;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    (process.env as any).NODE_ENV = originalNodeEnv;
  });

  test("returns 404 outside development", async () => {
    (process.env as any).NODE_ENV = "production";

    const response = await POST(
      new Request("http://localhost/api/discovery/harvest", {
        method: "POST",
        body: JSON.stringify({ url: "https://example.org/catalogue.rdf" }),
      })
    );

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({ error: "Not found" });
  });

  test("returns 400 when url is missing", async () => {
    (process.env as any).NODE_ENV = "development";

    const response = await POST(
      new Request("http://localhost/api/discovery/harvest", {
        method: "POST",
        body: JSON.stringify({}),
      })
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: 'Missing required field "url"',
    });
  });

  test("returns 200 with count when harvest succeeds", async () => {
    (process.env as any).NODE_ENV = "development";
    mockHarvestLocalIndexFromDcatUrlApi.mockResolvedValueOnce(12);

    const response = await POST(
      new Request("http://localhost/api/discovery/harvest", {
        method: "POST",
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
    (process.env as any).NODE_ENV = "development";
    mockHarvestLocalIndexFromDcatUrlApi.mockRejectedValueOnce(
      new Error("harvest failed")
    );

    const response = await POST(
      new Request("http://localhost/api/discovery/harvest", {
        method: "POST",
        body: JSON.stringify({ url: "https://example.org/catalogue.rdf" }),
      })
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ error: "harvest failed" });
  });
});
