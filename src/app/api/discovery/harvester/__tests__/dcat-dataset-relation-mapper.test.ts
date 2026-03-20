// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { describe, expect, it } from "@jest/globals";
import { parseRdfXmlToQuads } from "../rdf-quad-loader";
import { RdfGraph } from "../rdf-graph";
import { extractDatasetRelations } from "../dcat-dataset-relation-mapper";
import type * as RDF from "@rdfjs/types";

describe("extractDatasetRelations", () => {
  it("extracts isPartOf relation", async () => {
    const rdfXml = `
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
               xmlns:dct="http://purl.org/dc/terms/">
        <rdf:Description rdf:about="http://example.org/dataset1">
          <dct:isPartOf rdf:resource="http://example.org/parent-dataset"/>
        </rdf:Description>
      </rdf:RDF>
    `;

    const quads = await parseRdfXmlToQuads(rdfXml);
    const graph = new RdfGraph(quads);
    const datasetSubject: RDF.Term = {
      termType: "NamedNode",
      value: "http://example.org/dataset1",
    } as RDF.NamedNode;

    const result = extractDatasetRelations(datasetSubject, graph);

    expect(result).toEqual([
      {
        relation: "Is part of",
        target: "http://example.org/parent-dataset",
      },
    ]);
  });

  it("extracts multiple relations", async () => {
    const rdfXml = `
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
               xmlns:dct="http://purl.org/dc/terms/">
        <rdf:Description rdf:about="http://example.org/dataset1">
          <dct:hasPart rdf:resource="http://example.org/child-dataset"/>
          <dct:references rdf:resource="http://example.org/related-dataset"/>
          <dct:isVersionOf rdf:resource="http://example.org/original-dataset"/>
        </rdf:Description>
      </rdf:RDF>
    `;

    const quads = await parseRdfXmlToQuads(rdfXml);
    const graph = new RdfGraph(quads);
    const datasetSubject: RDF.Term = {
      termType: "NamedNode",
      value: "http://example.org/dataset1",
    } as RDF.NamedNode;

    const result = extractDatasetRelations(datasetSubject, graph);

    expect(result).toHaveLength(3);
    expect(result).toContainEqual({
      relation: "Has part",
      target: "http://example.org/child-dataset",
    });
    expect(result).toContainEqual({
      relation: "References",
      target: "http://example.org/related-dataset",
    });
    expect(result).toContainEqual({
      relation: "Is version of",
      target: "http://example.org/original-dataset",
    });
  });

  it("extracts relation with literal target", async () => {
    const rdfXml = `
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
               xmlns:dct="http://purl.org/dc/terms/">
        <rdf:Description rdf:about="http://example.org/dataset1">
          <dct:relation>dataset-identifier-123</dct:relation>
        </rdf:Description>
      </rdf:RDF>
    `;

    const quads = await parseRdfXmlToQuads(rdfXml);
    const graph = new RdfGraph(quads);
    const datasetSubject: RDF.Term = {
      termType: "NamedNode",
      value: "http://example.org/dataset1",
    } as RDF.NamedNode;

    const result = extractDatasetRelations(datasetSubject, graph);

    expect(result).toEqual([
      {
        relation: "Related to",
        target: "dataset-identifier-123",
      },
    ]);
  });

  it("returns undefined when no relations exist", async () => {
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

    const result = extractDatasetRelations(datasetSubject, graph);

    expect(result).toBeUndefined();
  });

  it("extracts inSeries relation", async () => {
    const rdfXml = `
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
               xmlns:dcat="http://www.w3.org/ns/dcat#">
        <rdf:Description rdf:about="http://example.org/dataset1">
          <dcat:inSeries rdf:resource="http://example.org/series/1"/>
        </rdf:Description>
      </rdf:RDF>
    `;

    const quads = await parseRdfXmlToQuads(rdfXml);
    const graph = new RdfGraph(quads);
    const datasetSubject: RDF.Term = {
      termType: "NamedNode",
      value: "http://example.org/dataset1",
    } as RDF.NamedNode;

    const result = extractDatasetRelations(datasetSubject, graph);

    expect(result).toEqual([
      {
        relation: "In series",
        target: "http://example.org/series/1",
      },
    ]);
  });
});
