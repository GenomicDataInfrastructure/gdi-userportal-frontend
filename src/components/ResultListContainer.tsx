// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import Error from "@/app/error";
import PaginationContainer from "@/components/PaginationContainer";

type ResultListContainerProps = {
  currentPage: number;
  count?: number;
  perPage: number;
  isLoading: boolean;
  errorCode?: number;
  children: React.ReactNode;
};

export default function ResultListContainer({
  currentPage,
  count,
  perPage,
  isLoading,
  errorCode,
  children,
}: Readonly<ResultListContainerProps>) {
  if (isLoading) {
    return (
      <div className="col-start-0 col-span-12 xl:col-span-8 xl:col-start-5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w-full mb-4 animate-pulse">
            <div className="h-36 bg-gray-200 rounded-lg mb-4"></div>
          </div>
        ))}
      </div>
    );
  } else if (errorCode) {
    return (
      <div className="col-start-0 col-span-12 xl:col-span-8 xl:col-start-5">
        <Error statusCode={errorCode} />
      </div>
    );
  }

  return (
    <>
      <div className="col-start-0 col-span-12 xl:col-span-8 xl:col-start-5">
        {children}
      </div>
      <div className="col-start-0 col-span-12 my-10 xl:col-span-8 xl:col-start-5">
        <PaginationContainer
          datasetCount={count || 0}
          datasetPerPage={perPage}
          currentPage={currentPage}
        />
      </div>
    </>
  );
}
