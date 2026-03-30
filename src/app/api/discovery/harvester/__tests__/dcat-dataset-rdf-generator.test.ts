// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  escapeTurtleLiteral,
  escapeXml,
  getDatasetExportUri,
  getDatasetRdfAboutAttribute,
  getDatasetTurtleSubject,
  getLocalDiscoveryExportBaseUrl,
  isAbsoluteUri,
} from "@/app/api/discovery/harvester/dcat-dataset-rdf-shared";
import { serializeDatasetAsJsonLd } from "@/app/api/discovery/harvester/dcat-dataset-jsonld-generator";
import {
  getLocalDiscoveryDatasetExportMimeType,
  serializeLocalDiscoveryDataset,
} from "@/app/api/discovery/harvester/dcat-dataset-rdf-generator";
import { serializeDatasetAsRdfXml } from "@/app/api/discovery/harvester/dcat-dataset-rdfxml-generator";
import { serializeDatasetAsTurtle } from "@/app/api/discovery/harvester/dcat-dataset-turtle-generator";
import {
  buildLocalDiscoveryDataset,
  canonicalLocalDiscoveryDatasetExportRdf,
} from "@/app/api/discovery/test-utils/fixtures";

describe("DCAT dataset export generators", () => {
  const originalBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_BASE_URL = "https://portal.example.org/";
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_BASE_URL = originalBaseUrl;
  });

  test("shared helpers escape XML and Turtle values", () => {
    expect(escapeXml(`5 < 6 & "7" '8' > 4`)).toBe(
      "5 &lt; 6 &amp; &quot;7&quot; &apos;8&apos; &gt; 4"
    );
    expect(escapeTurtleLiteral('line 1\\line 2 "quoted"\n\tend\r')).toBe(
      'line 1\\\\line 2 \\"quoted\\"\\n\\tend\\r'
    );
  });

  test("shared helpers preserve absolute ids and generate valid export URIs", () => {
    const uriDataset = buildLocalDiscoveryDataset({
      id: "https://example.org/datasets/export-1",
    });
    const localIdDataset = buildLocalDiscoveryDataset({ id: "dataset-1" });
    const identifierDataset = buildLocalDiscoveryDataset({
      id: "",
      identifier: "identifier-1",
    });
    const emptyIdDataset = buildLocalDiscoveryDataset({
      id: "",
      identifier: undefined,
    });

    expect(isAbsoluteUri("https://example.org/datasets/export-1")).toBe(true);
    expect(isAbsoluteUri("dataset-1")).toBe(false);
    expect(getLocalDiscoveryExportBaseUrl()).toBe("https://portal.example.org");
    expect(getDatasetExportUri(uriDataset)).toBe(
      "https://example.org/datasets/export-1"
    );
    expect(getDatasetExportUri(localIdDataset)).toBe(
      "https://portal.example.org/datasets/dataset-1"
    );
    expect(getDatasetExportUri(identifierDataset)).toBe(
      "https://portal.example.org/datasets/identifier-1"
    );
    expect(
      getDatasetExportUri(
        buildLocalDiscoveryDataset({
          id: "dataset-1",
          identifier: "identifier-2",
        })
      )
    ).toBe("https://portal.example.org/datasets/identifier-2");
    expect(getDatasetExportUri(emptyIdDataset)).toBe(
      "https://portal.example.org/datasets/unknown-dataset"
    );
    expect(getDatasetRdfAboutAttribute(uriDataset)).toBe(
      ' rdf:about="https://example.org/datasets/export-1"'
    );
    expect(getDatasetRdfAboutAttribute(localIdDataset)).toBe(
      ' rdf:about="https://portal.example.org/datasets/dataset-1"'
    );
    expect(getDatasetTurtleSubject(uriDataset)).toBe(
      "<https://example.org/datasets/export-1>"
    );
    expect(getDatasetTurtleSubject(emptyIdDataset)).toBe(
      "<https://portal.example.org/datasets/unknown-dataset>"
    );
  });

  test("serializes RDF/XML master dataset export", () => {
    const dataset = buildLocalDiscoveryDataset({
      id: "https://example.org/datasets/export-1",
      title: "Population Registry & Statistics",
      description: "National <regional> data",
    });

    expect(serializeDatasetAsRdfXml(dataset)).toBe(
      canonicalLocalDiscoveryDatasetExportRdf
    );
  });

  test("serializes Turtle master dataset export", () => {
    const dataset = buildLocalDiscoveryDataset({
      id: "https://example.org/datasets/export-1",
      title: 'Population "Registry"',
      description: "Line 1\nLine 2",
    });

    expect(serializeDatasetAsTurtle(dataset))
      .toBe(`@prefix dcat: <http://www.w3.org/ns/dcat#> .
@prefix dct: <http://purl.org/dc/terms/> .

<https://example.org/datasets/export-1> a dcat:Dataset ;
  dct:title "Population \\"Registry\\"" ;
  dct:description "Line 1\\nLine 2" .
`);
  });

  test("serializes JSON-LD master dataset export", () => {
    const dataset = buildLocalDiscoveryDataset({
      id: "https://example.org/datasets/export-1",
      title: "Dataset A",
      description: "desc-a",
    });

    expect(serializeDatasetAsJsonLd(dataset)).toBe(`{
  "@context": {
    "dcat": "http://www.w3.org/ns/dcat#",
    "dct": "http://purl.org/dc/terms/"
  },
  "@type": "dcat:Dataset",
  "@id": "https://example.org/datasets/export-1",
  "dct:title": "Dataset A",
  "dct:description": "desc-a"
}
`);
  });

  test("facade dispatches serializers and MIME types for all supported formats", () => {
    const dataset = buildLocalDiscoveryDataset({
      id: "https://example.org/datasets/export-1",
      title: "Dataset A",
      description: "desc-a",
    });

    expect(serializeLocalDiscoveryDataset(dataset, "rdf")).toContain(
      "<rdf:RDF"
    );
    expect(serializeLocalDiscoveryDataset(dataset, "ttl")).toContain(
      "@prefix dcat:"
    );
    expect(serializeLocalDiscoveryDataset(dataset, "jsonld")).toContain(
      '"@type": "dcat:Dataset"'
    );

    expect(getLocalDiscoveryDatasetExportMimeType("rdf")).toBe(
      "application/rdf+xml"
    );
    expect(getLocalDiscoveryDatasetExportMimeType("ttl")).toBe("text/turtle");
    expect(getLocalDiscoveryDatasetExportMimeType("jsonld")).toBe(
      "application/ld+json"
    );
  });

  test("handles missing optional export fields in all formats", () => {
    const dataset = buildLocalDiscoveryDataset({
      id: "dataset-1",
      title: "",
      description: undefined,
    });

    expect(serializeDatasetAsRdfXml(dataset))
      .toBe(`<?xml version="1.0" encoding="UTF-8"?>
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
         xmlns:dcat="http://www.w3.org/ns/dcat#"
         xmlns:dct="http://purl.org/dc/terms/">
  <dcat:Dataset rdf:about="https://portal.example.org/datasets/dataset-1">
  </dcat:Dataset>
</rdf:RDF>
`);
    expect(serializeDatasetAsTurtle(dataset))
      .toBe(`@prefix dcat: <http://www.w3.org/ns/dcat#> .
@prefix dct: <http://purl.org/dc/terms/> .

<https://portal.example.org/datasets/dataset-1> a dcat:Dataset .
`);
    expect(serializeDatasetAsJsonLd(dataset)).toBe(`{
  "@context": {
    "dcat": "http://www.w3.org/ns/dcat#",
    "dct": "http://purl.org/dc/terms/"
  },
  "@type": "dcat:Dataset",
  "@id": "https://portal.example.org/datasets/dataset-1"
}
`);
  });
});
