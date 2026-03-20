// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  LocalDiscoveryDataset,
  LocalDiscoverySearchOptions,
} from "@/app/api/discovery/local-store/types";

const fullTextSearchFields = [
  "title^3",
  "description",
  "populationCoverage",
  "versionNotes",
];

const keywordSearchFields = ["id", "identifier", "catalogue", "version"];

const phrasePrefixFields = [
  "title^4",
  "description",
  "populationCoverage",
  "versionNotes",
];

export const createIndexMappings = () => ({
  mappings: {
    properties: {
      id: { type: "keyword" },
      identifier: { type: "keyword" },
      title: { type: "text" },
      description: { type: "text" },
      catalogue: { type: "keyword" },
      languages: { type: "keyword" },
      createdAt: { type: "date" },
      modifiedAt: { type: "date" },
      version: { type: "keyword" },
      hasVersions: {
        properties: { value: { type: "keyword" }, label: { type: "keyword" } },
      },
      versionNotes: { type: "text" },
      numberOfRecords: { type: "integer" },
      numberOfUniqueIndividuals: { type: "integer" },
      maxTypicalAge: { type: "integer" },
      minTypicalAge: { type: "integer" },
      populationCoverage: { type: "text" },
      spatialCoverage: { type: "object" },
      spatialResolutionInMeters: { type: "keyword" },
      temporalCoverage: { type: "object" },
      retentionPeriod: { type: "object" },
      temporalResolution: { type: "keyword" },
      frequency: {
        properties: { value: { type: "keyword" }, label: { type: "keyword" } },
      },
      themes: {
        properties: { value: { type: "keyword" }, label: { type: "keyword" } },
      },
      keywords: { type: "keyword" },
      healthTheme: {
        properties: { value: { type: "keyword" }, label: { type: "keyword" } },
      },
      healthCategory: {
        properties: { value: { type: "keyword" }, label: { type: "keyword" } },
      },
      dcatType: {
        properties: { value: { type: "keyword" }, label: { type: "keyword" } },
      },
      publishers: {
        type: "object",
        properties: {
          name: { type: "text" },
          email: { type: "keyword" },
          url: { type: "keyword" },
          uri: { type: "keyword" },
          homepage: { type: "keyword" },
          identifier: { type: "keyword" },
          type: {
            properties: {
              value: { type: "keyword" },
              label: { type: "keyword" },
            },
          },
        },
      },
      hdab: {
        type: "object",
        properties: {
          name: { type: "text" },
          email: { type: "keyword" },
          url: { type: "keyword" },
          uri: { type: "keyword" },
          homepage: { type: "keyword" },
          identifier: { type: "keyword" },
          type: {
            properties: {
              value: { type: "keyword" },
              label: { type: "keyword" },
            },
          },
        },
      },
      creators: {
        type: "object",
        properties: {
          name: { type: "text" },
          email: { type: "keyword" },
          url: { type: "keyword" },
          uri: { type: "keyword" },
          homepage: { type: "keyword" },
          identifier: { type: "keyword" },
          type: {
            properties: {
              value: { type: "keyword" },
              label: { type: "keyword" },
            },
          },
        },
      },
      publisherType: {
        type: "object",
        properties: {
          value: { type: "keyword" },
          label: { type: "keyword" },
        },
      },
      accessRights: {
        properties: { value: { type: "keyword" }, label: { type: "keyword" } },
      },
      legalBasis: {
        properties: { value: { type: "keyword" }, label: { type: "keyword" } },
      },
      applicableLegislation: {
        properties: { value: { type: "keyword" }, label: { type: "keyword" } },
      },
    },
  },
});

export const buildSearchBody = (options: LocalDiscoverySearchOptions) => {
  const from = options.start ?? 0;
  const size = options.rows ?? 20;
  const query = options.query?.trim();

  const queryClause = query
    ? {
        bool: {
          should: [
            {
              multi_match: {
                query,
                fields: [...fullTextSearchFields, ...keywordSearchFields],
                fuzziness: "AUTO",
              },
            },
            {
              multi_match: {
                query,
                fields: phrasePrefixFields,
                type: "phrase_prefix",
              },
            },
          ],
          minimum_should_match: 1,
        },
      }
    : { match_all: {} };

  return {
    from,
    size,
    query: queryClause,
    sort: buildSortClause(options.sort),
  };
};

const buildSortClause = (sort?: string) => {
  if (sort === "newest") {
    return [{ createdAt: { order: "desc", missing: "_last" } }, { id: "asc" }];
  }

  return [
    { _score: "desc" },
    { modifiedAt: { order: "desc", missing: "_last" } },
    { id: "asc" },
  ];
};

export const buildClearBody = () => ({
  query: { match_all: {} },
});

export const buildBulkUpsertBody = (
  indexName: string,
  datasets: LocalDiscoveryDataset[]
): string =>
  datasets
    .map(
      (dataset) =>
        `${JSON.stringify({ index: { _index: indexName, _id: dataset.id } })}\n${JSON.stringify(dataset)}`
    )
    .join("\n")
    .concat("\n");
