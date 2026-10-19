// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { Link } from "@/i18n/navigation";
import { formatDate } from "@/utils/formatDate";
import { faCalendarAlt, faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import { DiscoverySearchedAiModel } from "@/app/api/discovery/providers/types";

type AiModelCardProps = {
  aiModel: DiscoverySearchedAiModel;
};

export default function AiModelCard({ aiModel }: Readonly<AiModelCardProps>) {
  const t = useTranslations("datasets.detail");
  return (
    <Link
      href={`/models/${encodeURIComponent(aiModel.id)}`}
      className="block w-full p-4"
    >
      <h3 className="font-semibold text-lg">{aiModel.title}</h3>
      {aiModel.description && (
        <p className="text-sm text-gray-600 mt-1">{aiModel.description}</p>
      )}
      <div className="flex gap-4 mt-2 text-xs text-gray-500">
        {aiModel.createdAt && (
          <span className="flex items-center gap-1">
            <FontAwesomeIcon icon={faCalendarAlt} />
            {t("createdOn")} {formatDate(aiModel.createdAt)}
          </span>
        )}
        {aiModel.modifiedAt && (
          <span className="flex items-center gap-1">
            <FontAwesomeIcon icon={faSyncAlt} />
            {t("modifiedOn")} {formatDate(aiModel.modifiedAt)}
          </span>
        )}
      </div>
    </Link>
  );
}
