// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./shadcn/pagination";

type PaginationProps = {
  datasetCount: number;
  datasetPerPage: number;
  pathname: string;
  queryParams: URLSearchParams;
};

function PaginationContainer({
  datasetCount,
  datasetPerPage,
  pathname,
  queryParams,
}: Readonly<PaginationProps>) {
  const currentPage = Number(queryParams.get("page")) || 1;
  const lastPageNb = Math.ceil(datasetCount / datasetPerPage) || 1;

  function createHref(page: number) {
    const params = new URLSearchParams(queryParams.toString());
    params.set("page", page.toString());
    return `${pathname}?${params}`;
  }

  return (
    <Pagination>
      <PaginationContent>
        {currentPage > 1 && (
          <>
            <PaginationFirst
              href={createHref(1)}
              className="text-info hover:text-hover-color"
            />
            <PaginationPrevious
              href={createHref(currentPage - 1)}
              className="text-info hover:text-hover-color"
            />
          </>
        )}
        <PaginationLink
          href={createHref(1)}
          isActive={currentPage === 1}
          className="text-info hover:text-hover-color"
        >
          1
        </PaginationLink>
        {currentPage > 4 && (
          <PaginationItem className="text-info hover:text-hover-color">
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {currentPage > 3 && (
          <PaginationLink
            href={createHref(currentPage - 2)}
            className="text-info hover:text-hover-color"
          >
            {currentPage - 2}
          </PaginationLink>
        )}
        {currentPage > 2 && (
          <PaginationLink
            href={createHref(currentPage - 1)}
            className="text-info hover:text-hover-color"
          >
            {currentPage - 1}
          </PaginationLink>
        )}
        {currentPage !== 1 && (
          <PaginationLink
            href={createHref(currentPage)}
            isActive
            className="text-info hover:text-hover-color"
          >
            {currentPage}
          </PaginationLink>
        )}
        {currentPage < lastPageNb - 1 && (
          <PaginationLink
            href={createHref(currentPage + 1)}
            className="text-info hover:text-hover-color"
          >
            {currentPage + 1}
          </PaginationLink>
        )}
        {currentPage < lastPageNb - 2 && (
          <PaginationLink
            href={createHref(currentPage + 2)}
            className="text-info hover:text-hover-color"
          >
            {currentPage + 2}
          </PaginationLink>
        )}
        {currentPage < lastPageNb - 3 && (
          <PaginationItem className="text-info hover:text-hover-color">
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {currentPage !== lastPageNb && (
          <>
            <PaginationLink
              href={createHref(lastPageNb)}
              className="text-info hover:text-hover-color"
            >
              {lastPageNb}
            </PaginationLink>
            <PaginationNext
              href={createHref(currentPage + 1)}
              className="text-info hover:text-hover-color"
            />
            <PaginationLast
              href={createHref(lastPageNb)}
              className="text-info hover:text-hover-color"
            />
          </>
        )}
      </PaginationContent>
    </Pagination>
  );
}

export default PaginationContainer;
