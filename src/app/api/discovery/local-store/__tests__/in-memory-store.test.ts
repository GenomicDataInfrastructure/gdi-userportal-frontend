// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { InMemoryDiscoveryStore } from "@/app/api/discovery/local-store/in-memory-store";

describe("InMemoryDiscoveryStore", () => {
  test("has memory key and ensureInitialized resolves", async () => {
    const store = new InMemoryDiscoveryStore();

    expect(store.key).toBe("memory");
    await expect(store.ensureInitialized()).resolves.toBeUndefined();
  });

  test("upserts datasets and retrieves by id", async () => {
    const store = new InMemoryDiscoveryStore();
    await store.upsertDatasets([
      { id: "a", title: "Alpha", description: "desc-a" },
      { id: "b", title: "Beta" },
    ]);

    await expect(store.retrieveDataset("a")).resolves.toEqual({
      id: "a",
      title: "Alpha",
      description: "desc-a",
    });
    await expect(store.retrieveDataset("missing")).resolves.toBeNull();
  });

  test("searches without query and applies pagination", async () => {
    const store = new InMemoryDiscoveryStore();
    await store.upsertDatasets([
      { id: "a", title: "Alpha" },
      { id: "b", title: "Beta" },
      { id: "c", title: "Gamma" },
    ]);

    const response = await store.searchDatasets({ start: 1, rows: 1 });

    expect(response.count).toBe(3);
    expect(response.results).toEqual([{ id: "b", title: "Beta" }]);
  });

  test("searches case-insensitively with trimmed query", async () => {
    const store = new InMemoryDiscoveryStore();
    await store.upsertDatasets([
      { id: "a", title: "Lux Data" },
      { id: "b", title: "Open Catalogue" },
      { id: "c", title: "LUX genome index" },
    ]);

    const response = await store.searchDatasets({ query: "  LuX  " });

    expect(response.count).toBe(2);
    expect(response.results.map((dataset) => dataset.id)).toEqual(["a", "c"]);
  });
});
