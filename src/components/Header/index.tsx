// SPDX-FileCopyrightText: 2025 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0

"use client";

import { User } from "@/app/api/auth/types/user.types";
import { Link, usePathname } from "@/i18n/navigation";
import contentConfig from "@/config/contentConfig";
import { useDatasetBasket } from "@/providers/DatasetBasketProvider";
import { useTranslations } from "next-intl";
import {
  faBars,
  faBook,
  faDatabase,
  faHome,
  faInfoCircle,
  faLineChart,
  faShoppingCart,
  faUser,
  faWandSparkles,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import Button from "../Button";
import Avatar from "./Avatar";
import NotificationBell from "./Notifications/NotificationBell";
import RequestIcon from "./RequestIcon";

function Header() {
  const t = useTranslations();
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const activeTab = usePathname();
  const { basket, isLoading } = useDatasetBasket();
  const isExternalHeaderLogo = contentConfig.headerLogoUrl.startsWith("http");

  let navItems = [
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
    {
      icon: faInfoCircle,
      label: t("nav.about"),
      href: "/about",
      isActive: (activePath: string) => activePath === "/about",
    },
  ];

  if (!contentConfig.showAlleleFrequency) {
    navItems = navItems.filter((item) => item.href !== "/allele-frequency");
  }

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const targetElement = event.target as Element;
      if (isMenuOpen && !targetElement.closest(".menu-container")) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("click", handleOutsideClick);

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [isMenuOpen]);

  let loginBtn;

  if (status !== "loading" && contentConfig.showBasketAndLogin) {
    loginBtn = session ? (
      <>
        <NotificationBell />
        <RequestIcon isActive={!!activeTab?.includes("requests")} />
        <Avatar user={session.user as User} />
      </>
    ) : (
      <Button
        icon={faUser}
        text={t("auth.login")}
        type="primary"
        onClick={() => signIn("keycloak")}
        flex={true}
      />
    );
  }

  return (
    <div className="relative bg-gray-50 py-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between px-6">
          <div className="flex items-center gap-x-4 md:gap-x-6">
            <div className="menu-container hidden md:block lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-primary hover:text-secondary focus:outline-hidden p-2"
              >
                <FontAwesomeIcon
                  icon={faBars}
                  className="text-2xl md:text-3xl"
                />
              </button>
              {isMenuOpen && (
                <div className="absolute left-0 right-0 top-[100%] z-10 rounded-md bg-white shadow-lg">
                  <ul>
                    {navItems.map((item) => {
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className="block px-8 py-3 hover:bg-primary hover:text-white text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary transition-colors duration-200"
                            onClick={closeMenu}
                          >
                            <FontAwesomeIcon
                              icon={item.icon}
                              className="mr-3 text-xl"
                            />
                            {item.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>

            {isExternalHeaderLogo ? (
              <a
                href={contentConfig.headerLogoUrl}
                className="py-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={"/logo.png"}
                  alt={"Logo"}
                  width="100"
                  height="37"
                  className={"mb-2 mt-2 w-[70px] md:w-[100px]"}
                />
              </a>
            ) : (
              <Link href={contentConfig.headerLogoUrl} className="py-2">
                <Image
                  src={"/logo.png"}
                  alt={"Logo"}
                  width="100"
                  height="37"
                  className={"mb-2 mt-2 w-[70px] md:w-[100px]"}
                />
              </Link>
            )}

            <div className="hidden items-center gap-x-2 text-base font-body lg:flex lg:text-lg xl:gap-x-4">
              {navItems.map((item) => {
                const isActive = item.isActive(activeTab);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-4 py-2 rounded-md transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary ${
                      isActive
                        ? "bg-primary text-white"
                        : "text-black hover:bg-primary hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="font-body flex items-center gap-x-6 md:gap-x-8">
            {contentConfig.showBasketAndLogin && !isLoading && (
              <>
                <Link
                  href="/basket"
                  className={`relative flex items-center text-info hover:text-secondary transition-opacity duration-300 p-2 ${
                    activeTab?.includes("basket") ? "text-primary" : ""
                  }`}
                >
                  <FontAwesomeIcon
                    icon={faShoppingCart}
                    className="text-2xl lg:text-3xl"
                  />
                  {basket.length > 0 && (
                    <span className="absolute right-0 top-0 inline-flex -translate-y-1/3 translate-x-1/2 transform items-center justify-center rounded-full bg-secondary px-2.5 py-1.5 text-sm font-bold leading-none text-white">
                      {basket.length}
                    </span>
                  )}
                </Link>
              </>
            )}
            {loginBtn}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
