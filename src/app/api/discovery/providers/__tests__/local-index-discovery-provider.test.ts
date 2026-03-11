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

jest.mock("@/utils/formatDatasetLanguage", () => ({
  __esModule: true,
  default: (language: string) => {
    const code = language.split("/").pop();

    if (code === "ENG") {
      return "English";
    }

    if (code === "FRA") {
      return "French";
    }

    return undefined;
  },
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
        {
          id: "a",
          identifier: "IDENT-A",
          title: "Dataset A",
          description: "desc-a",
          catalogue: "catalogue-a",
          languages: [
            "http://publications.europa.eu/resource/authority/language/ENG",
          ],
          createdAt: "2024-01-01T00:00:00.000Z",
          modifiedAt: "2024-03-10T00:00:00.000Z",
          version: "1.0.0",
          hasVersions: [{ value: "v1", label: "Version 1" }],
          versionNotes: "Initial release",
        },
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
          identifier: "IDENT-A",
          title: "Dataset A",
          description: "desc-a",
          catalogue: "catalogue-a",
          languages: [
            {
              value:
                "http://publications.europa.eu/resource/authority/language/ENG",
              label: "English",
            },
          ],
          createdAt: "2024-01-01T00:00:00.000Z",
          modifiedAt: "2024-03-10T00:00:00.000Z",
          version: "1.0.0",
          hasVersions: [{ value: "v1", label: "Version 1" }],
          versionNotes: "Initial release",
          publishers: [],
          themes: [],
          keywords: [],
        },
        {
          id: "b",
          identifier: "",
          title: "Dataset B",
          description: "",
          catalogue: "",
          languages: [],
          createdAt: undefined,
          modifiedAt: undefined,
          version: undefined,
          hasVersions: undefined,
          versionNotes: undefined,
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
      languages: [
        "http://publications.europa.eu/resource/authority/language/FRA",
      ],
      createdAt: "2024-01-01T00:00:00.000Z",
      modifiedAt: "2024-03-10T00:00:00.000Z",
      version: "1.0.0",
      hasVersions: [{ value: "v1", label: "Version 1" }],
      versionNotes: "Initial release",
    });

    await expect(provider.retrieveDataset("a")).resolves.toEqual({
      id: "a",
      identifier: "",
      title: "Dataset A",
      description: "desc-a",
      catalogue: "",
      languages: [
        {
          value:
            "http://publications.europa.eu/resource/authority/language/FRA",
          label: "French",
        },
      ],
      createdAt: "2024-01-01T00:00:00.000Z",
      modifiedAt: "2024-03-10T00:00:00.000Z",
      version: "1.0.0",
      hasVersions: [{ value: "v1", label: "Version 1" }],
      versionNotes: "Initial release",
      publishers: [],
      themes: [],
      keywords: [],
      populationCoverage: undefined,
      spatialResolutionInMeters: undefined,
      spatialCoverage: undefined,
    });

    mockStore.retrieveDataset.mockResolvedValueOnce(null);
    await expect(provider.retrieveDataset("missing")).rejects.toThrow(
      "Dataset not found in local index: missing"
    );
  });

  test("retrieveDataset defaults description to empty string when not present", async () => {
    mockStore.retrieveDataset.mockResolvedValueOnce({
      id: "b",
      title: "Dataset B",
    });

    await expect(provider.retrieveDataset("b")).resolves.toEqual({
      id: "b",
      identifier: "",
      title: "Dataset B",
      description: "",
      catalogue: "",
      languages: [],
      createdAt: undefined,
      modifiedAt: undefined,
      version: undefined,
      hasVersions: undefined,
      publishers: [],
      themes: [],
      keywords: [],
      populationCoverage: undefined,
      spatialResolutionInMeters: undefined,
      spatialCoverage: undefined,
    });
  });

  test("retrieveDataset preserves identifier and catalogue when present", async () => {
    mockStore.retrieveDataset.mockResolvedValueOnce({
      id: "c",
      identifier: "IDENT-C",
      title: "Dataset C",
      description: "desc-c",
      catalogue: "catalogue-c",
      languages: ["custom-language-code"],
      createdAt: "2024-02-15T00:00:00.000Z",
      version: "2.0.0",
    });

    await expect(provider.retrieveDataset("c")).resolves.toEqual({
      id: "c",
      identifier: "IDENT-C",
      title: "Dataset C",
      description: "desc-c",
      catalogue: "catalogue-c",
      languages: [
        { value: "custom-language-code", label: "custom-language-code" },
      ],
      createdAt: "2024-02-15T00:00:00.000Z",
      version: "2.0.0",
      publishers: [],
      themes: [],
      keywords: [],
      populationCoverage: undefined,
      spatialResolutionInMeters: undefined,
      spatialCoverage: undefined,
    });
  });

  test("retrieveDataset maps new fields when present", async () => {
    mockStore.retrieveDataset.mockResolvedValueOnce({
      id: "d",
      title: "Dataset D",
      description: "desc-d",
      populationCoverage: "People of LNDS.",
    });

    await expect(provider.retrieveDataset("d")).resolves.toEqual({
      id: "d",
      identifier: "",
      title: "Dataset D",
      description: "desc-d",
      catalogue: "",
      languages: [],
      publishers: [],
      themes: [],
      keywords: [],
      populationCoverage: "People of LNDS.",
      spatialResolutionInMeters: undefined,
      spatialCoverage: undefined,
    });
  });
});
