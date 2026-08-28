// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

export type HarvesterErrorCategory =
  | "sourceUnreachable"
  | "sourceNotFound"
  | "invalidXml"
  | "authorizationFailed"
  | "indexUnavailable"
  | "datasetMappingFailed"
  | "unknown";

const CATEGORY_MATCHERS: { category: HarvesterErrorCategory; test: RegExp }[] =
  [
    {
      category: "sourceNotFound",
      test: /ENOENT|no such file or directory|Failed to read DCAT catalogue file/i,
    },
    {
      category: "invalidXml",
      test: /Failed to parse RDF|unexpected close tag|unclosed tag|invalid xml/i,
    },
    {
      category: "authorizationFailed",
      test: /Failed to prepare authorization|unauthorized|401|403/i,
    },
    {
      category: "sourceUnreachable",
      test: /Failed to download DCAT catalogue|Failed to fetch DCAT catalogue|Failed to read DCAT catalogue response body|ECONNREFUSED|ETIMEDOUT|ENOTFOUND/i,
    },
    {
      category: "indexUnavailable",
      test: /Failed to clear the local discovery index|Failed to index .* harvested datasets|OpenSearch/i,
    },
  ];

export function classifyHarvesterError(
  message: string,
  subjectId?: string
): HarvesterErrorCategory {
  if (subjectId) {
    return "datasetMappingFailed";
  }

  for (const { category, test } of CATEGORY_MATCHERS) {
    if (test.test(message)) {
      return category;
    }
  }
  return "unknown";
}
