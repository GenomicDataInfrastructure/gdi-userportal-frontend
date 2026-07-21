// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  rewriteCodingSystemNodes,
  rewriteDocumentationNodes,
  applyRdfXmlPostProcessing,
} from "@/app/api/discovery/harvester/rdfxml-post-processor";

describe("rewriteCodingSystemNodes", () => {
  test("rewrites shorthand into nested dct:Standard element", () => {
    const input = `<healthdcatap:hasCodingSystem rdf:resource="https://example.org/coding/ICD-10"/>`;
    expect(rewriteCodingSystemNodes(input)).toBe(
      `<healthdcatap:hasCodingSystem>\n      <dct:Standard rdf:about="https://example.org/coding/ICD-10"/>\n    </healthdcatap:hasCodingSystem>`
    );
  });

  test("rewrites multiple occurrences independently", () => {
    const input = [
      `<healthdcatap:hasCodingSystem rdf:resource="https://example.org/coding/ICD-10"/>`,
      `<healthdcatap:hasCodingSystem rdf:resource="https://example.org/coding/SNOMED"/>`,
    ].join("\n");
    const result = rewriteCodingSystemNodes(input);
    expect(result).toContain(
      `<dct:Standard rdf:about="https://example.org/coding/ICD-10"/>`
    );
    expect(result).toContain(
      `<dct:Standard rdf:about="https://example.org/coding/SNOMED"/>`
    );
  });

  test("leaves unrelated XML unchanged", () => {
    const input = `<dct:title>Test</dct:title>`;
    expect(rewriteCodingSystemNodes(input)).toBe(input);
  });
});

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
  test("applies all rewrites in a single pass", () => {
    const codingUri = "https://example.org/coding/ICD-10";
    const docUri = "https://example.org/docs/guide";

    const input = `
<dcat:Dataset rdf:about="https://example.org/datasets/1">
  <healthdcatap:hasCodingSystem rdf:resource="${codingUri}"/>
  <foaf:page rdf:resource="${docUri}"/>
</dcat:Dataset>
    `.trim();

    const result = applyRdfXmlPostProcessing(input);

    expect(result).toContain(`<dct:Standard rdf:about="${codingUri}"/>`);
    expect(result).toContain(`<foaf:Document rdf:about="${docUri}"/>`);
  });
});
