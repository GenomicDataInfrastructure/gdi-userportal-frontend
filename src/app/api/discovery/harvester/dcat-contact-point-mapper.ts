// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import type * as RDF from "@rdfjs/types";
import { LocalContactPoint } from "@/app/api/discovery/local-store/types";
import { RdfGraph } from "@/app/api/discovery/harvester/rdf-graph";

const DCAT_CONTACT_POINT = "http://www.w3.org/ns/dcat#contactPoint"; // NOSONAR
const DCT_IDENTIFIER = "http://purl.org/dc/terms/identifier"; // NOSONAR
const VCARD_FN = "http://www.w3.org/2006/vcard/ns#fn"; // NOSONAR
const VCARD_HAS_EMAIL = "http://www.w3.org/2006/vcard/ns#hasEmail"; // NOSONAR
const VCARD_HAS_URL = "http://www.w3.org/2006/vcard/ns#hasURL"; // NOSONAR

export const extractContactPoints = (
  datasetSubject: RDF.Term,
  graph: RdfGraph
): LocalContactPoint[] | undefined => {
  const contactSubjects = graph.getObjects(datasetSubject, DCAT_CONTACT_POINT);
  if (!contactSubjects.length) return undefined;

  const contacts = contactSubjects
    .map((contactSubject) => mapContactPoint(contactSubject, graph))
    .filter((contact): contact is LocalContactPoint => contact !== undefined);

  return contacts.length > 0 ? contacts : undefined;
};

const mapContactPoint = (
  contactSubject: RDF.Term,
  graph: RdfGraph
): LocalContactPoint | undefined => {
  const email = getContactPointEmail(contactSubject, graph);
  const uri = graph.getNamedNodeValue(contactSubject) || undefined;
  const identifier =
    graph.getLiteral(contactSubject, DCT_IDENTIFIER) || undefined;
  const name =
    graph.getLiteral(contactSubject, VCARD_FN) ||
    email ||
    identifier ||
    uri ||
    "";

  if (!name && !email && !identifier && !uri) return undefined;

  return {
    name,
    email,
    uri,
    url: getContactPointUrl(contactSubject, graph),
    identifier,
  };
};

const getContactPointEmail = (
  contactSubject: RDF.Term,
  graph: RdfGraph
): string => {
  const rawEmail = graph
    .getObjects(contactSubject, VCARD_HAS_EMAIL)[0]
    ?.value.trim();
  if (!rawEmail) return "";
  return rawEmail.startsWith("mailto:")
    ? rawEmail.slice("mailto:".length)
    : rawEmail;
};

const getContactPointUrl = (
  contactSubject: RDF.Term,
  graph: RdfGraph
): string | undefined => {
  const url = graph.getObjects(contactSubject, VCARD_HAS_URL)[0]?.value.trim();
  return url || undefined;
};
