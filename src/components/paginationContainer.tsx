// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type PaginationProps = {
  datasetCount: number;
  datasetPerPage: number;
  pathname: string;
  queryParams: Record<string, string>;
};

function PaginationContainer({
  datasetCount,
  datasetPerPage,
  pathname,
  queryParams,
}: PaginationProps) {
  const currentPage = Number(queryParams.page) || 1;
  const lastPageNb = Math.ceil(datasetCount / datasetPerPage) || 1;

  function createHref(page: number) {
    const params = new URLSearchParams(queryParams);
    params.set("page", page.toString());
    return `${pathname}?${params}`;
  }

  return (
    <Pagination>
      <PaginationContent>
        {currentPage !== 1 && (
          <PaginationItem>
            <PaginationPrevious href={createHref(currentPage - 1)} />
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationLink href={createHref(1)} isActive={currentPage === 1}>
            1
          </PaginationLink>
        </PaginationItem>
        {currentPage > 4 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {currentPage > 3 && (
          <PaginationItem>
            <PaginationLink href={createHref(currentPage - 2)}>
              {currentPage - 2}
            </PaginationLink>
          </PaginationItem>
        )}
        {Number(currentPage) > 2 && (
          <PaginationItem>
            <PaginationLink href={createHref(currentPage - 1)}>
              {currentPage - 1}
            </PaginationLink>
          </PaginationItem>
        )}
        {currentPage !== 1 && (
          <PaginationItem>
            <PaginationLink href={createHref(currentPage)} isActive>
              {currentPage}
            </PaginationLink>
          </PaginationItem>
        )}
        {currentPage < lastPageNb - 1 && (
          <PaginationItem>
            <PaginationLink href={createHref(currentPage + 1)}>
              {currentPage + 1}
            </PaginationLink>
          </PaginationItem>
        )}
        {currentPage < lastPageNb - 2 && (
          <PaginationItem>
            <PaginationLink href={createHref(currentPage + 2)}>
              {currentPage + 2}
            </PaginationLink>
          </PaginationItem>
        )}
        {currentPage < lastPageNb - 3 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {currentPage !== lastPageNb && (
          <PaginationItem>
            <PaginationLink href={createHref(lastPageNb)}>
              {lastPageNb}
            </PaginationLink>
          </PaginationItem>
        )}
        {currentPage !== lastPageNb && (
          <PaginationItem>
            <PaginationNext href={createHref(currentPage + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}

export default PaginationContainer;
