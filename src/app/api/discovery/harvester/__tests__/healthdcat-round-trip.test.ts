// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { jest } from "@jest/globals";
import type * as RDF from "@rdfjs/types";
import { DcatHarvesterService } from "@/app/api/discovery/harvester/dcat-harvester-service";
import { serializeLocalDiscoveryDataset } from "@/app/api/discovery/harvester/dcat-dataset-rdf-generator";
import {
  parseRdfToQuads,
  RDF_CONTENT_TYPES,
} from "@/app/api/discovery/harvester/rdf-quad-loader";
import { getDatasetExportUri } from "@/app/api/discovery/harvester/dcat-dataset-rdf-shared";

jest.mock("@/app/api/discovery/harvester/shacl/shacl-validator", () => ({
  validateHealthDcatAp: jest.fn<() => Promise<unknown[]>>(() =>
    Promise.resolve([])
  ),
}));

const HEALTH = "http://healthdataportal.eu/ns/health#";
const DCT = "http://purl.org/dc/terms/";
const DCAT = "http://www.w3.org/ns/dcat#";
const DCATAP = "http://data.europa.eu/r5r/";
const GEODCATAP = "http://data.europa.eu/930/";
const FOAF = "http://xmlns.com/foaf/0.1/";
const SKOS = "http://www.w3.org/2004/02/skos/core#";
const XSD = "http://www.w3.org/2001/XMLSchema#";

const mdcHealthDatasetRdf = `<?xml version="1.0" encoding="utf-8"?>
<rdf:RDF
  xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
  xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"
  xmlns:dcat="${DCAT}"
  xmlns:dct="${DCT}"
  xmlns:foaf="${FOAF}"
  xmlns:skos="${SKOS}"
  xmlns:vcard="http://www.w3.org/2006/vcard/ns#"
  xmlns:cv="http://data.europa.eu/m8g/"
  xmlns:r5r="${DCATAP}"
  xmlns:geodcatap="${GEODCATAP}"
  xmlns:healthdcatap="${HEALTH}">
  <dcat:Dataset rdf:about="https://mdc.example.org/datasets/health-1">
    <dct:title xml:lang="eng">Health dataset</dct:title>
    <dct:description xml:lang="eng">MDC health dataset</dct:description>
    <dct:identifier>health-1</dct:identifier>
    <healthdcatap:healthTheme>
      <skos:Concept rdf:about="https://example.org/healththeme/BLOOD_INFECTIONS">
        <skos:prefLabel xml:lang="eng">Blood Infections</skos:prefLabel>
      </skos:Concept>
    </healthdcatap:healthTheme>
    <healthdcatap:minTypicalAge rdf:datatype="${XSD}nonNegativeInteger">0</healthdcatap:minTypicalAge>
    <healthdcatap:maxTypicalAge rdf:datatype="${XSD}nonNegativeInteger">90</healthdcatap:maxTypicalAge>
    <healthdcatap:numberOfRecords rdf:datatype="${XSD}nonNegativeInteger">2000</healthdcatap:numberOfRecords>
    <healthdcatap:numberOfUniqueIndividuals rdf:datatype="${XSD}nonNegativeInteger">0</healthdcatap:numberOfUniqueIndividuals>
    <healthdcatap:populationCoverage xml:lang="eng">EU</healthdcatap:populationCoverage>
    <healthdcatap:hasCodeValues xml:lang="eng">ICD-10 A41</healthdcatap:hasCodeValues>
    <healthdcatap:hasCodingSystem>
      <dct:Standard rdf:about="https://example.org/coding-system/HGNC"/>
    </healthdcatap:hasCodingSystem>
    <healthdcatap:retentionPeriod>
      <dct:PeriodOfTime>
        <dcat:startDate rdf:datatype="${XSD}date">2026-10-14</dcat:startDate>
        <dcat:endDate rdf:datatype="${XSD}date">2026-12-25</dcat:endDate>
      </dct:PeriodOfTime>
    </healthdcatap:retentionPeriod>
    <dct:publisher>
      <foaf:Agent>
        <foaf:name xml:lang="eng">Dummy Health Organisation</foaf:name>
      </foaf:Agent>
    </dct:publisher>
    <geodcatap:custodian>
      <foaf:Agent>
        <rdf:type rdf:resource="${FOAF}Organization"/>
        <foaf:name xml:lang="eng">Custodian Organisation</foaf:name>
        <cv:contactPoint>
          <cv:ContactPoint>
            <cv:email>custodian@example.org</cv:email>
            <cv:contactPage rdf:resource="https://custodian.example.org"/>
          </cv:ContactPoint>
        </cv:contactPoint>
      </foaf:Agent>
    </geodcatap:custodian>
    <dcat:distribution>
      <dcat:Distribution>
        <dct:identifier>179</dct:identifier>
        <dct:title xml:lang="eng">Data distribution</dct:title>
        <dct:description xml:lang="eng">Distribution description</dct:description>
        <dcat:accessURL rdf:resource="https://example.org/access"/>
        <dct:license>
          <dct:LicenseDocument rdf:about="https://creativecommons.org/licenses/by/4.0/legalcode">
            <skos:prefLabel xml:lang="eng">Legalcode</skos:prefLabel>
          </dct:LicenseDocument>
        </dct:license>
        <r5r:availability>
          <skos:Concept rdf:about="http://publications.europa.eu/resource/authority/planned-availability/AVAILABLE">
            <skos:prefLabel xml:lang="eng">Available</skos:prefLabel>
          </skos:Concept>
        </r5r:availability>
      </dcat:Distribution>
    </dcat:distribution>
    <healthdcatap:analytics>
      <dcat:Distribution>
        <dct:identifier>180</dct:identifier>
        <dct:title xml:lang="eng">Analytics distribution</dct:title>
        <dct:description xml:lang="eng">Aggregated statistics</dct:description>
        <dcat:accessURL rdf:resource="https://example.org/analytics"/>
      </dcat:Distribution>
    </healthdcatap:analytics>
  </dcat:Dataset>
</rdf:RDF>`;

