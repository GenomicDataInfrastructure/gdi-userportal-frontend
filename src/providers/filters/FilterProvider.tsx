// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import React, { createContext, useContext, useEffect, useReducer } from "react";
import { AxiosError } from "axios";
import { retrieveFiltersApi } from "../../app/api/discovery";
import { Filter } from "@/app/api/discovery/open-api/schemas";
import {
  ActiveFilter,
  FilterAction,
  FilterActionType,
  FilterContextReturnType,
  FilterContextState,
} from "@/providers/filters/FilterProvider.types";

function reducer(
  state: FilterContextState,
  action: FilterAction
): FilterContextState {
  switch (action.type) {
    case FilterActionType.FILTERS_RETRIEVED: {
      return {
        ...state,
        filters: action.payload as Filter[],
        isLoading: false,
        error: null,
      };
    }
    case FilterActionType.ACTIVE_FILTER_ADDED: {
      const newActiveFilter = action.payload as ActiveFilter;
      const existingIndex = state.activeFilters.findIndex(
        (f) =>
          f.key === newActiveFilter.key && f.source === newActiveFilter.source
      );

      const originalFilter = state.filters.find(
        (f) =>
          f.key === newActiveFilter.key && f.source === newActiveFilter.source
      );

      const valuesWithLabels = newActiveFilter.values?.map((v) => {
        const originalValue = originalFilter?.values?.find(
          (ov) => ov.value === v.value
        );
        return {
          ...v,
          label: originalValue?.label || v.label || v.value,
        };
      });

      const updatedFilter = {
        ...newActiveFilter,
        values: valuesWithLabels,
      };

      return {
        ...state,
        activeFilters:
          existingIndex >= 0
            ? state.activeFilters.map((f, i) =>
              i === existingIndex ? updatedFilter : f
            )
            : [...state.activeFilters, updatedFilter],
        error: null,
      };
    }
    case FilterActionType.ACTIVE_FILTER_REMOVED: {
      const { key, source } = action.payload as { key: string; source: string };
      return {
        ...state,
        activeFilters: state.activeFilters.filter(
          (f) => f.key !== key || f.source !== source
        ),
        isLoading: false,
        error: null,
      };
    }
    case FilterActionType.ACTIVE_FILTERS_CLEARED: {
      return {
        ...state,
        activeFilters: [],
        isLoading: false,
        error: null,
      };
    }
    case FilterActionType.LOADING: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case FilterActionType.REJECTED: {
      return {
        ...state,
        isLoading: false,
        error: action.payload as { message: string; statusCode: number },
      };
    }
    default:
      return state;
  }
}

function FilterProvider({ children }: { children: React.ReactNode }) {
  const initialState = {
    filters: [],
    activeFilters: [],
    isLoading: false,
    error: null,
  } as FilterContextState;

  const [{ filters, activeFilters, isLoading, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const retrieveFilters = async () => {
    dispatch({ type: FilterActionType.LOADING });

    try {
      const filters = await retrieveFiltersApi();
      dispatch({ type: FilterActionType.FILTERS_RETRIEVED, payload: filters });
    } catch (error) {
      const message =
        error instanceof AxiosError ? error.message : "An error occurred";
      const statusCode =
        error instanceof AxiosError ? error.response?.status : 500;

      dispatch({
        type: FilterActionType.REJECTED,
        payload: { message, statusCode },
      });
    }
  };

  useEffect(() => {
    retrieveFilters();
  }, []);

  const addActiveFilter = (filter: ActiveFilter) => {
    dispatch({ type: FilterActionType.ACTIVE_FILTER_ADDED, payload: filter });
  };

  const removeActiveFilter = (key: string, source: string) => {
    dispatch({
      type: FilterActionType.ACTIVE_FILTER_REMOVED,
      payload: { key, source },
    });
  };

  const clearActiveFilters = () => {
    dispatch({ type: FilterActionType.ACTIVE_FILTERS_CLEARED });
  };

  return (
    <FilterContext.Provider
      value={{
        filters,
        activeFilters,
        isLoading,
        error,
        addActiveFilter,
        removeActiveFilter,
        clearActiveFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

const FilterContext = createContext<FilterContextReturnType | undefined>(
  undefined
);

function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error("useFilters must be used within a FilterProvider");
  }
  return context;
}

export { FilterProvider, useFilters };
