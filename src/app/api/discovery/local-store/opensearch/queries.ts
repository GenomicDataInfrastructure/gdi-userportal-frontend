// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  LocalDiscoveryDataset,
  LocalDiscoverySearchFacet,
  LocalDiscoverySearchOptions,
} from "@/app/api/discovery/local-store/types";

const fullTextSearchFields = [
  "title^3",
  "description",
  "populationCoverage",
  "provenance",
  "versionNotes",
];

const keywordSearchFields = ["id", "identifier", "catalogue", "version"];

const phrasePrefixFields = [
  "title^4",
  "description",
  "populationCoverage",
  "provenance",
  "versionNotes",
];

type OpenSearchQueryClause = Record<string, unknown>;
type OpenSearchSortClause = Record<string, unknown>;

type FieldConfig = {
  exactFields?: string[];
  textFields?: string[];
  rangeField?: string;
  sortField?: string;
};

const fieldConfigs: Record<string, FieldConfig> = {
  id: { exactFields: ["id"], sortField: "id" },
  identifier: {
    exactFields: ["identifier", "id"],
    textFields: ["identifier", "id"],
    sortField: "identifier",
  },
  title: {
    exactFields: ["title.keyword"],
    textFields: ["title"],
    sortField: "title.keyword",
  },
  description: { textFields: ["description"] },
  provenance: { textFields: ["provenance"] },
  catalogue: {
    exactFields: ["catalogue"],
    textFields: ["catalogue"],
    sortField: "catalogue",
  },
  languages: { exactFields: ["languages"] },
  theme: {
    exactFields: ["themes.value", "themes.label"],
    textFields: ["themes.label"],
  },
  keywords: { exactFields: ["keywords"], textFields: ["keywords"] },
  publisherName: {
    exactFields: ["publishers.name.keyword"],
    textFields: ["publishers.name"],
  },
  accessRights: {
    exactFields: ["accessRights.value", "accessRights.label"],
    textFields: ["accessRights.label"],
  },
  conformsTo: {
    exactFields: ["conformsTo.value", "conformsTo.label"],
    textFields: ["conformsTo.label"],
  },
  frequency: {
    exactFields: ["frequency.value", "frequency.label"],
    textFields: ["frequency.label"],
  },
  publisherType: {
    exactFields: ["publisherType.value", "publisherType.label"],
    textFields: ["publisherType.label"],
  },
  createdAt: {
    exactFields: ["createdAt"],
    rangeField: "createdAt",
    sortField: "createdAt",
  },
  issued: {
    exactFields: ["createdAt"],
    rangeField: "createdAt",
    sortField: "createdAt",
  },
  modified: {
    exactFields: ["modifiedAt"],
    rangeField: "modifiedAt",
    sortField: "modifiedAt",
  },
  temporalResolution: {
    exactFields: ["temporalResolution"],
    sortField: "temporalResolution",
  },
  numberOfRecords: {
    exactFields: ["numberOfRecords"],
    rangeField: "numberOfRecords",
    sortField: "numberOfRecords",
  },
  recordsCount: {
    exactFields: ["numberOfRecords"],
    rangeField: "numberOfRecords",
    sortField: "numberOfRecords",
  },
  distributionsCount: {
    exactFields: ["distributionsCount"],
    rangeField: "distributionsCount",
    sortField: "distributionsCount",
  },
  numberOfUniqueIndividuals: {
    exactFields: ["numberOfUniqueIndividuals"],
    rangeField: "numberOfUniqueIndividuals",
    sortField: "numberOfUniqueIndividuals",
  },
  maxTypicalAge: {
    exactFields: ["maxTypicalAge"],
    rangeField: "maxTypicalAge",
    sortField: "maxTypicalAge",
  },
  minTypicalAge: {
    exactFields: ["minTypicalAge"],
    rangeField: "minTypicalAge",
    sortField: "minTypicalAge",
  },
  spatialResolutionInMeters: {
    exactFields: ["spatialResolutionInMeters"],
    rangeField: "spatialResolutionInMeters",
    sortField: "spatialResolutionInMeters",
  },
};

const resolveFieldConfig = (key?: string): FieldConfig | null => {
  if (!key) return null;
  return (
    fieldConfigs[key] ?? {
      exactFields: [key],
      textFields: [key],
      sortField: key,
    }
  );
};

