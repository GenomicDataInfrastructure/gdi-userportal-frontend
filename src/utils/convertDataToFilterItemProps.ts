// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  Facet,
  FacetGroup,
  ValueLabel,
} from "@/services/discovery/types/datasetSearch.types";

export interface Option {
  value: string;
  label?: string;
  disable?: boolean;
  fixed?: boolean;
  [key: string]: string | boolean | undefined;
}

export type FilterItemProps = {
  field: string;
  label: string;
  groupKey: string;
  data: Option[];
};

function convertDataToFilterItemProps(
  facetGroup: FacetGroup
): FilterItemProps[] {
  return facetGroup.facets.map((facet: Facet) => {
    return {
      field: facet.key,
      label: facet.label,
      groupKey: facetGroup.key,
      data: facet.values.map((vl: ValueLabel) => {
        return {
          label: vl.label,
          value: vl.value,
        };
      }),
    };
  });
}

export { convertDataToFilterItemProps };
