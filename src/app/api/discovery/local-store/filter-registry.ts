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

const mapBucketToValueLabel = (
  bucketKey: string
): LocalDiscoveryValueLabel => ({
  value: bucketKey,
  label: bucketKey,
});

const createDropdownFilter = ({
  group,
  key,
  label,
  field,
  mapBucket,
}: {
  group: string;
  key: string;
  label: string;
  field: string;
  mapBucket?: LocalFilterBucketMapper;
}): LocalFilterDefinition => ({
  source: "ckan",
  group,
  type: "DROPDOWN",
  key,
  label,
  aggregation: {
    field,
    mapBucket,
  },
});

const createOperatorFilter = ({
  group,
  type,
  key,
  label,
  operators,
}: {
  group: string;
  type: "NUMBER" | "DATETIME";
  key: string;
  label: string;
  operators: LocalDiscoveryOperator[];
}): LocalFilterDefinition => ({
  source: "ckan",
  group,
  type,
  key,
  label,
  operators,
});

const localFilterDefinitions: LocalFilterDefinition[] = [
  createDropdownFilter({
    group: "Catalogue",
    key: "theme",
    label: "Theme",
    field: "themes.label",
    mapBucket: mapBucketToValueLabel,
  }),
  createDropdownFilter({
    group: "Catalogue",
    key: "publisher_name",
    label: "Publisher",
    field: "publishers.name.keyword",
  }),
  createDropdownFilter({
    group: "Catalogue",
    key: "languages",
    label: "Language",
    field: "languages",
    mapBucket: (bucketKey) => ({
      value: bucketKey,
      label:
        formatDatasetLanguage(bucketKey) ??
        bucketKey.split("/").pop() ??
        bucketKey,
    }),
  }),
  createDropdownFilter({
    group: "Catalogue",
    key: "catalogue",
    label: "Catalogue",
    field: "catalogue",
  }),
  createDropdownFilter({
    group: "Access",
    key: "accessRights",
    label: "Access rights",
    field: "accessRights.label",
    mapBucket: mapBucketToValueLabel,
  }),
  createDropdownFilter({
    group: "Standards",
    key: "conformsTo",
    label: "Conforms to",
    field: "conformsTo.label",
    mapBucket: mapBucketToValueLabel,
  }),
  createDropdownFilter({
    group: "Health",
    key: "healthTheme",
    label: "Health theme",
    field: "healthTheme.label",
    mapBucket: mapBucketToValueLabel,
  }),
  createDropdownFilter({
    group: "Health",
    key: "healthCategory",
    label: "Health category",
    field: "healthCategory.label",
    mapBucket: mapBucketToValueLabel,
  }),
  createOperatorFilter({
    group: "Population",
    type: "NUMBER",
    key: "numberOfUniqueIndividuals",
    label: "Unique individuals",
    operators: comparisonOperators,
  }),
  createOperatorFilter({
    group: "Dates",
    type: "DATETIME",
    key: "metadata_modified",
    label: "Modified date",
    operators: [...comparisonOperators, "!"],
  }),
];

const stripAggregation = ({
  aggregation: _aggregation,
  ...filter
}: LocalFilterDefinition): LocalDiscoveryFilter => filter;

export const listLocalFilters = (): LocalDiscoveryFilter[] =>
  localFilterDefinitions.map(stripAggregation);

export const getLocalFilterDefinition = (
  key: string
): LocalFilterDefinition | undefined =>
  localFilterDefinitions.find((definition) => definition.key === key);
