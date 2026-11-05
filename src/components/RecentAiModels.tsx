// SPDX-FileCopyrightText: 2026 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0

import { Link } from "@/i18n/navigation";
import { formatDate } from "@/utils/formatDate";
import { DiscoverySearchedAiModel } from "@/app/api/discovery/providers/types";
import { useTranslations } from "next-intl";

type AiModelLinkProps = Pick<
  DiscoverySearchedAiModel,
  "title" | "createdAt" | "description"
>;

const RecentAiModels = ({
  aiModels,
}: {
  aiModels: DiscoverySearchedAiModel[];
}) => {
  const t = useTranslations();

  return (
    <div className="bg-white">
      <div className="flex flex-col items-center w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-center">
          {aiModels.map((aiModel) => (
            <Link
              key={aiModel.id}
              href={`/models/${aiModel.id}`}
              className="bg-white py-6 flex items-center justify-center rounded-lg shadow-lg border-b-4 border-b-[#B5BFC4] hover:border-b-primary transition-all duration-300 hover:shadow-xl text-left card-hover"
            >
              <AiModelLink
                title={aiModel.title}
                createdAt={aiModel.createdAt}
                description={aiModel.description}
              />
            </Link>
          ))}
        </div>
      </div>
      <div className="flex justify-end mt-12">
        <Link
          href="/models"
          className="link-arrow text-primary hover:text-hover-color"
        >
          {t("recent.seeAll")}
        </Link>
      </div>
    </div>
  );
};

function AiModelLink({
  title,
  createdAt,
  description,
}: Readonly<AiModelLinkProps>) {
  const t = useTranslations();

  return (
    <div className="p-5 h-full flex flex-col w-full">
      <span className="text-info text-sm font-subheading mb-2">
        {formatDate(createdAt!)}
      </span>
      <h3 className="text-lg font-title mb-2 line-clamp-2">{title}</h3>
      <p className="mb-4 line-clamp-3 text-heading-secondary">{description}</p>
      <div className="mt-auto text-primary text-sm font-title link-arrow">
        {t("recent.readMore")}
      </div>
    </div>
  );
}

export default RecentAiModels;
