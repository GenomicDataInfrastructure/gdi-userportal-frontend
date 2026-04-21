// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  DatasetRdfContext,
  addConcept,
  addLiteral,
  addNamedNode,
  createLiteral,
  createNamedNode,
  createNestedNode,
  ns,
  toMailtoUri,
} from "@/app/api/discovery/harvester/rdf/context";

const addAgents = (
  context: DatasetRdfContext,
  predicate: any,
  segment: string,
  agents: DatasetRdfContext["dataset"]["publishers"]
) => {
  const { store, datasetNode } = context;

  agents.forEach((agent, index) => {
    const node = agent.uri
      ? createNamedNode(agent.uri)
      : createNestedNode(context, `${segment}-${index + 1}`);

    store.add(datasetNode, predicate, node);
    store.add(node, ns.rdf("type"), ns.foaf("Agent"));
    store.add(node, ns.foaf("name"), createLiteral(agent.name));
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
  });
};

export const addDatasetAgentQuads = (context: DatasetRdfContext): void => {
  addAgents(
    context,
    ns.dct("publisher"),
    "publisher",
    context.dataset.publishers
  );
  addAgents(context, ns.health("hdab"), "hdab", context.dataset.hdab);
  addAgents(context, ns.dct("creator"), "creator", context.dataset.creators);
};
