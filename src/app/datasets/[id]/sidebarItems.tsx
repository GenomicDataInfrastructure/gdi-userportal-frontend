// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { SidebarItem } from "@/components/Sidebar";
import { RetrievedDataset } from "@/services/discovery/types/dataset.types";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faUser } from "@fortawesome/free-solid-svg-icons";
import AddToBasketButton from "@/components/AddToBasketButton";
import serverConfig from "@/config/serverConfig";

function createDatasetSidebarItems(dataset: RetrievedDataset): SidebarItem[] {
  const metaFormats = [
    {
      format: "rdf",
      label: "RDF",
      style: {
        backgroundColor: "var(--color-warning)",
        ":hover": { backgroundColor: "var(--color-hover)" },
      },
    },
    {
      format: "ttl",
      label: "TTL",
      style: { backgroundColor: "var(--color-info)", color: "white" },
    },
    {
      format: "jsonld",
      label: "JSON-LD",
      style: { backgroundColor: "var(--color-secondary)", color: "white" },
    },
  ];

  return [
    {
      label: "",
      value: (
        <div
          style={{ backgroundColor: "var(--color-surface)" }}
          className="flex flex-col rounded-2xl p-6 gap-3"
        >
          <h1 className="font-bold">Request data access</h1>
          <AddToBasketButton dataset={dataset} />
        </div>
      ),
    },
    {
      label: "",
      value: (
        <div
          style={{ backgroundColor: "var(--color-surface)" }}
          className="flex flex-col rounded-2xl p-6 gap-3"
        >
          <h1 className="font-bold">Export Metadata in</h1>
          <div className="flex gap-2 transition py-2 sm:py-0">
            {metaFormats.map((item) => (
              <div key={item.format}>
                <Link
                  href={`${serverConfig.discoveryUrl}/api/v1/datasets/${dataset.id}.${item.format}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-1"
                >
                  <div
                    className="uppercase text-[14px] font-normal rounded-md px-4 py-1.5 transition"
                    style={item.style}
                  >
                    {item.label}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      label: "",
      value: (
        <div
          style={{ backgroundColor: "var(--color-surface)" }}
          className="flex flex-col rounded-2xl p-6 gap-3"
        >
          <h1 className="font-bold">Contact Point(s)</h1>
          <div className="flex items-center text-[14px]">
            <div className="h-20 w-20 flex justify-left items-center">
              {dataset.catalogue /* Optionally add organization logo here */}
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex gap-2 items-center">
                <FontAwesomeIcon icon={faUser} className="text-primary" />
                <p>{dataset.contact?.label || "No contact provided."}</p>
              </div>
              <div className="flex gap-2 items-center">
                <FontAwesomeIcon icon={faEnvelope} className="text-primary" />
                <p>{dataset.contact?.value || "No e-mail provided."}</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      label: "",
      value: (
        <div
          style={{ backgroundColor: "var(--color-surface)" }}
          className="flex flex-col rounded-2xl p-6 gap-6"
        >
          <h1 className="font-extrabold">Similar Datasets</h1>
        </div>
      ),
    },
  ];
}

export { createDatasetSidebarItems };