const buildShouldClause = (
  clauses: OpenSearchQueryClause[]
): OpenSearchQueryClause => {
  if (clauses.length === 1) {
    return clauses[0];
  }

  return {
    bool: {
      should: clauses,
      minimum_should_match: 1,
    },
  };
};

const buildExactMatchClause = (
  fields: string[] | undefined,
  value: string
): OpenSearchQueryClause | null => {
  if (!fields?.length) return null;

  return buildShouldClause(
    fields.flatMap((field) => {
      const clauses: OpenSearchQueryClause[] = [{ term: { [field]: value } }];

      if (field.endsWith(".keyword")) {
        clauses.push({
          match_phrase: { [field.slice(0, -".keyword".length)]: value },
        });
      }

      return clauses;
    })
  );
};

const buildTextMatchClause = (
  fields: string[] | undefined,
  value: string
): OpenSearchQueryClause | null => {
  if (!fields?.length) return null;

  return buildShouldClause(
    fields.map((field) => ({
      match_phrase_prefix: { [field]: value },
    }))
  );
};

const buildRangeClause = (
  field: string | undefined,
  operator: string | undefined,
  value: string,
  valueType: "number" | "datetime"
): OpenSearchQueryClause | null => {
  if (!field) return null;

  const trimmedValue = value.trim();
  if (!trimmedValue) return null;

  const normalizedValue =
    valueType === "number" ? Number(trimmedValue) : trimmedValue;

  if (
    valueType === "number" &&
    (Number.isNaN(normalizedValue) || !Number.isFinite(normalizedValue))
  ) {
    return null;
  }

  if (valueType === "datetime" && Number.isNaN(Date.parse(trimmedValue))) {
    return null;
  }

  switch (operator) {
    case ">":
      return { range: { [field]: { gt: normalizedValue } } };
    case ">=":
      return { range: { [field]: { gte: normalizedValue } } };
    case "<":
      return { range: { [field]: { lt: normalizedValue } } };
    case "<=":
      return { range: { [field]: { lte: normalizedValue } } };
    default:
      return { term: { [field]: normalizedValue } };
  }
};

const applyNegation = (
  clause: OpenSearchQueryClause | null,
  operator?: string
): OpenSearchQueryClause | null => {
  if (!clause) return null;
  if (operator !== "!") return clause;

  return {
    bool: {
      must_not: [clause],
    },
  };
};

const buildFacetClause = (
  facet: LocalDiscoverySearchFacet
): OpenSearchQueryClause | null => {
  const fieldConfig = resolveFieldConfig(facet.key);
  if (!fieldConfig) return null;

  switch (facet.type) {
    case "DROPDOWN": {
      if (!facet.value) return null;
      return applyNegation(
        buildExactMatchClause(fieldConfig.exactFields, facet.value),
        facet.operator
      );
    }
    case "FREE_TEXT": {
      if (!facet.value) return null;
      const clause =
        buildTextMatchClause(fieldConfig.textFields, facet.value) ??
        buildExactMatchClause(fieldConfig.exactFields, facet.value);
      return applyNegation(clause, facet.operator);
    }
    case "ENTRIES": {
      const entryValues = facet.entries
        ?.map((entry) => entry.value)
        .filter((value): value is string => Boolean(value));
      if (!entryValues?.length) return null;
      return applyNegation(
        buildShouldClause(
          entryValues
            .map((value) =>
              buildExactMatchClause(fieldConfig.exactFields, value)
            )
            .filter((clause): clause is OpenSearchQueryClause =>
              Boolean(clause)
            )
        ),
        facet.operator
      );
    }
    case "DATETIME": {
      if (!facet.value) return null;
      return applyNegation(
        buildRangeClause(
          fieldConfig.rangeField ?? fieldConfig.exactFields?.[0],
          facet.operator,
          facet.value,
          "datetime"
        ),
        facet.operator
      );
    }
    case "NUMBER": {
      if (!facet.value) return null;
      return applyNegation(
        buildRangeClause(
          fieldConfig.rangeField ?? fieldConfig.exactFields?.[0],
          facet.operator,
          facet.value,
          "number"
        ),
        facet.operator
      );
    }
    default:
      return null;
  }
};

