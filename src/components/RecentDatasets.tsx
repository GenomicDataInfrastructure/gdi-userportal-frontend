// SPDX-FileCopyrightText: 2025 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "@/utils/formatDate";
import { SearchedDataset } from "@/app/api/discovery/open-api/schemas";

type DatasetLinkProps = Pick<
  SearchedDataset,
  "title" | "createdAt" | "description"
>;

const RecentDatasets = ({ datasets }: { datasets: SearchedDataset[] }) => {
  return (
    <div className="bg-white">
      <div className="flex flex-col items-center w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-center">
          {datasets.map((dataset) => (
            <Link
              key={dataset.id}
              href={`/datasets/${dataset.id}`}
              className="bg-white py-6 flex items-center justify-center rounded-lg shadow-lg border-b-4 border-b-[#B5BFC4] hover:border-b-primary transition-all duration-300 hover:shadow-xl text-left card-hover"
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
      <div className="flex justify-end mt-12">
        <Link
          href="/datasets"
          className="link-arrow text-primary hover:text-hover-color"
        >
          See all
        </Link>
      </div>
    </div>
  );
};

function DatasetLink({
  title,
  createdAt,
  description,
}: Readonly<DatasetLinkProps>) {
  return (
    <div className="p-5 h-full flex flex-col w-full">
      <span className="text-info text-sm font-subheading mb-2">
        {formatDate(createdAt!)}
      </span>
      <h3 className="text-lg font-title mb-2 line-clamp-2">{title}</h3>
      <p className="mb-4 line-clamp-3 text-heading-secondary">{description}</p>
      <div className="mt-auto text-primary text-sm font-title link-arrow">
        Read More
      </div>
    </div>
  );
}

export default RecentDatasets;
