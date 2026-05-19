// SPDX-FileCopyrightText: 2025 Centre for Genomic Regulation
// SPDX-FileContributor: 2025 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0
"use client";

import GVariantsSearchBar, {
  SearchInputData,
} from "@/app/allele-frequency/GVariantsSearchBar";
import GVariantsTable from "@/app/allele-frequency/GVariantsTable";
import {
  retrieveFilterValuesApi,
  retrieveDatasetApi,
  searchDatasetsApi,
  searchGVariantsApi,
} from "@/app/api/discovery";
import {
  GVariantsSearchResponse,
  SearchedDataset,
} from "@/app/api/discovery/open-api/schemas";
import ErrorComponent from "@/app/error";
import { UrlSearchParams } from "@/app/params";
import PageContainer from "@/components/PageContainer";
import {
  getExternalDatasetInfo,
  getFirstAccessUrl,
} from "@/utils/datasetHelpers";
import { isAxiosError } from "axios";
import { use, useEffect, useRef, useState } from "react";

type AlleleFrequencyPageProps = {
  searchParams: Promise<UrlSearchParams>;
};

type DatasetActionInfo = {
  dataset: SearchedDataset | null;
  isExternal: boolean;
  externalAccessUrl?: string;
};

export default function AlleleFrequencyPage({
  searchParams,
}: AlleleFrequencyPageProps) {
  const [results, setResults] = useState<GVariantsSearchResponse[]>([]);
  const [datasetActions, setDatasetActions] = useState<
    Record<string, DatasetActionInfo>
  >({});
  const [loading, setLoading] = useState(false);
  const [triedSearching, setTriedSearching] = useState(false);
  const [datasetTypeOptions, setDatasetTypeOptions] = useState<string[]>([]);
  const _searchParams = use(searchParams);
  const [error, setError] = useState<{
    statusCode: number;
    title?: string;
    detail?: string;
  } | null>(null);
  const datasetActionCacheRef = useRef<Record<string, DatasetActionInfo>>({});

  const buildDatasetActions = async (
    gvariantsResults: GVariantsSearchResponse[]
  ): Promise<Record<string, DatasetActionInfo>> => {
    const datasetIds = Array.from(
      new Set(
        gvariantsResults
          .map((row) => row.datasetId?.trim())
          .filter((id): id is string => !!id)
      )
    );

    if (datasetIds.length === 0) {
      return {};
    }

    const missingDatasetIds = datasetIds.filter(
      (datasetId) => !datasetActionCacheRef.current[datasetId]
    );

    if (missingDatasetIds.length > 0) {
      const { results: searchedDatasets = [] } = await searchDatasetsApi({
        rows: Math.max(missingDatasetIds.length, 100),
        facets: missingDatasetIds.map((datasetId) => ({
          source: "ckan",
          type: "DROPDOWN",
          key: "identifier",
          value: datasetId,
        })),
        operator: "OR",
      });

      const datasetByIdentifier = new Map<string, SearchedDataset>();
      searchedDatasets.forEach((dataset) => {
        if (dataset.identifier) {
          datasetByIdentifier.set(dataset.identifier, dataset);
        }
      });

      const missingEntries = await Promise.all(
        missingDatasetIds.map(async (datasetId) => {
          const dataset = datasetByIdentifier.get(datasetId) ?? null;
          if (!dataset) {
            return [
              datasetId,
              { dataset: null, isExternal: false } as DatasetActionInfo,
            ] as const;
          }

          const { isExternal } = getExternalDatasetInfo(dataset);
          let externalAccessUrl: string | undefined;

          if (isExternal && dataset.id) {
            try {
              const fullDataset = await retrieveDatasetApi(dataset.id);
              externalAccessUrl = getFirstAccessUrl(fullDataset?.distributions);
            } catch {
              externalAccessUrl = undefined;
            }
          }

          return [
            datasetId,
            { dataset, isExternal, externalAccessUrl } as DatasetActionInfo,
          ] as const;
        })
      );

      datasetActionCacheRef.current = {
        ...datasetActionCacheRef.current,
        ...Object.fromEntries(missingEntries),
      };
    }

    return Object.fromEntries(
      datasetIds.map((datasetId) => [
        datasetId,
        datasetActionCacheRef.current[datasetId] ?? {
          dataset: null,
          isExternal: false,
        },
      ])
    );
  };

  const filterResultsByDatasetType = (
    gvariantsResults: GVariantsSearchResponse[],
    actions: Record<string, DatasetActionInfo>,
    selectedDatasetType: string
  ) => {
    if (!selectedDatasetType || selectedDatasetType === "All") {
      return gvariantsResults;
    }

    return gvariantsResults.filter((row) => {
      const datasetId = row.datasetId?.trim();
      if (!datasetId) {
        return false;
      }

      return (
        actions[datasetId]?.dataset?.datasetType?.trim() === selectedDatasetType
      );
    });
  };

  useEffect(() => {
    let isMounted = true;

    const loadDatasetTypeOptions = async () => {
      try {
        const values = await retrieveFilterValuesApi("dcat_type");
        const options = Array.from(
          new Set(
            values
              .map((valueLabel) => valueLabel.label?.trim())
              .filter((label): label is string => !!label)
          )
        ).sort((a, b) =>
          a.localeCompare(b, undefined, {
            sensitivity: "base",
            numeric: true,
          })
        );

        if (isMounted) {
          setDatasetTypeOptions(options);
        }
      } catch {
        if (isMounted) {
          setDatasetTypeOptions([]);
        }
      }
    };

    void loadDatasetTypeOptions();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearch = async (props: SearchInputData) => {
    setLoading(true);
    setResults([]);
    setDatasetActions({});
    setError(null);

    try {
      const params: {
        referenceName?: string;
        start?: number[];
        end?: number[] | null;
        referenceBases?: string;
        alternateBases?: string;
        assemblyId?: string;
        sex?: string;
        countryOfBirth?: string;
      } = {};

      const variant = props.variant.trim();
      if (!variant) throw new Error("Variant is required");
      if (variant.toLowerCase() === "all") {
        const response = await searchGVariantsApi({ params: {} });
        const actions = await buildDatasetActions(response);
        const filteredResponse = filterResultsByDatasetType(
          response,
          actions,
          props.datasetType
        );
        setResults(filteredResponse);
        setDatasetActions(actions);
        setTriedSearching(true);
        return;
      }

      const parts = variant.split("-");
      if (parts.length !== 4) throw new Error("Invalid variant format");
      const [referenceName, start, referenceBases, alternateBases] = parts;
      const startNum = parseInt(start, 10);
      if (isNaN(startNum) || startNum <= 0)
        throw new Error("Invalid start position");

      // Convert user-provided 1-based position to 0-based coordinate.
      const startPosition = [startNum - 1];

      params.referenceName = referenceName;
      params.start = startPosition;
      params.end = null;
      params.referenceBases = referenceBases;
      params.alternateBases = alternateBases;

      if (props.refGenome) {
        params.assemblyId = props.refGenome;
      }
      if (props.sex && props.sex !== "All") {
        params.sex = props.sex;
      }
      if (props.countryOfBirth && props.countryOfBirth !== "All") {
        params.countryOfBirth = props.countryOfBirth;
      }

      const response = await searchGVariantsApi({ params });
      const actions = await buildDatasetActions(response);
      const filteredResponse = filterResultsByDatasetType(
        response,
        actions,
        props.datasetType
      );
      setResults(filteredResponse);
      setDatasetActions(actions);
      setTriedSearching(true);
    } catch (error) {
      if (isAxiosError(error)) {
        console.error(
          `Allele-frequency search failed with status ${error.response?.status ?? "unknown"}`
        );
      } else {
        console.error("Allele-frequency search failed");
      }
      if (isAxiosError(error) && error.response) {
        setError({
          statusCode: error.response.status,
          title: error.response.data.title,
          detail: error.response.data.detail,
        });
      } else {
        setError({ statusCode: 500 });
      }
    } finally {
      setLoading(false);
    }
  };
  if (error) {
    return (
      <ErrorComponent
        statusCode={error.statusCode}
        errorTitle={error.title}
        errorDetail={error.detail}
      />
    );
  }

  return (
    <PageContainer
      searchParams={_searchParams}
      className="container mx-auto px-4 pt-5"
    >
      <GVariantsSearchBar
        onSearchAction={handleSearch}
        loading={loading}
        datasetTypeOptions={datasetTypeOptions}
      />

      {loading && (
        <p className="text-center text-gray-500">
          Searching and preparing results...
        </p>
      )}

      {!loading && triedSearching && results.length == 0 && (
        <p className="text-center text-gray-500">No results found</p>
      )}

      {!loading && results.length > 0 && (
        <GVariantsTable results={results} datasetActions={datasetActions} />
      )}
    </PageContainer>
  );
}
