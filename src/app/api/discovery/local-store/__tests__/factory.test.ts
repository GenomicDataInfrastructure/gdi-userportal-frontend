// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { jest } from "@jest/globals";

describe("local-store factory", () => {
  afterEach(() => {
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
    const datasets = [{ id: "d1", title: "Dataset 1" }];

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
});
