// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { ListedApplication } from "@/types/application.types";
import { formatDate } from "@/utils/formatDate";
import { faCalendarAlt, faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import DatasetList from "./DatasetList";

export default function ApplicationItem({
  application,
}: Readonly<{
  application: ListedApplication;
}>) {
  return (
    <Link
      href={`/applications/${application.id}`}
      className="flex flex-col w-full mb-1.5 shadow-bb rounded-lg pl-4 pr-4.5 group"
    >
      <div className="flex flex-col lg:flex-row gap-x-2 gap-y-4">
        <div className="flex flex-col gap-y-2 shrink w-full lg:w-[90%] lg:pr-4">
          <div className="flex flex-wrap gap-2 font-normal text-xs leading-[12px] uppercase pb-2">
            <span>{application.currentState.split("/").pop()}</span>
          </div>

          <div className="font-bold text-[20px] group-hover:text-info group-hover:underline">
            {application.title}
          </div>

          <p className="mt-3 line-clamp-2 font-normal text-base">
            {application.description || "No description available"}
          </p>

          <div className="mt-3 flex flex-col sm:flex-row sm:flex-wrap text-xs sm:text-[15px] gap-x-6 gap-y-2">
            {application.createdAt && (
              <div className="flex gap-x-2.5">
                <div className="my-auto">
                  <FontAwesomeIcon
                    icon={faCalendarAlt}
                    className="text-primary"
                  />
                </div>
                <span>Created on {formatDate(application.createdAt)}</span>
              </div>
            )}
            {application.stateChangedAt && (
              <div className="flex gap-x-2.5">
                <div className="my-auto">
                  <FontAwesomeIcon icon={faSyncAlt} className="text-primary" />
                </div>
                <span>
                  Modified on {formatDate(application.stateChangedAt)}
                </span>
              </div>
            )}
          </div>
          <div className="mt-3 flex flex-col sm:flex-row sm:flex-wrap sm:gap-x-6 text-xs sm:text-[15px]">
            <DatasetList datasets={application.datasets} />
          </div>
        </div>
      </div>
    </Link>
  );
}
