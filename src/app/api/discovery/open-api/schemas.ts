import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

type DatasetSearchQuery = Partial<{
  query: string;
  facets: Array<DatasetSearchQueryFacet>;
  sort: string;
  rows: number;
  start: number;
  operator: QueryOperator;
}>;
type DatasetSearchQueryFacet = {
  source: string;
  type: FilterType;
  key?: string | undefined;
  value?: string | undefined;
  operator?: Operator | undefined;
  entries?: Array<QueryEntry> | undefined;
};
type FilterType = "DROPDOWN" | "FREE_TEXT" | "ENTRIES";
type Operator = "=" | ">" | "<" | "!=" | "%";
type QueryEntry = {
  key: string;
  value: string;
};
type QueryOperator = "OR" | "AND";
type SearchedDataset = {
  id: string;
  identifier?: string | undefined;
  title: string;
  description: string;
  publishers?: Array<Agent> | undefined;
  themes?: Array<ValueLabel> | undefined;
  keywords?: Array<ValueLabel> | undefined;
  catalogue?: string | undefined;
  modifiedAt?: string | undefined;
  createdAt?: string | undefined;
  recordsCount?: number | undefined;
  distributionsCount?: number | undefined;
};
type Agent = {
  name: string;
  email?: string | undefined;
  url?: string | undefined;
  type?: string | undefined;
  identifier?: string | undefined;
};
type ValueLabel = {
  value: string;
  label: string;
  count?: number | undefined;
};
type DatasetsSearchResponse = Partial<{
  count: number;
  results: Array<SearchedDataset>;
}>;
type RetrievedDataset = {
  id: string;
  identifier?: string | undefined;
  title: string;
  description: string;
  themes?: Array<ValueLabel> | undefined;
  contacts?: Array<ContactPoint> | undefined;
  datasetRelationships?: Array<DatasetRelationEntry> | undefined;
  dataDictionary?: Array<DatasetDictionaryEntry> | undefined;
  catalogue?: string | undefined;
  createdAt?: string | undefined;
  modifiedAt?: string | undefined;
  url?: string | undefined;
  languages?: Array<ValueLabel> | undefined;
  creators?: Array<Agent> | undefined;
  publishers?: Array<Agent> | undefined;
  hasVersions?: Array<ValueLabel> | undefined;
  accessRights?: ValueLabel | undefined;
  conformsTo?: Array<ValueLabel> | undefined;
  keywords?: Array<ValueLabel> | undefined;
  provenance?: string | undefined;
  spatial?: ValueLabel | undefined;
  distributions?: Array<RetrievedDistribution> | undefined;
};
type ContactPoint = {
  name: string;
  email: string;
  uri?: string | undefined;
};
type DatasetRelationEntry = {
  relation: string;
  target: string;
};
type DatasetDictionaryEntry = {
  name: string;
  type: string;
  description: string;
};
type RetrievedDistribution = {
  id: string;
  title: string;
  description: string;
  format?: ValueLabel | undefined;
  accessUrl?: string | undefined;
  downloadUrl?: string | undefined;
  createdAt?: string | undefined;
  modifiedAt?: string | undefined;
  languages?: Array<ValueLabel> | undefined;
};
type Filter = {
  source: string;
  group?: string | undefined;
  type: FilterType;
  key: string;
  label: string;
  values?: Array<ValueLabel> | undefined;
  operators?: Array<Operator> | undefined;
  entries?: Array<FilterEntry> | undefined;
};
type FilterEntry = {
  key: string;
  label: string;
};

const FilterType = z.enum(["DROPDOWN", "FREE_TEXT", "ENTRIES"]);
const Operator = z.enum(["=", ">", "<", "!=", "%"]);
const QueryEntry = z
  .object({ key: z.string(), value: z.string() })
  .passthrough();
const DatasetSearchQueryFacet: z.ZodType<DatasetSearchQueryFacet> = z
  .object({
    source: z.string(),
    type: FilterType,
    key: z.string().optional(),
    value: z.string().optional(),
    operator: Operator.optional(),
    entries: z.array(QueryEntry).optional(),
  })
  .passthrough();
const QueryOperator = z.enum(["OR", "AND"]);
const DatasetSearchQuery: z.ZodType<DatasetSearchQuery> = z
  .object({
    query: z.string(),
    facets: z.array(DatasetSearchQueryFacet),
    sort: z.string().default("score desc, metadata_modified desc"),
    rows: z.number().int().gte(0).lte(1000).default(10),
    start: z.number().int().gte(0).default(0),
    operator: QueryOperator,
  })
  .partial()
  .passthrough();
const Agent = z
  .object({
    name: z.string(),
    email: z.string().optional(),
    url: z.string().optional(),
    type: z.string().optional(),
    identifier: z.string().optional(),
  })
  .passthrough();
const ValueLabel = z
  .object({
    value: z.string(),
    label: z.string(),
    count: z.number().int().optional(),
  })
  .passthrough();
