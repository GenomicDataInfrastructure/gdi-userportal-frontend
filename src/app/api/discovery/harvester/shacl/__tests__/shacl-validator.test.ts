// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { validateHealthDcatAp } from "@/app/api/discovery/harvester/shacl/shacl-validator";
import { parseRdfToQuads } from "@/app/api/discovery/harvester/rdf-quad-loader";

const RDF_HEADER = `
  <rdf:RDF
    xmlns:dcat="http://www.w3.org/ns/dcat#"
    xmlns:dct="http://purl.org/dc/terms/"
    xmlns:foaf="http://xmlns.com/foaf/0.1/"
    xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
    xmlns:healthdcatap="http://healthdataportal.eu/ns/health#"
  >`;

const buildMinimalDataset = (subjectUri: string) => `
  ${RDF_HEADER}
    <dcat:Dataset rdf:about="${subjectUri}">
      <dct:title xml:lang="en">Missing required fields</dct:title>
    </dcat:Dataset>
  </rdf:RDF>
`;

describe("validateHealthDcatAp", () => {
  jest.setTimeout(30000);

  test("reports SHACL violations for a dataset missing required fields", async () => {
    const rdf = buildMinimalDataset("https://example.org/datasets/incomplete");
    const quads = await parseRdfToQuads(rdf, "application/rdf+xml");

    const violations = await validateHealthDcatAp(quads);

    expect(violations.length).toBeGreaterThan(0);
    expect(
      violations.every((v) =>
        v.subjectId?.startsWith("https://example.org/datasets/incomplete")
      )
    ).toBe(true);
  });

  test("includes the dataset title alongside each violation", async () => {
    const rdf = `
      ${RDF_HEADER}
        <dcat:Dataset rdf:about="https://example.org/datasets/titled">
          <dct:title xml:lang="en">My Dataset</dct:title>
        </dcat:Dataset>
      </rdf:RDF>
    `;
    const quads = await parseRdfToQuads(rdf, "application/rdf+xml");

    const violations = await validateHealthDcatAp(quads);

    expect(violations.length).toBeGreaterThan(0);
    expect(violations.every((v) => v.datasetTitle === "My Dataset")).toBe(true);
  });

  test("reports a readable field name alongside the SHACL message for a wrong-type value", async () => {
    const rdf = `
      ${RDF_HEADER}
        <dcat:Dataset rdf:about="https://example.org/datasets/bad-age">
          <dct:title xml:lang="en">Bad age dataset</dct:title>
          <healthdcatap:minTypicalAge>not-a-number</healthdcatap:minTypicalAge>
        </dcat:Dataset>
      </rdf:RDF>
    `;
    const quads = await parseRdfToQuads(rdf, "application/rdf+xml");

    const violations = await validateHealthDcatAp(quads);
    const ageViolation = violations.find((v) => v.field === "min typical age");

    expect(ageViolation).toBeDefined();
    expect(ageViolation?.message).toContain("does not have datatype");
  });

  test("reports a readable field name for too many values on a single-valued field", async () => {
    const rdf = `
      ${RDF_HEADER}
        <dcat:Dataset rdf:about="https://example.org/datasets/multi-type">
          <dct:title xml:lang="en">Multi type dataset</dct:title>
          <dct:type rdf:resource="https://example.org/type-a"/>
          <dct:type rdf:resource="https://example.org/type-b"/>
        </dcat:Dataset>
      </rdf:RDF>
    `;
    const quads = await parseRdfToQuads(rdf, "application/rdf+xml");

    const violations = await validateHealthDcatAp(quads);
    const typeViolation = violations.find((v) => v.field === "type");

    expect(typeViolation).toBeDefined();
    expect(typeViolation?.message).toContain("More than");
  });
});
