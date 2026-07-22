// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  DatasetRdfContext,
  addConcept,
  addLiteral,
  addNamedNode,
  createLanguageLiteral,
  createLiteral,
  createNamedNode,
  createNestedNode,
  isNonEmptyString,
  ns,
  toMailtoUri,
} from "@/app/api/discovery/harvester/rdf/context";

const addAgents = (
  context: DatasetRdfContext,
  predicate: any,
  segment: string,
  agents: DatasetRdfContext["dataset"]["publishers"],
  agentRdfType?: any
) => {
  const { store, datasetNode } = context;
  const typeNode = agentRdfType ?? ns.foaf("Agent");

  agents.forEach((agent, index) => {
    const node = agent.uri
      ? createNamedNode(agent.uri)
      : createNestedNode(context, `${segment}-${index + 1}`);

    store.add(datasetNode, predicate, node);
    store.add(node, ns.rdf("type"), typeNode);
    if (isNonEmptyString(agent.name)) {
      store.add(
        node,
        ns.foaf("name"),
        createLanguageLiteral(agent.name, "eng")
      );
    }
    addNamedNode(store, node, ns.foaf("workInfoHomepage"), agent.url);
    addNamedNode(store, node, ns.foaf("homepage"), agent.homepage);
    addNamedNode(store, node, ns.foaf("mbox"), toMailtoUri(agent.email));
    addLiteral(store, node, ns.dct("identifier"), agent.identifier);
    if (agent.type) {
      addConcept(
        store,
        node,
        ns.dct("type"),
        agent.type.value,
        agent.type.label
      );
    }

    agent.contactPoints?.forEach((cp, cpIndex) => {
      const cpNode = createNestedNode(
        context,
        `${segment}-${index + 1}-contact-point-${cpIndex + 1}`
      );
      store.add(node, ns.cv("contactPoint"), cpNode);
      store.add(cpNode, ns.rdf("type"), ns.cv("ContactPoint"));
      store.add(cpNode, ns.rdf("type"), ns.vcard("Kind"));
      if (isNonEmptyString(cp.name)) {
        store.add(cpNode, ns.vcard("fn"), createLiteral(cp.name));
      }
      if (isNonEmptyString(cp.email)) {
        addNamedNode(
          store,
          cpNode,
          ns.vcard("hasEmail"),
          toMailtoUri(cp.email)
        );
        store.add(cpNode, ns.cv("email"), createLiteral(cp.email));
      }
    });
  });
};

export const addDatasetAgentQuads = (context: DatasetRdfContext): void => {
  addAgents(
    context,
    ns.dct("publisher"),
    "publisher",
    context.dataset.publishers
  );
  addAgents(
    context,
    ns.health("hdab"),
    "hdab",
    context.dataset.hdab,
    ns.foaf("Organization")
  );
  addAgents(context, ns.dct("creator"), "creator", context.dataset.creators);
};
