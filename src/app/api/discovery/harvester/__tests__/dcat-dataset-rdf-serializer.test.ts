// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { Readable } from "node:stream";
import type { Quad } from "@rdfjs/types";
import { rdfParser } from "rdf-parse";
import { LocalDiscoveryDataset } from "@/app/api/discovery/local-store/types";
import { serializeDatasetStore } from "@/app/api/discovery/harvester/dcat-dataset-rdf-serializer";
import { LocalDiscoveryDatasetExportFormat } from "@/app/api/discovery/harvester/dcat-dataset-export-types";
import { DATASET_EXPORT_PREFIXES as prefixes } from "@/app/api/discovery/harvester/dcat-dataset-rdf-shared";

const buildDataset = (
  overrides: Partial<LocalDiscoveryDataset> = {}
): LocalDiscoveryDataset => ({
  id: "https://example.org/datasets/regression",
  title: "RDF export regression",
  publishers: [],
  hdab: [],
  creators: [],
  ...overrides,
});

const getObjects = (quads: Quad[], subject: string, predicate: string) =>
  quads
    .filter(
      (quad) =>
        quad.subject.value === subject && quad.predicate.value === predicate
    )
    .map((quad) => quad.object);

const namedNode = (value: string) =>
  expect.objectContaining({ termType: "NamedNode", value });

