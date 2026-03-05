// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { BasePlaceholderDiscoveryProvider } from "@/app/api/discovery/providers/base-placeholder-provider";

export class CustomDiscoveryProvider extends BasePlaceholderDiscoveryProvider {
  readonly key = "custom";

  readonly capabilities = {
    supportsBeaconEnrichment: false,
    supportsGVariants: false,
    supportsFilterEntries: true,
  } as const;
}
