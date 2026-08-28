// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { sanitizeRdfIris } from "@/app/api/discovery/harvester/rdf-iri-sanitizer";
import { parseRdfToQuads } from "@/app/api/discovery/harvester/rdf-quad-loader";

const BAD_STATUS =
  "http://publications.europa.eu/resource/authority/distribution-status/UNDER DEVELOPMENT";
const FIXED_STATUS =
  "http://publications.europa.eu/resource/authority/distribution-status/UNDER%20DEVELOPMENT";

describe("sanitizeRdfIris", () => {
  test("percent-encodes spaces in rdf:resource IRIs (RDF/XML)", () => {
    const xml = `<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:adms="http://www.w3.org/ns/adms#">
      <rdf:Description rdf:about="https://example.org/dist/1">
        <adms:status rdf:resource="${BAD_STATUS}"/>
      </rdf:Description>
    </rdf:RDF>`;

    const out = sanitizeRdfIris(xml, "application/rdf+xml");

    expect(out).toContain(`rdf:resource="${FIXED_STATUS}"`);
    expect(out).not.toContain("UNDER DEVELOPMENT");
  });

  test("percent-encodes spaces inside <...> IRIs (Turtle)", () => {
    const ttl = `@prefix adms: <http://www.w3.org/ns/adms#> .
      <https://example.org/dist/1> adms:status <${BAD_STATUS}> .`;

    const out = sanitizeRdfIris(ttl, "text/turtle");

    expect(out).toContain(`<${FIXED_STATUS}>`);
  });

  test("leaves a clean document untouched", () => {
    const xml = `<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
      <rdf:Description rdf:about="https://example.org/a"/>
      <rdf:Description rdf:about="relative/ref"/>
    </rdf:RDF>`;
    expect(sanitizeRdfIris(xml, "application/rdf+xml")).toBe(xml);
  });

  test("replaces a mangled-scheme IRI with a urn:x-invalid: placeholder", () => {
    const xml = `<foaf:Document rdf:about="htttp//:documentaiondistribution.lu"/>`;
    const out = sanitizeRdfIris(xml, "application/rdf+xml");
    expect(out).toContain(
      'rdf:about="urn:x-invalid:htttp%2F%2F%3Adocumentaiondistribution.lu"'
    );
  });

  test("does not touch spaces in literal attribute-like text", () => {
    const xml = `<rdf:Description rdf:about="https://example.org/a">
      <dct:title>Status: under development</dct:title>
    </rdf:Description>`;
    expect(sanitizeRdfIris(xml, "application/rdf+xml")).toContain(
      "under development"
    );
  });

  test("the sanitized RDF/XML now parses", async () => {
    const xml = `<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:adms="http://www.w3.org/ns/adms#" xmlns:dcat="http://www.w3.org/ns/dcat#">
      <dcat:Distribution rdf:about="https://example.org/dist/1">
        <adms:status rdf:resource="${BAD_STATUS}"/>
      </dcat:Distribution>
    </rdf:RDF>`;

    await expect(parseRdfToQuads(xml, "application/rdf+xml")).rejects.toThrow();

    const quads = await parseRdfToQuads(
      sanitizeRdfIris(xml, "application/rdf+xml"),
      "application/rdf+xml"
    );
    const statusQuad = quads.find(
      (q) => q.predicate.value === "http://www.w3.org/ns/adms#status"
    );
    expect(statusQuad?.object.value).toBe(FIXED_STATUS);
  });
});
