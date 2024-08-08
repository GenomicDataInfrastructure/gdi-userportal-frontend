// SPDX-FileCopyrightText: 2024 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0

import Link from "next/link";
import { RetrievedOrganization } from "@/services/discovery/types/dataset.types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faBuilding,
  faDatabase,
} from "@fortawesome/free-solid-svg-icons";

interface OrganizationListProps {
  organizations: RetrievedOrganization[];
}

const OrganizationList: React.FC<OrganizationListProps> = ({
  organizations,
}) => {
  return (
    <div className="bg-white">
      <div className="flex flex-col w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-center">
          {organizations.map((org) => (
            <div
              key={org.id}
              className="bg-white py-6 flex flex-col items-start justify-start rounded-lg shadow-lg border-b-4 border-b-[#B5BFC4] hover:border-b-secondary transition hover:bg-gray-50 text-left"
            >
              <div className="w-full h-32 mb-4 flex justify-center items-center">
                {/* {org.imageUrl ? (
                  <img src={org.imageUrl} alt={org.name} className="w-full h-full object-cover rounded-t-lg" />
                ) : (
                  <FontAwesomeIcon icon={faBuilding} className="w-24 h-24 text-primary" />
                )} */}
                <FontAwesomeIcon
                  icon={faBuilding}
                  className="w-24 h-24 text-info"
                />
              </div>
              <div className="p-5 h-full flex flex-col">
                <h3 className="text-[26px] truncate-lines-1 font-bold mb-2">
                  {org.title}
                </h3>
                <div className="flex items-center mb-4">
                  <FontAwesomeIcon icon={faDatabase} className="mr-2" />
                  {org.numberOfDatasets}{" "}
                  {org.numberOfDatasets === 1 ? "dataset" : "datasets"}
                </div>
                <div className="mt-auto text-primary flex items-center gap-1 transition hover:underline duration-1000">
                  <Link
                    href={`/datasets?page=1&ckan-organization=${org.name}`}
                    className="flex items-center gap-1"
                  >
                    See datasets
                    <FontAwesomeIcon icon={faArrowRight} className="w-5 h-5" />
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

export default OrganizationList;