describe.each<[LocalDiscoveryDatasetExportFormat, string]>([
  ["rdf", "application/rdf+xml"],
  ["ttl", "text/turtle"],
  ["jsonld", "application/ld+json"],
])("shared %s export round trips", (format, contentType) => {
  const roundTrip = async (dataset: LocalDiscoveryDataset): Promise<Quad[]> => {
    const text = await serializeDatasetStore(dataset, format);
    const quads: Quad[] = [];
    await new Promise<void>((resolve, reject) => {
      rdfParser
        .parse(Readable.from([text]), { contentType, baseIRI: dataset.id })
        .on("data", (quad: Quad) => quads.push(quad))
        .on("error", reject)
        .on("end", resolve);
    });
    return quads;
  };

  test("preserves two distinct Activity resources and their own categories", async () => {
    const categories = [
      "https://example.org/activity/collection",
      "https://example.org/activity/analysis",
    ];
    const dataset = buildDataset({
      wasGeneratedBy: categories.map((activityType) => ({ activityType })),
    });
    const quads = await roundTrip(dataset);

    expect(
      getObjects(quads, dataset.id, `${prefixes.prov}wasGeneratedBy`)
    ).toEqual(
      expect.arrayContaining([
        namedNode(`${dataset.id}#activity-1`),
        namedNode(`${dataset.id}#activity-2`),
      ])
    );
    expect(
      getObjects(quads, dataset.id, `${prefixes.prov}wasGeneratedBy`)
    ).toHaveLength(2);
    categories.forEach((category, index) => {
      const activity = `${dataset.id}#activity-${index + 1}`;
      expect(getObjects(quads, activity, `${prefixes.rdf}type`)).toEqual([
        namedNode(`${prefixes.prov}Activity`),
      ]);
      expect(getObjects(quads, activity, `${prefixes.dct}type`)).toEqual([
        namedNode(category),
      ]);
    });
  });

  test("keeps activity IRIs stable, unique even with repeated categories, and dataset-specific", async () => {
    const dataset = buildDataset({
      wasGeneratedBy: [
        { activityType: "https://example.org/activity/collection" },
        { activityType: "https://example.org/activity/collection" },
      ],
    });
    const otherDataset = {
      ...dataset,
      id: "https://example.org/datasets/other",
    };
    const activityIds = async (input: LocalDiscoveryDataset) =>
      getObjects(
        await roundTrip(input),
        input.id,
        `${prefixes.prov}wasGeneratedBy`
      )
        .map((term) => term.value)
        .sort();

    const ids = await activityIds(dataset);
    expect(ids).toEqual([
      `${dataset.id}#activity-1`,
      `${dataset.id}#activity-2`,
    ]);
    expect(await activityIds(dataset)).toEqual(ids);
    expect(await activityIds(otherDataset)).toEqual([
      `${otherDataset.id}#activity-1`,
      `${otherDataset.id}#activity-2`,
    ]);
  });

  test.each([undefined, []])(
    "omits activity links and resources when activities are %j",
    async (wasGeneratedBy) => {
      const dataset = buildDataset({ wasGeneratedBy });
      const quads = await roundTrip(dataset);

      expect(
        getObjects(quads, dataset.id, `${prefixes.prov}wasGeneratedBy`)
      ).toEqual([]);
      expect(
        quads.filter(
          (quad) =>
            quad.predicate.value === `${prefixes.rdf}type` &&
            quad.object.value === `${prefixes.prov}Activity`
        )
      ).toEqual([]);
    }
  );

  test.each([undefined, "", " ", "not-a-uri"])(
    "preserves an Activity without a category triple for %j",
    async (activityType) => {
      const dataset = buildDataset({ wasGeneratedBy: [{ activityType }] });
      const quads = await roundTrip(dataset);
      const activity = `${dataset.id}#activity-1`;

      expect(
        getObjects(quads, dataset.id, `${prefixes.prov}wasGeneratedBy`)
      ).toEqual([namedNode(activity)]);
      expect(getObjects(quads, activity, `${prefixes.rdf}type`)).toEqual([
        namedNode(`${prefixes.prov}Activity`),
      ]);
      expect(getObjects(quads, activity, `${prefixes.dct}type`)).toEqual([]);
    }
  );

  test("types all four dataset concepts, including REPORT without a label", async () => {
    const types = [
      {
        value:
          "http://publications.europa.eu/resource/authority/dataset-type/GLOSSARY",
        label: "Glossary",
      },
      {
        value:
          "http://publications.europa.eu/resource/authority/dataset-type/ONTOLOGY",
        label: "Ontology",
      },
      {
        value:
          "http://publications.europa.eu/resource/authority/dataset-type/STATISTICAL",
        label: "Statistical",
      },
      {
        value:
          "http://publications.europa.eu/resource/authority/resource-type/REPORT",
        label: "",
      },
    ];
    const dataset = buildDataset({ dcatType: types });
    const quads = await roundTrip(dataset);

    expect(getObjects(quads, dataset.id, `${prefixes.dct}type`)).toHaveLength(
      4
    );
    expect(getObjects(quads, dataset.id, `${prefixes.dct}type`)).toEqual(
      expect.arrayContaining(types.map(({ value }) => namedNode(value)))
    );
    types.forEach(({ value, label }) => {
      expect(getObjects(quads, value, `${prefixes.rdf}type`)).toEqual([
        namedNode(`${prefixes.skos}Concept`),
      ]);
      expect(getObjects(quads, value, `${prefixes.skos}prefLabel`)).toEqual(
        label
          ? [expect.objectContaining({ termType: "Literal", value: label })]
          : []
      );
    });
  });

  test("types the other concept callers and preserves labels", async () => {
    const concept = {
      value: "https://example.org/concepts/classification",
      label: "Classification",
    };
    const dataset = buildDataset({
      themes: [concept],
      healthTheme: [concept],
      healthCategory: [concept],
      publishers: [
        {
          name: "Example publisher",
          uri: "https://example.org/publisher",
          type: concept,
        },
      ],
    });
    const quads = await roundTrip(dataset);

    for (const [subject, predicate] of [
      [dataset.id, `${prefixes.dcat}theme`],
      [dataset.id, `${prefixes.healthdcatap}healthTheme`],
      [dataset.id, `${prefixes.healthdcatap}healthCategory`],
      ["https://example.org/publisher", `${prefixes.dct}type`],
    ]) {
      expect(getObjects(quads, subject, predicate)).toEqual([
        namedNode(concept.value),
      ]);
    }
    expect(getObjects(quads, concept.value, `${prefixes.rdf}type`)).toEqual([
      namedNode(`${prefixes.skos}Concept`),
    ]);
    expect(
      getObjects(quads, concept.value, `${prefixes.skos}prefLabel`)
    ).toMatchObject([
      { termType: "Literal", value: concept.label, language: "" },
    ]);
  });

  test("preserves non-URI concepts as literals and skips empty values", async () => {
    const dataset = buildDataset({
      dcatType: [
        { value: "Local category", label: "Unused label" },
        { value: "", label: "Empty" },
        { value: " ", label: "Whitespace" },
      ],
    });
    const quads = await roundTrip(dataset);

    expect(getObjects(quads, dataset.id, `${prefixes.dct}type`)).toMatchObject([
      { termType: "Literal", value: "Local category" },
    ]);
    expect(
      quads.some((quad) => quad.object.value === `${prefixes.skos}Concept`)
    ).toBe(false);
    expect(
      quads.some((quad) => quad.predicate.value === `${prefixes.skos}prefLabel`)
    ).toBe(false);
  });
});
