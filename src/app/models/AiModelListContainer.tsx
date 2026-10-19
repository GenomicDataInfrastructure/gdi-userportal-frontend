// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import ResultListContainer from "@/components/ResultListContainer";
import List from "@/components/List";
import ListItem from "@/components/List/ListItem";
import AiModelCard from "./AiModelCard";
import {
  AI_MODEL_PER_PAGE,
  useAiModels,
} from "@/providers/aiModels/AiModelsProvider";

type AiModelListContainerProps = {
  currentPage: number;
};

export default function AiModelListContainer({
  currentPage,
}: AiModelListContainerProps) {
  const { aiModels, aiModelCount, isLoading, errorCode } = useAiModels();

  return (
    <ResultListContainer
      currentPage={currentPage}
      count={aiModelCount}
      perPage={AI_MODEL_PER_PAGE}
      isLoading={isLoading}
      errorCode={errorCode}
    >
      <List>
        {(aiModels || []).map((aiModel) => (
          <ListItem
            key={aiModel.id}
            className="bg-white mb-4 flex items-center justify-center px-2 rounded-lg shadow-lg border-b-4 border-b-[#B5BFC4] hover:border-b-secondary transition hover:bg-gray-50"
          >
            <AiModelCard aiModel={aiModel} />
          </ListItem>
        ))}
      </List>
    </ResultListContainer>
  );
}
