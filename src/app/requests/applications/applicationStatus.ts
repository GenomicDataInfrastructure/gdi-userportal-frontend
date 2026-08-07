// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { ListedApplication } from "@/app/api/access-management/open-api/schemas";

export type ListedApplicationCatalogStatus = {
  status?: string;
  latest?: number;
  date_received?: string;
};

export type ListedApplicationCatalog = {
  statuses?: ListedApplicationCatalogStatus[];
};

export type ListedApplicationListItem = ListedApplication & {
  catalogs?: ListedApplicationCatalog[];
  translation?: {
    status?: string;
  };
};

export type ApplicationStatusFilter =
  | "ALL"
  | "DRAFT"
  | "EXPIRED"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "WITHDRAWN";
