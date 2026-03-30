// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  DatasetRdfContext,
  addLiteral,
  addNamedNode,
  createLiteral,
  createNamedNode,
  createNestedNode,
  ns,
  toMailtoUri,
} from "@/app/api/discovery/harvester/rdf/context";

export const addDatasetContactQuads = ({
  dataset,
  store,
  datasetNode,
}: DatasetRdfContext): void => {
  dataset.contacts?.forEach((contact, index) => {
    const contactNode = contact.uri
      ? createNamedNode(contact.uri)
      : createNestedNode(
          { dataset, store, datasetNode },
          `contact-point-${index + 1}`
        );

    store.add(datasetNode, ns.dcat("contactPoint"), contactNode);
    store.add(contactNode, ns.rdf("type"), ns.vcard("Kind"));
    addLiteral(store, contactNode, ns.vcard("fn"), contact.name);
    addNamedNode(
      store,
      contactNode,
      ns.vcard("hasEmail"),
      toMailtoUri(contact.email)
    );
    addNamedNode(store, contactNode, ns.vcard("hasURL"), contact.url);
    addLiteral(store, contactNode, ns.dct("identifier"), contact.identifier);
  });
};
