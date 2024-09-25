// SPDX-FileCopyrightText: 2024 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0

import Link from "next/link";
import { RetrievedPublisher } from "@/services/discovery/types/dataset.types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faDatabase } from "@fortawesome/free-solid-svg-icons";

interface PublisherListProps {
  publishers: RetrievedPublisher[];
}

const PublisherList: React.FC<PublisherListProps> = ({ publishers }) => {
  return (
    <div className="bg-white mb-16">
      <div className="flex flex-col w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 justify-center">
          {publishers.map((org) => (
            <div
              key={org.id}
              className="bg-white py-4 flex flex-col items-start justify-start rounded-lg shadow-lg border-b-4 border-b-[#B5BFC4] hover:border-b-secondary transition hover:bg-gray-50 text-left w-full sm:max-w-[260px]"
            >
              <div className="p-4 h-full flex flex-col">
                <h3 className="text-lg truncate-lines-1 font-medium mb-1">
                  {org.title}
                </h3>
                <div className="flex items-center mb-3 text-sm">
                  <FontAwesomeIcon icon={faDatabase} className="mr-2" />
                  {org.numberOfDatasets}{" "}
                  {org.numberOfDatasets === 1 ? "dataset" : "datasets"}
                </div>
                <div className="mt-auto text-secondary flex items-center gap-1 transition hover:underline duration-1000 text-sm">
                  <Link
                    href={`/datasets?page=1&ckan-organization=${org.name}`}
                    className="flex items-center gap-1"
                  >
                    See datasets
                    <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PublisherList;
