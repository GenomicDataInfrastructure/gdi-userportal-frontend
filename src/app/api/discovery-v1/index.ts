// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use server";

import { discoveryHdEuClient } from "@/app/api/shared/client";
import { createHeaders } from "@/app/api/shared/headers";
import { isAxiosError } from "axios";
import {
  DatasetSearchQuery,
  SearchedDataset,
  ValueLabel,
  RetrievedDistribution,
  Agent,
  RetrievedDataset,
  ContactPoint,
  DatasetDictionaryEntry,
} from "@/app/api/discovery/open-api/schemas";

type FilterItem = {
  value: string;
  label: string;
  count: number;
};

type LocalizedText = Record<string, unknown> | string | undefined;

type DiscoveryVariable = {
  name?: string;
  titles?: LocalizedText;
  datatype?: string;
  description?: LocalizedText;
  propertyUrl?: string;
};

function isDiscoveryVariable(value: unknown): value is DiscoveryVariable {
  if (!value || typeof value !== "object") return false;
  return (
    "name" in value ||
    "titles" in value ||
    "datatype" in value ||
    "description" in value ||
    "propertyUrl" in value
  );
}

function normalizeTitle(title: unknown, fallbackId: unknown): string {
  if (typeof title === "string") return title;
  if (
    title &&
    typeof title === "object" &&
    "en" in (title as Record<string, unknown>)
  ) {
    const en = (title as Record<string, unknown>)["en"];
    if (typeof en === "string") return en;
  }
  return String(fallbackId ?? "");
}

function normalizeVariables(variables: unknown): DatasetDictionaryEntry[] {
  if (!Array.isArray(variables)) return [];

  return (variables as DiscoveryVariable[])
    .filter(isDiscoveryVariable)
    .map((variable) => {
      const name = String(variable.name ?? "");
      return {
        name,
        type: String(variable.datatype ?? ""),
        description: normalizeTitle(variable.description, name),
      };
    })
    .filter((entry) => entry.name.length > 0);
}

function toDataThemeResource(code: string): string {
  // Map EU data theme codes (e.g., HEAL) to authority resource URLs
  return `http://publications.europa.eu/resource/authority/data-theme/${code}`;
}

function mapFacetsToFilterItems(data: any): FilterItem[] {
  const facets: any[] = data?.result?.facets ?? [];
  const categoriesFacet = facets.find((f) => f?.id === "categories");
  const items = (categoriesFacet?.items ?? []) as Array<any>;

  // Convert categories facet items to simplified filter items
  return items.map((it) => {
    const id = String(it?.id ?? "");
    const label = normalizeTitle(it?.title, id);
    const count = Number(it?.count ?? 0);
    const value = toDataThemeResource(id);
    return { value, label, count };
  });
}

function mapDiscoveryDatasetToSearched(dataset: any): SearchedDataset {
  // Extract base fields
  const id = String(dataset?.id ?? "");
  const title = normalizeTitle(dataset?.title, id);
  const description = normalizeTitle(dataset?.description, "");
  const rawVariables = dataset?.distributions_sample?.[0]?.variables;
  const variables = rawVariables ? normalizeVariables(rawVariables) : [];

  // Map categories to themes
  const themes: ValueLabel[] = (dataset?.categories ?? []).map((cat: any) => ({
    value: String(cat?.id ?? ""),
    label: normalizeTitle(cat?.label, cat?.id),
  }));

  // Map publishers
  const publishers: Agent[] = dataset?.publisher
    ? [
        {
          name: String(dataset.publisher.name ?? ""),
          email: dataset.publisher.email?.replace(/^mailto:/, ""),
          url: dataset.publisher.homepage,
          type: dataset.publisher.type,
        },
      ]
    : [];

  // Map keywords
  const keywords = (dataset?.keywords ?? []).map((kw: any) =>
    typeof kw === "string"
      ? kw
      : {
          value: String(kw?.id ?? ""),
          label: String(kw?.label ?? ""),
        }
  );

  // Map distributions
  const distributions: RetrievedDistribution[] = (
    dataset?.distributions ?? []
  ).map((dist: any) => ({
    id: String(dist?.id ?? ""),
    title: normalizeTitle(dist?.title, dist?.id),
    description: normalizeTitle(dist?.description, ""),
    format: dist?.format
      ? {
          value: String(dist.format.id ?? ""),
          label: String(dist.format.label ?? ""),
        }
      : undefined,
    uri: dist?.resource,
    accessUrl: dist?.access_url?.[0],
    downloadUrl: dist?.download_url?.[0],
    createdAt: dist?.issued,
    modifiedAt: dist?.modified,
    languages: (dist?.language ?? []).map((lang: any) => ({
      value: String(lang?.id ?? ""),
      label: String(lang?.label ?? ""),
    })),
  }));

  return {
    id,
    identifier: dataset?.id,
    title,
    description,
    themes,
    publishers,
    keywords,
    distributions,
    dataDictionary: variables,
    catalogue: dataset?.catalog?.id,
    createdAt: dataset?.issued,
    modifiedAt: dataset?.modified,
    recordsCount: dataset?.number_of_records,
    distributionsCount: (dataset?.distributions ?? []).length,
    url: dataset?.resource,
  };
}

