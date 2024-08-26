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
}: PaginationProps) {
  const currentPage = Number(queryParams.get("page")) || 1;
  const lastPageNb = Math.ceil(datasetCount / datasetPerPage) || 1;

  function createHref(page: number) {
    const params = new URLSearchParams(queryParams.toString());
    params.set("page", page.toString());
    return `${pathname}?${params}`;
  }

  const showLeftEllipsis = currentPage > 3;
  const showRightEllipsis = currentPage < lastPageNb - 2;

  const pageNumbers = [];

  if (lastPageNb <= 5) {
    for (let i = 1; i <= lastPageNb; i++) {
      pageNumbers.push(i);
    }
  } else if (currentPage <= 3) {
    pageNumbers.push(2, 3);
  } else if (currentPage >= lastPageNb - 2) {
    pageNumbers.push(lastPageNb - 2, lastPageNb - 1);
  } else {
    pageNumbers.push(currentPage - 1, currentPage, currentPage + 1);
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
        {showLeftEllipsis && (
          <PaginationItem className="text-info hover:text-hover-color">
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {pageNumbers.map((page) => (
          <PaginationLink
            key={page}
            href={createHref(page)}
            isActive={currentPage === page}
            className="text-info hover:text-hover-color"
          >
            {page}
          </PaginationLink>
        ))}
        {showRightEllipsis && (
          <PaginationItem className="text-info hover:text-hover-color">
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {lastPageNb > 1 && (
          <PaginationLink
            href={createHref(lastPageNb)}
            isActive={currentPage === lastPageNb}
            className="text-info hover:text-hover-color"
          >
            {lastPageNb}
          </PaginationLink>
        )}
        {currentPage < lastPageNb && (
          <>
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
