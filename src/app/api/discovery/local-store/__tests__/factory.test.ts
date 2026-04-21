// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { jest } from "@jest/globals";

describe("local-store factory", () => {
  const originalEnv = {
    url: process.env.OPENSEARCH_URL,
    index: process.env.OPENSEARCH_DISCOVERY_INDEX,
    username: process.env.OPENSEARCH_USERNAME,
    password: process.env.OPENSEARCH_PASSWORD,
    apiKey: process.env.OPENSEARCH_API_KEY,
    insecure: process.env.OPENSEARCH_TLS_INSECURE,
  };

  afterEach(() => {
    if (originalEnv.url === undefined) delete process.env.OPENSEARCH_URL;
    else process.env.OPENSEARCH_URL = originalEnv.url;
    if (originalEnv.index === undefined)
      delete process.env.OPENSEARCH_DISCOVERY_INDEX;
    else process.env.OPENSEARCH_DISCOVERY_INDEX = originalEnv.index;
    if (originalEnv.username === undefined)
      delete process.env.OPENSEARCH_USERNAME;
    else process.env.OPENSEARCH_USERNAME = originalEnv.username;
    if (originalEnv.password === undefined)
      delete process.env.OPENSEARCH_PASSWORD;
    else process.env.OPENSEARCH_PASSWORD = originalEnv.password;
    if (originalEnv.apiKey === undefined) delete process.env.OPENSEARCH_API_KEY;
    else process.env.OPENSEARCH_API_KEY = originalEnv.apiKey;
    if (originalEnv.insecure === undefined)
      delete process.env.OPENSEARCH_TLS_INSECURE;
    else process.env.OPENSEARCH_TLS_INSECURE = originalEnv.insecure;
    jest.resetModules();
  });

  test("getLocalDiscoveryStore returns cached opensearch store", async () => {
    const { getLocalDiscoveryStore } =
      await import("@/app/api/discovery/local-store/factory");

    const store1 = getLocalDiscoveryStore();
    const store2 = getLocalDiscoveryStore();

    expect(store1.key).toBe("opensearch");
    expect(store2).toBe(store1);
  });

  test("upsertLocalDiscoveryDatasets forwards to underlying store", async () => {
    const { getLocalDiscoveryStore, upsertLocalDiscoveryDatasets } =
      await import("@/app/api/discovery/local-store/factory");

    const store = getLocalDiscoveryStore();
    const spy = jest.spyOn(store, "upsertDatasets").mockResolvedValueOnce();
    const datasets = [
      { id: "d1", title: "Dataset 1", publishers: [], hdab: [], creators: [] },
    ];

    await upsertLocalDiscoveryDatasets(datasets);

    expect(spy).toHaveBeenCalledWith(datasets);
  });

  test("clearLocalDiscoveryDatasets forwards to underlying store", async () => {
    const { getLocalDiscoveryStore, clearLocalDiscoveryDatasets } =
      await import("@/app/api/discovery/local-store/factory");

    const store = getLocalDiscoveryStore();
    const spy = jest.spyOn(store, "clearDatasets").mockResolvedValueOnce();

    await clearLocalDiscoveryDatasets();

    expect(spy).toHaveBeenCalled();
  });

  test("getLocalDiscoveryStore handles explicit tls-insecure flag value 1", async () => {
    process.env.OPENSEARCH_TLS_INSECURE = "1";

    const { getLocalDiscoveryStore } =
      await import("@/app/api/discovery/local-store/factory");

    expect(getLocalDiscoveryStore().key).toBe("opensearch");
  });
});
