// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { jest } from "@jest/globals";
import { DcatHarvesterService } from "@/app/api/discovery/harvester/dcat-harvester-service";

describe("DcatHarvesterService", () => {
  test("parses a whole catalogue with basic fields", async () => {
    const service = new DcatHarvesterService();
    const rdf = `
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
               xmlns:dcat="http://www.w3.org/ns/dcat#"
               xmlns:dct="http://purl.org/dc/terms/"
               xmlns:dc="http://purl.org/dc/elements/1.1/"
               xmlns:foaf="http://xmlns.com/foaf/0.1/"
               xmlns:adms="http://www.w3.org/ns/adms#">
        <dcat:Catalog rdf:about="https://example.org/catalogues/main">
          <dct:title>Main Catalogue</dct:title>
        </dcat:Catalog>
        <dcat:Dataset rdf:about="https://example.org/datasets/1">
          <dct:identifier>dataset-1</dct:identifier>
          <dct:title xml:lang="en">Population Registry</dct:title>
          <dct:description xml:lang="en">National &amp; regional data</dct:description>
          <dct:issued>2023-06-15</dct:issued>
          <dct:modified>2024-02-20T14:30:00Z</dct:modified>
          <dcat:version>1.2.0</dcat:version>
          <dcat:hasVersion rdf:resource="https://example.org/datasets/1/v1"/>
          <adms:versionNotes>Updated with 2024 data</adms:versionNotes>
          <foaf:homepage rdf:resource="https://example.org/page/1" />
        </dcat:Dataset>
        <dcat:Dataset>
          <dct:identifier>ID-2</dct:identifier>
          <dc:title>Hospital Capacity</dc:title>
          <dc:description><![CDATA[ Bed occupancy  ]]></dc:description>
        </dcat:Dataset>
        <dcat:Dataset>
          <dct:title>   </dct:title>
          <dct:description>   </dct:description>
        </dcat:Dataset>
      </rdf:RDF>
    `;

    const datasets = await service.parseDatasetsFromRdf(rdf);

    expect(datasets).toEqual([
      {
        id: "dataset-1",
        identifier: "dataset-1",
        title: "Population Registry",
        description: "National & regional data",
        catalogue: "Main Catalogue",
        languages: [],
        createdAt: "2023-06-15T00:00:00.000Z",
        modifiedAt: "2024-02-20T14:30:00.000Z",
        version: "1.2.0",
        hasVersions: [
          {
            value: "https://example.org/datasets/1/v1",
            label: "https://example.org/datasets/1/v1",
          },
        ],
        versionNotes: "Updated with 2024 data",
        populationCoverage: "",
        spatialResolutionInMeters: undefined,
      },
      {
        id: "ID-2",
        identifier: "ID-2",
        title: "Hospital Capacity",
        description: "Bed occupancy",
        catalogue: "Main Catalogue",
        languages: [],
        createdAt: "",
        modifiedAt: "",
        version: "",
        hasVersions: undefined,
        versionNotes: "",
        populationCoverage: "",
        spatialResolutionInMeters: undefined,
      },
    ]);
  });

  test("extracts dataset languages from dct:language entries", async () => {
    const service = new DcatHarvesterService();
    const rdf = `
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
               xmlns:dcat="http://www.w3.org/ns/dcat#"
               xmlns:dct="http://purl.org/dc/terms/">
        <dcat:Dataset rdf:about="https://example.org/datasets/1">
          <dct:title>Dataset A</dct:title>
          <dct:description>Description A</dct:description>
          <dct:language rdf:resource="http://publications.europa.eu/resource/authority/language/ENG" />
          <dct:language rdf:resource="http://publications.europa.eu/resource/authority/language/FRA" />
          <dct:language> DEU </dct:language>
        </dcat:Dataset>
      </rdf:RDF>
    `;

    const datasets = await service.parseDatasetsFromRdf(rdf);
    expect(datasets[0].languages).toEqual([
      "http://publications.europa.eu/resource/authority/language/ENG",
      "http://publications.europa.eu/resource/authority/language/FRA",
      "DEU",
    ]);
  });

  test("extracts title from dct:title and dc:title", async () => {
    const service = new DcatHarvesterService();
    const rdf = `
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:dcat="http://www.w3.org/ns/dcat#" xmlns:dct="http://purl.org/dc/terms/" xmlns:dc="http://purl.org/dc/elements/1.1/">
        <dcat:Dataset rdf:about="https://example.org/datasets/1">
          <dct:title>  Dataset A  </dct:title>
          <dct:description>x</dct:description>
        </dcat:Dataset>
        <dcat:Dataset rdf:about="https://example.org/datasets/2">
          <dc:title>Dataset B</dc:title>
          <dct:description>y</dct:description>
        </dcat:Dataset>
      </rdf:RDF>
    `;

    const datasets = await service.parseDatasetsFromRdf(rdf);
    expect(datasets.map((dataset) => dataset.title)).toEqual([
      "Dataset A",
      "Dataset B",
    ]);
  });

  test("extracts description from dct:description and dc:description", async () => {
    const service = new DcatHarvesterService();
    const rdf = `
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:dcat="http://www.w3.org/ns/dcat#" xmlns:dct="http://purl.org/dc/terms/" xmlns:dc="http://purl.org/dc/elements/1.1/">
        <dcat:Dataset rdf:about="https://example.org/datasets/1">
          <dct:title>A</dct:title>
          <dct:description>  Foo &amp; Bar  </dct:description>
        </dcat:Dataset>
        <dcat:Dataset rdf:about="https://example.org/datasets/2">
          <dct:title>B</dct:title>
          <dc:description><![CDATA[  CDATA text  ]]></dc:description>
        </dcat:Dataset>
      </rdf:RDF>
    `;

    const datasets = await service.parseDatasetsFromRdf(rdf);
    expect(datasets.map((dataset) => dataset.description)).toEqual([
      "Foo & Bar",
      "CDATA text",
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
    const datasets = await service.harvestFromUrl(
      "https://example.org/catalogue.rdf"
    );

    expect(fetcher).toHaveBeenCalledWith("https://example.org/catalogue.rdf", {
      headers: undefined,
    });
    expect(datasets).toEqual([
      {
        id: "https://example.org/datasets/x",
        identifier: "",
        title: "T",
        description: "D",
        catalogue: "",
        languages: [],
        createdAt: "",
        modifiedAt: "",
        version: "",
        hasVersions: undefined,
        versionNotes: "",
        populationCoverage: "",
        spatialResolutionInMeters: undefined,
      },
    ]);
  });

  test("deduplicates repeated dataset languages", async () => {
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

  test("extracts dataset catalogue from dcat:inCatalog rdf:resource", async () => {
    const service = new DcatHarvesterService();
    const rdf = `
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
               xmlns:dcat="http://www.w3.org/ns/dcat#"
               xmlns:dct="http://purl.org/dc/terms/">
        <dcat:Catalog rdf:about="https://example.org/catalogues/main">
          <dct:title>Main Catalogue</dct:title>
        </dcat:Catalog>
        <dcat:Catalog rdf:about="https://example.org/catalogues/special">
          <dct:title>Special Catalogue</dct:title>
        </dcat:Catalog>
        <dcat:Dataset rdf:about="https://example.org/datasets/1">
          <dct:title>Dataset A</dct:title>
          <dct:description>Description A</dct:description>
          <dcat:inCatalog rdf:resource="https://example.org/catalogues/special" />
        </dcat:Dataset>
      </rdf:RDF>
    `;

    const datasets = await service.parseDatasetsFromRdf(rdf);
    expect(datasets[0].catalogue).toBe("Special Catalogue");
  });

  test("falls back to catalog rdf:about when catalog has no title", async () => {
    const service = new DcatHarvesterService();
    const rdf = `
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
               xmlns:dcat="http://www.w3.org/ns/dcat#"
               xmlns:dct="http://purl.org/dc/terms/">
        <dcat:Catalog rdf:about="https://example.org/catalogues/about-only">
          <dct:description>About-only catalogue</dct:description>
        </dcat:Catalog>
        <dcat:Dataset rdf:about="https://example.org/datasets/1">
          <dct:title>Dataset A</dct:title>
          <dct:description>Description A</dct:description>
        </dcat:Dataset>
      </rdf:RDF>
    `;

    const datasets = await service.parseDatasetsFromRdf(rdf);
    expect(datasets[0].catalogue).toBe(
      "https://example.org/catalogues/about-only"
    );
  });

  test("extracts dataset catalogue from inline dcat:inCatalog title block", async () => {
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
          <dcat:inCatalog>
            <dcat:Catalog>
              <dct:title>Inline Catalogue</dct:title>
            </dcat:Catalog>
          </dcat:inCatalog>
        </dcat:Dataset>
      </rdf:RDF>
    `;

    const datasets = await service.parseDatasetsFromRdf(rdf);
    expect(datasets[0].catalogue).toBe("Inline Catalogue");
  });

  test("uses the single top-level catalog as fallback, not a nested inline catalog", async () => {
    const service = new DcatHarvesterService();
    const rdf = `
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
               xmlns:dcat="http://www.w3.org/ns/dcat#"
               xmlns:dct="http://purl.org/dc/terms/">
        <dcat:Dataset rdf:about="https://example.org/datasets/1">
          <dct:title>Dataset A</dct:title>
          <dct:description>Description A</dct:description>
          <dcat:inCatalog>
            <dcat:Catalog>
              <dct:title>Inline Catalogue</dct:title>
            </dcat:Catalog>
          </dcat:inCatalog>
        </dcat:Dataset>
        <dcat:Catalog rdf:about="https://example.org/catalogues/main">
          <dct:title>Main Catalogue</dct:title>
        </dcat:Catalog>
        <dcat:Dataset rdf:about="https://example.org/datasets/2">
          <dct:title>Dataset B</dct:title>
          <dct:description>Description B</dct:description>
        </dcat:Dataset>
      </rdf:RDF>
    `;

    const datasets = await service.parseDatasetsFromRdf(rdf);
    expect(datasets[0].catalogue).toBe("Inline Catalogue");
    expect(datasets[1].catalogue).toBe("Main Catalogue");
  });

  test("falls back to generated dataset id when identifier/about are missing", async () => {
    const service = new DcatHarvesterService();
    const rdf = `
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
               xmlns:dcat="http://www.w3.org/ns/dcat#"
               xmlns:dct="http://purl.org/dc/terms/">
        <dcat:Dataset>
          <dct:title>Dataset A</dct:title>
          <dct:description>Description A</dct:description>
        </dcat:Dataset>
      </rdf:RDF>
    `;

    const datasets = await service.parseDatasetsFromRdf(rdf);
    expect(datasets[0].id).toBe("dataset-1");
  });

  test("extracts identifier independently from id fallback", async () => {
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
    expect(datasets[0]).toEqual({
      id: "https://example.org/datasets/1",
      identifier: "",
      title: "Dataset A",
      description: "Description A",
      catalogue: "",
      languages: [],
      createdAt: "",
      modifiedAt: "",
      version: "",
      hasVersions: undefined,
      versionNotes: "",
      populationCoverage: "",
      spatialResolutionInMeters: undefined,
    });
  });

  test("handles invalid dates gracefully", async () => {
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
    expect(datasets[0].createdAt).toBe("");
    expect(datasets[0].modifiedAt).toBe("");
  });

  test("parses dcterms:issued and dcterms:modified as valid ISO dates", async () => {
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
    expect(datasets[0].createdAt).toBe("2020-01-02T03:04:05.000Z");
    expect(datasets[0].modifiedAt).toBe("2021-02-03T04:05:06.000Z");
  });

  test("harvestFromUrl throws on non-ok response", async () => {
    const fetcher =
      jest.fn<(input: string | URL, init?: RequestInit) => Promise<Response>>();
    fetcher.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      text: async () => "",
    } as Response);

    const service = new DcatHarvesterService(fetcher);

    await expect(
      service.harvestFromUrl("https://example.org/catalogue.rdf")
    ).rejects.toThrow(
      "Failed to fetch DCAT catalogue (500 Internal Server Error)"
    );
  });

  test("extracts populationCoverage from healthdcatap:populationCoverage", async () => {
    const service = new DcatHarvesterService();
    const rdf = `
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
               xmlns:dcat="http://www.w3.org/ns/dcat#"
               xmlns:dct="http://purl.org/dc/terms/"
               xmlns:healthdcatap="http://data.europa.eu/r5r/">
        <dcat:Dataset rdf:about="https://example.org/datasets/1">
          <dct:title>Dataset A</dct:title>
          <dct:description>Description A</dct:description>
          <healthdcatap:populationCoverage xml:lang="eng">People of LNDS.</healthdcatap:populationCoverage>
        </dcat:Dataset>
      </rdf:RDF>
    `;

    const datasets = await service.parseDatasetsFromRdf(rdf);
    expect(datasets[0].populationCoverage).toBe("People of LNDS.");
  });

  test("extracts spatialResolutionInMeters from dcat:spatialResolutionInMeters", async () => {
    const service = new DcatHarvesterService();
    const rdf = `
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
               xmlns:dcat="http://www.w3.org/ns/dcat#"
               xmlns:dct="http://purl.org/dc/terms/">
        <dcat:Dataset rdf:about="https://example.org/datasets/1">
          <dct:title>Dataset A</dct:title>
          <dct:description>Description A</dct:description>
          <dcat:spatialResolutionInMeters rdf:datatype="http://www.w3.org/2001/XMLSchema#decimal">4</dcat:spatialResolutionInMeters>
        </dcat:Dataset>
      </rdf:RDF>
    `;

    const datasets = await service.parseDatasetsFromRdf(rdf);
    expect(datasets[0].spatialResolutionInMeters).toBe(4);
  });
});
