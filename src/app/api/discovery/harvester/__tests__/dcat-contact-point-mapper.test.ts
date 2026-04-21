// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import type * as RDF from "@rdfjs/types";
import { extractContactPoints } from "../dcat-contact-point-mapper";
import { RdfGraph } from "../rdf-graph";
import { parseRdfXmlToQuads } from "../rdf-quad-loader";

describe("extractContactPoints", () => {
  it("extracts contact points with all fields including mailto: prefix handling", async () => {
    const rdfXml = `
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
               xmlns:dcat="http://www.w3.org/ns/dcat#"
               xmlns:dct="http://purl.org/dc/terms/"
               xmlns:vcard="http://www.w3.org/2006/vcard/ns#">
        <dcat:Dataset rdf:about="http://example.org/dataset1">
          <dcat:contactPoint rdf:resource="http://example.org/contact1"/>
          <dcat:contactPoint rdf:resource="http://example.org/contact2"/>
        </dcat:Dataset>
        <rdf:Description rdf:about="http://example.org/contact1">
          <vcard:fn>John Doe</vcard:fn>
          <vcard:hasEmail>mailto:john@example.org</vcard:hasEmail>
          <vcard:hasURL>https://example.org</vcard:hasURL>
          <dct:identifier>contact-123</dct:identifier>
        </rdf:Description>
        <rdf:Description rdf:about="http://example.org/contact2">
          <vcard:hasEmail>plain@example.org</vcard:hasEmail>
        </rdf:Description>
      </rdf:RDF>
    `;

    const quads = await parseRdfXmlToQuads(rdfXml);
    const graph = new RdfGraph(quads);
    const datasetSubject: RDF.Term = {
      termType: "NamedNode",
      value: "http://example.org/dataset1",
    } as RDF.NamedNode;

    const result = extractContactPoints(datasetSubject, graph);

    expect(result).toEqual([
      {
        name: "John Doe",
        email: "john@example.org",
        uri: "http://example.org/contact1",
        url: "https://example.org",
        identifier: "contact-123",
      },
      {
        name: "plain@example.org",
        email: "plain@example.org",
        uri: "http://example.org/contact2",
        url: undefined,
        identifier: undefined,
      },
    ]);
  });

  it("returns undefined when no contact points exist", async () => {
    const rdfXml = `
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
               xmlns:dct="http://purl.org/dc/terms/">
        <rdf:Description rdf:about="http://example.org/dataset1">
          <dct:title>Test Dataset</dct:title>
        </rdf:Description>
      </rdf:RDF>
    `;

    const quads = await parseRdfXmlToQuads(rdfXml);
    const graph = new RdfGraph(quads);
    const datasetSubject: RDF.Term = {
      termType: "NamedNode",
      value: "http://example.org/dataset1",
    } as RDF.NamedNode;

    const result = extractContactPoints(datasetSubject, graph);

    expect(result).toBeUndefined();
  });
});
