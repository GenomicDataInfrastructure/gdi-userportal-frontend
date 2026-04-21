// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { Agent, Dispatcher } from "undici";

const harvestDispatcher = new Agent({
  connect: { rejectUnauthorized: false },
});

type HarvestRequestInit = RequestInit & {
  dispatcher?: Dispatcher;
};

export const buildHarvestRequestInit = (
  init: RequestInit = {}
): HarvestRequestInit => ({
  ...init,
  dispatcher: harvestDispatcher,
});
