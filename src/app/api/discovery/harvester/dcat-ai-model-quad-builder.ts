// SPDX-FileCopyrightText: 2026 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0

import * as rdf from "rdflib";
import {
  LocalAgent,
  LocalContactPoint,
  LocalDiscoveryAiModel,
} from "@/app/api/discovery/local-store/types";
import {
  buildExportUri,
  DATASET_EXPORT_PREFIXES,
  isAbsoluteUri,
  isNonEmptyString,
  toMailtoUri,
} from "@/app/api/discovery/harvester/dcat-dataset-rdf-shared";
import {
  addEnglishLiteral,
  addLiteral,
  addNamedNode,
  createDateTimeLiteral,
  createLiteral,
  createNamedNode,
  ns,
  RdfNamedNode,
  RdfStore,
} from "@/app/api/discovery/harvester/rdf/context";

const BASE_PATH = "models";
const FALLBACK_KEY = "unknown-ai-model";

export const buildAiModelRdfStore = (
  model: LocalDiscoveryAiModel
): RdfStore => {
  const store = rdf.graph();
  const subject = createNamedNode(getAiModelExportUri(model));
  const nested = (segment: string) =>
    createNamedNode(`${subject.value}#${encodeURIComponent(segment)}`);

  addCore(store, subject, model, nested);
  addClassification(store, subject, model);
  addAgents(
    store,
    subject,
    model.publishers,
    ns.dct("publisher"),
    "publisher",
    nested
  );
  addAgents(
    store,
    subject,
    model.creators,
    ns.dct("creator"),
    "creator",
    nested
  );
  addContacts(store, subject, model.contacts, nested);
  model.documentation?.forEach((value) => {
    const document = createNamedNode(value);
    store.add(subject, ns.foaf("page"), document);
    store.add(document, ns.rdf("type"), ns.foaf("Document"));
  });
  return store;
};

const addCore = (
  store: RdfStore,
  subject: RdfNamedNode,
  model: LocalDiscoveryAiModel,
  nested: (segment: string) => RdfNamedNode
): void => {
  store.add(subject, ns.rdf("type"), ns.dcat("Resource"));
  addLiteral(store, subject, ns.dct("identifier"), model.identifier);
  addEnglishLiteral(store, subject, ns.dct("title"), model.title);
  addEnglishLiteral(store, subject, ns.dct("description"), model.description);
  if (isNonEmptyString(model.createdAt)) {
    store.add(
      subject,
      ns.dct("issued"),
      createDateTimeLiteral(model.createdAt)
    );
  }
  if (isNonEmptyString(model.modifiedAt)) {
    store.add(
      subject,
      ns.dct("modified"),
      createDateTimeLiteral(model.modifiedAt)
    );
  }
  addLiteral(store, subject, ns.dcat("version"), model.version);
  if (isNonEmptyString(model.versionNotes)) {
    store.add(
      subject,
      ns.adms("versionNotes"),
      createLiteral(model.versionNotes)
    );
  }
  model.hasVersions?.forEach((version, index) => {
    const node = isAbsoluteUri(version.value)
      ? createNamedNode(version.value)
      : nested(`version-${index + 1}`);
    store.add(subject, ns.dcat("hasVersion"), node);
    store.add(node, ns.rdf("type"), ns.dcat("Resource"));
    addLiteral(store, node, ns.dct("identifier"), version.value);
    addEnglishLiteral(store, node, ns.dct("title"), version.label);
  });
};

const addClassification = (
  store: RdfStore,
  subject: RdfNamedNode,
  model: LocalDiscoveryAiModel
): void => {
  if (model.accessRights?.value) {
    const rights = createNamedNode(model.accessRights.value);
    store.add(subject, ns.dct("accessRights"), rights);
    store.add(rights, ns.rdf("type"), ns.dct("RightsStatement"));
    addEnglishLiteral(
      store,
      rights,
      ns.skos("prefLabel"),
      model.accessRights.label
    );
  }
  model.keywords?.forEach((value) =>
    store.add(subject, ns.dcat("keyword"), createLiteral(value))
  );
  addResources(
    store,
    subject,
    ns.dct("conformsTo"),
    ns.dct("Standard"),
    model.libraryResources,
    model.libraries
  );
  addResources(
    store,
    subject,
    ns.dct("type"),
    ns.skos("Concept"),
    model.taskResources,
    model.tasks
  );
};

const addResources = (
  store: RdfStore,
  subject: RdfNamedNode,
  predicate: RdfNamedNode,
  resourceType: RdfNamedNode,
  resources: Array<{ value: string; label: string }> | undefined,
  fallbackLabels: string[] | undefined
): void => {
  const resourceLabels = new Set(resources?.map(({ label }) => label));

  if (resources?.length) {
    resources.forEach(({ value, label }) => {
      const resource = createNamedNode(value);
      store.add(subject, predicate, resource);
      store.add(resource, ns.rdf("type"), resourceType);
      addEnglishLiteral(store, resource, ns.skos("prefLabel"), label);
    });
  }

  fallbackLabels
    ?.filter((value) => !resourceLabels.has(value))
    .forEach((value) => store.add(subject, predicate, createLiteral(value)));
};

const addAgents = (
  store: RdfStore,
  subject: RdfNamedNode,
  agents: LocalAgent[],
  predicate: RdfNamedNode,
  segment: string,
  nested: (segment: string) => RdfNamedNode
): void => {
  agents.forEach((agent, index) => {
    const node = agent.uri
      ? createNamedNode(agent.uri)
      : nested(`${segment}-${index + 1}`);
    store.add(subject, predicate, node);
    store.add(node, ns.rdf("type"), ns.foaf("Agent"));
    addEnglishLiteral(store, node, ns.foaf("name"), agent.name);
    addNamedNode(store, node, ns.foaf("workInfoHomepage"), agent.url);
    addNamedNode(store, node, ns.foaf("homepage"), agent.homepage);
    addNamedNode(store, node, ns.foaf("mbox"), toMailtoUri(agent.email));
    addLiteral(store, node, ns.dct("identifier"), agent.identifier);
  });
};

const addContacts = (
  store: RdfStore,
  subject: RdfNamedNode,
  contacts: LocalContactPoint[] | undefined,
  nested: (segment: string) => RdfNamedNode
): void => {
  contacts?.forEach((contact, index) => {
    const node = contact.uri
      ? createNamedNode(contact.uri)
      : nested(`contact-point-${index + 1}`);
    store.add(subject, ns.dcat("contactPoint"), node);
    store.add(node, ns.rdf("type"), ns.vcard("Kind"));
    addEnglishLiteral(store, node, ns.vcard("fn"), contact.name);
    addNamedNode(store, node, ns.vcard("hasEmail"), toMailtoUri(contact.email));
    addNamedNode(store, node, ns.vcard("hasURL"), contact.url);
    addLiteral(store, node, ns.dct("identifier"), contact.identifier);
  });
};

const getAiModelExportUri = (model: LocalDiscoveryAiModel): string =>
  buildExportUri(BASE_PATH, model, FALLBACK_KEY);

export const getAiModelExportPrefixes = (): Record<string, string> => ({
  ...DATASET_EXPORT_PREFIXES,
});
