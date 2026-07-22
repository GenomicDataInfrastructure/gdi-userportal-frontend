// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  rewriteDocumentationNodes,
  applyRdfXmlPostProcessing,
} from "@/app/api/discovery/harvester/rdfxml-post-processor";

describe("rewriteDocumentationNodes", () => {
  test("rewrites shorthand into nested foaf:Document element", () => {
    const input = `<foaf:page rdf:resource="https://example.org/docs/guide"/>`;
    expect(rewriteDocumentationNodes(input)).toBe(
      `<foaf:page>\n      <foaf:Document rdf:about="https://example.org/docs/guide"/>\n    </foaf:page>`
    );
  });

  test("rewrites multiple occurrences independently", () => {
    const input = [
      `<foaf:page rdf:resource="https://example.org/docs/guide"/>`,
      `<foaf:page rdf:resource="https://example.org/docs/reference"/>`,
    ].join("\n");
    const result = rewriteDocumentationNodes(input);
    expect(result).toContain(
      `<foaf:Document rdf:about="https://example.org/docs/guide"/>`
    );
    expect(result).toContain(
      `<foaf:Document rdf:about="https://example.org/docs/reference"/>`
    );
  });

  test("leaves unrelated XML unchanged", () => {
    const input = `<dct:title>Test</dct:title>`;
    expect(rewriteDocumentationNodes(input)).toBe(input);
  });
});

describe("applyRdfXmlPostProcessing", () => {
  test("rewrites foaf:page nodes", () => {
    const docUri = "https://example.org/docs/guide";
    const input = `<foaf:page rdf:resource="${docUri}"/>`;
    const result = applyRdfXmlPostProcessing(input);
    expect(result).toContain(`<foaf:Document rdf:about="${docUri}"/>`);
  });
});
