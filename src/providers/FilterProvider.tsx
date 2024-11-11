// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { ActiveFilter, Filter } from "@/services/discovery/types/filter.type";
import React, { createContext, useContext, useEffect, useReducer } from "react";

type FilterContextState = {
  filters: Filter[];
  activeFilters: ActiveFilter[];
  isLoading: boolean;
  error: { message: string; statusCode: number } | null;
};

type FilterContextReturnType = FilterContextState & {
  addActiveFilter: (filter: ActiveFilter) => void;
  removeActiveFilter: (key: string, source: string) => void;
  clearActiveFilters: () => void;
};

enum FilterActionType {
  FILTERS_RETRIEVED,
  ACTIVE_FILTER_ADDED,
  ACTIVE_FILTER_REMOVED,
  ACTIVE_FILTERS_CLEARED,
  ACTIVE_VALUE_REMOVED,
  LOADING,
  REJECTED,
}

type FilterAction = {
  type: FilterActionType;
  payload?: unknown;
};

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

      return {
        ...state,
        activeFilters:
          existingIndex >= 0
            ? state.activeFilters.map((f, i) =>
                i === existingIndex ? newActiveFilter : f
              )
            : [...state.activeFilters, newActiveFilter],
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

  useEffect(() => {
    retrieveFilters();
  }, []);

  const retrieveFilters = async () => {
    dispatch({ type: FilterActionType.LOADING });
    const response = await fetch("api/filters");

    if (!response.ok) {
      dispatch({
        type: FilterActionType.REJECTED,
        payload: { message: response.statusText, statusCode: response.status },
      });
    }

    const filters = await response.json();
    dispatch({ type: FilterActionType.FILTERS_RETRIEVED, payload: filters });
  };

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
