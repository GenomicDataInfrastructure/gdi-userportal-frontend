// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { jest } from "@jest/globals";
import {
  LocalDiscoveryDataset,
  LocalDiscoverySearchResult,
} from "@/app/api/discovery/local-store/types";
import { buildLocalDiscoveryDataset } from "@/app/api/discovery/test-utils/fixtures";

const mockStore = {
  key: "opensearch",
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
    if (code === "ENG") return "English";
    if (code === "FRA") return "French";
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

  test("exposes expected key, capabilities, and empty filters", async () => {
    expect(provider.key).toBe("local-index");
    expect(provider.capabilities).toEqual({
      supportsBeaconEnrichment: false,
      supportsGVariants: false,
      supportsFilterEntries: false,
    });

    await expect(provider.retrieveFilters({})).resolves.toEqual([]);
    await expect(provider.retrieveFilterValues("theme", {})).resolves.toEqual(
      []
    );
  });

  test("searchDatasets maps a canonical dataset fixture and applies defaults", async () => {
    mockStore.searchDatasets.mockResolvedValueOnce({
      count: 2,
      results: [
        buildLocalDiscoveryDataset({ identifier: "IDENT-A" }),
        { id: "b", title: "Dataset B" },
      ],
    });

    await expect(
      provider.searchDatasets({ query: "Dataset", start: 5, rows: 10 }, {})
    ).resolves.toEqual({
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
          numberOfUniqueIndividuals: 25000,
          maxTypicalAge: 95,
          minTypicalAge: 18,
          recordsCount: 2,
          publishers: [],
          themes: [],
          keywords: [],
          populationCoverage: "People of LNDS.",
          spatialResolutionInMeters: 4,
          spatialCoverage: [
            {
              uri: {
                value:
                  "http://publications.europa.eu/resource/authority/country/LUX",
                label:
                  "http://publications.europa.eu/resource/authority/country/LUX",
              },
              text: "Luxembourg",
            },
          ],
          accessRights: {
            value:
              "http://publications.europa.eu/resource/authority/access-right/PUBLIC",
            label: "Public",
          },
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
          numberOfUniqueIndividuals: undefined,
          maxTypicalAge: undefined,
          minTypicalAge: undefined,
          recordsCount: 2,
          publishers: [],
          themes: [],
          keywords: [],
          populationCoverage: undefined,
          spatialResolutionInMeters: undefined,
          spatialCoverage: undefined,
          accessRights: undefined,
        },
      ],
    });

    expect(mockStore.ensureInitialized).toHaveBeenCalled();
    expect(mockStore.searchDatasets).toHaveBeenCalledWith({
      query: "Dataset",
      start: 5,
      rows: 10,
    });
  });

  test("retrieveDataset maps the canonical fixture for API consumers", async () => {
    mockStore.retrieveDataset.mockResolvedValueOnce(
      buildLocalDiscoveryDataset({
        id: "retrieve-id",
        identifier: "IDENT-R",
        languages: [
          "http://publications.europa.eu/resource/authority/language/FRA",
        ],
        spatialCoverage: [
          {
            uri: "http://publications.europa.eu/resource/authority/country/ITA",
            text: "Italy",
            geom: "POLYGON((...))",
            bbox: "5,45,15,48",
            centroid: "POINT(10 46)",
          },
        ],
        themes: [
          { value: "http://example.org/theme/health", label: "Health" },
          { value: "http://example.org/theme/science", label: "Science" },
        ],
        keywords: ["oncology", "genomics"],
        healthTheme: [
          { value: "http://example.org/health-theme/cancer", label: "Cancer" },
        ],
        healthCategory: [
          {
            value: "http://example.org/health-category/registries",
            label: "Registries",
          },
        ],
        dcatType: [
          {
            value: "http://example.org/dataset-type/STATISTICAL",
            label: "STATISTICAL",
          },
          {
            value: "http://example.org/dataset-type/CODE_LIST",
            label: "CODE_LIST",
          },
        ],
      })
    );

    await expect(provider.retrieveDataset("retrieve-id")).resolves.toEqual({
      id: "retrieve-id",
      identifier: "IDENT-R",
      title: "Dataset A",
      description: "desc-a",
      catalogue: "catalogue-a",
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
      numberOfUniqueIndividuals: 25000,
      maxTypicalAge: 95,
      minTypicalAge: 18,
      numberOfRecords: 50000,
      publishers: [],
      themes: [
        { value: "http://example.org/theme/health", label: "Health" },
        { value: "http://example.org/theme/science", label: "Science" },
      ],
      keywords: ["oncology", "genomics"],
      populationCoverage: "People of LNDS.",
      spatialResolutionInMeters: 4,
      spatialCoverage: [
        {
          uri: {
            value:
              "http://publications.europa.eu/resource/authority/country/ITA",
            label:
              "http://publications.europa.eu/resource/authority/country/ITA",
          },
          text: "Italy",
          geom: "POLYGON((...))",
          bbox: "5,45,15,48",
          centroid: "POINT(10 46)",
        },
      ],
      healthTheme: [
        { value: "http://example.org/health-theme/cancer", label: "Cancer" },
      ],
      healthCategory: [
        {
          value: "http://example.org/health-category/registries",
          label: "Registries",
        },
      ],
      dcatType: {
        value: "http://example.org/dataset-type/STATISTICAL",
        label: "STATISTICAL",
      },
      accessRights: {
        value:
          "http://publications.europa.eu/resource/authority/access-right/PUBLIC",
        label: "Public",
      },
      legalBasis: [
        {
          value: "GDPR Art. 6(1)(e)",
          label: "GDPR Art. 6(1)(e)",
        },
        {
          value: "GDPR Art. 6(1)(c)",
          label: "GDPR Art. 6(1)(c)",
        },
      ],
      applicableLegislation: [
        {
          value: "http://data.europa.eu/eli/reg/2016/679",
          label: "GDPR",
        },
        {
          value: "http://example.com/law/42",
          label: "Example Law 42",
        },
        {
          value: "http://example.com/law/99",
          label: "99",
        },
      ],
    });
  });

  test("retrieveDataset preserves unknown languages and text-only spatial coverage", async () => {
    mockStore.retrieveDataset.mockResolvedValueOnce(
      buildLocalDiscoveryDataset({
        id: "custom",
        identifier: undefined,
        description: undefined,
        catalogue: undefined,
        languages: ["custom-language-code"],
        spatialCoverage: [{ text: "Luxembourg" }],
        populationCoverage: undefined,
        spatialResolutionInMeters: undefined,
      })
    );

    await expect(provider.retrieveDataset("custom")).resolves.toEqual({
      id: "custom",
      identifier: "",
      title: "Dataset A",
      description: "",
      catalogue: "",
      languages: [
        { value: "custom-language-code", label: "custom-language-code" },
      ],
      createdAt: "2024-01-01T00:00:00.000Z",
      modifiedAt: "2024-03-10T00:00:00.000Z",
      version: "1.0.0",
      hasVersions: [{ value: "v1", label: "Version 1" }],
      versionNotes: "Initial release",
      numberOfUniqueIndividuals: 25000,
      maxTypicalAge: 95,
      minTypicalAge: 18,
      numberOfRecords: 50000,
      publishers: [],
      themes: [],
      keywords: [],
      populationCoverage: undefined,
      spatialResolutionInMeters: undefined,
      spatialCoverage: [{ uri: undefined, text: "Luxembourg" }],
      healthTheme: [],
      healthCategory: [],
      dcatType: undefined,
      accessRights: {
        value:
          "http://publications.europa.eu/resource/authority/access-right/PUBLIC",
        label: "Public",
      },
      legalBasis: [
        {
          value: "GDPR Art. 6(1)(e)",
          label: "GDPR Art. 6(1)(e)",
        },
        {
          value: "GDPR Art. 6(1)(c)",
          label: "GDPR Art. 6(1)(c)",
        },
      ],
      applicableLegislation: [
        {
          value: "http://data.europa.eu/eli/reg/2016/679",
          label: "GDPR",
        },
        {
          value: "http://example.com/law/42",
          label: "Example Law 42",
        },
        {
          value: "http://example.com/law/99",
          label: "99",
        },
      ],
    });
  });

  test("retrieveDataset throws when the dataset is missing", async () => {
    mockStore.retrieveDataset.mockResolvedValueOnce(null);

    await expect(provider.retrieveDataset("missing")).rejects.toThrow(
      "Dataset not found in local index: missing"
    );
  });
});
