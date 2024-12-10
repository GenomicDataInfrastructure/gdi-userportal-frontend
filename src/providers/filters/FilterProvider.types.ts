// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  Filter,
  FilterType,
  Operator,
} from "@/app/api/discovery/open-api/schemas";

export type FilterContextState = {
  filters: Filter[];
  activeFilters: ActiveFilter[];
  isLoading: boolean;
  error: { message: string; statusCode: number } | null;
};

export type FilterContextReturnType = FilterContextState & {
  addActiveFilter: (filter: ActiveFilter) => void;
  removeActiveFilter: (key: string, source: string) => void;
  clearActiveFilters: () => void;
};

export enum FilterActionType {
  FILTERS_RETRIEVED,
  ACTIVE_FILTER_ADDED,
  ACTIVE_FILTER_REMOVED,
  ACTIVE_FILTERS_CLEARED,
  ACTIVE_VALUE_REMOVED,
  LOADING,
  REJECTED,
}

export type FilterAction = {
  type: FilterActionType;
  payload?: unknown;
};

export type ActiveFilter = {
  source: string;
  type: FilterType;
  key: string;
  label: string;
  values?: { value: string; label?: string; operator?: Operator }[];
  entries?: ActiveFilterEntry[];
};

export type ActiveFilterEntry = {
  key: string;
  label: string;
  value: string;
};
