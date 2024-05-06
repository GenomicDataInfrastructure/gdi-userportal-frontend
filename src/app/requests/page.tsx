// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import PageContainer from "@/components/PageContainer";
import { faDatabase, faFileText } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  redirect,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import ApplicationsPage from "./applications";
import GrantedDatasetsPage from "./grantedDatasets";

enum ActiveTab {
  APPLICATIONS = "APPLICATIONS",
  DATASETS = "GRANTED DATASETS",
}

function RequestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const path = usePathname();

  const activeTab: ActiveTab = searchParams.get("tab") as ActiveTab;

  if (
    !activeTab ||
    !Object.values(ActiveTab).includes(activeTab.toUpperCase() as ActiveTab)
  ) {
    const newPath = `${path}?tab=${ActiveTab.APPLICATIONS.toLowerCase()}`;
    redirect(newPath);
  }

  function setActiveTab(e: React.MouseEvent<HTMLButtonElement>) {
    const newTab = e.currentTarget.textContent!.toLowerCase();
    if (newTab === activeTab) return;

    const newParams = new URLSearchParams();
    newParams.set("tab", newTab);
    router.push(`${path}?${newParams.toString()}`);
  }

  return (
    <PageContainer className="pt-6">
      <div className="flex">
        <button
          onClick={setActiveTab}
          className={`flex w-1/2 flex-1 items-center justify-center gap-x-3 py-4 hover:bg-white-smoke focus:text-primary lg:px-20 xl:px-32 ${activeTab === ActiveTab.APPLICATIONS.toLowerCase() ? "text-primary" : "text-black"} transition-all duration-300 ease-linear`}
        >
          <FontAwesomeIcon icon={faFileText} />
          <span className="md:text-md text-sm font-bold">
            {ActiveTab.APPLICATIONS}
          </span>
        </button>
        <button
          onClick={setActiveTab}
          className={`flex w-1/2 flex-1 items-center justify-center gap-x-3 py-4 text-center hover:bg-white-smoke lg:px-20 xl:px-32 ${activeTab === ActiveTab.DATASETS.toLowerCase() ? "text-primary" : "text-black"} transition-all duration-300 ease-linear`}
        >
          <FontAwesomeIcon icon={faDatabase} />
          <span className="md:text-md text-sm font-bold">
            {ActiveTab.DATASETS}
          </span>
        </button>
      </div>
      <div className="border border-white-smoke"></div>
      <div className="flex justify-around">
        <div
          className={`relative -top-0.5 w-full flex-1 border transition-all duration-300 ease-linear ${activeTab === ActiveTab.APPLICATIONS.toLowerCase() ? "border-primary" : "borders-white-smoke"}`}
        ></div>
        <div
          className={`relative -top-0.5 w-full flex-1 border transition-all duration-300 ease-linear  ${activeTab === ActiveTab.DATASETS.toLowerCase() ? "border-primary" : "borders-white-smoke"}`}
        ></div>
      </div>

      {activeTab === ActiveTab.APPLICATIONS.toLowerCase() ? (
        <ApplicationsPage />
      ) : (
        <GrantedDatasetsPage />
      )}
    </PageContainer>
  );
}

export default RequestPage;