function mapDiscoveryDatasetToRetrieved(dataset: any): RetrievedDataset {
  // Extract base fields with localization support
  const id = String(dataset?.id ?? "");
  const title = normalizeTitle(dataset?.title, id);
  const description = normalizeTitle(dataset?.description, "");
  const provenance = normalizeTitle(dataset?.provenance, "");
  const rawVariables = dataset?.distributions_sample?.[0]?.variables;
  const variables = rawVariables ? normalizeVariables(rawVariables) : [];

  // Map themes/categories
  const themes: ValueLabel[] = (dataset?.categories ?? []).map((cat: any) => ({
    value: String(cat?.id ?? ""),
    label: normalizeTitle(cat?.label, cat?.id),
  }));

  // Map languages
  const languages: ValueLabel[] = (dataset?.language ?? []).map(
    (lang: any) => ({
      value: String(lang?.id ?? ""),
      label: String(lang?.label ?? ""),
    })
  );

  // Map creators
  const creators: Agent[] = dataset?.creator
    ? [
        {
          name: String(dataset.creator.name ?? ""),
          email: dataset.creator.email?.replace(/^mailto:/, ""),
          url: dataset.creator.homepage,
          type: dataset.creator.type,
        },
      ]
    : [];

  // Map publishers
  const publishers: Agent[] = dataset?.publisher
    ? [
        {
          name: String(dataset.publisher.name ?? ""),
          email: dataset.publisher.email?.replace(/^mailto:/, ""),
          url: dataset.publisher.homepage,
          type: dataset.publisher.type,
        },
      ]
    : [];

  // Map contacts
  const contacts: ContactPoint[] = (dataset?.contact_point ?? []).map(
    (contact: any) => ({
      name: String(contact?.name ?? ""),
      email: contact?.email?.replace(/^mailto:/, ""),
      uri: contact?.url?.[0],
    })
  );

  // Map keywords
  const keywords = (dataset?.keywords ?? []).map((kw: any) =>
    typeof kw === "string"
      ? kw
      : {
          value: String(kw?.id ?? ""),
          label: String(kw?.label ?? ""),
        }
  );

  // Map distributions
  const distributions: RetrievedDistribution[] = (
    dataset?.distributions ?? []
  ).map((dist: any) => ({
    id: String(dist?.id ?? ""),
    title: normalizeTitle(dist?.title, dist?.id),
    description: normalizeTitle(dist?.description, ""),
    format: dist?.format
      ? {
          value: String(dist.format.id ?? ""),
          label: String(dist.format.label ?? ""),
        }
      : undefined,
    uri: dist?.resource,
    accessUrl: dist?.access_url?.[0],
    downloadUrl: dist?.download_url?.[0],
    createdAt: dist?.issued,
    modifiedAt: dist?.modified,
    languages: (dist?.language ?? []).map((lang: any) => ({
      value: String(lang?.id ?? ""),
      label: String(lang?.label ?? ""),
    })),
  }));

  // Map access rights
  const accessRights: ValueLabel | undefined = dataset?.access_right
    ? {
        value: String(dataset.access_right.resource ?? ""),
        label: String(dataset.access_right.label ?? ""),
      }
    : undefined;

  // Map DCAT type
  const dcatType: ValueLabel | undefined = dataset?.type
    ? {
        value: String(dataset.type.id ?? ""),
        label: String(dataset.type.label ?? ""),
      }
    : undefined;

  // Map conforms to
  const conformsTo: ValueLabel[] = (dataset?.conforms_to ?? []).map(
    (conf: any) => ({
      value: String(conf?.resource ?? ""),
      label: String(conf?.label ?? ""),
    })
  );

  // Map spatial
  const spatial: ValueLabel | undefined =
    dataset?.country && dataset.country.id
      ? {
          value: String(dataset.country.resource ?? ""),
          label: String(dataset.country.label ?? ""),
        }
      : undefined;

  return {
    id,
    identifier: dataset?.id,
    title,
    description,
    themes,
    contacts,
    languages,
    creators,
    publishers,
    accessRights,
    keywords,
    provenance,
    spatial,
    conformsTo,
    distributions,
    dcatType,
    dataDictionary: variables,
    catalogue: dataset?.catalog?.id,
    url: dataset?.resource,
    createdAt: dataset?.issued,
    modifiedAt: dataset?.modified,
  };
}

