// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { jest } from "@jest/globals";
import {
  LocalDiscoveryDataset,
  LocalDiscoverySearchResult,
} from "@/app/api/discovery/local-store/types";

const mockStore = {
  key: "elasticsearch",
  ensureInitialized: jest.fn<() => Promise<void>>(),
  searchDatasets:
    jest.fn<(_options: unknown) => Promise<LocalDiscoverySearchResult>>(),
  retrieveDataset:
    jest.fn<(_id: string) => Promise<LocalDiscoveryDataset | null>>(),
  upsertDatasets:
    jest.fn<(_datasets: LocalDiscoveryDataset[]) => Promise<void>>(),
};

jest.mock("@/app/api/discovery/local-store/factory", () => ({
  getLocalDiscoveryStore: () => mockStore,
}));

import { LocalIndexDiscoveryProvider } from "@/app/api/discovery/providers/local-index-discovery-provider";

describe("LocalIndexDiscoveryProvider", () => {
  let provider: LocalIndexDiscoveryProvider;

  beforeEach(() => {
    jest.clearAllMocks();
    provider = new LocalIndexDiscoveryProvider();
  });

  test("exposes expected key and capabilities", () => {
    expect(provider.key).toBe("local-index");
    expect(provider.capabilities).toEqual({
      supportsBeaconEnrichment: false,
      supportsGVariants: false,
      supportsFilterEntries: false,
    });
  });

  test("returns empty filters and filter values", async () => {
    await expect(provider.retrieveFilters({})).resolves.toEqual([]);
    await expect(provider.retrieveFilterValues("theme", {})).resolves.toEqual(
      []
    );
  });

  test("searchDatasets initializes store and maps local datasets", async () => {
    mockStore.searchDatasets.mockResolvedValueOnce({
      count: 2,
      results: [
        { id: "a", title: "Dataset A", description: "desc-a" },
        { id: "b", title: "Dataset B" },
      ],
    });

    const response = await provider.searchDatasets(
      { query: "Dataset", start: 5, rows: 10 },
      {}
    );

    expect(mockStore.ensureInitialized).toHaveBeenCalled();
    expect(mockStore.searchDatasets).toHaveBeenCalledWith({
      query: "Dataset",
      start: 5,
      rows: 10,
    });
    expect(response).toEqual({
      count: 2,
      results: [
        {
          id: "a",
          title: "Dataset A",
          description: "desc-a",
          publishers: [],
          themes: [],
          keywords: [],
        },
        {
          id: "b",
          title: "Dataset B",
          description: "",
          publishers: [],
          themes: [],
          keywords: [],
        },
      ],
    });
  });

  test("retrieveDataset maps dataset and throws when missing", async () => {
    mockStore.retrieveDataset.mockResolvedValueOnce({
      id: "a",
      title: "Dataset A",
      description: "desc-a",
    });

    await expect(provider.retrieveDataset("a")).resolves.toEqual({
      id: "a",
      title: "Dataset A",
      description: "desc-a",
      publishers: [],
      themes: [],
      keywords: [],
    });

    mockStore.retrieveDataset.mockResolvedValueOnce(null);
    await expect(provider.retrieveDataset("missing")).rejects.toThrow(
      "Dataset not found in local index: missing"
    );
  });
});
