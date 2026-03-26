// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { LocalDiscoveryDataset } from "@/app/api/discovery/local-store/types";

export const canonicalDiscoveryRdf = `
  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
           xmlns:dcat="http://www.w3.org/ns/dcat#"
           xmlns:dct="http://purl.org/dc/terms/"
           xmlns:dc="http://purl.org/dc/elements/1.1/"
           xmlns:adms="http://www.w3.org/ns/adms#"
           xmlns:healthdcatap="http://healthdataportal.eu/ns/health#"
           xmlns:dcatap="http://data.europa.eu/r5r/"
           xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"
           xmlns:skos="http://www.w3.org/2004/02/skos/core#"
           xmlns:dpv="http://www.w3.org/ns/dpv#"
           xmlns:foaf="http://xmlns.com/foaf/0.1/"
           xmlns:vcard="http://www.w3.org/2006/vcard/ns#">
    <dcat:Catalog rdf:about="https://example.org/catalogues/main">
      <dct:title>Main Catalogue</dct:title>
    </dcat:Catalog>

    <dcat:Dataset rdf:about="https://example.org/datasets/1">
      <dct:identifier>dataset-1</dct:identifier>
      <dct:title xml:lang="en">Population Registry</dct:title>
      <dct:description xml:lang="en">National &amp; regional data</dct:description>
      <dct:language rdf:resource="http://publications.europa.eu/resource/authority/language/ENG" />
      <dct:language> DEU </dct:language>
      <dct:issued>2023-06-15</dct:issued>
      <dct:modified>2024-02-20T14:30:00Z</dct:modified>
      <dcat:version>1.2.0</dcat:version>
      <dcat:hasVersion rdf:resource="https://example.org/datasets/1/v1"/>
      <adms:versionNotes>Updated with 2024 data</adms:versionNotes>
      <healthdcatap:populationCoverage xml:lang="eng">People of LNDS.</healthdcatap:populationCoverage>
      <healthdcatap:numberOfRecords>50000</healthdcatap:numberOfRecords>
      <healthdcatap:numberOfUniqueIndividuals>25000</healthdcatap:numberOfUniqueIndividuals>
      <healthdcatap:maxTypicalAge>95</healthdcatap:maxTypicalAge>
      <healthdcatap:minTypicalAge>18</healthdcatap:minTypicalAge>
      <dct:spatial>
        <dct:Location rdf:about="http://publications.europa.eu/resource/authority/country/LUX">
          <skos:prefLabel xml:lang="eng">Luxembourg</skos:prefLabel>
        </dct:Location>
      </dct:spatial>
      <dcat:spatialResolutionInMeters>4</dcat:spatialResolutionInMeters>
      <dct:temporal>
        <dct:PeriodOfTime rdf:nodeID="Ne1ae7e791f824885a7927c6865d17cbc">
          <dcat:startDate rdf:datatype="http://www.w3.org/2001/XMLSchema#date">2022-01-01</dcat:startDate>
          <dcat:endDate rdf:datatype="http://www.w3.org/2001/XMLSchema#date">2023-01-01</dcat:endDate>
          <dct:title xml:lang="eng">Dataset Coverage Period</dct:title>
        </dct:PeriodOfTime>
      </dct:temporal>
      <healthdcatap:retentionPeriod>
        <dct:PeriodOfTime rdf:nodeID="Nad4e3883f20c42498933a861b94d96e8">
          <dcat:startDate rdf:datatype="http://www.w3.org/2001/XMLSchema#date">2026-03-13</dcat:startDate>
          <dcat:endDate rdf:datatype="http://www.w3.org/2001/XMLSchema#date">2026-03-20</dcat:endDate>
        </dct:PeriodOfTime>
      </healthdcatap:retentionPeriod>
      <dcat:temporalResolution rdf:datatype="http://www.w3.org/2001/XMLSchema#duration">P1D</dcat:temporalResolution>
      <dct:accrualPeriodicity>
        <dct:Frequency rdf:about="http://publications.europa.eu/resource/authority/frequency/ANNUAL">
          <skos:prefLabel xml:lang="eng">Annual</skos:prefLabel>
        </dct:Frequency>
      </dct:accrualPeriodicity>
      <dcat:theme rdf:resource="http://publications.europa.eu/resource/authority/data-theme/HEAL"/>
      <dcat:keyword>oncology</dcat:keyword>
      <dcat:keyword>genomics</dcat:keyword>
      <healthdcatap:healthTheme rdf:resource="http://healthdataportal.eu/ns/health-theme/cancer"/>
      <healthdcatap:healthCategory rdf:resource="http://healthdataportal.eu/ns/health-category/registries"/>
      <dct:type rdf:resource="http://publications.europa.eu/resource/authority/dataset-type/STATISTICAL"/>
      <dct:accessRights>
        <skos:Concept rdf:about="http://publications.europa.eu/resource/authority/access-right/PUBLIC">
          <skos:prefLabel xml:lang="eng">Public</skos:prefLabel>
        </skos:Concept>
      </dct:accessRights>
      <dpv:hasLegalBasis>
        <dpv:LegalBasis rdf:nodeID="Nlegalbasis1">
          <dct:description xml:lang="eng">GDPR Art. 6(1)(e)</dct:description>
        </dpv:LegalBasis>
      </dpv:hasLegalBasis>
      <dpv:hasLegalBasis>
        <dpv:LegalBasis rdf:nodeID="Nlegalbasis2">
          <!-- intentionally missing dct:description — should be dropped by mapper -->
        </dpv:LegalBasis>
      </dpv:hasLegalBasis>
      <dpv:hasLegalBasis>
        <dpv:LegalBasis rdf:nodeID="Nlegalbasis3">
          <dct:description xml:lang="eng">GDPR Art. 6(1)(c)</dct:description>
        </dpv:LegalBasis>
      </dpv:hasLegalBasis>
      <dcatap:applicableLegislation>
        <rdf:Description rdf:about="http://data.europa.eu/eli/reg/2016/679">
          <rdfs:label xml:lang="eng">GDPR</rdfs:label>
        </rdf:Description>
      </dcatap:applicableLegislation>
      <dcatap:applicableLegislation>
        <rdf:Description rdf:about="http://example.com/law/42">
          <skos:prefLabel xml:lang="eng">Example Law 42</skos:prefLabel>
        </rdf:Description>
      </dcatap:applicableLegislation>
      <dcatap:applicableLegislation>
        <rdf:Description rdf:about="http://example.com/law/99"/>
      </dcatap:applicableLegislation>
      <dct:publisher>
        <foaf:Agent rdf:nodeID="Npublisher1">
          <foaf:name xml:lang="eng">org</foaf:name>
          <dct:type>
            <skos:Concept rdf:about="http://purl.org/adms/publishertype/Company">
              <skos:prefLabel xml:lang="eng">Company</skos:prefLabel>
            </skos:Concept>
          </dct:type>
          <foaf:mbox rdf:resource="mailto:a@mail.com"/>
        </foaf:Agent>
      </dct:publisher>
      <healthdcatap:hdab>
        <foaf:Agent rdf:about="https://health.data.lu/hdab/luxembourg">
          <foaf:name xml:lang="eng">Health Data Access Body Luxembourg</foaf:name>
          <foaf:mbox rdf:resource="mailto:hdab@health.lu"/>
        </foaf:Agent>
      </healthdcatap:hdab>
      <dct:creator>
        <foaf:Agent rdf:nodeID="Ncreator1">
          <foaf:name xml:lang="eng">org</foaf:name>
        </foaf:Agent>
      </dct:creator>
      <dcat:contactPoint>
        <vcard:Kind rdf:nodeID="Ncontact1">
          <vcard:hasURL rdf:resource="https://commission.europa.eu/"/>
          <vcard:hasEmail rdf:resource="mailto:tab3-contactPoint-mail@test.com"/>
        </vcard:Kind>
      </dcat:contactPoint>
      <dct:isPartOf rdf:resource="https://example.org/datasets/parent-collection"/>
      <dct:hasPart rdf:resource="https://example.org/datasets/subset-1"/>
      <dcat:distribution>
        <dcat:Distribution rdf:about="https://example.org/distributions/population-registry-csv">
          <dct:identifier>distribution-1</dct:identifier>
          <dct:title>Population Registry CSV</dct:title>
          <dct:format rdf:resource="http://publications.europa.eu/resource/authority/file-type/CSV" />
          <dcat:accessURL rdf:resource="https://example.org/access/population-registry" />
          <dcat:downloadURL rdf:resource="https://example.org/download/population-registry.csv" />
        </dcat:Distribution>
      </dcat:distribution>
    </dcat:Dataset>

    <dcat:Dataset>
      <dct:identifier>ID-2</dct:identifier>
      <dc:title>Hospital Capacity</dc:title>
      <dc:description><![CDATA[ Bed occupancy ]]></dc:description>
    </dcat:Dataset>
  </rdf:RDF>
`;

