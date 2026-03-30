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
import { parseRdfXmlToQuads } from "@/app/api/discovery/harvester/rdf-quad-loader";
import { serializeDatasetAsRdfXml } from "@/app/api/discovery/harvester/dcat-dataset-rdfxml-generator";
import { serializeDatasetAsTurtle } from "@/app/api/discovery/harvester/dcat-dataset-turtle-generator";
import { buildLocalDiscoveryDataset } from "@/app/api/discovery/test-utils/fixtures";

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

  test("serializes RDF/XML with extended dataset metadata", async () => {
    const dataset = buildLocalDiscoveryDataset({
      id: "https://example.org/datasets/export-1",
      title: "Population Registry & Statistics",
      description: "National <regional> data",
    });

    const rdfXml = await serializeDatasetAsRdfXml(dataset);

    expect(rdfXml).toContain("<rdf:RDF");
    expect(rdfXml).toContain("<healthdcatap:numberOfRecords");
    expect(rdfXml).toContain(
      'rdf:about="https://example.org/datasets/export-1#distribution-1"'
    );
    expect(rdfXml).toContain(
      'rdf:about="https://example.org/datasets/export-1#contact-point-1"'
    );

    const quads = await parseRdfXmlToQuads(rdfXml);
    expect(
      quads.some(
        (quad) =>
          quad.predicate.value === "http://www.w3.org/ns/dcat#version" &&
          quad.object.termType === "Literal" &&
          quad.object.value === "1.0.0"
      )
    ).toBe(true);
    expect(
      quads.some(
        (quad) =>
          quad.predicate.value === "http://www.w3.org/ns/dcat#distribution" &&
          quad.object.termType === "NamedNode"
      )
    ).toBe(true);
  });

  test("serializes Turtle with extended dataset metadata", async () => {
    const dataset = buildLocalDiscoveryDataset({
      id: "https://example.org/datasets/export-1",
      title: 'Population "Registry"',
      description: "Line 1\nLine 2",
    });

    const turtle = await serializeDatasetAsTurtle(dataset);

    expect(turtle).toContain("@prefix healthdcatap:");
    expect(turtle).toContain('dct:title "Population \\"Registry\\""');
    expect(turtle).toContain('dct:description "Line 1\\nLine 2"');
    expect(turtle).toContain("healthdcatap:numberOfRecords 50000");
    expect(turtle).toContain(
      "<https://example.org/datasets/export-1#distribution-1>"
    );
    expect(turtle).toContain("a dcat:Distribution");
  });

  test("serializes JSON-LD with extended dataset metadata", async () => {
    const dataset = buildLocalDiscoveryDataset({
      id: "https://example.org/datasets/export-1",
      title: "Dataset A",
      description: "desc-a",
    });

    const jsonLd = JSON.parse(
      await serializeDatasetAsJsonLd(dataset)
    ) as Record<string, unknown>;
    const graph = jsonLd["@graph"] as Array<Record<string, unknown>>;

    expect(jsonLd["@context"]).toBeDefined();
    expect(Array.isArray(graph)).toBe(true);
    expect(
      graph.some(
        (item) =>
          item["@id"] === "https://example.org/datasets/export-1" &&
          Array.isArray(item["dct:title"])
      )
    ).toBe(true);
    expect(
      graph.some(
        (item) =>
          item["@id"] === "https://example.org/datasets/export-1#distribution-1"
      )
    ).toBe(true);
  });

  test("facade dispatches serializers and MIME types for all supported formats", async () => {
    const dataset = buildLocalDiscoveryDataset({
      id: "https://example.org/datasets/export-1",
      title: "Dataset A",
      description: "desc-a",
    });

    expect(await serializeLocalDiscoveryDataset(dataset, "rdf")).toContain(
      "<rdf:RDF"
    );
    expect(await serializeLocalDiscoveryDataset(dataset, "ttl")).toContain(
      "@prefix dcat:"
    );
    expect(await serializeLocalDiscoveryDataset(dataset, "jsonld")).toContain(
      '"@context"'
    );

    expect(getLocalDiscoveryDatasetExportMimeType("rdf")).toBe(
      "application/rdf+xml"
    );
    expect(getLocalDiscoveryDatasetExportMimeType("ttl")).toBe("text/turtle");
    expect(getLocalDiscoveryDatasetExportMimeType("jsonld")).toBe(
      "application/ld+json"
    );
  });

  test("handles missing optional export fields in all formats", async () => {
    const dataset = buildLocalDiscoveryDataset({
      id: "dataset-1",
      title: "",
      description: undefined,
      languages: undefined,
      versionNotes: undefined,
      distributions: undefined,
      contacts: undefined,
      publishers: [],
      hdab: [],
      creators: [],
      keywords: undefined,
      themes: undefined,
      healthTheme: undefined,
      healthCategory: undefined,
      dcatType: undefined,
      conformsTo: undefined,
      applicableLegislation: undefined,
      legalBasis: undefined,
      spatialCoverage: undefined,
      spatialResolutionInMeters: undefined,
      temporalCoverage: undefined,
      retentionPeriod: undefined,
      frequency: undefined,
      datasetRelationships: undefined,
      accessRights: undefined,
      numberOfRecords: undefined,
      numberOfUniqueIndividuals: undefined,
      maxTypicalAge: undefined,
      minTypicalAge: undefined,
      populationCoverage: undefined,
      temporalResolution: undefined,
      hasVersions: undefined,
      version: undefined,
      createdAt: undefined,
      modifiedAt: undefined,
    });

    const rdfXml = await serializeDatasetAsRdfXml(dataset);
    expect(rdfXml).toContain(
      'rdf:about="https://portal.example.org/datasets/dataset-1"'
    );
    await expect(parseRdfXmlToQuads(rdfXml)).resolves.toEqual(
      expect.any(Array)
    );

    expect(await serializeDatasetAsTurtle(dataset)).toContain(
      "<https://portal.example.org/datasets/dataset-1> a dcat:Dataset"
    );

    const jsonLd = JSON.parse(
      await serializeDatasetAsJsonLd(dataset)
    ) as Record<string, unknown>;
    const graph = jsonLd["@graph"] as Array<Record<string, unknown>>;
    expect(
      graph.some(
        (item) =>
          item["@id"] === "https://portal.example.org/datasets/dataset-1"
      )
    ).toBe(true);
  });
});
