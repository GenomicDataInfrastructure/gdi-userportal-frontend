// SPDX-FileCopyrightText: 2025 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0

"use client";

import { Link, usePathname } from "@/i18n/navigation";
import debounce from "@/utils/debounce";
import { getNavItems } from "@/utils/getNavItems";
import { useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";

function Navbar() {
  const t = useTranslations();
  const activeTab = usePathname();
  const [showNavbar, setShowNavbar] = useState(true);
  const prevScrollPos = useRef(
    typeof window !== "undefined" ? window.scrollY : 0
  );

  const navItems = getNavItems(t);

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
