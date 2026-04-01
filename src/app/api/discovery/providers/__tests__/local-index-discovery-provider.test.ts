// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { jest } from "@jest/globals";
import {
  LocalDiscoveryDataset,
  LocalDiscoverySearchResult,
} from "@/app/api/discovery/local-store/types";
import { buildLocalDiscoveryDataset } from "@/app/api/discovery/test-utils/fixtures";
import { parseRdfXmlToQuads } from "@/app/api/discovery/harvester/rdf-quad-loader";

const mockStore = {
  key: "opensearch",
  ensureInitialized: jest.fn<() => Promise<void>>(),
  retrieveFilterValues: jest.fn<(_key: string) => Promise<unknown[]>>(),
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

  const hasQuad = (
    quads: Awaited<ReturnType<typeof parseRdfXmlToQuads>>,
    {
      subject,
      predicate,
      object,
      objectTermType,
    }: {
      subject?: string;
      predicate: string;
      object?: string;
      objectTermType?: "NamedNode" | "Literal" | "BlankNode";
    }
  ) =>
    quads.some(
      (quad) =>
        (!subject || quad.subject.value === subject) &&
        quad.predicate.value === predicate &&
        (!object || quad.object.value === object) &&
        (!objectTermType || quad.object.termType === objectTermType)
    );

  beforeEach(() => {
    jest.clearAllMocks();
    provider = new LocalIndexDiscoveryProvider();
    mockStore.retrieveFilterValues.mockResolvedValue([]);
  });

  test("exposes expected key, capabilities, and local filters", async () => {
    expect(provider.key).toBe("local-index");
    expect(provider.capabilities).toEqual({
      supportsBeaconEnrichment: false,
      supportsGVariants: false,
      supportsFilterEntries: false,
    });

    mockStore.retrieveFilterValues.mockImplementation(async (key) => {
      if (key === "theme") {
        return [{ value: "Health", label: "Health", count: 3 }];
      }

      if (key === "publisherName") {
        return [{ value: "LNDS", label: "LNDS", count: 2 }];
      }

      return [];
    });

    await expect(provider.retrieveFilters({})).resolves.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          source: "local-index",
          key: "theme",
          type: "DROPDOWN",
          values: [{ value: "Health", label: "Health", count: 3 }],
        }),
        expect.objectContaining({
          source: "local-index",
          key: "publisherName",
          type: "DROPDOWN",
          values: [{ value: "LNDS", label: "LNDS", count: 2 }],
        }),
        expect.objectContaining({
          source: "local-index",
          key: "modified",
          type: "DATETIME",
          operators: ["=", ">", "<", ">=", "<=", "!"],
        }),
      ])
    );

    await expect(provider.retrieveFilterValues("theme", {})).resolves.toEqual([
      { value: "Health", label: "Health", count: 3 },
    ]);
  });

  test("searchDatasets maps a canonical dataset fixture and applies defaults", async () => {
    mockStore.searchDatasets.mockResolvedValueOnce({
      count: 2,
      results: [
        buildLocalDiscoveryDataset({ identifier: "IDENT-A" }),
        { id: "b", title: "Dataset B", publishers: [], hdab: [], creators: [] },
      ],
    });

    await expect(
      provider.searchDatasets(
        {
          query: "Dataset",
          facets: [
            {
              source: "local-index",
              type: "DROPDOWN",
              key: "identifier",
              value: "IDENT-A",
            },
          ],
          sort: "issued desc",
          start: 5,
          rows: 10,
          operator: "AND",
        },
        {}
      )
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
          distributionsCount: 3,
          publishers: [
            {
              name: "org",
              email: "a@mail.com",
              type: {
                value: "http://purl.org/adms/publishertype/Company",
                label: "Company",
              },
              url: undefined,
              uri: undefined,
              homepage: undefined,
              identifier: undefined,
              actedOnBehalfOf: undefined,
            },
          ],
          themes: [],
          keywords: [],
          conformsTo: [
            {
              value: "https://example.org/spec/healthdcat-ap-v6",
              label: "HealthDCAT-AP v6",
            },
          ],
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
              geom: undefined,
              bbox: undefined,
              centroid: undefined,
            },
          ],
          temporalCoverage: {
            start: "2022-01-01T00:00:00.000Z",
            end: "2023-01-01T00:00:00.000Z",
          },
          retentionPeriod: [
            {
              start: "2026-03-13T00:00:00.000Z",
              end: "2026-03-20T00:00:00.000Z",
            },
          ],
          temporalResolution: "P1D",
          frequency: {
            value:
              "http://publications.europa.eu/resource/authority/frequency/ANNUAL",
            label: "Annual",
          },
          hdab: [
            {
              name: "Health Data Access Body Luxembourg",
              email: "hdab@health.lu",
              uri: "https://health.data.lu/hdab/luxembourg",
              url: undefined,
              homepage: undefined,
              identifier: undefined,
              type: undefined,
              actedOnBehalfOf: undefined,
            },
          ],
          creators: [
            {
              name: "org",
              email: undefined,
              url: undefined,
              uri: undefined,
              homepage: undefined,
              identifier: undefined,
              type: undefined,
              actedOnBehalfOf: undefined,
            },
          ],
          publisherType: [
            {
              value: "http://purl.org/adms/publishertype/Company",
              label: "Company",
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
          distributionsCount: undefined,
          publishers: [],
          hdab: [],
          themes: [],
          keywords: [],
          conformsTo: [],
          populationCoverage: undefined,
          spatialResolutionInMeters: undefined,
          spatialCoverage: undefined,
          accessRights: undefined,
          temporalCoverage: undefined,
          retentionPeriod: undefined,
          temporalResolution: undefined,
          frequency: undefined,
          creators: [],
          publisherType: undefined,
        },
      ],
    });

    expect(mockStore.ensureInitialized).toHaveBeenCalled();
    expect(mockStore.searchDatasets).toHaveBeenCalledWith({
      query: "Dataset",
      facets: [
        {
          type: "DROPDOWN",
          key: "identifier",
          value: "IDENT-A",
        },
      ],
      sort: "issued desc",
      start: 5,
      rows: 10,
      operator: "AND",
    });
  });

  test("searchDatasets forwards supported sort modes to the local store", async () => {
    mockStore.searchDatasets.mockResolvedValueOnce({
      count: 0,
      results: [],
    });

    await provider.searchDatasets({ sort: "newest" }, {});

    expect(mockStore.searchDatasets).toHaveBeenCalledWith({
      query: undefined,
      sort: "newest",
      start: undefined,
      rows: undefined,
    });
  });

  test("searchDatasets forwards supported sort modes to the local store", async () => {
    mockStore.searchDatasets.mockResolvedValueOnce({
      count: 0,
      results: [],
    });

    await provider.searchDatasets({ sort: "newest" }, {});

    expect(mockStore.searchDatasets).toHaveBeenCalledWith({
      query: undefined,
      sort: "newest",
      start: undefined,
      rows: undefined,
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
      themes: [
        { value: "http://example.org/theme/health", label: "Health" },
        { value: "http://example.org/theme/science", label: "Science" },
      ],
      keywords: ["oncology", "genomics"],
      conformsTo: [
        {
          value: "https://example.org/spec/healthdcat-ap-v6",
          label: "HealthDCAT-AP v6",
        },
      ],
      publishers: [
        {
          name: "org",
          email: "a@mail.com",
          type: {
            value: "http://purl.org/adms/publishertype/Company",
            label: "Company",
          },
          url: undefined,
          uri: undefined,
          homepage: undefined,
          identifier: undefined,
        },
      ],
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
      contacts: [
        {
          name: "Jane Doe",
          email: "jane.doe@example.org",
        },
      ],
      datasetRelationships: [
        {
          relation: "Is part of",
          target: "https://example.org/datasets/parent-collection",
        },
        {
          relation: "Has part",
          target: "https://example.org/datasets/subset-1",
        },
      ],
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
      personalData: [
        { value: "https://w3id.org/dpv/dpv-pd#Age", label: "Age" },
        {
          value: "https://w3id.org/dpv/dpv-pd#MedicalRecord",
          label: "Medical Record",
        },
      ],
      distributions: [
        {
          id: "distribution-1",
          title: "Population Registry CSV",
          description: "",
          format: {
            value:
              "http://publications.europa.eu/resource/authority/file-type/CSV",
            label: "CSV",
          },
          accessUrl: "https://example.org/access/population-registry",
          downloadUrl: "https://example.org/download/population-registry.csv",
        },
      ],
      temporalCoverage: {
        start: "2022-01-01T00:00:00.000Z",
        end: "2023-01-01T00:00:00.000Z",
      },
      retentionPeriod: [
        {
          start: "2026-03-13T00:00:00.000Z",
          end: "2026-03-20T00:00:00.000Z",
        },
      ],
      temporalResolution: "P1D",
      frequency: {
        value:
          "http://publications.europa.eu/resource/authority/frequency/ANNUAL",
        label: "Annual",
      },
      hdab: [
        {
          name: "Health Data Access Body Luxembourg",
          email: "hdab@health.lu",
          uri: "https://health.data.lu/hdab/luxembourg",
          url: undefined,
          homepage: undefined,
          identifier: undefined,
          type: undefined,
        },
      ],
      creators: [
        {
          name: "org",
          email: undefined,
          url: undefined,
          uri: undefined,
          homepage: undefined,
          identifier: undefined,
          type: undefined,
        },
      ],
      publisherType: [
        {
          value: "http://purl.org/adms/publishertype/Company",
          label: "Company",
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
      publishers: [
        {
          name: "org",
          email: "a@mail.com",
          type: {
            value: "http://purl.org/adms/publishertype/Company",
            label: "Company",
          },
          url: undefined,
          uri: undefined,
          homepage: undefined,
          identifier: undefined,
        },
      ],
      themes: [],
      keywords: [],
      conformsTo: [
        {
          value: "https://example.org/spec/healthdcat-ap-v6",
          label: "HealthDCAT-AP v6",
        },
      ],
      populationCoverage: undefined,
      spatialResolutionInMeters: undefined,
      healthTheme: [],
      healthCategory: [],
      dcatType: undefined,
      contacts: [
        {
          name: "Jane Doe",
          email: "jane.doe@example.org",
        },
      ],
      datasetRelationships: [
        {
          relation: "Is part of",
          target: "https://example.org/datasets/parent-collection",
        },
        {
          relation: "Has part",
          target: "https://example.org/datasets/subset-1",
        },
      ],
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
      personalData: [
        { value: "https://w3id.org/dpv/dpv-pd#Age", label: "Age" },
        {
          value: "https://w3id.org/dpv/dpv-pd#MedicalRecord",
          label: "Medical Record",
        },
      ],
      distributions: [
        {
          id: "distribution-1",
          title: "Population Registry CSV",
          description: "",
          format: {
            value:
              "http://publications.europa.eu/resource/authority/file-type/CSV",
            label: "CSV",
          },
          accessUrl: "https://example.org/access/population-registry",
          downloadUrl: "https://example.org/download/population-registry.csv",
        },
      ],
      spatialCoverage: [
        {
          uri: undefined,
          text: "Luxembourg",
          geom: undefined,
          bbox: undefined,
          centroid: undefined,
        },
      ],
      temporalCoverage: {
        start: "2022-01-01T00:00:00.000Z",
        end: "2023-01-01T00:00:00.000Z",
      },
      retentionPeriod: [
        {
          start: "2026-03-13T00:00:00.000Z",
          end: "2026-03-20T00:00:00.000Z",
        },
      ],
      temporalResolution: "P1D",
      frequency: {
        value:
          "http://publications.europa.eu/resource/authority/frequency/ANNUAL",
        label: "Annual",
      },
      hdab: [
        {
          name: "Health Data Access Body Luxembourg",
          email: "hdab@health.lu",
          uri: "https://health.data.lu/hdab/luxembourg",
          url: undefined,
          homepage: undefined,
          identifier: undefined,
          type: undefined,
        },
      ],
      creators: [
        {
          name: "org",
          email: undefined,
          url: undefined,
          uri: undefined,
          homepage: undefined,
          identifier: undefined,
          type: undefined,
        },
      ],
      publisherType: [
        {
          value: "http://purl.org/adms/publishertype/Company",
          label: "Company",
        },
      ],
    });
  });

  test("retrieveDatasetInFormat serializes full local-store datasets to RDF", async () => {
    mockStore.retrieveDataset.mockResolvedValueOnce(
      buildLocalDiscoveryDataset({
        id: "https://example.org/datasets/export-1",
        title: "Population Registry & Statistics",
        description: "National <regional> data",
      })
    );

    const blob = await provider.retrieveDatasetInFormat("export-1", "rdf", {});

    expect(mockStore.ensureInitialized).toHaveBeenCalled();
    expect(mockStore.retrieveDataset).toHaveBeenCalledWith("export-1");
    expect(blob.type).toBe("application/rdf+xml");
    const text = await blob.text();
    expect(text).toContain("<rdf:RDF");
    expect(text).toContain("<dcat:Distribution");
    const quads = await parseRdfXmlToQuads(text);
    const datasetSubject = "https://example.org/datasets/export-1";

    expect(
      hasQuad(quads, {
        subject: datasetSubject,
        predicate: "http://purl.org/dc/terms/language",
        object: "http://publications.europa.eu/resource/authority/language/ENG",
        objectTermType: "NamedNode",
      })
    ).toBe(true);
    expect(
      hasQuad(quads, {
        subject: datasetSubject,
        predicate: "http://purl.org/dc/terms/issued",
        object: "2024-01-01T00:00:00.000Z",
        objectTermType: "Literal",
      })
    ).toBe(true);
    expect(
      hasQuad(quads, {
        subject: datasetSubject,
        predicate: "http://purl.org/dc/terms/modified",
        object: "2024-03-10T00:00:00.000Z",
        objectTermType: "Literal",
      })
    ).toBe(true);
    expect(
      hasQuad(quads, {
        subject: datasetSubject,
        predicate: "http://www.w3.org/ns/dcat#version",
        object: "1.0.0",
        objectTermType: "Literal",
      })
    ).toBe(true);
    expect(
      hasQuad(quads, {
        subject: datasetSubject,
        predicate: "http://www.w3.org/ns/dcat#hasVersion",
        object: "https://example.org/datasets/export-1#version-1",
        objectTermType: "NamedNode",
      })
    ).toBe(true);
    expect(
      hasQuad(quads, {
        subject: datasetSubject,
        predicate: "http://www.w3.org/ns/adms#versionNotes",
        object: "Initial release",
        objectTermType: "Literal",
      })
    ).toBe(true);
    expect(
      hasQuad(quads, {
        subject: datasetSubject,
        predicate: "http://healthdataportal.eu/ns/health#numberOfRecords",
        object: "50000",
        objectTermType: "Literal",
      })
    ).toBe(true);
    expect(
      hasQuad(quads, {
        subject: datasetSubject,
        predicate:
          "http://healthdataportal.eu/ns/health#numberOfUniqueIndividuals",
        object: "25000",
        objectTermType: "Literal",
      })
    ).toBe(true);
    expect(
      hasQuad(quads, {
        subject: datasetSubject,
        predicate: "http://healthdataportal.eu/ns/health#maxTypicalAge",
        object: "95",
        objectTermType: "Literal",
      })
    ).toBe(true);
    expect(
      hasQuad(quads, {
        subject: datasetSubject,
        predicate: "http://healthdataportal.eu/ns/health#minTypicalAge",
        object: "18",
        objectTermType: "Literal",
      })
    ).toBe(true);
    expect(
      hasQuad(quads, {
        subject: datasetSubject,
        predicate: "http://healthdataportal.eu/ns/health#populationCoverage",
        object: "People of LNDS.",
        objectTermType: "Literal",
      })
    ).toBe(true);
    expect(
      hasQuad(quads, {
        subject: datasetSubject,
        predicate: "http://purl.org/dc/terms/spatial",
        object: "http://publications.europa.eu/resource/authority/country/LUX",
        objectTermType: "NamedNode",
      })
    ).toBe(true);
    expect(
      hasQuad(quads, {
        subject: "http://publications.europa.eu/resource/authority/country/LUX",
        predicate: "http://www.w3.org/2004/02/skos/core#prefLabel",
        object: "Luxembourg",
        objectTermType: "Literal",
      })
    ).toBe(true);
    expect(
      hasQuad(quads, {
        subject: datasetSubject,
        predicate: "http://www.w3.org/ns/dcat#spatialResolutionInMeters",
        object: "4",
        objectTermType: "Literal",
      })
    ).toBe(true);
    expect(
      hasQuad(quads, {
        subject: datasetSubject,
        predicate: "http://purl.org/dc/terms/temporal",
        object: "https://example.org/datasets/export-1#temporal-coverage",
        objectTermType: "NamedNode",
      })
    ).toBe(true);
    expect(
      hasQuad(quads, {
        subject: "https://example.org/datasets/export-1#temporal-coverage",
        predicate: "http://www.w3.org/ns/dcat#startDate",
        object: "2022-01-01T00:00:00.000Z",
        objectTermType: "Literal",
      })
    ).toBe(true);
    expect(
      hasQuad(quads, {
        subject: "https://example.org/datasets/export-1#temporal-coverage",
        predicate: "http://www.w3.org/ns/dcat#endDate",
        object: "2023-01-01T00:00:00.000Z",
        objectTermType: "Literal",
      })
    ).toBe(true);
    expect(
      hasQuad(quads, {
        subject: datasetSubject,
        predicate: "http://healthdataportal.eu/ns/health#retentionPeriod",
        object: "https://example.org/datasets/export-1#retention-period-1",
        objectTermType: "NamedNode",
      })
    ).toBe(true);
    expect(
      hasQuad(quads, {
        subject: "https://example.org/datasets/export-1#retention-period-1",
        predicate: "http://www.w3.org/ns/dcat#startDate",
        object: "2026-03-13T00:00:00.000Z",
        objectTermType: "Literal",
      })
    ).toBe(true);
    expect(
      hasQuad(quads, {
        subject: "https://example.org/datasets/export-1#retention-period-1",
        predicate: "http://www.w3.org/ns/dcat#endDate",
        object: "2026-03-20T00:00:00.000Z",
        objectTermType: "Literal",
      })
    ).toBe(true);
    expect(
      hasQuad(quads, {
        subject: datasetSubject,
        predicate: "http://www.w3.org/ns/dcat#temporalResolution",
        object: "P1D",
        objectTermType: "Literal",
      })
    ).toBe(true);
    expect(
      hasQuad(quads, {
        subject: datasetSubject,
        predicate: "http://purl.org/dc/terms/accrualPeriodicity",
        object:
          "http://publications.europa.eu/resource/authority/frequency/ANNUAL",
        objectTermType: "NamedNode",
      })
    ).toBe(true);
    expect(
      hasQuad(quads, {
        subject:
          "http://publications.europa.eu/resource/authority/frequency/ANNUAL",
        predicate: "http://www.w3.org/2004/02/skos/core#prefLabel",
        object: "Annual",
        objectTermType: "Literal",
      })
    ).toBe(true);
    expect(
      hasQuad(quads, {
        subject: datasetSubject,
        predicate: "http://purl.org/dc/terms/accessRights",
        object:
          "http://publications.europa.eu/resource/authority/access-right/PUBLIC",
        objectTermType: "NamedNode",
      })
    ).toBe(true);
    expect(
      hasQuad(quads, {
        subject:
          "http://publications.europa.eu/resource/authority/access-right/PUBLIC",
        predicate: "http://www.w3.org/2004/02/skos/core#prefLabel",
        object: "Public",
        objectTermType: "Literal",
      })
    ).toBe(true);
    expect(
      hasQuad(quads, {
        subject: datasetSubject,
        predicate: "http://purl.org/dc/terms/conformsTo",
        object: "https://example.org/spec/healthdcat-ap-v6",
        objectTermType: "NamedNode",
      })
    ).toBe(true);
    expect(
      hasQuad(quads, {
        subject: "https://example.org/spec/healthdcat-ap-v6",
        predicate: "http://www.w3.org/2004/02/skos/core#prefLabel",
        object: "HealthDCAT-AP v6",
        objectTermType: "Literal",
      })
    ).toBe(true);
    expect(
      hasQuad(quads, {
        subject: datasetSubject,
        predicate: "http://www.w3.org/ns/dpv#hasLegalBasis",
        object: "https://example.org/datasets/export-1#legal-basis-1",
        objectTermType: "NamedNode",
      })
    ).toBe(true);
    expect(
      hasQuad(quads, {
        subject: "https://example.org/datasets/export-1#legal-basis-1",
        predicate: "http://purl.org/dc/terms/description",
        object: "GDPR Art. 6(1)(e)",
        objectTermType: "Literal",
      })
    ).toBe(true);
    expect(
      hasQuad(quads, {
        subject: datasetSubject,
        predicate: "http://data.europa.eu/r5r/applicableLegislation",
        object: "http://data.europa.eu/eli/reg/2016/679",
        objectTermType: "NamedNode",
      })
    ).toBe(true);
    expect(
      hasQuad(quads, {
        subject: "http://data.europa.eu/eli/reg/2016/679",
        predicate: "http://www.w3.org/2004/02/skos/core#prefLabel",
        object: "GDPR",
        objectTermType: "Literal",
      })
    ).toBe(true);
    expect(
      hasQuad(quads, {
        subject: datasetSubject,
        predicate: "http://www.w3.org/ns/dcat#contactPoint",
        object: "https://example.org/datasets/export-1#contact-point-1",
        objectTermType: "NamedNode",
      })
    ).toBe(true);
    expect(
      hasQuad(quads, {
        subject: "https://example.org/datasets/export-1#contact-point-1",
        predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
        object: "http://www.w3.org/2006/vcard/ns#Kind",
        objectTermType: "NamedNode",
      })
    ).toBe(true);
    expect(
      hasQuad(quads, {
        subject: datasetSubject,
        predicate: "http://purl.org/dc/terms/publisher",
        object: "https://example.org/datasets/export-1#publisher-1",
        objectTermType: "NamedNode",
      })
    ).toBe(true);
    expect(
      hasQuad(quads, {
        subject: "https://example.org/datasets/export-1#publisher-1",
        predicate: "http://xmlns.com/foaf/0.1/name",
        object: "org",
        objectTermType: "Literal",
      })
    ).toBe(true);
    expect(
      hasQuad(quads, {
        subject: datasetSubject,
        predicate: "http://healthdataportal.eu/ns/health#hdab",
        object: "https://health.data.lu/hdab/luxembourg",
        objectTermType: "NamedNode",
      })
    ).toBe(true);
    expect(
      hasQuad(quads, {
        subject: "https://health.data.lu/hdab/luxembourg",
        predicate: "http://xmlns.com/foaf/0.1/name",
        object: "Health Data Access Body Luxembourg",
        objectTermType: "Literal",
      })
    ).toBe(true);
    expect(
      hasQuad(quads, {
        subject: datasetSubject,
        predicate: "http://purl.org/dc/terms/creator",
        object: "https://example.org/datasets/export-1#creator-1",
        objectTermType: "NamedNode",
      })
    ).toBe(true);
    expect(
      hasQuad(quads, {
        subject: "https://example.org/datasets/export-1#creator-1",
        predicate: "http://xmlns.com/foaf/0.1/name",
        object: "org",
        objectTermType: "Literal",
      })
    ).toBe(true);
    expect(
      hasQuad(quads, {
        subject: datasetSubject,
        predicate: "http://www.w3.org/ns/dcat#distribution",
        object: "https://example.org/datasets/export-1#distribution-1",
        objectTermType: "NamedNode",
      })
    ).toBe(true);
    expect(
      hasQuad(quads, {
        subject: "https://example.org/datasets/export-1#distribution-1",
        predicate: "http://purl.org/dc/terms/identifier",
        object: "distribution-1",
        objectTermType: "Literal",
      })
    ).toBe(true);
    expect(
      hasQuad(quads, {
        subject: "https://example.org/datasets/export-1#distribution-1",
        predicate: "http://purl.org/dc/terms/title",
        object: "Population Registry CSV",
        objectTermType: "Literal",
      })
    ).toBe(true);
    expect(
      hasQuad(quads, {
        subject: "https://example.org/datasets/export-1#distribution-1",
        predicate: "http://purl.org/dc/terms/format",
        object:
          "http://publications.europa.eu/resource/authority/file-type/CSV",
        objectTermType: "NamedNode",
      })
    ).toBe(true);
    expect(
      hasQuad(quads, {
        subject: "https://example.org/datasets/export-1#distribution-1",
        predicate: "http://www.w3.org/ns/dcat#accessURL",
        object: "https://example.org/access/population-registry",
        objectTermType: "NamedNode",
      })
    ).toBe(true);
    expect(
      hasQuad(quads, {
        subject: "https://example.org/datasets/export-1#distribution-1",
        predicate: "http://www.w3.org/ns/dcat#downloadURL",
        object: "https://example.org/download/population-registry.csv",
        objectTermType: "NamedNode",
      })
    ).toBe(true);
    expect(
      hasQuad(quads, {
        subject: datasetSubject,
        predicate: "http://purl.org/dc/terms/isPartOf",
        object: "https://example.org/datasets/parent-collection",
        objectTermType: "NamedNode",
      })
    ).toBe(true);
    expect(
      hasQuad(quads, {
        subject: datasetSubject,
        predicate: "http://purl.org/dc/terms/hasPart",
        object: "https://example.org/datasets/subset-1",
        objectTermType: "NamedNode",
      })
    ).toBe(true);
  });

  test("retrieveDatasetInFormat throws when the dataset is missing", async () => {
    mockStore.retrieveDataset.mockResolvedValueOnce(null);

    await expect(
      provider.retrieveDatasetInFormat("missing-export", "rdf", {})
    ).rejects.toThrow("Dataset not found in local index: missing-export");
  });

  test("retrieveDataset throws when the dataset is missing", async () => {
    mockStore.retrieveDataset.mockResolvedValueOnce(null);

    await expect(provider.retrieveDataset("missing")).rejects.toThrow(
      "Dataset not found in local index: missing"
    );
  });
});
