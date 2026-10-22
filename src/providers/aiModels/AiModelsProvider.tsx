// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { AxiosError } from "axios";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import {
  AiModelsAction,
  AiModelsActionType,
  AiModelsState,
} from "./AiModelProvider.types";
import { searchAiModelsApi } from "@/app/api/discovery";
import {
  DiscoveryAiModelSearchQuery,
  DiscoverySearchFacet,
} from "@/app/api/discovery/providers/types";
import { useFilters } from "@/providers/filters/FilterProvider";
import { ActiveFilter } from "@/providers/filters/FilterProvider.types";
import { FilterType } from "@/app/api/discovery/additional-types";
import { UrlSearchParams } from "@/app/params";

function convertActiveFiltersToFacets(
  activeFilters: ActiveFilter[]
): DiscoverySearchFacet[] {
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

      return filter.values!.map((value) => ({
        ...baseFacet,
        value: value.value,
        operator: value.operator,
      }));
    })
    .flat();
}

const AiModelsContext = createContext<AiModelsState | undefined>(undefined);

function reducer(state: AiModelsState, action: AiModelsAction): AiModelsState {
  switch (action.type) {
    case AiModelsActionType.LOADING:
      return { ...state, isLoading: true, errorCode: undefined };
    case AiModelsActionType.AI_MODELS_LOADED:
      return {
        ...state,
        isLoading: false,
        aiModels: action.payload?.aiModels,
        aiModelCount: action.payload?.aiModelCount,
        errorCode: undefined,
      };
    case AiModelsActionType.REJECTED:
      return {
        ...state,
        isLoading: false,
        errorCode: action.payload?.errorCode,
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

const AI_MODEL_PER_PAGE = 12;

const initialState: AiModelsState = {
  aiModels: undefined,
  aiModelCount: undefined,
  isLoading: false,
  errorCode: undefined,
};

type AiModelsProviderProps = {
  children: React.ReactNode;
  searchParams: UrlSearchParams;
};

export default function AiModelsProvider({
  children,
  searchParams,
}: AiModelsProviderProps) {
  const { activeFilters, setFilters } = useFilters();
  const [{ aiModels, aiModelCount, isLoading, errorCode }, dispatch] =
    useReducer(reducer, initialState);
  const { page, q, sort } = searchParams;

  const fetchAiModels = useCallback(async () => {
    dispatch({ type: AiModelsActionType.LOADING });

    const options: DiscoveryAiModelSearchQuery = {
      query: q,
      facets: convertActiveFiltersToFacets(activeFilters),
      sort: sort || "relevance",
      start: page ? (Number(page) - 1) * AI_MODEL_PER_PAGE : 0,
      rows: AI_MODEL_PER_PAGE,
    };

    try {
      const data = await searchAiModelsApi(options);
      setFilters(data.facets ?? []);
      dispatch({
        type: AiModelsActionType.AI_MODELS_LOADED,
        payload: {
          aiModels: data.results,
          aiModelCount: data.count,
        },
      });
    } catch (error) {
      const errorCode =
        error instanceof AxiosError ? error.response?.status : 500;
      dispatch({
        type: AiModelsActionType.REJECTED,
        payload: { errorCode },
      });
      console.error(error);
    }
  }, [activeFilters, page, q, sort, setFilters]);

  useEffect(() => {
    fetchAiModels();
  }, [fetchAiModels]);

  return (
    <AiModelsContext.Provider
      value={{
        aiModels,
        aiModelCount,
        isLoading,
        errorCode,
      }}
    >
      {children}
    </AiModelsContext.Provider>
  );
}

function useAiModels() {
  const context = useContext(AiModelsContext);
  if (context === undefined) {
    throw new Error("useAiModels must be used within an AiModelsProvider");
  }
  return context;
}

export { AI_MODEL_PER_PAGE, AiModelsProvider, useAiModels };
