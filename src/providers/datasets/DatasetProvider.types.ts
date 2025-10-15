// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { SearchedDataset } from "@/app/api/discovery/open-api/schemas";

export enum DatasetsActionType {
  LOADING,
  DATASETS_LOADED,
  REJECTED,
}

export type DatasetsState = {
  isLoading: boolean;
  datasetCount?: number;
  datasets?: SearchedDataset[];
  errorCode?: number;
};

export type DatasetsAction = {
  type: DatasetsActionType;
  payload?: {
    datasets?: SearchedDataset[];
    datasetCount?: number;
    errorCode?: number;
  };
};
