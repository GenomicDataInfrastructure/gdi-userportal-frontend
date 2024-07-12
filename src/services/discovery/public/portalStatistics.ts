// SPDX-FileCopyrightText: 2024 PNED G.I.E.
// SDPX-Contributor: Stichting Health-RI
//
// SPDX-License-Identifier: Apache-2.0

import { PortalStatistics } from "../types/portalStatistics.types";
import axios from "axios";
import {
  DatasetSource,
  DatasetsSearchResponse,
  FacetType,
} from "../types/datasetSearch.types";
import { DEFAULT_DATASET_SEARCH_QUERY, createHeaders } from "../utils";

export const makePortalStatistics = (discoveryUrl: string) => {
  return async (): Promise<PortalStatistics> => {
    const response = await axios.post<DatasetsSearchResponse>(
      `${discoveryUrl}/api/v1/datasets/search`,
      DEFAULT_DATASET_SEARCH_QUERY,
      {
        headers: await createHeaders(),
      }
    );

    const ckanFacetsGroup = response.data.facetGroups.find(
      (x) => x.key === DatasetSource.Ckan
    );
    const countFacet = (facet: FacetType) =>
      ckanFacetsGroup?.facets.find((x) => x.key === facet)?.values?.length ?? 0;

    return {
      catalogues: countFacet(FacetType.Organization),
      keywords: countFacet(FacetType.Tags),
      themes: countFacet(FacetType.Theme),
    };
  };
};
