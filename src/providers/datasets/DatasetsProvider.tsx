"use client";
import { datasetList } from "@/services/discovery/index.public";
import { SearchedDataset } from "@/services/discovery/types/dataset.types";
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

enum DatasetsActionType {
  LOADING,
  DATASETS_LOADED,
  REJECTED,
}

type DatasetsState = {
  isLoading: boolean;
  datasetCount?: number;
  datasets?: SearchedDataset[];
  errorCode?: number;
};

type DatasetsAction = {
  type: DatasetsActionType;
  payload?: {
    datasets?: SearchedDataset[];
    datasetCount?: number;
    errorCode?: number;
  };
};

const DatasetsContext = createContext<DatasetsState | undefined>(undefined);

function parseFacets(queryParams: URLSearchParams): DatasetSearchQueryFacet[] {
  const facetsQuery: DatasetSearchQueryFacet[] = [];

  queryParams.forEach((value, key) => {
    if (!["page", "q", "sort"].includes(key)) {
      const group = key.split("-")[0];
      const facet = key.split("-")[1];
      const values = value.split(",");

      values.map((v) =>
        facetsQuery.push({
          facetGroup: group,
          facet: facet,
          value: v,
        })
      );
    }
  });
  return facetsQuery;
}

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
    const options: DatasetSearchOptions = {
      facets: parseFacets(queryParams),
      offset: queryParams.get("page")
        ? (Number(queryParams.get("page")) - 1) * DATASET_PER_PAGE
        : 0,
      limit: DATASET_PER_PAGE,
      query: queryParams.get("q") as string | undefined,
      sort: queryParams.get("sort") as string | "relevance",
      include_private: false,
    };

    try {
      dispatch({ type: DatasetsActionType.LOADING });
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

export { DatasetsProvider, useDatasets };
