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

  test("resolveLocalDiscoveryStoreKey resolves memory and defaults", async () => {
    const { resolveLocalDiscoveryStoreKey } =
      await import("@/app/api/discovery/local-store/factory");

    expect(resolveLocalDiscoveryStoreKey(undefined)).toBe("memory");
    expect(resolveLocalDiscoveryStoreKey("MEMORY")).toBe("memory");
  });

  test("resolveLocalDiscoveryStoreKey throws for unsupported value", async () => {
    const { resolveLocalDiscoveryStoreKey } =
      await import("@/app/api/discovery/local-store/factory");

    expect(() => resolveLocalDiscoveryStoreKey("sqlite")).toThrow(
      'Unsupported LOCAL_DISCOVERY_STORE "sqlite". Supported values: memory'
    );
  });

  test("getLocalDiscoveryStore returns cached memory store", async () => {
    const { getLocalDiscoveryStore } =
      await import("@/app/api/discovery/local-store/factory");

    process.env.LOCAL_DISCOVERY_STORE = "memory";

    const store1 = getLocalDiscoveryStore();
    const store2 = getLocalDiscoveryStore();

    expect(store1.key).toBe("memory");
    expect(store2).toBe(store1);
  });

  test("upsertLocalDiscoveryDatasets forwards to underlying store", async () => {
    process.env.LOCAL_DISCOVERY_STORE = "memory";
    const { getLocalDiscoveryStore, upsertLocalDiscoveryDatasets } =
      await import("@/app/api/discovery/local-store/factory");

    const store = getLocalDiscoveryStore();
    const spy = jest.spyOn(store, "upsertDatasets");
    const datasets = [{ id: "d1", title: "Dataset 1" }];

    await upsertLocalDiscoveryDatasets(datasets);

    expect(spy).toHaveBeenCalledWith(datasets);
  });
});