const buildFacetFilterClauses = (
  facets: LocalDiscoverySearchFacet[] | undefined,
  operator: "OR" | "AND" | undefined
): OpenSearchQueryClause[] => {
  const clauses =
    facets
      ?.map(buildFacetClause)
      .filter((clause): clause is OpenSearchQueryClause => Boolean(clause)) ??
    [];

  if (!clauses.length) return [];
  if (operator === "OR") {
    return [
      {
        bool: {
          should: clauses,
          minimum_should_match: 1,
        },
      },
    ];
  }

  return clauses;
};

const buildSortClause = (sort?: string): OpenSearchSortClause[] => {
  if (sort === "newest") {
    return [{ createdAt: { order: "desc", missing: "_last" } }, { id: "asc" }];
  }

  return [
    { _score: "desc" },
    { modifiedAt: { order: "desc", missing: "_last" } },
    { id: "asc" },
  ];
};

export const createIndexMappings = () => ({
  mappings: {
    properties: {
      id: { type: "keyword" },
      identifier: { type: "keyword" },
      title: {
        type: "text",
        fields: {
          keyword: { type: "keyword" },
        },
      },
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
      provenance: { type: "text" },
      numberOfRecords: { type: "integer" },
      numberOfUniqueIndividuals: { type: "integer" },
      maxTypicalAge: { type: "integer" },
      minTypicalAge: { type: "integer" },
      populationCoverage: { type: "text" },
      spatialCoverage: { type: "object" },
      spatialResolutionInMeters: { type: "float" },
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
      codeValues: {
        properties: { value: { type: "keyword" }, label: { type: "keyword" } },
      },
      codingSystem: {
        properties: { value: { type: "keyword" }, label: { type: "keyword" } },
      },
      isReferencedBy: { type: "keyword" },
      dcatType: {
        properties: { value: { type: "keyword" }, label: { type: "keyword" } },
      },
      publishers: {
        type: "object",
        properties: {
          name: {
            type: "text",
            fields: {
              keyword: { type: "keyword" },
            },
          },
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
          name: {
            type: "text",
            fields: {
              keyword: { type: "keyword" },
            },
          },
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
          name: {
            type: "text",
            fields: {
              keyword: { type: "keyword" },
            },
          },
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
      conformsTo: {
        properties: { value: { type: "keyword" }, label: { type: "keyword" } },
      },
      legalBasis: {
        properties: { value: { type: "keyword" }, label: { type: "keyword" } },
      },
      applicableLegislation: {
        properties: { value: { type: "keyword" }, label: { type: "keyword" } },
      },
      dataDictionary: {
        type: "object",
        properties: {
          name: {
            type: "text",
            fields: { keyword: { type: "keyword" } },
          },
          type: { type: "keyword" },
          description: { type: "text" },
        },
      },
      personalData: {
        properties: { value: { type: "keyword" }, label: { type: "keyword" } },
      },
      purpose: {
        properties: { value: { type: "keyword" }, label: { type: "keyword" } },
      },
      distributionsCount: { type: "integer" },
    },
  },
});

export const buildSearchBody = (options: LocalDiscoverySearchOptions) => {
  const from = options.start ?? 0;
  const size = options.rows ?? 20;
  const query = options.query?.trim();
  const facetFilters = buildFacetFilterClauses(
    options.facets,
    options.operator
  );

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
    : null;

  const hasQuery = Boolean(queryClause);
  const hasFacetFilters = facetFilters.length > 0;

  const finalQuery =
    !hasQuery && !hasFacetFilters
      ? { match_all: {} }
      : {
          bool: {
            ...(queryClause ? { must: [queryClause] } : {}),
            ...(facetFilters.length ? { filter: facetFilters } : {}),
          },
        };

  return {
    from,
    size,
    query: finalQuery,
    sort: buildSortClause(options.sort),
  };
};

export const buildClearBody = () => ({
  query: { match_all: {} },
});

export const buildFilterValuesBody = (field: string, size = 1000) => ({
  size: 0,
  aggs: {
    values: {
      terms: {
        field,
        size,
        order: { _count: "desc" },
      },
    },
  },
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
