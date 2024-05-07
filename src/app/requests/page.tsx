// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import PageContainer from "@/components/PageContainer";
import { ITabItem, TabComponent } from "@/components/Tab";
import { faDatabase, faFileText } from "@fortawesome/free-solid-svg-icons";
import {
  redirect,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import ApplicationsPage from "./applications";
import GrantedDatasetsPage from "./grantedDatasets";

function createTabItems(): ITabItem[] {
  return [
    {
      name: "applications",
      icon: faFileText,
    },
    {
      name: "granted datasets",
      icon: faDatabase,
    },
  ];
}

function RequestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const path = usePathname();

  const activeTab: string = searchParams.get("tab") as string;

  const tabItems = createTabItems();
  const tabNames = tabItems.map(
    (tabItem: ITabItem) => tabItem.name,
  ) as ReadonlyArray<string>;

  if (!activeTab || !tabNames.includes(activeTab)) {
    const newPath = `${path}?tab=${tabNames[0]}`;
    redirect(newPath);
  }

  function setActiveTab(activeTab: string) {
    const newParams = new URLSearchParams();
    newParams.set("tab", activeTab.toLowerCase());
    router.push(`${path}?${newParams.toString()}`);
  }

  return (
    <PageContainer className="pt-5">
      <TabComponent
        tabItems={tabItems}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      {activeTab === "applications" ? (
        <ApplicationsPage />
      ) : (
        <GrantedDatasetsPage />
      )}
    </PageContainer>
  );
}

export default RequestPage;
