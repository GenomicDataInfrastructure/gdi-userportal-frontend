// SPDX-FileCopyrightText: 2025 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0

import {
  faBook,
  faDatabase,
  faHome,
  faInfoCircle,
  faLineChart,
  faServer,
  faWandSparkles,
} from "@fortawesome/free-solid-svg-icons";
import contentConfig from "@/config/contentConfig";
import { NavItem } from "@/types/navigation";

interface GetNavItemsOptions {
  includeAbout?: boolean;
}

export function getNavItems(
  t: (key: string) => string,
  options: GetNavItemsOptions = {}
): NavItem[] {
  const { includeAbout = false } = options;

  let navItems: NavItem[] = [
    {
      icon: faHome,
      label: t("nav.home"),
      href: "/",
      isActive: (activePath: string) => activePath === "/",
    },
    {
      icon: faDatabase,
      label: t("nav.datasets"),
      href: "/datasets",
      isActive: (activePath: string) => activePath.includes("/datasets"),
    },
    {
      icon: faLineChart,
      label: t("nav.alleleFrequency"),
      href: "/allele-frequency",
      isActive: (activePath: string) =>
        activePath.includes("/allele-frequency"),
    },
    {
      icon: faWandSparkles,
      label: t("nav.themes"),
      href: "/themes",
      isActive: (activePath: string) => activePath === "/themes",
    },
    {
      icon: faBook,
      label: t("nav.publishers"),
      href: "/publishers",
      isActive: (activePath: string) => activePath === "/publishers",
    },
  ];

  if (includeAbout) {
    navItems.push({
      icon: faInfoCircle,
      label: t("nav.about"),
      href: "/about",
      isActive: (activePath: string) => activePath === "/about",
    });
  }

  if (contentConfig.showServices) {
    navItems.push({
      icon: faServer,
      label: t("nav.services"),
      href: "/services",
      isActive: (activePath: string) => activePath === "/services",
    });
  }

  if (!contentConfig.showAlleleFrequency) {
    navItems = navItems.filter((item) => item.href !== "/allele-frequency");
  }

  return navItems;
}
