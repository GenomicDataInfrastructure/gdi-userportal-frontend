// SPDX-FileCopyrightText: 2025 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0

"use client";

import contentConfig from "@/config/contentConfig";
import debounce from "@/utils/debounce";
import {
  faBook,
  faDatabase,
  faHome,
  faLineChart,
  faWandSparkles,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function Navbar() {
  const activeTab = usePathname();
  const [showNavbar, setShowNavbar] = useState(true);
  const prevScrollPos = useRef(
    typeof window !== "undefined" ? window.scrollY : 0
  );

  let navItems = [
    {
      icon: faHome,
      label: "Home",
      href: "/",
      isActive: (activePath: string) => activePath === "/",
    },
    {
      icon: faDatabase,
      label: "Datasets",
      href: "/datasets",
      isActive: (activePath: string) => activePath.includes("/datasets"),
    },
    {
      icon: faLineChart,
      label: "Allele Frequency",
      href: "/allele-frequency",
      isActive: (activePath: string) =>
        activePath.includes("/allele-frequency"),
    },
    {
      icon: faWandSparkles,
      label: "Themes",
      href: "/themes",
      isActive: (activePath: string) => activePath === "/themes",
    },
    {
      icon: faBook,
      label: "Publishers",
      href: "/publishers",
      isActive: (activePath: string) => activePath === "/publishers",
    },
  ];

  if (!contentConfig.showAlleleFrequency) {
    navItems = navItems.filter((item) => item.href !== "/allele-frequency");
  }

  useEffect(() => {
    const handleScroll = debounce(() => {
      const currentScrollPos = window.scrollY;
      if (currentScrollPos < 150) {
        setShowNavbar(true);
      } else if (prevScrollPos.current - 20 > currentScrollPos) {
        setShowNavbar(true);
      } else if (prevScrollPos.current + 20 < currentScrollPos) {
        setShowNavbar(false);
      }
      prevScrollPos.current = currentScrollPos;
    }, 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="menu-container relative lg:hidden">
        <nav
          className={`fixed z-10 bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden transform transition-transform duration-300 ease ${showNavbar ? "translate-y-0" : "translate-y-full"}`}
        >
          <ul className="flex justify-around items-center h-16">
            {navItems.map((item) => {
              const isActive = item.isActive(activeTab);

              return (
                <li key={item.href} className="flex-1">
                  <Link
                    href={item.href}
                    className={`flex flex-col items-center justify-center h-full hover:text-primary ${
                      isActive ? "text-primary" : ""
                    }`}
                  >
                    <FontAwesomeIcon icon={item.icon} className="w-6 h-6" />
                    <span className="text-xs mt-1 h-6 text-center">
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
}

export default Navbar;
