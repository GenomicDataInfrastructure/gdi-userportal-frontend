// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import Card from "@/components/Card";
import { createAiModelCardItems } from "./aiModelCardItems";
import { DiscoverySearchedAiModel } from "@/app/api/discovery/providers/types";
import { useTranslations } from "next-intl";
import { useWindowSize } from "@/hooks";
import { truncateDescription } from "@/utils/textProcessing";

type AiModelCardProps = {
  aiModel: DiscoverySearchedAiModel;
};

export default function AiModelCard({ aiModel }: Readonly<AiModelCardProps>) {
  const t = useTranslations("datasets.detail");
  const tAiModels = useTranslations("aiModels");
  const screenSize = useWindowSize();
  const description = aiModel.description
    ? truncateDescription(aiModel.description, screenSize)
    : t("noDescriptionAvailable");

  return (
    <Card
      url={`/models/${encodeURIComponent(aiModel.id)}`}
      title={aiModel.title}
      description={description}
      cardItems={createAiModelCardItems(
        aiModel,
        {
          createdOn: t("createdOn"),
          modifiedOn: t("modifiedOn"),
        },
        tAiModels("libraries")
      )}
      keywords={aiModel.keywords}
    />
  );
}
