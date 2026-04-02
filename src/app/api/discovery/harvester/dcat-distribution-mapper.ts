// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import type * as RDF from "@rdfjs/types";
import { LocalDiscoveryDistribution } from "@/app/api/discovery/local-store/types";
import { RdfGraph } from "@/app/api/discovery/harvester/rdf-graph";
import { normalizeDate } from "@/app/api/discovery/harvester/date-utils";

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
const DCT_ISSUED = "http://purl.org/dc/terms/issued"; // NOSONAR

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

const getDistributionSubjects = (datasetSubject: RDF.Term, graph: RdfGraph) => {
  const subjects = [
    ...graph.getObjects(datasetSubject, DCAT_DISTRIBUTION),
    ...graph.getObjects(datasetSubject, HEALTHDCATAP_ANALYTICS),
  ];

  const seen = new Set<string>();
  return subjects.filter((subject) => {
    const key = `${subject.termType}:${subject.value}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const mapDistribution = (
  distributionSubject: RDF.Term,
  graph: RdfGraph,
  datasetId: string,
  index: number
): LocalDiscoveryDistribution | undefined => {
  const id = getDistributionId(distributionSubject, graph, datasetId, index);
  const accessUrl = getDistributionAccessUrl(distributionSubject, graph);
  const downloadUrl = getDistributionDownloadUrl(distributionSubject, graph);
  const title = getDistributionTitle(
    distributionSubject,
    graph,
    id,
    accessUrl,
    downloadUrl
  );

  if (!id && !accessUrl && !downloadUrl) return undefined;

  return {
    id: id || `${datasetId}-distribution-${index + 1}`,
    title,
    format: getDistributionFormat(distributionSubject, graph),
    accessUrl,
    downloadUrl,
    createdAt: normalizeDate(graph.getLiteral(distributionSubject, DCT_ISSUED)),
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
  "";

const getDistributionTitle = (
  distributionSubject: RDF.Term,
  graph: RdfGraph,
  id: string,
  accessUrl?: string,
  downloadUrl?: string
): string =>
  graph.getFirstLiteral(distributionSubject, [DCT_TITLE, DC_TITLE]) ||
  id ||
  accessUrl ||
  downloadUrl ||
  "";

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
