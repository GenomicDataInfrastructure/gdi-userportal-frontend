// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  LocalDiscoveryDataset,
  LocalDiscoverySearchOptions,
} from "@/app/api/discovery/local-store/types";

export const createIndexMappings = () => ({
  mappings: {
    properties: {
      id: { type: "keyword" },
      identifier: { type: "keyword" },
      title: { type: "text" },
      description: { type: "text" },
      catalogue: { type: "keyword" },
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
                fields: [
                  "title^3",
                  "description",
                  "id",
                  "identifier",
                  "catalogue",
                ],
                fuzziness: "AUTO",
              },
            },
            {
              multi_match: {
                query,
                fields: ["title^4", "description", "identifier", "catalogue"],
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
    sort: [{ _score: "desc" }, { id: "asc" }],
  };
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
