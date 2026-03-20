// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { DataFactory } from "n3";
import { extractContactPoints } from "../dcat-contact-point-mapper";
import { RdfGraph } from "../rdf-graph";

describe("extractContactPoints", () => {
  it("extracts contact points with all fields including mailto: prefix handling", () => {
    const quads = [
      DataFactory.quad(
        DataFactory.namedNode("http://example.org/dataset1"),
        DataFactory.namedNode("http://www.w3.org/ns/dcat#contactPoint"),
        DataFactory.namedNode("http://example.org/contact1")
      ),
      DataFactory.quad(
        DataFactory.namedNode("http://example.org/contact1"),
        DataFactory.namedNode("http://www.w3.org/2006/vcard/ns#fn"),
        DataFactory.literal("John Doe")
      ),
      DataFactory.quad(
        DataFactory.namedNode("http://example.org/contact1"),
        DataFactory.namedNode("http://www.w3.org/2006/vcard/ns#hasEmail"),
        DataFactory.literal("mailto:john@example.org")
      ),
      DataFactory.quad(
        DataFactory.namedNode("http://example.org/contact1"),
        DataFactory.namedNode("http://www.w3.org/2006/vcard/ns#hasURL"),
        DataFactory.literal("https://example.org")
      ),
      DataFactory.quad(
        DataFactory.namedNode("http://example.org/contact1"),
        DataFactory.namedNode("http://purl.org/dc/terms/identifier"),
        DataFactory.literal("contact-123")
      ),
      DataFactory.quad(
        DataFactory.namedNode("http://example.org/dataset1"),
        DataFactory.namedNode("http://www.w3.org/ns/dcat#contactPoint"),
        DataFactory.namedNode("http://example.org/contact2")
      ),
      DataFactory.quad(
        DataFactory.namedNode("http://example.org/contact2"),
        DataFactory.namedNode("http://www.w3.org/2006/vcard/ns#hasEmail"),
        DataFactory.literal("plain@example.org")
      ),
    ];

    const graph = new RdfGraph(quads);
    const datasetSubject = DataFactory.namedNode("http://example.org/dataset1");

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

  it("returns undefined when no contact points exist", () => {
    const quads = [
      DataFactory.quad(
        DataFactory.namedNode("http://example.org/dataset1"),
        DataFactory.namedNode("http://purl.org/dc/terms/title"),
        DataFactory.literal("Test Dataset")
      ),
    ];

    const graph = new RdfGraph(quads);
    const datasetSubject = DataFactory.namedNode("http://example.org/dataset1");

    const result = extractContactPoints(datasetSubject, graph);

    expect(result).toBeUndefined();
  });
});
