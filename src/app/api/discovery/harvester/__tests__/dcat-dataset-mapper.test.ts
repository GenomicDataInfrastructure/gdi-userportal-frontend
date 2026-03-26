// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { DcatHarvesterService } from "@/app/api/discovery/harvester/dcat-harvester-service";

describe("dcat dataset mapper", () => {
  test("maps data dictionary", async () => {
    const rdfXml = `
      <rdf:RDF
        xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
        xmlns:dcat="http://www.w3.org/ns/dcat#"
        xmlns:dct="http://purl.org/dc/terms/"
        xmlns:csvw="http://www.w3.org/ns/csvw#"
        xmlns:foaf="http://xmlns.com/foaf/0.1/">
        <dcat:Dataset rdf:about="https://example.org/datasets/1">
          <dct:title>Dataset with dictionary</dct:title>
          <dct:description>Dataset description</dct:description>
          <foaf:page>
            <foaf:Document rdf:nodeID="table-group-1">
              <rdf:type rdf:resource="http://www.w3.org/ns/csvw#TableGroup"/>
              <csvw:table>
                <csvw:Table rdf:nodeID="table-1">
                  <csvw:column>
                    <csvw:Column rdf:nodeID="column-1">
                      <csvw:name>patient_id</csvw:name>
                      <csvw:datatype rdf:resource="http://www.w3.org/2001/XMLSchema#string"/>
                      <dct:description>Unique pseudonymised identifier for each patient.</dct:description>
                    </csvw:Column>
                  </csvw:column>
                  <csvw:column>
                    <csvw:Column rdf:nodeID="column-2">
                      <csvw:name>diagnosis_code</csvw:name>
                      <csvw:datatype>code</csvw:datatype>
                      <dct:description>Primary diagnosis code recorded for the encounter.</dct:description>
                    </csvw:Column>
                  </csvw:column>
                </csvw:Table>
              </csvw:table>
            </foaf:Document>
          </foaf:page>
        </dcat:Dataset>
      </rdf:RDF>
    `;

    const datasets = await new DcatHarvesterService().parseDatasetsFromRdf(
      rdfXml
    );

    expect(datasets).toHaveLength(1);
    expect(datasets[0].dataDictionary).toEqual([
      {
        name: "patient_id",
        type: "string",
        description: "Unique pseudonymised identifier for each patient.",
      },
      {
        name: "diagnosis_code",
        type: "code",
        description: "Primary diagnosis code recorded for the encounter.",
      },
    ]);
  });

  test("ignores entries missing required fields", async () => {
    const rdfXml = `
      <rdf:RDF
        xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
        xmlns:dcat="http://www.w3.org/ns/dcat#"
        xmlns:dct="http://purl.org/dc/terms/"
        xmlns:csvw="http://www.w3.org/ns/csvw#"
        xmlns:foaf="http://xmlns.com/foaf/0.1/">
        <dcat:Dataset rdf:about="https://example.org/datasets/2">
          <dct:title>Dataset with partial dictionary</dct:title>
          <dct:description>Dataset description</dct:description>
          <foaf:page>
            <foaf:Document rdf:nodeID="table-group-2">
              <rdf:type rdf:resource="http://www.w3.org/ns/csvw#TableGroup"/>
              <csvw:table>
                <csvw:Table rdf:nodeID="table-2">
                  <csvw:column>
                    <csvw:Column rdf:nodeID="missing-name">
                      <csvw:datatype rdf:resource="http://www.w3.org/2001/XMLSchema#string"/>
                      <dct:description>Missing a name.</dct:description>
                    </csvw:Column>
                  </csvw:column>
                  <csvw:column>
                    <csvw:Column rdf:nodeID="valid-column">
                      <csvw:name>valid_column</csvw:name>
                      <csvw:datatype rdf:resource="http://www.w3.org/2001/XMLSchema#integer"/>
                      <dct:description>A complete dictionary entry.</dct:description>
                    </csvw:Column>
                  </csvw:column>
                  <csvw:column>
                    <csvw:Column rdf:nodeID="missing-type">
                      <csvw:name>missing_type</csvw:name>
                      <dct:description>Missing a datatype.</dct:description>
                    </csvw:Column>
                  </csvw:column>
                  <csvw:column>
                    <csvw:Column rdf:nodeID="missing-description">
                      <csvw:name>missing_description</csvw:name>
                      <csvw:datatype rdf:resource="http://www.w3.org/2001/XMLSchema#boolean"/>
                    </csvw:Column>
                  </csvw:column>
                </csvw:Table>
              </csvw:table>
            </foaf:Document>
          </foaf:page>
        </dcat:Dataset>
      </rdf:RDF>
    `;

    const datasets = await new DcatHarvesterService().parseDatasetsFromRdf(
      rdfXml
    );

    expect(datasets).toHaveLength(1);
    expect(datasets[0].dataDictionary).toEqual([
      {
        name: "valid_column",
        type: "integer",
        description: "A complete dictionary entry.",
      },
    ]);
  });

  test("returns undefined when there is no data dictionary", async () => {
    const rdfXml = `
      <rdf:RDF
        xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
        xmlns:dcat="http://www.w3.org/ns/dcat#"
        xmlns:dct="http://purl.org/dc/terms/"
        xmlns:foaf="http://xmlns.com/foaf/0.1/">
        <dcat:Dataset rdf:about="https://example.org/datasets/3">
          <dct:title>Dataset without dictionary</dct:title>
          <dct:description>Dataset description</dct:description>
          <foaf:page>
            <foaf:Document rdf:about="https://example.org/pages/landing">
              <dct:title>Landing page</dct:title>
            </foaf:Document>
          </foaf:page>
        </dcat:Dataset>
      </rdf:RDF>
    `;

    const datasets = await new DcatHarvesterService().parseDatasetsFromRdf(
      rdfXml
    );

    expect(datasets).toHaveLength(1);
    expect(datasets[0].dataDictionary).toBeUndefined();
  });
});
