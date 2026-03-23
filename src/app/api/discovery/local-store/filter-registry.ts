// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import formatDatasetLanguage from "@/utils/formatDatasetLanguage";
import {
  LocalDiscoveryFilter,
  LocalDiscoveryOperator,
  LocalDiscoveryValueLabel,
} from "@/app/api/discovery/local-store/types";

type LocalFilterBucketMapper = (bucketKey: string) => LocalDiscoveryValueLabel;

type LocalFilterAggregation = {
  field: string;
  size?: number;
  mapBucket?: LocalFilterBucketMapper;
};

export type LocalFilterDefinition = LocalDiscoveryFilter & {
  aggregation?: LocalFilterAggregation;
};

const comparisonOperators: LocalDiscoveryOperator[] = [
  "=",
  ">",
  "<",
  ">=",
  "<=",
];

const localFilterDefinitions: LocalFilterDefinition[] = [
  {
    source: "ckan",
    group: "Catalogue",
    type: "DROPDOWN",
    key: "theme",
    label: "Theme",
    aggregation: {
      field: "themes.label",
      mapBucket: (bucketKey) => ({ value: bucketKey, label: bucketKey }),
    },
  },
  {
    source: "ckan",
    group: "Catalogue",
    type: "DROPDOWN",
    key: "publisher_name",
    label: "Publisher",
    aggregation: {
      field: "publishers.name.keyword",
    },
  },
  {
    source: "ckan",
    group: "Catalogue",
    type: "DROPDOWN",
    key: "languages",
    label: "Language",
    aggregation: {
      field: "languages",
      mapBucket: (bucketKey) => ({
        value: bucketKey,
        label:
          formatDatasetLanguage(bucketKey) ??
          bucketKey.split("/").pop() ??
          bucketKey,
      }),
    },
  },
  {
    source: "ckan",
    group: "Catalogue",
    type: "DROPDOWN",
    key: "catalogue",
    label: "Catalogue",
    aggregation: {
      field: "catalogue",
    },
  },
  {
    source: "ckan",
    group: "Access",
    type: "DROPDOWN",
    key: "accessRights",
    label: "Access rights",
    aggregation: {
      field: "accessRights.label",
      mapBucket: (bucketKey) => ({ value: bucketKey, label: bucketKey }),
    },
  },
  {
    source: "ckan",
    group: "Standards",
    type: "DROPDOWN",
    key: "conformsTo",
    label: "Conforms to",
    aggregation: {
      field: "conformsTo.label",
      mapBucket: (bucketKey) => ({ value: bucketKey, label: bucketKey }),
    },
  },
  {
    source: "ckan",
    group: "Health",
    type: "DROPDOWN",
    key: "healthTheme",
    label: "Health theme",
    aggregation: {
      field: "healthTheme.label",
      mapBucket: (bucketKey) => ({ value: bucketKey, label: bucketKey }),
    },
  },
  {
    source: "ckan",
    group: "Health",
    type: "DROPDOWN",
    key: "healthCategory",
    label: "Health category",
    aggregation: {
      field: "healthCategory.label",
      mapBucket: (bucketKey) => ({ value: bucketKey, label: bucketKey }),
    },
  },
  {
    source: "ckan",
    group: "Population",
    type: "NUMBER",
    key: "numberOfUniqueIndividuals",
    label: "Unique individuals",
    operators: comparisonOperators,
  },
  {
    source: "ckan",
    group: "Dates",
    type: "DATETIME",
    key: "metadata_modified",
    label: "Modified date",
    operators: [...comparisonOperators, "!"],
  },
];

const stripAggregation = ({
  aggregation: _aggregation,
  ...filter
}: LocalFilterDefinition): LocalDiscoveryFilter => filter;

export const listLocalFilterDefinitions = (): LocalFilterDefinition[] =>
  localFilterDefinitions.map((definition) => ({ ...definition }));

export const listLocalFilters = (): LocalDiscoveryFilter[] =>
  localFilterDefinitions.map(stripAggregation);

export const getLocalFilterDefinition = (
  key: string
): LocalFilterDefinition | undefined =>
  localFilterDefinitions.find((definition) => definition.key === key);
