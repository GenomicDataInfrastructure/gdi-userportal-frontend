// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

export type UrlSearchParams = Partial<{
  page: string;
  q: string;
  sort: string;
  tab: string;
  beacon: string;
}>;

export type UrlParams = Partial<{
  id: string;
}>;
