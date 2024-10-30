// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { datasetList } from "@/services/discovery/index.public";
import {
  DatasetSearchOptions,
  DatasetSearchQueryFacet,
} from "@/services/discovery/types/datasetSearch.types";
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

function parseFacets(queryParams: URLSearchParams): DatasetSearchQueryFacet[] {
  const facetsQuery: DatasetSearchQueryFacet[] = [];

  queryParams.forEach((value, key) => {
    if (!["page", "q", "sort"].includes(key)) {
      const source = key.split("-")[0];
      const facetKey = key.split("-")[1];
      const values = value.split(",");

      values.map((v) =>
        facetsQuery.push({
          source,
          type: "DROPDOWN",
          key: facetKey,
          value: v,
        })
      );
    }
  });
  return facetsQuery;
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
  isLoading: false,
};

export default function DatasetsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryParams = useSearchParams();
  const [{ datasets, datasetCount, isLoading, errorCode }, dispatch] =
    useReducer(reducer, initialState);

  const fetchDatasets = useCallback(async () => {
    dispatch({ type: DatasetsActionType.LOADING });

    const query = queryParams || new URLSearchParams();
    const options: DatasetSearchOptions = {
      facets: parseFacets(query),
      offset: query.get("page")
        ? (Number(query.get("page")) - 1) * DATASET_PER_PAGE
        : 0,
      limit: DATASET_PER_PAGE,
      query: query.get("q") as string | undefined,
      sort: query.get("sort") as string | "relevance",
      include_private: false,
    };

    try {
      const response = await datasetList(options);
      dispatch({
        type: DatasetsActionType.DATASETS_LOADED,
        payload: {
          datasets: response.data?.datasets,
          datasetCount: response.data?.count,
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
  }, [queryParams]);

  useEffect(() => {
    fetchDatasets();
  }, [queryParams, fetchDatasets]);

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
