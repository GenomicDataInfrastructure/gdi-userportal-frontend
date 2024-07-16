// SPDX-FileCopyrightText: 2024 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0

import Link from "next/link";
import { SearchedDataset } from "@/services/discovery/types/dataset.types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "@/utils/formatDate";

type DatasetLinkProps = Pick<
  SearchedDataset,
  "title" | "createdAt" | "description"
>;

const RecentDatasets = ({ datasets }: { datasets: SearchedDataset[] }) => {
  return (
    <div className="bg-white sm:p-4 rounded-lg pb-28 sm:pb-28 w-full">
      <div className="custom-container lg:px-3">
        <div className="flex flex-col items-center w-full">
          <div className="flex flex-col sm:flex-row w-full justify-between pb-8 sm:pb-2">
            <h2 className="mb-4 text-2xl font-bold text-primary text-center sm:text-left">
              Most Recent Datasets
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-center">
            {datasets.map((dataset) => (
              <Link
                key={dataset.id}
                href={`/datasets/${dataset.id}`}
                className="bg-white py-6 flex items-center justify-center rounded-lg shadow-lg border-b-4 border-b-[#B5BFC4] hover:border-b-secondary transition hover:bg-gray-50 text-left"
              >
                <DatasetLink
                  title={dataset.title}
                  createdAt={dataset.createdAt}
                  description={dataset.description}
                />
              </Link>
            ))}
          </div>
        </div>
        <div className="flex justify-end mt-8">
          <Link
            href="/datasets"
            className="flex items-center gap-1 transition hover:underline duration-1000 text-primary"
          >
            See all
            <FontAwesomeIcon icon={faArrowRight} className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

function DatasetLink({ title, createdAt, description }: DatasetLinkProps) {
  return (
    <div className="p-5 h-full flex flex-col">
      <span className="text-info flex items-center mb-4">
        {formatDate(createdAt)}
      </span>
      <h3 className="text-xl text-primary truncate-lines-1">{title}</h3>
      <div className="flex items-center gap-1 leading-6 tracking-tight pt-2 pb-2">
        <p className="mb-4 text-xs md:text-base truncate-lines-3">
          {description}
        </p>
      </div>
      <div className="mt-auto text-primary flex items-center gap-1 transition hover:underline duration-1000">
        Read More <FontAwesomeIcon icon={faArrowRight} className="w-5 h-5" />
      </div>
    </div>
  );
}

export default RecentDatasets;
