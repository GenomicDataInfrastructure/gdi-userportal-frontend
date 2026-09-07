// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  RDF_CONTENT_TYPES,
  detectContentTypeFromUrl,
  detectRdfContentType,
  parseRdfToQuads,
  parseRdfXmlToQuads,
} from "@/app/api/discovery/harvester/rdf-quad-loader";

describe("detectRdfContentType", () => {
  test("honours an explicit turtle content type, ignoring charset parameters", () => {
    expect(detectRdfContentType(undefined, "text/turtle; charset=utf-8")).toBe(
      RDF_CONTENT_TYPES.turtle
    );
  });

  test("accepts the legacy application/x-turtle content type", () => {
    expect(detectRdfContentType("catalogue.rdf", "application/x-turtle")).toBe(
      RDF_CONTENT_TYPES.turtle
    );
  });

  test.each([
    "application/rdf+xml",
    "application/xml",
    "text/xml",
    "APPLICATION/RDF+XML",
  ])("treats %s as RDF/XML even when the path looks like turtle", (header) => {
    expect(detectRdfContentType("catalogue.ttl", header)).toBe(
      RDF_CONTENT_TYPES.rdfxml
    );
  });

  test.each(["catalogue.ttl", "catalogue.turtle", "graph.n3"])(
    "falls back to the %s extension when no content type is given",
    (source) => {
      expect(detectRdfContentType(source)).toBe(RDF_CONTENT_TYPES.turtle);
    }
  );

  test("reads the extension from a URL path, ignoring the query string", () => {
    expect(
      detectRdfContentType("https://example.org/catalogue.ttl?token=abc#frag")
    ).toBe(RDF_CONTENT_TYPES.turtle);
  });

  test("reads the extension from a bare path with a query string", () => {
    expect(detectRdfContentType("exports/catalogue.ttl?v=2")).toBe(
      RDF_CONTENT_TYPES.turtle
    );
  });

  test("defaults to RDF/XML when neither the content type nor the source is decisive", () => {
    expect(detectRdfContentType()).toBe(RDF_CONTENT_TYPES.rdfxml);
    expect(detectRdfContentType("catalogue", "application/json")).toBe(
      RDF_CONTENT_TYPES.rdfxml
    );
    expect(detectRdfContentType("https://example.org/catalogue", null)).toBe(
      RDF_CONTENT_TYPES.rdfxml
    );
  });

  test("prefers the content type over a conflicting source extension", () => {
    expect(detectRdfContentType("catalogue.rdf", "text/turtle")).toBe(
      RDF_CONTENT_TYPES.turtle
    );
  });
});

describe("detectContentTypeFromUrl", () => {
  test("delegates to detectRdfContentType using only the URL", () => {
    expect(detectContentTypeFromUrl("https://example.org/data.ttl")).toBe(
      RDF_CONTENT_TYPES.turtle
    );
    expect(detectContentTypeFromUrl("https://example.org/data.rdf")).toBe(
      RDF_CONTENT_TYPES.rdfxml
    );
  });
});

describe("parseRdfToQuads", () => {
  test("parses a Turtle document into quads", async () => {
    const turtle = `@prefix dcat: <http://www.w3.org/ns/dcat#> .
      <https://example.org/dataset/1> a dcat:Dataset .`;

    const quads = await parseRdfToQuads(turtle, RDF_CONTENT_TYPES.turtle);

    expect(quads).toHaveLength(1);
    expect(quads[0].subject.value).toBe("https://example.org/dataset/1");
    expect(quads[0].object.value).toBe("http://www.w3.org/ns/dcat#Dataset");
  });

  test("parses an RDF/XML document into quads", async () => {
    const xml = `<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:dcat="http://www.w3.org/ns/dcat#">
      <dcat:Dataset rdf:about="https://example.org/dataset/2"/>
    </rdf:RDF>`;

    const quads = await parseRdfToQuads(xml, RDF_CONTENT_TYPES.rdfxml);

    expect(quads).toHaveLength(1);
    expect(quads[0].subject.value).toBe("https://example.org/dataset/2");
  });

  test("resolves relative IRIs against the provided base IRI", async () => {
    const turtle = `@prefix dcat: <http://www.w3.org/ns/dcat#> .
      <dataset/3> a dcat:Dataset .`;

    const quads = await parseRdfToQuads(
      turtle,
      RDF_CONTENT_TYPES.turtle,
      "https://example.org/base/"
    );

    expect(quads[0].subject.value).toBe("https://example.org/base/dataset/3");
  });

  test("rejects when the document cannot be parsed", async () => {
    await expect(
      parseRdfToQuads("this is not turtle @@@", RDF_CONTENT_TYPES.turtle)
    ).rejects.toBeInstanceOf(Error);
  });
});

describe("parseRdfXmlToQuads", () => {
  test("parses RDF/XML without an explicit content type argument", async () => {
    const xml = `<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:dcat="http://www.w3.org/ns/dcat#">
      <dcat:Dataset rdf:about="https://example.org/dataset/4"/>
    </rdf:RDF>`;

    const quads = await parseRdfXmlToQuads(xml);

    expect(quads).toHaveLength(1);
    expect(quads[0].subject.value).toBe("https://example.org/dataset/4");
  });
});
