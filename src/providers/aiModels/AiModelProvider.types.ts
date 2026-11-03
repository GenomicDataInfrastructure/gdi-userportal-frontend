// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { DiscoverySearchedAiModel } from "@/app/api/discovery/providers/types";

export enum AiModelsActionType {
  LOADING,
  AI_MODELS_LOADED,
  REJECTED,
}

export type AiModelsState = {
  isLoading: boolean;
  aiModelCount?: number;
  aiModels?: DiscoverySearchedAiModel[];
  errorCode?: number;
};

export type AiModelsAction = {
  type: AiModelsActionType;
  payload?: {
    aiModels?: DiscoverySearchedAiModel[];
    aiModelCount?: number;
    errorCode?: number;
  };
};
