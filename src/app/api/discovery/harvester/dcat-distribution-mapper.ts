// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import type * as RDF from "@rdfjs/types";
import { LocalDiscoveryDistribution } from "@/app/api/discovery/local-store/types";
import { RdfGraph } from "@/app/api/discovery/harvester/rdf-graph";

const DCAT_DISTRIBUTION = "http://www.w3.org/ns/dcat#distribution"; // NOSONAR
const HEALTHDCATAP_ANALYTICS = "http://healthdataportal.eu/ns/health#analytics"; // NOSONAR
const DCAT_ACCESS_URL = "http://www.w3.org/ns/dcat#accessURL"; // NOSONAR
const DCAT_DOWNLOAD_URL = "http://www.w3.org/ns/dcat#downloadURL"; // NOSONAR
const DCT_IDENTIFIER = "http://purl.org/dc/terms/identifier"; // NOSONAR
const DCT_TITLE = "http://purl.org/dc/terms/title"; // NOSONAR
const DC_TITLE = "http://purl.org/dc/elements/1.1/title"; // NOSONAR
const DCT_FORMAT = "http://purl.org/dc/terms/format"; // NOSONAR
const SKOS_PREF_LABEL = "http://www.w3.org/2004/02/skos/core#prefLabel"; // NOSONAR
const RDFS_LABEL = "http://www.w3.org/2000/01/rdf-schema#label"; // NOSONAR

export const extractDistributions = (
  datasetSubject: RDF.Term,
  graph: RdfGraph,
  datasetId: string
): LocalDiscoveryDistribution[] | undefined => {
  const distributionSubjects = getDistributionSubjects(datasetSubject, graph);
  if (!distributionSubjects.length) return undefined;

  const distributions = distributionSubjects
    .map((distributionSubject, index) =>
      mapDistribution(distributionSubject, graph, datasetId, index)
    )
    .filter(
      (distribution): distribution is LocalDiscoveryDistribution =>
        distribution !== undefined
    );

  return distributions.length ? distributions : undefined;
};

const getDistributionSubjects = (datasetSubject: RDF.Term, graph: RdfGraph) => [
  ...graph.getObjects(datasetSubject, DCAT_DISTRIBUTION),
  ...graph.getObjects(datasetSubject, HEALTHDCATAP_ANALYTICS),
];

const mapDistribution = (
  distributionSubject: RDF.Term,
  graph: RdfGraph,
  datasetId: string,
  index: number
): LocalDiscoveryDistribution | undefined => {
  const id = getDistributionId(distributionSubject, graph, datasetId, index);
  const title = getDistributionTitle(distributionSubject, graph);

  if (!id || !title) return undefined;

  return {
    id,
    title,
    format: getDistributionFormat(distributionSubject, graph),
    accessUrl: getDistributionAccessUrl(distributionSubject, graph),
    downloadUrl: getDistributionDownloadUrl(distributionSubject, graph),
  };
};

const getDistributionId = (
  distributionSubject: RDF.Term,
  graph: RdfGraph,
  datasetId: string,
  index: number
): string =>
  graph.getLiteral(distributionSubject, DCT_IDENTIFIER) ||
  graph.getNamedNodeValue(distributionSubject) ||
  `${datasetId}-distribution-${index + 1}`;

const getDistributionTitle = (
  distributionSubject: RDF.Term,
  graph: RdfGraph
): string => graph.getFirstLiteral(distributionSubject, [DCT_TITLE, DC_TITLE]);

const getDistributionFormat = (
  distributionSubject: RDF.Term,
  graph: RdfGraph
): LocalDiscoveryDistribution["format"] => {
  const formatSubject = graph.getObjects(distributionSubject, DCT_FORMAT)[0];
  if (!formatSubject) return undefined;

  const value =
    graph.getNamedNodeValue(formatSubject) || formatSubject.value.trim();
  if (!value) return undefined;

  const label =
    graph.getFirstLiteral(formatSubject, [SKOS_PREF_LABEL, RDFS_LABEL]) ||
    value.split("/").pop() ||
    value;

  return { value, label };
};

const getDistributionAccessUrl = (
  distributionSubject: RDF.Term,
  graph: RdfGraph
): string | undefined => {
  const url = graph
    .getObjects(distributionSubject, DCAT_ACCESS_URL)[0]
    ?.value.trim();
  return url || undefined;
};

const getDistributionDownloadUrl = (
  distributionSubject: RDF.Term,
  graph: RdfGraph
): string | undefined => {
  const url = graph
    .getObjects(distributionSubject, DCAT_DOWNLOAD_URL)[0]
    ?.value.trim();
  return url || undefined;
};