export const buildLocalDiscoveryDataset = (
  overrides: Partial<LocalDiscoveryDataset> = {}
): LocalDiscoveryDataset => ({
  id: "a",
  title: "Dataset A",
  description: "desc-a",
  catalogue: "catalogue-a",
  languages: [
    "http://publications.europa.eu/resource/authority/language/ENG", // NOSONAR
  ],
  createdAt: "2024-01-01T00:00:00.000Z",
  modifiedAt: "2024-03-10T00:00:00.000Z",
  version: "1.0.0",
  hasVersions: [{ value: "v1", label: "Version 1" }],
  versionNotes: ["Initial release"],
  numberOfRecords: 50000,
  numberOfUniqueIndividuals: 25000,
  maxTypicalAge: 95,
  minTypicalAge: 18,
  populationCoverage: "People of LNDS.",
  spatialResolutionInMeters: [4],
  spatialCoverage: [
    {
      uri: "http://publications.europa.eu/resource/authority/country/LUX", // NOSONAR
      text: "Luxembourg",
    },
  ],
  accessRights: {
    value:
      "http://publications.europa.eu/resource/authority/access-right/PUBLIC", // NOSONAR
    label: "Public",
  },
  conformsTo: [
    {
      value: "https://example.org/spec/healthdcat-ap-v6", // NOSONAR
      label: "HealthDCAT-AP v6",
    },
  ],
  legalBasis: [
    {
      value: "GDPR Art. 6(1)(e)",
      label: "GDPR Art. 6(1)(e)",
    },
    {
      value: "GDPR Art. 6(1)(c)",
      label: "GDPR Art. 6(1)(c)",
    },
  ],
  applicableLegislation: [
    {
      value: "http://data.europa.eu/eli/reg/2016/679", // NOSONAR
      label: "GDPR",
    },
    {
      value: "http://example.com/law/42", // NOSONAR
      label: "Example Law 42",
    },
    {
      value: "http://example.com/law/99", // NOSONAR
      label: "99",
    },
  ],
  distributions: [
    {
      id: "distribution-1",
      title: "Population Registry CSV",
      format: {
        value: "http://publications.europa.eu/resource/authority/file-type/CSV", // NOSONAR
        label: "CSV",
      },
      accessUrl: "https://example.org/access/population-registry",
      downloadUrl: "https://example.org/download/population-registry.csv",
    },
  ],
  contacts: [
    {
      name: "Jane Doe",
      email: "jane.doe@example.org",
    },
  ],
  datasetRelationships: [
    {
      relation: "Is part of",
      target: "https://example.org/datasets/parent-collection",
    },
    {
      relation: "Has part",
      target: "https://example.org/datasets/subset-1",
    },
  ],
  dataDictionary: [
    {
      name: "patient_id",
      type: "string",
      description: "Unique pseudonymised identifier for each patient.",
    },
    {
      name: "diagnosis_code",
      type: "string",
      description: "Primary diagnosis code recorded for the encounter.",
    },
  ],
  temporalCoverage: {
    start: "2022-01-01T00:00:00.000Z",
    end: "2023-01-01T00:00:00.000Z",
  },
  retentionPeriod: [
    {
      start: "2026-03-13T00:00:00.000Z",
      end: "2026-03-20T00:00:00.000Z",
    },
  ],
  temporalResolution: "P1D",
  frequency: {
    value: "http://publications.europa.eu/resource/authority/frequency/ANNUAL", // NOSONAR
    label: "Annual",
  },
  distributionsCount: 3,
  publishers: [
    {
      name: "org",
      email: "a@mail.com",
      type: {
        value: "http://purl.org/adms/publishertype/Company", // NOSONAR
        label: "Company",
      },
    },
  ],
  hdab: [
    {
      name: "Health Data Access Body Luxembourg",
      email: "hdab@health.lu",
      uri: "https://health.data.lu/hdab/luxembourg", // NOSONAR
    },
  ],
  creators: [
    {
      name: "org",
    },
  ],
  publisherType: [
    {
      value: "http://purl.org/adms/publishertype/Company", // NOSONAR
      label: "Company",
    },
  ],
  ...overrides,
});

export const buildDdsSearchedDataset = (
  overrides: Record<string, unknown> = {}
) => ({
  id: "d1",
  title: "Dataset 1",
  description: "A",
  createdAt: "2024-01-15T00:00:00.000Z",
  modifiedAt: "2024-03-10T00:00:00.000Z",
  version: "1.0.0",
  hasVersions: [{ value: "v1", label: "Version 1" }],
  themes: [{ value: "theme-1", label: "Theme 1" }],
  keywords: ["keyword-1"],
  temporalCoverage: {
    start: "2022-01-01T00:00:00.000Z",
    end: "2023-01-01T00:00:00.000Z",
  },
  accessRights: { value: "public", label: "Public" },
  conformsTo: [{ value: "spec-1", label: "Spec 1" }],
  publishers: [{ name: "DDS Publisher" }],
  distributionsCount: 4,
  numberOfUniqueIndividuals: 25000,
  maxTypicalAge: 95,
  minTypicalAge: 18,
  ...overrides,
});
