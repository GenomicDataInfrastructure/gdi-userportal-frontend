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
            label: "https://example.org/datasets/1/v1",
          },
        ],
        versionNotes: ["Updated with 2024 data"],
        populationCoverage: "People of LNDS.",
        spatialCoverage: [
          {
            uri: "http://publications.europa.eu/resource/authority/country/LUX",
            text: "Luxembourg",
          },
        ],
        spatialResolutionInMeters: [4],
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
        hasVersions: undefined,
        versionNotes: undefined,
        populationCoverage: "",
        spatialCoverage: undefined,
        spatialResolutionInMeters: undefined,
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
        hasVersions: undefined,
        versionNotes: undefined,
        populationCoverage: "",
        spatialCoverage: undefined,
        spatialResolutionInMeters: undefined,
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
      text: async () => "",
    } as Response);

    const service = new DcatHarvesterService(fetcher);

    await expect(
      service.harvestFromUrl("https://example.org/catalogue.rdf")
    ).rejects.toThrow(
      "Failed to fetch DCAT catalogue from https://example.org/catalogue.rdf (500 Internal Server Error)"
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