const roundTrip = async () => {
  const {
    datasets: [dataset],
  } = await new DcatHarvesterService().parseCatalogueFromRdf(
    mdcHealthDatasetRdf,
    undefined,
    RDF_CONTENT_TYPES.rdfxml
  );
  const stored = JSON.parse(JSON.stringify(dataset));
  const payload = await serializeLocalDiscoveryDataset(stored, "rdf");
  const quads = await parseRdfToQuads(payload, RDF_CONTENT_TYPES.rdfxml);
  return { quads, datasetUri: getDatasetExportUri(stored) };
};

const objectsOf = (quads: RDF.Quad[], subject: string, predicate: string) =>
  quads
    .filter(
      (q) => q.subject.value === subject && q.predicate.value === predicate
    )
    .map((q) => q.object);

const literalOf = (quads: RDF.Quad[], subject: string, predicate: string) =>
  objectsOf(quads, subject, predicate)[0]?.value;

const distributionByTitle = (
  quads: RDF.Quad[],
  datasetUri: string,
  predicate: string,
  title: string
) =>
  objectsOf(quads, datasetUri, predicate).find(
    (node) => literalOf(quads, node.value, `${DCT}title`) === title
  );

describe("HealthDCAT-AP round trip from MDC RDF to dispatcher payload", () => {
  const originalBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_BASE_URL = "https://portal.example.org/";
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_BASE_URL = originalBaseUrl;
  });

  test("keeps health dataset properties, including zero values", async () => {
    const { quads, datasetUri } = await roundTrip();

    expect(literalOf(quads, datasetUri, `${HEALTH}numberOfRecords`)).toBe(
      "2000"
    );
    expect(
      literalOf(quads, datasetUri, `${HEALTH}numberOfUniqueIndividuals`)
    ).toBe("0");
    expect(literalOf(quads, datasetUri, `${HEALTH}minTypicalAge`)).toBe("0");
    expect(literalOf(quads, datasetUri, `${HEALTH}maxTypicalAge`)).toBe("90");
    expect(literalOf(quads, datasetUri, `${HEALTH}populationCoverage`)).toBe(
      "EU"
    );
    expect(literalOf(quads, datasetUri, `${HEALTH}hasCodeValues`)).toBe(
      "ICD-10 A41"
    );
    expect(
      objectsOf(quads, datasetUri, `${HEALTH}hasCodingSystem`).map(
        (o) => o.value
      )
    ).toEqual(["https://example.org/coding-system/HGNC"]);
    expect(
      objectsOf(quads, datasetUri, `${HEALTH}healthTheme`).map((o) => o.value)
    ).toEqual(["https://example.org/healththeme/BLOOD_INFECTIONS"]);

    const [retention] = objectsOf(
      quads,
      datasetUri,
      `${HEALTH}retentionPeriod`
    );
    expect(retention).toBeDefined();
    expect(literalOf(quads, retention.value, `${DCAT}startDate`)).toMatch(
      /^2026-10-14/
    );
    expect(literalOf(quads, retention.value, `${DCAT}endDate`)).toMatch(
      /^2026-12-25/
    );
  });

  test("keeps the custodian agent", async () => {
    const { quads, datasetUri } = await roundTrip();

    const [custodian] = objectsOf(quads, datasetUri, `${GEODCATAP}custodian`);
    expect(custodian).toBeDefined();
    expect(literalOf(quads, custodian.value, `${FOAF}name`)).toBe(
      "Custodian Organisation"
    );
    expect(
      objectsOf(
        quads,
        custodian.value,
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
      ).map((o) => o.value)
    ).toContain(`${FOAF}Organization`);
  });

  test("keeps distribution description, licence and availability", async () => {
    const { quads, datasetUri } = await roundTrip();

    const distribution = distributionByTitle(
      quads,
      datasetUri,
      `${DCAT}distribution`,
      "Data distribution"
    );
    expect(distribution).toBeDefined();
    expect(literalOf(quads, distribution!.value, `${DCT}description`)).toBe(
      "Distribution description"
    );
    expect(
      objectsOf(quads, distribution!.value, `${DCT}license`).map((o) => o.value)
    ).toEqual(["https://creativecommons.org/licenses/by/4.0/legalcode"]);
    expect(
      objectsOf(quads, distribution!.value, `${DCATAP}availability`).map(
        (o) => o.value
      )
    ).toEqual([
      "http://publications.europa.eu/resource/authority/planned-availability/AVAILABLE",
    ]);
  });

  test("keeps analytics distributions under health:analytics only", async () => {
    const { quads, datasetUri } = await roundTrip();

    expect(
      distributionByTitle(
        quads,
        datasetUri,
        `${HEALTH}analytics`,
        "Analytics distribution"
      )
    ).toBeDefined();
    expect(
      distributionByTitle(
        quads,
        datasetUri,
        `${DCAT}distribution`,
        "Analytics distribution"
      )
    ).toBeUndefined();
    expect(
      distributionByTitle(
        quads,
        datasetUri,
        `${HEALTH}analytics`,
        "Data distribution"
      )
    ).toBeUndefined();
  });
});
