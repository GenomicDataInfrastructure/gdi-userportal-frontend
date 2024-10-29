// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

// import { ValueLabel } from "@/services/discovery/types/datasetSearch.types";
// import { Filter } from "@/services/discovery/types/filter.type";

// export interface Option {
//   value: string;
//   label?: string;
//   disable?: boolean;
//   fixed?: boolean;
//   [key: string]: string | boolean | undefined;
// }

// export type FilterItemProps = {
//   field: string;
//   label: string;
//   groupKey: string;
//   data: Option[];
// };

// function convertDataToFilterItemProps(filters: Filter[]): FilterItemProps[] {
//   return filters.map((filter: Filter) => {
//     return {
//       field: filter.key,
//       label: filter.label,
//       groupKey: filter.source,
//       data: filter.values.map((vl: ValueLabel) => {
//         return {
//           label: vl.label,
//           value: vl.value,
//         };
//       }),
//     };
//   });
// }

// export { convertDataToFilterItemProps };
