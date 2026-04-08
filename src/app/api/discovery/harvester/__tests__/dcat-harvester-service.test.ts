// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { jest } from "@jest/globals";
import { canonicalDiscoveryRdf } from "@/app/api/discovery/test-utils/fixtures";
import { DcatHarvesterService } from "@/app/api/discovery/harvester/dcat-harvester-service";

describe("DcatHarvesterService", () => {
  test("parses a canonical RDF fixture with discovery metadata", async () => {
    const service = new DcatHarvesterService();
    await expect(
      service.parseDatasetsFromRdf(canonicalDiscoveryRdf)
    ).resolves.toEqual([
      {
        id: "dataset-1",
        identifier: "dataset-1",
        title: "Population Registry",
        description: "National & regional data",
        catalogue: "Main Catalogue",
        languages: [
          "http://publications.europa.eu/resource/authority/language/ENG",
          "DEU",
        ],
        createdAt: "2023-06-15T00:00:00.000Z",
        modifiedAt: "2024-02-20T14:30:00.000Z",
        version: "1.2.0",
        hasVersions: [
          {
            value: "https://example.org/datasets/1/v1",
            label: "v1",
          },
        ],
        versionNotes: ["Updated with 2024 data"],
        numberOfRecords: 50000,
        numberOfUniqueIndividuals: 25000,
        maxTypicalAge: 95,
        minTypicalAge: 18,
        populationCoverage: "People of LNDS.",
        spatialCoverage: [
          {
            uri: "http://publications.europa.eu/resource/authority/country/LUX",
            text: "Luxembourg",
          },
        ],
        spatialResolutionInMeters: [4],
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
        publishers: [
          {
            name: "org",
            email: "a@mail.com",
            type: {
              value: "http://purl.org/adms/publishertype/Company",
              label: "Company",
            },
          },
        ],
        hdab: [
          {
            name: "Health Data Access Body Luxembourg",
            email: "hdab@health.lu",
            uri: "https://health.data.lu/hdab/luxembourg",
          },
        ],
        creators: [
          {
            name: "org",
          },
        ],
        publisherType: [
          {
            value: "http://purl.org/adms/publishertype/Company",
            label: "Company",
          },
        ],
        themes: [
          {
            value:
              "http://publications.europa.eu/resource/authority/data-theme/HEAL",
            label: "HEAL",
          },
        ],
        keywords: ["oncology", "genomics"],
        healthTheme: [
          {
            value: "http://healthdataportal.eu/ns/health-theme/cancer",
            label: "cancer",
          },
        ],
        healthCategory: [
          {
            value: "http://healthdataportal.eu/ns/health-category/registries",
            label: "registries",
          },
        ],
        dcatType: [
          {
            value:
              "http://publications.europa.eu/resource/authority/dataset-type/STATISTICAL",
            label: "STATISTICAL",
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
          {
            value: "https://w3id.org/dpv/dpv-pd#Age",
            label: "Age",
          },
          {
            value: "https://w3id.org/dpv/dpv-pd#MedicalRecord",
            label: "Medical Record",
          },
        ],
        purpose: [
          {
            value: "https://www.example.com/purpose/research",
            label: "https://www.example.com/purpose/research",
          },
        ],
        codeValues: undefined,
        codingSystem: undefined,
        contacts: [
          {
            name: "tab3-contactPoint-mail@test.com",
            email: "tab3-contactPoint-mail@test.com",
            uri: undefined,
            url: "https://commission.europa.eu/",
            identifier: undefined,
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
        distributions: [
          {
            id: "distribution-1",
            title: "Population Registry CSV",
            format: {
              value:
                "http://publications.europa.eu/resource/authority/file-type/CSV",
              label: "CSV",
            },
            mediaType: {
              value: "http://www.iana.org/assignments/media-types/text/csv",
              label: "CSV",
            },
            license: {
              value: "http://spdx.org/licenses/Apache-2.0",
              label: "Apache 2.0",
            },
            conformsTo: [
              {
                value: "https://example.org/spec/standard-1",
                label: "standard-1",
              },
            ],
            byteSize: 2048,
            accessUrl: "https://example.org/access/population-registry",
            downloadUrl: "https://example.org/download/population-registry.csv",
            createdAt: "2023-06-15T00:00:00.000Z",
          },
        ],
      },
      {
        id: "ID-2",
        identifier: "ID-2",
        title: "Hospital Capacity",
        description: "Bed occupancy",
        catalogue: "Main Catalogue",
        languages: [],
        createdAt: undefined,
        modifiedAt: undefined,
        version: "",
        hasVersions: [],
        versionNotes: undefined,
        numberOfRecords: undefined,
        numberOfUniqueIndividuals: undefined,
        maxTypicalAge: undefined,
        minTypicalAge: undefined,
        populationCoverage: "",
        spatialCoverage: undefined,
        spatialResolutionInMeters: undefined,
        temporalCoverage: undefined,
        retentionPeriod: undefined,
        temporalResolution: undefined,
        frequency: undefined,
        publishers: [],
        hdab: [],
        creators: [],
        publisherType: undefined,
        datasetRelationships: undefined,
        themes: [],
        keywords: [],
        healthTheme: [],
        healthCategory: [],
        dcatType: [],
        accessRights: undefined,
        legalBasis: undefined,
        applicableLegislation: undefined,
        personalData: undefined,
        purpose: undefined,
        codeValues: undefined,
        codingSystem: undefined,
        contacts: undefined,
        distributions: undefined,
      },
    ]);
  });

  test("supports dct and dc title or description fallbacks", async () => {
    const service = new DcatHarvesterService();
    const rdf = `
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
               xmlns:dcat="http://www.w3.org/ns/dcat#"
               xmlns:dct="http://purl.org/dc/terms/"
               xmlns:dc="http://purl.org/dc/elements/1.1/">
        <dcat:Dataset rdf:about="https://example.org/datasets/1">
          <dct:title>  Dataset A  </dct:title>
          <dc:description><![CDATA[  Fallback description  ]]></dc:description>
        </dcat:Dataset>
        <dcat:Dataset rdf:about="https://example.org/datasets/2">
          <dc:title>Dataset B</dc:title>
          <dct:description>  Foo &amp; Bar  </dct:description>
        </dcat:Dataset>
      </rdf:RDF>
    `;

    const datasets = await service.parseDatasetsFromRdf(rdf);
    expect(
      datasets.map(({ title, description }) => ({ title, description }))
    ).toEqual([
      { title: "Dataset A", description: "Fallback description" },
      { title: "Dataset B", description: "Foo & Bar" },
    ]);
  });

  test("parses distributions exposed under healthdcatap analytics", async () => {
    const service = new DcatHarvesterService();
    const rdf = `
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
               xmlns:dcat="http://www.w3.org/ns/dcat#"
               xmlns:dct="http://purl.org/dc/terms/"
               xmlns:dc="http://purl.org/dc/elements/1.1/"
               xmlns:healthdcatap="http://healthdataportal.eu/ns/health#"
               xmlns:skos="http://www.w3.org/2004/02/skos/core#">
        <dcat:Dataset rdf:about="https://example.org/datasets/1">
          <dct:identifier>dataset-1</dct:identifier>
          <dct:title>Dataset A</dct:title>
          <dct:description>Description A</dct:description>
          <healthdcatap:analytics>
            <dcat:Distribution rdf:nodeID="distribution-analytics-1">
              <dct:identifier>25</dct:identifier>
              <dct:title>Distribution1</dct:title>
              <dct:format>
                <dct:MediaTypeOrExtent rdf:about="http://publications.europa.eu/resource/authority/file-type/AAB">
                  <skos:prefLabel>Aab</skos:prefLabel>
                </dct:MediaTypeOrExtent>
              </dct:format>
              <dcat:downloadURL rdf:resource="http://download-2/"/>
              <dcat:accessURL rdf:resource="http://abc.com/"/>
            </dcat:Distribution>
          </healthdcatap:analytics>
        </dcat:Dataset>
      </rdf:RDF>
    `;

    const datasets = await service.parseDatasetsFromRdf(rdf);

    expect(datasets[0].distributions).toHaveLength(1);
    expect(datasets[0].distributions?.[0]?.id).toBe("25");
  });

  test("keeps distributions without titles by falling back to identifier or URLs", async () => {
    const service = new DcatHarvesterService();
    const rdf = `
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
               xmlns:dcat="http://www.w3.org/ns/dcat#"
               xmlns:dct="http://purl.org/dc/terms/">
        <dcat:Dataset rdf:about="https://example.org/datasets/1">
          <dct:identifier>dataset-1</dct:identifier>
          <dct:title>Dataset A</dct:title>
          <dct:description>Description A</dct:description>
          <dcat:distribution>
            <dcat:Distribution rdf:nodeID="distribution-1">
              <dct:identifier>dist-1</dct:identifier>
              <dcat:accessURL rdf:resource="https://example.org/access/1"/>
            </dcat:Distribution>
          </dcat:distribution>
        </dcat:Dataset>
      </rdf:RDF>
    `;

    const datasets = await service.parseDatasetsFromRdf(rdf);

    expect(datasets[0].distributions).toEqual([
      {
        id: "dist-1",
        title: "dist-1",
        format: undefined,
        accessUrl: "https://example.org/access/1",
        downloadUrl: undefined,
      },
    ]);
  });

  test("deduplicates distributions referenced by both dcat distribution and healthdcatap analytics", async () => {
    const service = new DcatHarvesterService();
    const rdf = `
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
               xmlns:dcat="http://www.w3.org/ns/dcat#"
               xmlns:dct="http://purl.org/dc/terms/"
               xmlns:healthdcatap="http://healthdataportal.eu/ns/health#">
        <dcat:Dataset rdf:about="https://example.org/datasets/1">
          <dct:identifier>dataset-1</dct:identifier>
          <dct:title>Dataset A</dct:title>
          <dct:description>Description A</dct:description>
          <dcat:distribution rdf:resource="https://example.org/distributions/1"/>
          <healthdcatap:analytics rdf:resource="https://example.org/distributions/1"/>
        </dcat:Dataset>
        <dcat:Distribution rdf:about="https://example.org/distributions/1">
          <dct:identifier>dist-1</dct:identifier>
          <dct:title>Distribution 1</dct:title>
          <dcat:downloadURL rdf:resource="https://example.org/download/1"/>
        </dcat:Distribution>
      </rdf:RDF>
    `;

    const datasets = await service.parseDatasetsFromRdf(rdf);

    expect(datasets[0].distributions).toHaveLength(1);
    expect(datasets[0].distributions?.[0]?.id).toBe("dist-1");
  });

  test("deduplicates dataset languages", async () => {
    const service = new DcatHarvesterService();
    const rdf = `
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
               xmlns:dcat="http://www.w3.org/ns/dcat#"
               xmlns:dct="http://purl.org/dc/terms/">
        <dcat:Dataset rdf:about="https://example.org/datasets/1">
          <dct:title>Dataset A</dct:title>
          <dct:description>Description A</dct:description>
          <dct:language rdf:resource="http://publications.europa.eu/resource/authority/language/ENG" />
          <dct:language rdf:resource="http://publications.europa.eu/resource/authority/language/ENG" />
        </dcat:Dataset>
      </rdf:RDF>
    `;

    const datasets = await service.parseDatasetsFromRdf(rdf);
    expect(datasets[0].languages).toEqual([
      "http://publications.europa.eu/resource/authority/language/ENG",
    ]);
  });

  test("resolves explicit and inline catalogues, and only uses fallback when a single top-level catalogue exists", async () => {
    const service = new DcatHarvesterService();
    const rdf = `
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
               xmlns:dcat="http://www.w3.org/ns/dcat#"
               xmlns:dct="http://purl.org/dc/terms/">
        <dcat:Catalog rdf:about="https://example.org/catalogues/main">
          <dct:title>Main Catalogue</dct:title>
        </dcat:Catalog>
        <dcat:Catalog rdf:about="https://example.org/catalogues/about-only">
          <dct:description>About-only catalogue</dct:description>
        </dcat:Catalog>

        <dcat:Dataset rdf:about="https://example.org/datasets/1">
          <dct:title>Dataset A</dct:title>
          <dct:description>Description A</dct:description>
          <dcat:inCatalog rdf:resource="https://example.org/catalogues/about-only" />
        </dcat:Dataset>

        <dcat:Dataset rdf:about="https://example.org/datasets/2">
          <dct:title>Dataset B</dct:title>
          <dct:description>Description B</dct:description>
          <dcat:inCatalog>
            <dcat:Catalog>
              <dct:title>Inline Catalogue</dct:title>
            </dcat:Catalog>
          </dcat:inCatalog>
        </dcat:Dataset>

        <dcat:Dataset rdf:about="https://example.org/datasets/3">
          <dct:title>Dataset C</dct:title>
          <dct:description>Description C</dct:description>
        </dcat:Dataset>

        <dcat:Catalog rdf:about="https://example.org/catalogues/fallback-only">
          <dct:title>Fallback Catalogue</dct:title>
        </dcat:Catalog>
        <dcat:Dataset rdf:about="https://example.org/datasets/4">
          <dct:title>Dataset D</dct:title>
          <dct:description>Description D</dct:description>
          <dcat:inCatalog>
            <dcat:Catalog>
              <dct:title>Nested Catalogue</dct:title>
            </dcat:Catalog>
          </dcat:inCatalog>
        </dcat:Dataset>
      </rdf:RDF>
    `;

    const datasets = await service.parseDatasetsFromRdf(rdf);
    expect(datasets.map((dataset) => dataset.catalogue)).toEqual([
      "https://example.org/catalogues/about-only",
      "Inline Catalogue",
      "",
      "Nested Catalogue",
    ]);
  });

  test("uses the single top-level catalogue as fallback", async () => {
    const service = new DcatHarvesterService();
    const rdf = `
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
               xmlns:dcat="http://www.w3.org/ns/dcat#"
               xmlns:dct="http://purl.org/dc/terms/">
        <dcat:Catalog rdf:about="https://example.org/catalogues/main">
          <dct:title>Main Catalogue</dct:title>
        </dcat:Catalog>
        <dcat:Dataset rdf:about="https://example.org/datasets/1">
          <dct:title>Dataset A</dct:title>
          <dct:description>Description A</dct:description>
        </dcat:Dataset>
      </rdf:RDF>
    `;

    const datasets = await service.parseDatasetsFromRdf(rdf);
    expect(datasets[0].catalogue).toBe("Main Catalogue");
  });

  test("falls back to generated dataset ids and keeps identifier independent", async () => {
    const service = new DcatHarvesterService();
    const rdf = `
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
               xmlns:dcat="http://www.w3.org/ns/dcat#"
               xmlns:dct="http://purl.org/dc/terms/">
        <dcat:Dataset>
          <dct:title>Dataset A</dct:title>
          <dct:description>Description A</dct:description>
        </dcat:Dataset>
        <dcat:Dataset rdf:about="https://example.org/datasets/2">
          <dct:title>Dataset B</dct:title>
          <dct:description>Description B</dct:description>
        </dcat:Dataset>
      </rdf:RDF>
    `;

    const datasets = await service.parseDatasetsFromRdf(rdf);
    expect(datasets[0].id).toBe("dataset-1");
    expect(datasets[1]).toMatchObject({
      id: "https://example.org/datasets/2",
      identifier: "",
    });
    expect(datasets[0]).toEqual({
      id: "dataset-1",
      identifier: "",
      title: "Dataset A",
      description: "Description A",
      catalogue: "",
      languages: [],
      createdAt: undefined,
      modifiedAt: undefined,
      version: "",
      hasVersions: [],
      versionNotes: undefined,
      populationCoverage: "",
      spatialCoverage: undefined,
      spatialResolutionInMeters: undefined,
      temporalCoverage: undefined,
      retentionPeriod: undefined,
      temporalResolution: undefined,
      frequency: undefined,
      publishers: [],
      hdab: [],
      creators: [],
      publisherType: undefined,
      datasetRelationships: undefined,
      themes: [],
      keywords: [],
      healthTheme: [],
      healthCategory: [],
      dcatType: [],
      personalData: undefined,
      purpose: undefined,
      codeValues: undefined,
      codingSystem: undefined,
    });
  });

  test("normalizes invalid dates to empty strings", async () => {
    const service = new DcatHarvesterService();
    const rdf = `
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
               xmlns:dcat="http://www.w3.org/ns/dcat#"
               xmlns:dct="http://purl.org/dc/terms/">
        <dcat:Dataset rdf:about="https://example.org/datasets/1">
          <dct:title>Dataset A</dct:title>
          <dct:description>Description A</dct:description>
          <dct:issued>not-a-valid-date</dct:issued>
          <dct:modified>also-invalid</dct:modified>
        </dcat:Dataset>
      </rdf:RDF>
    `;

    const datasets = await service.parseDatasetsFromRdf(rdf);
    expect(datasets[0]).toMatchObject({
      createdAt: undefined,
      modifiedAt: undefined,
    });
  });

  test("parses dcterms issued and modified dates as ISO strings", async () => {
    const service = new DcatHarvesterService();
    const rdf = `
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
               xmlns:dcat="http://www.w3.org/ns/dcat#"
               xmlns:dcterms="http://purl.org/dc/terms/">
        <dcat:Dataset rdf:about="https://example.org/datasets/1">
          <dcterms:title>Dataset A</dcterms:title>
          <dcterms:description>Description A</dcterms:description>
          <dcterms:issued>2020-01-02T03:04:05Z</dcterms:issued>
          <dcterms:modified>2021-02-03T04:05:06Z</dcterms:modified>
        </dcat:Dataset>
      </rdf:RDF>
    `;

    const datasets = await service.parseDatasetsFromRdf(rdf);
    expect(datasets[0]).toMatchObject({
      createdAt: "2020-01-02T03:04:05.000Z",
      modifiedAt: "2021-02-03T04:05:06.000Z",
    });
  });

  test("supports healthdcatap populationCoverage", async () => {
    const service = new DcatHarvesterService();
    const rdf = `
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
               xmlns:dcat="http://www.w3.org/ns/dcat#"
               xmlns:dct="http://purl.org/dc/terms/"
               xmlns:healthdcatap="http://healthdataportal.eu/ns/health#">
        <dcat:Dataset rdf:about="https://example.org/datasets/1">
          <dct:title>Dataset A</dct:title>
          <dct:description>Description A</dct:description>
          <healthdcatap:populationCoverage xml:lang="eng">Population cov</healthdcatap:populationCoverage>
        </dcat:Dataset>
      </rdf:RDF>
    `;

    const datasets = await service.parseDatasetsFromRdf(rdf);
    expect(datasets[0].populationCoverage).toBe("Population cov");
  });

  test("stores all valid spatial resolution values and ignores invalid ones", async () => {
    const service = new DcatHarvesterService();
    const rdf = `
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
               xmlns:dcat="http://www.w3.org/ns/dcat#"
               xmlns:dct="http://purl.org/dc/terms/">
        <dcat:Dataset rdf:about="https://example.org/datasets/1">
          <dct:title>Dataset A</dct:title>
          <dct:description>Description A</dct:description>
          <dcat:spatialResolutionInMeters>not-a-number</dcat:spatialResolutionInMeters>
          <dcat:spatialResolutionInMeters>100</dcat:spatialResolutionInMeters>
          <dcat:spatialResolutionInMeters>200</dcat:spatialResolutionInMeters>
        </dcat:Dataset>
      </rdf:RDF>
    `;

    const datasets = await service.parseDatasetsFromRdf(rdf);
    expect(datasets[0].spatialResolutionInMeters).toEqual([100, 200]);
  });

  test("stores all version notes values", async () => {
    const service = new DcatHarvesterService();
    const rdf = `
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
               xmlns:dcat="http://www.w3.org/ns/dcat#"
               xmlns:dct="http://purl.org/dc/terms/"
               xmlns:adms="http://www.w3.org/ns/adms#">
        <dcat:Dataset rdf:about="https://example.org/datasets/1">
          <dct:title>Dataset A</dct:title>
          <dct:description>Description A</dct:description>
          <adms:versionNotes>Version Notes 1</adms:versionNotes>
          <adms:versionNotes>Version Notes 2</adms:versionNotes>
        </dcat:Dataset>
      </rdf:RDF>
    `;

    const datasets = await service.parseDatasetsFromRdf(rdf);
    expect(datasets[0].versionNotes).toEqual([
      "Version Notes 1",
      "Version Notes 2",
    ]);
  });

  test("maps spatial coverage without labels when only the URI exists", async () => {
    const service = new DcatHarvesterService();
    const rdf = `
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
               xmlns:dcat="http://www.w3.org/ns/dcat#"
               xmlns:dct="http://purl.org/dc/terms/">
        <dcat:Dataset rdf:about="https://example.org/datasets/1">
          <dct:title>Dataset A</dct:title>
          <dct:description>Description A</dct:description>
          <dct:spatial>
            <dct:Location rdf:about="http://publications.europa.eu/resource/authority/country/LUX"/>
          </dct:spatial>
        </dcat:Dataset>
      </rdf:RDF>
    `;

    const datasets = await service.parseDatasetsFromRdf(rdf);
    expect(datasets[0].spatialCoverage).toEqual([
      {
        uri: "http://publications.europa.eu/resource/authority/country/LUX",
        text: undefined,
      },
    ]);
  });

  test("harvestFromUrl fetches RDF and parses datasets", async () => {
    const fetcher =
      jest.fn<(input: string | URL, init?: RequestInit) => Promise<Response>>();
    fetcher.mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: "OK",
      text: async () => `
        <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:dcat="http://www.w3.org/ns/dcat#" xmlns:dct="http://purl.org/dc/terms/">
          <dcat:Dataset rdf:about="https://example.org/datasets/x"><dct:title>T</dct:title><dct:description>D</dct:description></dcat:Dataset>
        </rdf:RDF>
      `,
    } as Response);

    const service = new DcatHarvesterService(fetcher);

    await expect(
      service.harvestFromUrl("https://example.org/catalogue.rdf")
    ).resolves.toEqual([
      {
        id: "https://example.org/datasets/x",
        identifier: "",
        title: "T",
        description: "D",
        catalogue: "",
        languages: [],
        createdAt: undefined,
        modifiedAt: undefined,
        version: "",
        hasVersions: [],
        versionNotes: undefined,
        numberOfRecords: undefined,
        numberOfUniqueIndividuals: undefined,
        maxTypicalAge: undefined,
        minTypicalAge: undefined,
        populationCoverage: "",
        spatialCoverage: undefined,
        spatialResolutionInMeters: undefined,
        temporalCoverage: undefined,
        retentionPeriod: undefined,
        temporalResolution: undefined,
        frequency: undefined,
        publishers: [],
        hdab: [],
        creators: [],
        publisherType: undefined,
        datasetRelationships: undefined,
        themes: [],
        keywords: [],
        healthTheme: [],
        healthCategory: [],
        dcatType: [],
        personalData: undefined,
        purpose: undefined,
        codeValues: undefined,
        codingSystem: undefined,
      },
    ]);

    expect(fetcher).toHaveBeenCalledWith("https://example.org/catalogue.rdf", {
      headers: undefined,
    });
  });

  test("harvestFromUrl throws on non-ok response", async () => {
    const fetcher =
      jest.fn<(input: string | URL, init?: RequestInit) => Promise<Response>>();
    fetcher.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      headers: new Headers({ "content-type": "text/plain; charset=utf-8" }),
      text: async () => "upstream proxy failure",
    } as Response);

    const service = new DcatHarvesterService(fetcher);

    await expect(
      service.harvestFromUrl("https://example.org/catalogue.rdf")
    ).rejects.toThrow(
      "Failed to fetch DCAT catalogue from https://example.org/catalogue.rdf (500 Internal Server Error) | content-type: text/plain; charset=utf-8 | response body: upstream proxy failure"
    );
  });

  test("harvestFromUrl reports failures while reading non-ok response bodies", async () => {
    const fetcher =
      jest.fn<(input: string | URL, init?: RequestInit) => Promise<Response>>();
    const cause = Object.assign(new Error("socket hang up"), {
      code: "ECONNRESET",
      host: "example.org",
      port: 443,
    });
    const error = new Error("failed to consume error response body");
    (error as Error & { cause?: Error }).cause = cause;
    fetcher.mockResolvedValueOnce({
      ok: false,
      status: 502,
      statusText: "Bad Gateway",
      headers: new Headers({ "content-type": "text/html" }),
      text: async () => {
        throw error;
      },
    } as unknown as Response);

    const service = new DcatHarvesterService(fetcher);

    await expect(
      service.harvestFromUrl("https://example.org/catalogue.rdf")
    ).rejects.toThrow(
      "Failed to fetch DCAT catalogue from https://example.org/catalogue.rdf (502 Bad Gateway) | content-type: text/html | response body: unable to read error response body: failed to consume error response body | cause: socket hang up (code=ECONNRESET, host=example.org, port=443)"
    );
  });

  test("harvestFromUrl includes non-Error failure details", async () => {
    const fetcher =
      jest.fn<(input: string | URL, init?: RequestInit) => Promise<Response>>();
    fetcher.mockRejectedValueOnce("socket closed");

    const service = new DcatHarvesterService(fetcher);

    await expect(
      service.harvestFromUrl("https://example.org/catalogue.rdf")
    ).rejects.toThrow(
      "Failed to download DCAT catalogue from https://example.org/catalogue.rdf: socket closed"
    );
  });

  test("harvestFromUrl includes response body read failures", async () => {
    const fetcher =
      jest.fn<(input: string | URL, init?: RequestInit) => Promise<Response>>();
    const cause = Object.assign(new Error("socket hang up"), {
      code: "ECONNRESET",
      host: "example.org",
      port: 443,
    });
    const error = new Error("failed to consume response body");
    (error as Error & { cause?: Error }).cause = cause;
    fetcher.mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: "OK",
      text: async () => {
        throw error;
      },
    } as unknown as Response);

    const service = new DcatHarvesterService(fetcher);

    await expect(
      service.harvestFromUrl("https://example.org/catalogue.rdf")
    ).rejects.toThrow(
      "Failed to read DCAT catalogue response body from https://example.org/catalogue.rdf: failed to consume response body | cause: socket hang up (code=ECONNRESET, host=example.org, port=443)"
    );
  });

  test("harvestFromUrl includes RDF parse failures", async () => {
    const fetcher =
      jest.fn<(input: string | URL, init?: RequestInit) => Promise<Response>>();
    fetcher.mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: "OK",
      text: async () => "<rdf />",
    } as Response);

    const service = new DcatHarvesterService(fetcher);
    jest
      .spyOn(service, "parseDatasetsFromRdf")
      .mockRejectedValueOnce(new Error("invalid RDF payload"));

    await expect(
      service.harvestFromUrl("https://example.org/catalogue.rdf")
    ).rejects.toThrow(
      "Failed to parse RDF/XML from https://example.org/catalogue.rdf: invalid RDF payload"
    );
  });

  test("extracts frequency with skos:prefLabel as label", async () => {
    const service = new DcatHarvesterService();
    const rdf = `
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
               xmlns:dcat="http://www.w3.org/ns/dcat#"
               xmlns:dct="http://purl.org/dc/terms/"
               xmlns:skos="http://www.w3.org/2004/02/skos/core#">
        <dcat:Dataset rdf:about="https://example.org/datasets/1">
          <dct:title>Dataset A</dct:title>
          <dct:description>Description A</dct:description>
          <dct:accrualPeriodicity>
            <dct:Frequency rdf:about="http://publications.europa.eu/resource/authority/frequency/ANNUAL">
              <skos:prefLabel xml:lang="eng">Annual</skos:prefLabel>
            </dct:Frequency>
          </dct:accrualPeriodicity>
        </dcat:Dataset>
      </rdf:RDF>
    `;

    const datasets = await service.parseDatasetsFromRdf(rdf);
    expect(datasets[0].frequency).toEqual({
      value:
        "http://publications.europa.eu/resource/authority/frequency/ANNUAL",
      label: "Annual",
    });
  });

  test("extracts frequency falling back to URI tail when skos:prefLabel is absent", async () => {
    const service = new DcatHarvesterService();
    const rdf = `
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
               xmlns:dcat="http://www.w3.org/ns/dcat#"
               xmlns:dct="http://purl.org/dc/terms/">
        <dcat:Dataset rdf:about="https://example.org/datasets/1">
          <dct:title>Dataset A</dct:title>
          <dct:description>Description A</dct:description>
          <dct:accrualPeriodicity rdf:resource="http://publications.europa.eu/resource/authority/frequency/MONTHLY"/>
        </dcat:Dataset>
      </rdf:RDF>
    `;

    const datasets = await service.parseDatasetsFromRdf(rdf);
    expect(datasets[0].frequency).toEqual({
      value:
        "http://publications.europa.eu/resource/authority/frequency/MONTHLY",
      label: "MONTHLY",
    });
  });

  test("extracts temporalCoverage with start and end dates", async () => {
    const service = new DcatHarvesterService();
    const rdf = `
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
               xmlns:dcat="http://www.w3.org/ns/dcat#"
               xmlns:dct="http://purl.org/dc/terms/">
        <dcat:Dataset rdf:about="https://example.org/datasets/1">
          <dct:title>Dataset A</dct:title>
          <dct:description>Description A</dct:description>
          <dct:temporal>
            <dct:PeriodOfTime>
              <dcat:startDate>2020-01-01</dcat:startDate>
              <dcat:endDate>2023-12-31</dcat:endDate>
            </dct:PeriodOfTime>
          </dct:temporal>
        </dcat:Dataset>
      </rdf:RDF>
    `;

    const datasets = await service.parseDatasetsFromRdf(rdf);
    expect(datasets[0].temporalCoverage).toEqual({
      start: "2020-01-01T00:00:00.000Z",
      end: "2023-12-31T00:00:00.000Z",
    });
  });

  test("extracts retentionPeriod with multiple periods", async () => {
    const service = new DcatHarvesterService();
    const rdf = `
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
               xmlns:dcat="http://www.w3.org/ns/dcat#"
               xmlns:dct="http://purl.org/dc/terms/"
               xmlns:healthdcatap="http://healthdataportal.eu/ns/health#">
        <dcat:Dataset rdf:about="https://example.org/datasets/1">
          <dct:title>Dataset A</dct:title>
          <dct:description>Description A</dct:description>
          <healthdcatap:retentionPeriod>
            <dct:PeriodOfTime>
              <dcat:startDate>2020-01-01</dcat:startDate>
              <dcat:endDate>2022-12-31</dcat:endDate>
            </dct:PeriodOfTime>
          </healthdcatap:retentionPeriod>
          <healthdcatap:retentionPeriod>
            <dct:PeriodOfTime>
              <dcat:startDate>2023-01-01</dcat:startDate>
            </dct:PeriodOfTime>
          </healthdcatap:retentionPeriod>
        </dcat:Dataset>
      </rdf:RDF>
    `;

    const datasets = await service.parseDatasetsFromRdf(rdf);
    expect(datasets[0].retentionPeriod).toEqual([
      { start: "2020-01-01T00:00:00.000Z", end: "2022-12-31T00:00:00.000Z" },
      { start: "2023-01-01T00:00:00.000Z", end: undefined },
    ]);
  });

  test("returns undefined for temporalCoverage when period has no valid dates", async () => {
    const service = new DcatHarvesterService();
    const rdf = `
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
               xmlns:dcat="http://www.w3.org/ns/dcat#"
               xmlns:dct="http://purl.org/dc/terms/">
        <dcat:Dataset rdf:about="https://example.org/datasets/1">
          <dct:title>Dataset A</dct:title>
          <dct:description>Description A</dct:description>
          <dct:temporal>
            <dct:PeriodOfTime>
              <dcat:startDate>not-a-date</dcat:startDate>
              <dcat:endDate>also-invalid</dcat:endDate>
            </dct:PeriodOfTime>
          </dct:temporal>
        </dcat:Dataset>
      </rdf:RDF>
    `;

    const datasets = await service.parseDatasetsFromRdf(rdf);
    expect(datasets[0].temporalCoverage).toBeUndefined();
  });

  test("returns undefined for retentionPeriod when all periods have no valid dates", async () => {
    const service = new DcatHarvesterService();
    const rdf = `
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
               xmlns:dcat="http://www.w3.org/ns/dcat#"
               xmlns:dct="http://purl.org/dc/terms/"
               xmlns:healthdcatap="http://healthdataportal.eu/ns/health#">
        <dcat:Dataset rdf:about="https://example.org/datasets/1">
          <dct:title>Dataset A</dct:title>
          <dct:description>Description A</dct:description>
          <healthdcatap:retentionPeriod>
            <dct:PeriodOfTime>
              <dcat:startDate>not-a-date</dcat:startDate>
              <dcat:endDate>also-invalid</dcat:endDate>
            </dct:PeriodOfTime>
          </healthdcatap:retentionPeriod>
        </dcat:Dataset>
      </rdf:RDF>
    `;

    const datasets = await service.parseDatasetsFromRdf(rdf);
    expect(datasets[0].retentionPeriod).toBeUndefined();
  });

  test("extracts personalData as ValueLabel array using URI fragment as fallback label", async () => {
    const service = new DcatHarvesterService();
    const rdf = `
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
               xmlns:dcat="http://www.w3.org/ns/dcat#"
               xmlns:dct="http://purl.org/dc/terms/"
               xmlns:dpv="http://www.w3.org/ns/dpv#"
               xmlns:skos="http://www.w3.org/2004/02/skos/core#">
        <dcat:Dataset rdf:about="https://example.org/datasets/1">
          <dct:title>Dataset A</dct:title>
          <dct:description>Description A</dct:description>
          <dpv:hasPersonalData rdf:resource="https://w3id.org/dpv/dpv-pd#Age"/>
          <dpv:hasPersonalData>
            <dpv:PersonalData rdf:about="https://w3id.org/dpv/dpv-pd#MedicalRecord">
              <skos:prefLabel xml:lang="eng">Medical Record</skos:prefLabel>
            </dpv:PersonalData>
          </dpv:hasPersonalData>
        </dcat:Dataset>
      </rdf:RDF>
    `;

    const datasets = await service.parseDatasetsFromRdf(rdf);
    expect(datasets[0].personalData).toEqual([
      { value: "https://w3id.org/dpv/dpv-pd#Age", label: "Age" },
      {
        value: "https://w3id.org/dpv/dpv-pd#MedicalRecord",
        label: "Medical Record",
      },
    ]);
  });

  test("returns undefined for personalData when no dpv:hasPersonalData triples exist", async () => {
    const service = new DcatHarvesterService();
    const rdf = `
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
               xmlns:dcat="http://www.w3.org/ns/dcat#"
               xmlns:dct="http://purl.org/dc/terms/">
        <dcat:Dataset rdf:about="https://example.org/datasets/1">
          <dct:title>Dataset A</dct:title>
          <dct:description>Description A</dct:description>
        </dcat:Dataset>
      </rdf:RDF>
    `;

    const datasets = await service.parseDatasetsFromRdf(rdf);
    expect(datasets[0].personalData).toBeUndefined();
  });

  test("uses rdfs:label as fallback label when skos:prefLabel is absent", async () => {
    const service = new DcatHarvesterService();
    const rdf = `
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
               xmlns:dcat="http://www.w3.org/ns/dcat#"
               xmlns:dct="http://purl.org/dc/terms/"
               xmlns:dpv="http://www.w3.org/ns/dpv#"
               xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#">
        <dcat:Dataset rdf:about="https://example.org/datasets/1">
          <dct:title>Dataset A</dct:title>
          <dct:description>Description A</dct:description>
          <dpv:hasPersonalData>
            <dpv:PersonalData rdf:about="https://w3id.org/dpv/dpv-pd#Location">
              <rdfs:label xml:lang="eng">Location Data</rdfs:label>
            </dpv:PersonalData>
          </dpv:hasPersonalData>
        </dcat:Dataset>
      </rdf:RDF>
    `;

    const datasets = await service.parseDatasetsFromRdf(rdf);
    expect(datasets[0].personalData).toEqual([
      { value: "https://w3id.org/dpv/dpv-pd#Location", label: "Location Data" },
    ]);
  });

  test("falls back to URI path segment when no label triple exists", async () => {
    const service = new DcatHarvesterService();
    const rdf = `
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
               xmlns:dcat="http://www.w3.org/ns/dcat#"
               xmlns:dct="http://purl.org/dc/terms/"
               xmlns:dpv="http://www.w3.org/ns/dpv#">
        <dcat:Dataset rdf:about="https://example.org/datasets/1">
          <dct:title>Dataset A</dct:title>
          <dct:description>Description A</dct:description>
          <dpv:hasPersonalData rdf:resource="https://w3id.org/dpv/dpv-pd#Financial"/>
          <dpv:hasPersonalData rdf:resource="https://example.org/personal-data/Genetic"/>
        </dcat:Dataset>
      </rdf:RDF>
    `;

    const datasets = await service.parseDatasetsFromRdf(rdf);
    expect(datasets[0].personalData).toEqual([
      { value: "https://w3id.org/dpv/dpv-pd#Financial", label: "Financial" },
      {
        value: "https://example.org/personal-data/Genetic",
        label: "Genetic",
      },
    ]);
  });

  test("collects personalData across multiple datasets independently", async () => {
    const service = new DcatHarvesterService();
    const rdf = `
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
               xmlns:dcat="http://www.w3.org/ns/dcat#"
               xmlns:dct="http://purl.org/dc/terms/"
               xmlns:dpv="http://www.w3.org/ns/dpv#">
        <dcat:Dataset rdf:about="https://example.org/datasets/1">
          <dct:title>Dataset A</dct:title>
          <dct:description>Description A</dct:description>
          <dpv:hasPersonalData rdf:resource="https://w3id.org/dpv/dpv-pd#Age"/>
        </dcat:Dataset>
        <dcat:Dataset rdf:about="https://example.org/datasets/2">
          <dct:title>Dataset B</dct:title>
          <dct:description>Description B</dct:description>
        </dcat:Dataset>
      </rdf:RDF>
    `;

    const datasets = await service.parseDatasetsFromRdf(rdf);
    expect(datasets[0].personalData).toEqual([
      { value: "https://w3id.org/dpv/dpv-pd#Age", label: "Age" },
    ]);
    expect(datasets[1].personalData).toBeUndefined();
  });

  test("extracts purpose using dct:description as value and label", async () => {
    const service = new DcatHarvesterService();
    const rdf = `
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
               xmlns:dcat="http://www.w3.org/ns/dcat#"
               xmlns:dct="http://purl.org/dc/terms/"
               xmlns:dpv="http://www.w3.org/ns/dpv#">
        <dcat:Dataset rdf:about="https://example.org/datasets/1">
          <dct:title>Dataset A</dct:title>
          <dct:description>Description A</dct:description>
          <dpv:hasPurpose>
            <dpv:Purpose rdf:nodeID="Npurpose1">
              <dct:description xml:lang="eng">https://www.example.com/purpose/research</dct:description>
            </dpv:Purpose>
          </dpv:hasPurpose>
          <dpv:hasPurpose>
            <dpv:Purpose rdf:nodeID="Npurpose2">
              <dct:description xml:lang="eng">Scientific analysis</dct:description>
            </dpv:Purpose>
          </dpv:hasPurpose>
        </dcat:Dataset>
      </rdf:RDF>
    `;

    const datasets = await service.parseDatasetsFromRdf(rdf);
    expect(datasets[0].purpose).toEqual([
      {
        value: "https://www.example.com/purpose/research",
        label: "https://www.example.com/purpose/research",
      },
      { value: "Scientific analysis", label: "Scientific analysis" },
    ]);
  });

  test("returns undefined for purpose when no dpv:hasPurpose triples exist", async () => {
    const service = new DcatHarvesterService();
    const rdf = `
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
               xmlns:dcat="http://www.w3.org/ns/dcat#"
               xmlns:dct="http://purl.org/dc/terms/">
        <dcat:Dataset rdf:about="https://example.org/datasets/1">
          <dct:title>Dataset A</dct:title>
          <dct:description>Description A</dct:description>
        </dcat:Dataset>
      </rdf:RDF>
    `;

    const datasets = await service.parseDatasetsFromRdf(rdf);
    expect(datasets[0].purpose).toBeUndefined();
  });

  test("ignores dpv:hasPurpose entries with no dct:description", async () => {
    const service = new DcatHarvesterService();
    const rdf = `
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
               xmlns:dcat="http://www.w3.org/ns/dcat#"
               xmlns:dct="http://purl.org/dc/terms/"
               xmlns:dpv="http://www.w3.org/ns/dpv#">
        <dcat:Dataset rdf:about="https://example.org/datasets/1">
          <dct:title>Dataset A</dct:title>
          <dct:description>Description A</dct:description>
          <dpv:hasPurpose>
            <dpv:Purpose rdf:nodeID="Npurpose-empty"/>
          </dpv:hasPurpose>
          <dpv:hasPurpose>
            <dpv:Purpose rdf:nodeID="Npurpose-valid">
              <dct:description xml:lang="eng">Valid purpose</dct:description>
            </dpv:Purpose>
          </dpv:hasPurpose>
        </dcat:Dataset>
      </rdf:RDF>
    `;

    const datasets = await service.parseDatasetsFromRdf(rdf);
    expect(datasets[0].purpose).toEqual([
      { value: "Valid purpose", label: "Valid purpose" },
    ]);
  });

  test("collects purpose across multiple datasets independently", async () => {
    const service = new DcatHarvesterService();
    const rdf = `
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
               xmlns:dcat="http://www.w3.org/ns/dcat#"
               xmlns:dct="http://purl.org/dc/terms/"
               xmlns:dpv="http://www.w3.org/ns/dpv#">
        <dcat:Dataset rdf:about="https://example.org/datasets/1">
          <dct:title>Dataset A</dct:title>
          <dct:description>Description A</dct:description>
          <dpv:hasPurpose>
            <dpv:Purpose rdf:nodeID="Np1">
              <dct:description xml:lang="eng">Research</dct:description>
            </dpv:Purpose>
          </dpv:hasPurpose>
        </dcat:Dataset>
        <dcat:Dataset rdf:about="https://example.org/datasets/2">
          <dct:title>Dataset B</dct:title>
          <dct:description>Description B</dct:description>
        </dcat:Dataset>
      </rdf:RDF>
    `;

    const datasets = await service.parseDatasetsFromRdf(rdf);
    expect(datasets[0].purpose).toEqual([
      { value: "Research", label: "Research" },
    ]);
    expect(datasets[1].purpose).toBeUndefined();
  });

  test("extracts temporalResolution as ISO duration string", async () => {
    const service = new DcatHarvesterService();
    const rdf = `
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
               xmlns:dcat="http://www.w3.org/ns/dcat#"
               xmlns:dct="http://purl.org/dc/terms/">
        <dcat:Dataset rdf:about="https://example.org/datasets/1">
          <dct:title>Dataset A</dct:title>
          <dct:description>Description A</dct:description>
          <dcat:temporalResolution rdf:datatype="http://www.w3.org/2001/XMLSchema#duration">P1M</dcat:temporalResolution>
        </dcat:Dataset>
      </rdf:RDF>
    `;

    const datasets = await service.parseDatasetsFromRdf(rdf);
    expect(datasets[0].temporalResolution).toBe("P1M");
  });

  test("returns undefined for dates when getTime throws", async () => {
    const service = new DcatHarvesterService();
    const getTimeSpy = jest
      .spyOn(Date.prototype, "getTime")
      .mockImplementationOnce(() => {
        throw new Error("date getTime failed");
      });

    const rdf = `
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
               xmlns:dcat="http://www.w3.org/ns/dcat#"
               xmlns:dct="http://purl.org/dc/terms/">
        <dcat:Dataset rdf:about="https://example.org/datasets/1">
          <dct:title>Dataset A</dct:title>
          <dct:description>Description A</dct:description>
          <dct:issued>2020-01-02</dct:issued>
        </dcat:Dataset>
      </rdf:RDF>
    `;

    try {
      const datasets = await service.parseDatasetsFromRdf(rdf);
      expect(datasets[0]).toMatchObject({ createdAt: undefined });
    } finally {
      getTimeSpy.mockRestore();
    }
  });
});