const SearchedDataset: z.ZodType<SearchedDataset> = z
  .object({
    id: z.string(),
    identifier: z.string().optional(),
    title: z.string(),
    description: z.string(),
    publishers: z.array(Agent).optional(),
    themes: z.array(ValueLabel).optional(),
    keywords: z.array(ValueLabel).optional(),
    catalogue: z.string().optional(),
    modifiedAt: z.string().datetime({ offset: true }).optional(),
    createdAt: z.string().datetime({ offset: true }).optional(),
    recordsCount: z.number().int().optional(),
    distributionsCount: z.number().int().optional(),
  })
  .passthrough();
const DatasetsSearchResponse: z.ZodType<DatasetsSearchResponse> = z
  .object({ count: z.number().int(), results: z.array(SearchedDataset) })
  .partial()
  .passthrough();
const ContactPoint = z
  .object({ name: z.string(), email: z.string(), uri: z.string().optional() })
  .passthrough();
const DatasetRelationEntry = z
  .object({ relation: z.string(), target: z.string() })
  .passthrough();
const DatasetDictionaryEntry = z
  .object({ name: z.string(), type: z.string(), description: z.string() })
  .passthrough();
const RetrievedDistribution: z.ZodType<RetrievedDistribution> = z
  .object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    format: ValueLabel.optional(),
    accessUrl: z.string().optional(),
    downloadUrl: z.string().optional(),
    createdAt: z.string().datetime({ offset: true }).optional(),
    modifiedAt: z.string().datetime({ offset: true }).optional(),
    languages: z.array(ValueLabel).optional(),
  })
  .passthrough();
const RetrievedDataset: z.ZodType<RetrievedDataset> = z
  .object({
    id: z.string(),
    identifier: z.string().optional(),
    title: z.string(),
    description: z.string(),
    themes: z.array(ValueLabel).optional(),
    contacts: z.array(ContactPoint).optional(),
    datasetRelationships: z.array(DatasetRelationEntry).optional(),
    dataDictionary: z.array(DatasetDictionaryEntry).optional(),
    catalogue: z.string().optional(),
    createdAt: z.string().datetime({ offset: true }).optional(),
    modifiedAt: z.string().datetime({ offset: true }).optional(),
    url: z.string().optional(),
    languages: z.array(ValueLabel).optional(),
    creators: z.array(Agent).optional(),
    publishers: z.array(Agent).optional(),
    hasVersions: z.array(ValueLabel).optional(),
    accessRights: ValueLabel.optional(),
    conformsTo: z.array(ValueLabel).optional(),
    keywords: z.array(ValueLabel).optional(),
    provenance: z.string().optional(),
    spatial: ValueLabel.optional(),
    distributions: z.array(RetrievedDistribution).optional(),
  })
  .passthrough();
const ErrorResponse = z
  .object({
    title: z.string(),
    status: z.number().int(),
    detail: z.string().optional(),
  })
  .passthrough();
const FilterEntry = z
  .object({ key: z.string(), label: z.string() })
  .passthrough();
const Filter: z.ZodType<Filter> = z
  .object({
    source: z.string(),
    group: z.string().optional(),
    type: FilterType,
    key: z.string(),
    label: z.string(),
    values: z.array(ValueLabel).optional(),
    operators: z.array(Operator).optional(),
    entries: z.array(FilterEntry).optional(),
  })
  .passthrough();

export {
  FilterType,
  Operator,
  QueryEntry,
  DatasetSearchQueryFacet,
  QueryOperator,
  DatasetSearchQuery,
  Agent,
  ValueLabel,
  SearchedDataset,
  DatasetsSearchResponse,
  ContactPoint,
  DatasetRelationEntry,
  DatasetDictionaryEntry,
  RetrievedDistribution,
  RetrievedDataset,
  ErrorResponse,
  FilterEntry,
  Filter,
};

export const schemas = {
  FilterType,
  Operator,
  QueryEntry,
  DatasetSearchQueryFacet,
  QueryOperator,
  DatasetSearchQuery,
  Agent,
  ValueLabel,
  SearchedDataset,
  DatasetsSearchResponse,
  ContactPoint,
  DatasetRelationEntry,
  DatasetDictionaryEntry,
  RetrievedDistribution,
  RetrievedDataset,
  ErrorResponse,
  FilterEntry,
  Filter,
};

const endpoints = makeApi([
  {
    method: "get",
    path: "/api/v1/datasets/:id",
    alias: "retrieve_dataset",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: RetrievedDataset,
    errors: [
      {
        status: 404,
        description: `Dataset not found`,
        schema: z
          .object({
            title: z.string(),
            status: z.number().int(),
            detail: z.string().optional(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/datasets/:id.:format",
    alias: "retrieve_dataset_in_format",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "format",
        type: "Path",
        schema: z.enum(["jsonld", "rdf", "ttl"]),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 404,
        description: `Dataset not found`,
        schema: z
          .object({
            title: z.string(),
            status: z.number().int(),
            detail: z.string().optional(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "post",
    path: "/api/v1/datasets/search",
    alias: "dataset_search",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: DatasetSearchQuery,
      },
    ],
    response: DatasetsSearchResponse,
  },
  {
    method: "get",
    path: "/api/v1/filters",
    alias: "retrieve_filters",
    requestFormat: "json",
    response: z.array(Filter),
  },
  {
    method: "get",
    path: "/api/v1/filters/:key/values",
    alias: "retrieve_filter_values",
    requestFormat: "json",
    parameters: [
      {
        name: "key",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.array(ValueLabel),
  },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
