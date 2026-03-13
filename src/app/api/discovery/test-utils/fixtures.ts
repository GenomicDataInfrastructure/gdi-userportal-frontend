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
           xmlns:skos="http://www.w3.org/2004/02/skos/core#">
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
      <dct:spatial>
        <dct:Location rdf:about="http://publications.europa.eu/resource/authority/country/LUX">
          <skos:prefLabel xml:lang="eng">Luxembourg</skos:prefLabel>
        </dct:Location>
      </dct:spatial>
      <dcat:spatialResolutionInMeters>4</dcat:spatialResolutionInMeters>
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
  recordsCount: 50000,
  numberOfUniqueIndividuals: 25000,
  maxTypicalAge: 95,
  populationCoverage: "People of LNDS.",
  spatialResolutionInMeters: [4],
  spatialCoverage: [
    {
      uri: "http://publications.europa.eu/resource/authority/country/LUX", // NOSONAR
      text: "Luxembourg",
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
  recordsCount: 100,
  numberOfUniqueIndividuals: 25000,
  maxTypicalAge: 95,
  ...overrides,
});
