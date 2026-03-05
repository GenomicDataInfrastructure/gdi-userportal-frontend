// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { jest } from "@jest/globals";
import { DcatHarvesterService } from "@/app/api/discovery/harvester/dcat-harvester-service";

describe("DcatHarvesterService", () => {
  test("parses a whole catalogue with basic fields", () => {
    const service = new DcatHarvesterService();
    const rdf = `
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
               xmlns:dcat="http://www.w3.org/ns/dcat#"
               xmlns:dct="http://purl.org/dc/terms/"
               xmlns:dc="http://purl.org/dc/elements/1.1/"
               xmlns:foaf="http://xmlns.com/foaf/0.1/">
        <dcat:Dataset rdf:about="https://example.org/datasets/1">
          <dct:identifier>dataset-1</dct:identifier>
          <dct:title xml:lang="en">Population Registry</dct:title>
          <dct:description xml:lang="en">National &amp; regional data</dct:description>
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

    const datasets = service.parseDatasetsFromRdf(rdf);

    expect(datasets).toEqual([
      {
        id: "dataset-1",
        title: "Population Registry",
        description: "National & regional data",
      },
      {
        id: "ID-2",
        title: "Hospital Capacity",
        description: "Bed occupancy",
      },
    ]);
  });

  test("extracts title from dct:title and dc:title", () => {
    const service = new DcatHarvesterService();
    const rdf = `
      <rdf:RDF xmlns:dcat="http://www.w3.org/ns/dcat#" xmlns:dct="http://purl.org/dc/terms/" xmlns:dc="http://purl.org/dc/elements/1.1/">
        <dcat:Dataset rdf:about="d1">
          <dct:title>  Dataset A  </dct:title>
          <dct:description>x</dct:description>
        </dcat:Dataset>
        <dcat:Dataset rdf:about="d2">
          <dc:title>Dataset B</dc:title>
          <dct:description>y</dct:description>
        </dcat:Dataset>
      </rdf:RDF>
    `;

    const datasets = service.parseDatasetsFromRdf(rdf);
    expect(datasets.map((dataset) => dataset.title)).toEqual([
      "Dataset A",
      "Dataset B",
    ]);
  });

  test("extracts description from dct:description and dc:description", () => {
    const service = new DcatHarvesterService();
    const rdf = `
      <rdf:RDF xmlns:dcat="http://www.w3.org/ns/dcat#" xmlns:dct="http://purl.org/dc/terms/" xmlns:dc="http://purl.org/dc/elements/1.1/">
        <dcat:Dataset rdf:about="d1">
          <dct:title>A</dct:title>
          <dct:description>  Foo &amp; Bar  </dct:description>
        </dcat:Dataset>
        <dcat:Dataset rdf:about="d2">
          <dct:title>B</dct:title>
          <dc:description><![CDATA[  CDATA text  ]]></dc:description>
        </dcat:Dataset>
      </rdf:RDF>
    `;

    const datasets = service.parseDatasetsFromRdf(rdf);
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
        <rdf:RDF xmlns:dcat="http://www.w3.org/ns/dcat#" xmlns:dct="http://purl.org/dc/terms/">
          <dcat:Dataset rdf:about="x"><dct:title>T</dct:title><dct:description>D</dct:description></dcat:Dataset>
        </rdf:RDF>
      `,
    } as Response);

    const service = new DcatHarvesterService(fetcher);
    const datasets = await service.harvestFromUrl(
      "https://example.org/catalogue.rdf"
    );

    expect(fetcher).toHaveBeenCalledWith("https://example.org/catalogue.rdf");
    expect(datasets).toEqual([{ id: "x", title: "T", description: "D" }]);
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
});
