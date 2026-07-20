// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  rewriteCodingSystemNodes,
  rewriteDocumentationNodes,
  rewriteAccessRightsNodes,
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

describe("rewriteAccessRightsNodes", () => {
  test("inlines label from detached RightsStatement block", () => {
    const uri =
      "http://publications.europa.eu/resource/authority/access-right/NON_PUBLIC";
    const input = `
<dcat:Dataset rdf:about="https://example.org/datasets/1">
  <dct:accessRights rdf:resource="${uri}"/>
</dcat:Dataset>
<dct:RightsStatement rdf:about="${uri}">
  <skos:prefLabel xml:lang="eng">Non public</skos:prefLabel>
</dct:RightsStatement>
    `.trim();

    const result = rewriteAccessRightsNodes(input);

    expect(result).toContain(`<dct:accessRights>`);
    expect(result).toContain(`<dct:RightsStatement rdf:about="${uri}">`);
    expect(result).toContain(
      `<skos:prefLabel xml:lang="eng">Non public</skos:prefLabel>`
    );
    expect(result).toContain(`</dct:RightsStatement>`);
    expect(result).not.toContain(`rdf:resource="${uri}"`);
    expect(result).not.toContain(
      `<dct:RightsStatement rdf:about="${uri}">\n  <skos:prefLabel`
    );
  });

  test("removes the detached RightsStatement top-level block", () => {
    const uri =
      "http://publications.europa.eu/resource/authority/access-right/PUBLIC";
    const input = `
<dct:accessRights rdf:resource="${uri}"/>
<dct:RightsStatement rdf:about="${uri}">
  <skos:prefLabel xml:lang="eng">Public</skos:prefLabel>
</dct:RightsStatement>
    `.trim();

    const result = rewriteAccessRightsNodes(input);
    // The detached block should not appear as a standalone top-level element
    const topLevelBlockCount = (
      result.match(/<dct:RightsStatement rdf:about=/g) ?? []
    ).length;
    expect(topLevelBlockCount).toBe(1); // only the inlined one
  });

  test("produces inline element without label when no detached block exists", () => {
    const uri =
      "http://publications.europa.eu/resource/authority/access-right/PUBLIC";
    const input = `<dct:accessRights rdf:resource="${uri}"/>`;

    const result = rewriteAccessRightsNodes(input);

    expect(result).toContain(`<dct:RightsStatement rdf:about="${uri}">`);
    expect(result).not.toContain(`skos:prefLabel`);
  });

  test("leaves unrelated XML unchanged", () => {
    const input = `<dct:title>Test</dct:title>`;
    expect(rewriteAccessRightsNodes(input)).toBe(input);
  });
});

describe("applyRdfXmlPostProcessing", () => {
  test("applies all rewrites in a single pass", () => {
    const accessUri =
      "http://publications.europa.eu/resource/authority/access-right/PUBLIC";
    const codingUri = "https://example.org/coding/ICD-10";
    const docUri = "https://example.org/docs/guide";

    const input = `
<dcat:Dataset rdf:about="https://example.org/datasets/1">
  <dct:accessRights rdf:resource="${accessUri}"/>
  <healthdcatap:hasCodingSystem rdf:resource="${codingUri}"/>
  <foaf:page rdf:resource="${docUri}"/>
</dcat:Dataset>
<dct:RightsStatement rdf:about="${accessUri}">
  <skos:prefLabel xml:lang="eng">Public</skos:prefLabel>
</dct:RightsStatement>
    `.trim();

    const result = applyRdfXmlPostProcessing(input);

    expect(result).toContain(`<dct:RightsStatement rdf:about="${accessUri}">`);
    expect(result).toContain(
      `<skos:prefLabel xml:lang="eng">Public</skos:prefLabel>`
    );
    expect(result).toContain(`<dct:Standard rdf:about="${codingUri}"/>`);
    expect(result).toContain(`<foaf:Document rdf:about="${docUri}"/>`);
  });
});
