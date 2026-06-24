// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { redirect, usePathname, useRouter } from "@/i18n/navigation";
import PageContainer from "@/components/PageContainer";
import { ITabItem, TabComponent } from "@/components/Tab";
import { faDatabase, faFileText } from "@fortawesome/free-solid-svg-icons";
import { useLocale, useTranslations } from "next-intl";
import ApplicationsPage from "./applications";
import EntitlementsPage from "./entitlements";
import { UrlSearchParams } from "@/app/params";
import { use } from "react";

function createTabItems(t: ReturnType<typeof useTranslations>): ITabItem[] {
  return [
    {
      name: "applications",
      label: t("requests.tabs.applications"),
      icon: faFileText,
    },
    {
      name: "entitlements",
      label: t("requests.tabs.entitlements"),
      icon: faDatabase,
    },
  ];
}

type RequestPageProps = {
  searchParams: Promise<UrlSearchParams>;
};

function RequestPage({ searchParams }: RequestPageProps) {
  const locale = useLocale();
  const t = useTranslations();
  const router = useRouter();
  const _searchParams = use(searchParams);

  const path = usePathname();

  const activeTab: string = _searchParams.tab || "";

  const tabItems = createTabItems(t);
  const tabNames = tabItems.map(
    (tabItem: ITabItem) => tabItem.name
  ) as ReadonlyArray<string>;

  if (!activeTab || !tabNames.includes(activeTab)) {
    const newPath = `${path}?tab=${tabNames[0]}`;
    redirect({ href: newPath, locale });
  }

  function setActiveTab(activeTab: string) {
    const newParams = new URLSearchParams();
    newParams.set("tab", activeTab.toLowerCase());
    router.push(`${path}?${newParams.toString()}`);
  }

  return (
    <PageContainer searchParams={_searchParams} className="pt-5">
      <TabComponent
        tabItems={tabItems}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      {activeTab === "applications" ? (
        <ApplicationsPage />
      ) : (
        <EntitlementsPage />
      )}
    </PageContainer>
  );
}

export default RequestPage;
