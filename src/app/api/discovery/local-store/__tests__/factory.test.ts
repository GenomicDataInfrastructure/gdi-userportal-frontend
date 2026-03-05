// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { jest } from "@jest/globals";

describe("local-store factory", () => {
  const originalStoreEnv = process.env.LOCAL_DISCOVERY_STORE;

  afterEach(() => {
    if (originalStoreEnv === undefined) {
      delete process.env.LOCAL_DISCOVERY_STORE;
    } else {
      process.env.LOCAL_DISCOVERY_STORE = originalStoreEnv;
    }
    jest.resetModules();
  });

  test("resolveLocalDiscoveryStoreKey resolves elasticsearch and defaults", async () => {
    const { resolveLocalDiscoveryStoreKey } =
      await import("@/app/api/discovery/local-store/factory");

    expect(resolveLocalDiscoveryStoreKey(undefined)).toBe("elasticsearch");
    expect(resolveLocalDiscoveryStoreKey("ELASTICSEARCH")).toBe(
      "elasticsearch"
    );
  });

  test("resolveLocalDiscoveryStoreKey throws for unsupported value", async () => {
    const { resolveLocalDiscoveryStoreKey } =
      await import("@/app/api/discovery/local-store/factory");

    expect(() => resolveLocalDiscoveryStoreKey("postgres")).toThrow(
      'Unsupported LOCAL_DISCOVERY_STORE "postgres". Supported values: elasticsearch'
    );
  });

  test("getLocalDiscoveryStore returns cached elasticsearch store", async () => {
    const { getLocalDiscoveryStore } =
      await import("@/app/api/discovery/local-store/factory");

    process.env.LOCAL_DISCOVERY_STORE = "elasticsearch";

    const store1 = getLocalDiscoveryStore();
    const store2 = getLocalDiscoveryStore();

    expect(store1.key).toBe("elasticsearch");
    expect(store2).toBe(store1);
  });

  test("upsertLocalDiscoveryDatasets forwards to underlying store", async () => {
    process.env.LOCAL_DISCOVERY_STORE = "elasticsearch";
    const { getLocalDiscoveryStore, upsertLocalDiscoveryDatasets } =
      await import("@/app/api/discovery/local-store/factory");

    const store = getLocalDiscoveryStore();
    const spy = jest.spyOn(store, "upsertDatasets").mockResolvedValueOnce();
    const datasets = [{ id: "d1", title: "Dataset 1" }];

    await upsertLocalDiscoveryDatasets(datasets);

    expect(spy).toHaveBeenCalledWith(datasets);
  });
});
