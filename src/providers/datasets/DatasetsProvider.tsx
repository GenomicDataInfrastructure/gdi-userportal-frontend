// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { AxiosError } from "axios";
import { useSearchParams } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import {
  DatasetsAction,
  DatasetsActionType,
  DatasetsState,
} from "./DatasetProvider.types";
import { useFilters } from "@/providers/filters/FilterProvider";
import { searchDatasetsApi } from "../../app/api/discovery";
import {
  DatasetSearchQuery,
  DatasetSearchQueryFacet,
  Operator,
} from "@/app/api/discovery/open-api/schemas";
import { ActiveFilter } from "@/providers/filters/FilterProvider.types";
import { FilterType } from "@/app/api/discovery/additional-types";

function convertActiveFiltersToFacets(
  activeFilters: ActiveFilter[]
): DatasetSearchQueryFacet[] {
  return activeFilters
    .map((filter) => {
      const baseFacet = {
        source: filter.source,
        type: filter.type,
        key: filter.key,
      };

      if (filter.type === FilterType.ENTRIES) {
        return {
          ...baseFacet,
          entries: filter.entries,
        };
      }

      return filter.values!.map(
        (value: { value: string; label?: string; operator?: Operator }) => ({
          ...baseFacet,
          value: value.value,
          operator: value.operator,
        })
      );
    })
    .flat();
}

const DatasetsContext = createContext<DatasetsState | undefined>(undefined);

function reducer(state: DatasetsState, action: DatasetsAction): DatasetsState {
  switch (action.type) {
    case DatasetsActionType.LOADING:
      return { ...state, isLoading: true };
    case DatasetsActionType.DATASETS_LOADED:
      return {
        ...state,
        isLoading: false,
        datasets: action.payload?.datasets,
        datasetCount: action.payload?.datasetCount,
      };
    case DatasetsActionType.REJECTED:
      return {
        ...state,
        isLoading: false,
        errorCode: action.payload?.errorCode,
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

const DATASET_PER_PAGE = 12;

const initialState = {
  datasets: undefined,
  datasetCount: undefined,
  isLoading: false,
  errorCode: undefined,
};

export default function DatasetsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryParams = useSearchParams();
  const { activeFilters } = useFilters();
  const [{ datasets, datasetCount, isLoading, errorCode }, dispatch] =
    useReducer(reducer, initialState);

  const fetchDatasets = useCallback(async () => {
    dispatch({ type: DatasetsActionType.LOADING });

    const query = queryParams || new URLSearchParams();
    const options: DatasetSearchQuery = {
      query: query.get("q") || undefined,
      facets: convertActiveFiltersToFacets(activeFilters),
      sort: query.get("sort") || "score desc, metadata_modified desc",
      start: query.get("page")
        ? (Number(query.get("page")) - 1) * DATASET_PER_PAGE
        : 0,
      rows: DATASET_PER_PAGE,
    };

    try {
      const data = await searchDatasetsApi(options);
      dispatch({
        type: DatasetsActionType.DATASETS_LOADED,
        payload: {
          datasets: data.results,
          datasetCount: data.count,
        },
      });
    } catch (error) {
      const errorCode =
        error instanceof AxiosError ? error.response?.status : 500;
      dispatch({
        type: DatasetsActionType.REJECTED,
        payload: { errorCode },
      });
      console.error(error);
    }
  }, [queryParams, activeFilters]);

  useEffect(() => {
    fetchDatasets();
  }, [queryParams, fetchDatasets, activeFilters]);

  return (
    <DatasetsContext.Provider
      value={{
        datasets,
        datasetCount,
        isLoading,
        errorCode,
      }}
    >
      {children}
    </DatasetsContext.Provider>
  );
}

function useDatasets() {
  const context = useContext(DatasetsContext);
  if (context === undefined) {
    throw new Error("useDatasets must be used within a DatasetsProvider");
  }
  return context;
}

export { DATASET_PER_PAGE, DatasetsProvider, useDatasets };
