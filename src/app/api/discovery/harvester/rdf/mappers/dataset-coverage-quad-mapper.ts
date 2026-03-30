// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  DatasetRdfContext,
  addLiteral,
  createDateTimeLiteral,
  createDecimalLiteral,
  createDurationLiteral,
  createIntegerLiteral,
  createNamedNode,
  createNestedNode,
  isNonEmptyString,
  ns,
} from "@/app/api/discovery/harvester/rdf/context";

export const addDatasetCoverageQuads = ({
  dataset,
  store,
  datasetNode,
}: DatasetRdfContext): void => {
  if (typeof dataset.numberOfRecords === "number") {
    store.add(
      datasetNode,
      ns.health("numberOfRecords"),
      createIntegerLiteral(dataset.numberOfRecords)
    );
  }
  if (typeof dataset.numberOfUniqueIndividuals === "number") {
    store.add(
      datasetNode,
      ns.health("numberOfUniqueIndividuals"),
      createIntegerLiteral(dataset.numberOfUniqueIndividuals)
    );
  }
  if (typeof dataset.maxTypicalAge === "number") {
    store.add(
      datasetNode,
      ns.health("maxTypicalAge"),
      createIntegerLiteral(dataset.maxTypicalAge)
    );
  }
  if (typeof dataset.minTypicalAge === "number") {
    store.add(
      datasetNode,
      ns.health("minTypicalAge"),
      createIntegerLiteral(dataset.minTypicalAge)
    );
  }

  addLiteral(
    store,
    datasetNode,
    ns.health("populationCoverage"),
    dataset.populationCoverage
  );

  dataset.spatialCoverage?.forEach((coverage, index) => {
    const locationNode = coverage.uri
      ? createNamedNode(coverage.uri)
      : createNestedNode(
          { dataset, store, datasetNode },
          `spatial-coverage-${index + 1}`
        );

    store.add(datasetNode, ns.dct("spatial"), locationNode);
    store.add(locationNode, ns.rdf("type"), ns.dct("Location"));
    addLiteral(store, locationNode, ns.skos("prefLabel"), coverage.text);
    addLiteral(store, locationNode, ns.dcat("bbox"), coverage.bbox);
    addLiteral(store, locationNode, ns.dcat("centroid"), coverage.centroid);
  });

  dataset.spatialResolutionInMeters?.forEach((value) =>
    store.add(
      datasetNode,
      ns.dcat("spatialResolutionInMeters"),
      createDecimalLiteral(value)
    )
  );

  if (
    isNonEmptyString(dataset.temporalCoverage?.start) ||
    isNonEmptyString(dataset.temporalCoverage?.end)
  ) {
    const periodNode = createNestedNode(
      { dataset, store, datasetNode },
      "temporal-coverage"
    );
    store.add(datasetNode, ns.dct("temporal"), periodNode);
    store.add(periodNode, ns.rdf("type"), ns.dct("PeriodOfTime"));
    if (isNonEmptyString(dataset.temporalCoverage?.start)) {
      store.add(
        periodNode,
        ns.dcat("startDate"),
        createDateTimeLiteral(dataset.temporalCoverage.start)
      );
    }
    if (isNonEmptyString(dataset.temporalCoverage?.end)) {
      store.add(
        periodNode,
        ns.dcat("endDate"),
        createDateTimeLiteral(dataset.temporalCoverage.end)
      );
    }
  }

  dataset.retentionPeriod?.forEach((period, index) => {
    const periodNode = createNestedNode(
      { dataset, store, datasetNode },
      `retention-period-${index + 1}`
    );
    store.add(datasetNode, ns.health("retentionPeriod"), periodNode);
    store.add(periodNode, ns.rdf("type"), ns.dct("PeriodOfTime"));
    if (isNonEmptyString(period.start)) {
      store.add(
        periodNode,
        ns.dcat("startDate"),
        createDateTimeLiteral(period.start)
      );
    }
    if (isNonEmptyString(period.end)) {
      store.add(
        periodNode,
        ns.dcat("endDate"),
        createDateTimeLiteral(period.end)
      );
    }
  });

  if (isNonEmptyString(dataset.temporalResolution)) {
    store.add(
      datasetNode,
      ns.dcat("temporalResolution"),
      createDurationLiteral(dataset.temporalResolution)
    );
  }
};
