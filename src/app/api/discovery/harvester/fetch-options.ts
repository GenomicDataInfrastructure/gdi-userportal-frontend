// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { Agent, Dispatcher, fetch as undiciFetch } from "undici";

const harvestDispatcher = new Agent({
  connect: { rejectUnauthorized: false },
});

type HarvestRequestInit = RequestInit & {
  dispatcher?: Dispatcher;
};

export type HarvestFetchLike = (
  input: string | URL,
  init?: RequestInit
) => Promise<Response>;

export const harvestFetch = undiciFetch as unknown as HarvestFetchLike;

const usesHttps = (input: string | URL): boolean =>
  String(input).trim().toLowerCase().startsWith("https://");

export const buildHarvestRequestInit = (
  input: string | URL,
  init: RequestInit = {}
): HarvestRequestInit =>
  usesHttps(input)
    ? {
        ...init,
        dispatcher: harvestDispatcher,
      }
    : { ...init };
