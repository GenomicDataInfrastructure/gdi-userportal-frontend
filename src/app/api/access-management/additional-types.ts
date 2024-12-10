// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { SearchedDataset } from "@/app/api/discovery/open-api/schemas";

export enum ApplicationState {
  DRAFT = "application.state/draft",
  CLOSED = "application.state/closed",
  APPROVED = "application.state/approved",
  RETURNED = "application.state/returned",
  REJECTED = "application.state/rejected",
  REVOKED = "application.state/revoked",
  SUBMITTED = "application.state/submitted",
}

export enum FormFieldType {
  TEXT = "text",
  TEXT_AREA = "texta",
  ATTACHMENT = "attachment",
  PHONE = "phone-number",
  DATE = "date",
  EMAIL = "email",
  HEADER = "header",
  OPTION = "option",
  MULTISELECT = "multiselect",
  LABEL = "label",
  TABLE = "table",
}

export type DatasetEntitlement = {
  dataset: SearchedDataset;
  start: string;
  end?: string;
};