export const retrieveFiltersApi = async () => {
  const headers = await createHeaders();
  try {
    const client = discoveryHdEuClient;
    const requestPath = "search?filters=dataset"; // avoid leading slash so baseURL path is preserved
    const fullUrl = `${client.defaults.baseURL?.replace(/\/$/, "")}/${requestPath}`;
    console.log("Retrieving filters with URL:", fullUrl);
    const response = await client.get(requestPath, {
      headers,
    });

    console.debug("✅ Discovery request succeeded", {
      status: response.status,
    });
    // Convert discovery response to simplified filter items
    const simplified = mapFacetsToFilterItems(response.data);
    return simplified;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("❌ Discovery request failed", {
        status: error.response?.status,
        message: error.message,
        responseData: error.response?.data,
      });
      throw error;
    } else {
      console.error("❌ Non-Axios error", error);
      throw error;
    }
  }
};

export const searchDatasetsApi = async (
  options: DatasetSearchQuery
): Promise<{ count: number; results: SearchedDataset[] }> => {
  const headers = await createHeaders();
  try {
    const client = discoveryHdEuClient;

    // Build query parameters from options
    const params = new URLSearchParams();
    params.append("filters", "dataset");

    if (options.query) {
      params.append("q", options.query);
    }
    if (options.limit) {
      params.append("limit", String(options.limit));
    }
    if (options.offset) {
      params.append("offset", String(options.offset));
    }

    const requestPath = `search?${params.toString()}`; // avoid leading slash so baseURL path is preserved
    const fullUrl = `${client.defaults.baseURL?.replace(/\/$/, "")}/${requestPath}`;
    const response = await client.get(requestPath, {
      headers,
    });
    console.debug("✅ Discovery request succeeded", {
      status: response.status,
    });

    // Map discovery datasets to SearchedDataset format
    const results: SearchedDataset[] = (
      response.data?.result?.results ?? []
    ).map((dataset: any) => mapDiscoveryDatasetToSearched(dataset));

    return {
      count: response.data?.result?.count ?? 0,
      results,
    };
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("❌ Discovery request failed", {
        status: error.response?.status,
        message: error.message,
        responseData: error.response?.data,
      });
      throw error;
    } else {
      console.error("❌ Non-Axios error", error);
      throw error;
    }
  }
};

export const retrieveDatasetApi = async (id: string) => {
  const headers = await createHeaders();
  try {
    const client = discoveryHdEuClient;

    const requestPath = `datasets/${id}`; // avoid leading slash so baseURL path is preserved
    const fullUrl = `${client.defaults.baseURL?.replace(/\/$/, "")}/${requestPath}`;
    console.log("Retrieving dataset with URL:", fullUrl);
    const response = await client.get(requestPath, {
      headers,
    });

    console.debug("✅ Discovery request succeeded", {
      status: response.status,
    });

    // Map the discovered dataset to RetrievedDataset format
    const dataset = mapDiscoveryDatasetToRetrieved(response.data.result);

    return dataset;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("❌ Discovery request failed", {
        status: error.response?.status,
        message: error.message,
        responseData: error.response?.data,
      });
      throw error;
    } else {
      console.error("❌ Non-Axios error", error);
      throw error;
    }
  }
};

// export const retrieveFilterValuesApi = async (key: string) => {
//   const headers = await createHeaders();
//   return await discoveryHdEuUrl.retrieve_filter_values({
//     params: { key },
//     headers,
//   });
// };

// export const retrieveDatasetInSpecifiedFormat = async (
//   id: string,
//   format: "rdf" | "ttl" | "jsonld"
// ) => {
//   const headers = await createHeaders();

//   return await discoveryClient.retrieve_dataset_in_format({
//     params: {
//       "id.": id,
//       id,
//       format,
//     },
//     headers,
//     responseType: "blob",
//   });
// };

// export const searchGVariantsApi = async (options: GVariantSearchQuery) => {
//   return await discoveryClient.searchGenomicVariants(options);
// };
