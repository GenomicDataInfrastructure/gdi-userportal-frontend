// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { fetch as undiciFetch } from "undici";
import { withAcceptEncoding } from "@/app/api/shared/accept-encoding";

export type HarvestFetchLike = (
  input: string | URL,
  init?: RequestInit
) => Promise<Response>;

export const harvestFetch = undiciFetch as unknown as HarvestFetchLike;

// TLS is always verified. Add private CAs of harvested sources through
// NODE_EXTRA_CA_CERTS in the deployment, not here.
export const buildHarvestRequestInit = (
  init: RequestInit = {}
): RequestInit => ({
  ...init,
  headers: withAcceptEncoding(init.headers),
});
