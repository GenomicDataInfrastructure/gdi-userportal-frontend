// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import type * as RDF from "@rdfjs/types";
import { jest } from "@jest/globals";
import { extractDistributions } from "../dcat-distribution-mapper";
import { RdfGraph } from "../rdf-graph";
import { parseRdfXmlToQuads } from "../rdf-quad-loader";
import * as dateUtils from "../date-utils";

describe("extractDistributions", () => {
  const rdfXml = `
    <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
             xmlns:dcat="http://www.w3.org/ns/dcat#"
             xmlns:dct="http://purl.org/dc/terms/">
      <dcat:Dataset rdf:about="http://example.org/dataset1">
        <dcat:distribution rdf:resource="http://example.org/distributions/good"/>
        <dcat:distribution rdf:resource="http://example.org/distributions/bad"/>
      </dcat:Dataset>
      <dcat:Distribution rdf:about="http://example.org/distributions/good">
        <dct:identifier>good-distribution</dct:identifier>
        <dct:title>Good Distribution</dct:title>
        <dct:issued>2024-01-01</dct:issued>
      </dcat:Distribution>
      <dcat:Distribution rdf:about="http://example.org/distributions/bad">
        <dct:identifier>bad-distribution</dct:identifier>
        <dct:title>Bad Distribution</dct:title>
        <dct:issued>2024-02-01</dct:issued>
      </dcat:Distribution>
    </rdf:RDF>
  `;

  const datasetSubject: RDF.Term = {
    termType: "NamedNode",
    value: "http://example.org/dataset1",
  } as RDF.NamedNode;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("keeps healthy distributions and drops one that throws when no error handler is given", async () => {
    const quads = await parseRdfXmlToQuads(rdfXml);
    const graph = new RdfGraph(quads);

    jest
      .spyOn(dateUtils, "normalizeDate")
      .mockImplementationOnce(() => "2024-01-01T00:00:00.000Z")
      .mockImplementationOnce(() => {
        throw new Error("malformed distribution field");
      });

    const distributions = extractDistributions(
      datasetSubject,
      graph,
      "dataset-1"
    );

    expect(distributions).toHaveLength(1);
    expect(distributions?.[0].id).toBe("good-distribution");
  });

  it("reports the failing distribution to the error handler instead of dropping it silently", async () => {
    const quads = await parseRdfXmlToQuads(rdfXml);
    const graph = new RdfGraph(quads);

    jest
      .spyOn(dateUtils, "normalizeDate")
      .mockImplementationOnce(() => "2024-01-01T00:00:00.000Z")
      .mockImplementationOnce(() => {
        throw new Error("malformed distribution field");
      });

    const onDistributionError = jest.fn();

    const distributions = extractDistributions(
      datasetSubject,
      graph,
      "dataset-1",
      onDistributionError
    );

    expect(distributions).toHaveLength(1);
    expect(onDistributionError).toHaveBeenCalledTimes(1);
    expect(onDistributionError).toHaveBeenCalledWith(
      expect.objectContaining({
        datasetId: "dataset-1",
        distributionId: "http://example.org/distributions/bad",
        message: "malformed distribution field",
      })
    );
  });

  it("returns undefined when every distribution fails to map", async () => {
    const quads = await parseRdfXmlToQuads(rdfXml);
    const graph = new RdfGraph(quads);

    jest.spyOn(dateUtils, "normalizeDate").mockImplementation(() => {
      throw new Error("malformed distribution field");
    });

    const onDistributionError = jest.fn();

    const distributions = extractDistributions(
      datasetSubject,
      graph,
      "dataset-1",
      onDistributionError
    );

    expect(distributions).toBeUndefined();
    expect(onDistributionError).toHaveBeenCalledTimes(2);
  });
});
