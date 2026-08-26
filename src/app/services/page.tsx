// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import PageContainer from "@/components/PageContainer";
import ServiceCard, { Service, ServiceKey } from "@/components/ServiceCard";
import { UrlSearchParams } from "@/app/params";
import { getTranslations } from "next-intl/server";

type ServicesPageProps = {
  searchParams: Promise<UrlSearchParams>;
};

const serviceKeys: ServiceKey[] = ["datasetDiscovery", "alleleFrequency"];

export default async function ServicesPage({
  searchParams,
}: ServicesPageProps) {
  const t = await getTranslations("services");
  const _searchParams = await searchParams;

  const services: Service[] = serviceKeys.map((key) => ({
    key,
    name: t(`${key}.name`),
    shortName: t(`${key}.shortName`),
    overview: t(`${key}.overview`),
    intendedUsers: t(`${key}.intendedUsers`),
    keyFeatures: t.raw(`${key}.keyFeatures`) as string[],
  }));

  return (
    <PageContainer
      searchParams={_searchParams}
      className="container mx-auto px-4 pt-5"
    >
      <div className="my-8 px-4 sm:px-6 lg:px-8">
        <h1 className="font-title text-left text-2xl sm:text-3xl">
          {t("title")}
        </h1>
        <p className="mt-2 text-sm text-gray-600">{t("subtitle")}</p>
      </div>

      <div className="flex flex-col gap-6 px-4 pb-12 sm:px-6 lg:px-8">
        {services.map((service) => (
          <ServiceCard key={service.key} service={service} />
        ))}
      </div>
    </PageContainer>
  );
}
