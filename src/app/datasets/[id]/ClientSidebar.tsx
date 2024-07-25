// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import Sidebar from "@/components/Sidebar";
import { RetrievedDataset } from "@/services/discovery/types/dataset.types";
import { createDatasetSidebarItems } from "./sidebarItems";

type ClientSidebarProps = {
  dataset: RetrievedDataset;
};

function ClientSidebar({ dataset }: ClientSidebarProps) {
  const sidebarItems = createDatasetSidebarItems(dataset);

  return (
    <aside className="w-full lg:w-1/3 lg:sticky top-24">
      <div className="flex flex-col gap-4 pb-8">
        {sidebarItems.map((item, index) => (
          <div key={index} className="mb-3">
            <h3 className="text-base text-primary sm:text-lg lg:text-xl">
              {item.label}
            </h3>
            <span className="text-sm sm:text-base lg:text-lg">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default ClientSidebar;
