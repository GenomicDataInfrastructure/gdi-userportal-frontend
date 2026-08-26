// SPDX-FileCopyrightText: 2025 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0

import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

export interface NavItem {
  icon: IconDefinition;
  label: string;
  href: string;
  isActive: (activePath: string) => boolean;
}
