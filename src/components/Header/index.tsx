// SPDX-FileCopyrightText: 2024 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useDatasetBasket } from "@/providers/DatasetBasketProvider";
import { User } from "@/types/user.types";
import {
  faBars,
  faBook,
  faDatabase,
  faHome,
  faInfoCircle,
  faShoppingCart,
  faUser,
  faWandSparkles,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "../Button";
import Avatar from "./Avatar";
import RequestIcon from "./RequestIcon";
import contentConfig from "@/config/contentConfig";

function Header() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const activeTab = usePathname();
  const { basket, isLoading } = useDatasetBasket();

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
        <RequestIcon isActive={!!activeTab?.includes("requests")} />
        <Avatar user={session.user as User} />
      </>
    ) : (
      <Button
        icon={faUser}
        text="Login"
        type="primary"
        onClick={() => signIn("keycloak")}
        flex={true}
      />
    );
  }

  return (
    <div className="bg-gray-50 py-4 md:py-5">
      <div className="container mx-auto">
        <div className="flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-x-4 md:gap-x-6">
            <div className="menu-container relative lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-primary hover:text-secondary focus:outline-none p-2"
              >
                <FontAwesomeIcon
                  icon={faBars}
                  className="text-2xl md:text-3xl"
                />
              </button>
              {isMenuOpen && (
                <div className="absolute left-0 z-10 mt-2 w-56 origin-top-left rounded-md bg-white shadow-lg">
                  <Link
                    href="/"
                    className="block px-6 py-3 hover:bg-hover-color hover:text-white text-lg"
                    onClick={closeMenu}
                  >
                    <FontAwesomeIcon icon={faHome} className="mr-3 text-xl" />
                    Home
                  </Link>
                  <Link
                    href="/datasets"
                    className="block px-6 py-3 hover:bg-hover-color hover:text-white text-lg"
                    onClick={closeMenu}
                  >
                    <FontAwesomeIcon
                      icon={faDatabase}
                      className="mr-3 text-xl"
                    />
                    Datasets
                  </Link>
                  <Link
                    href="/themes"
                    className="block px-6 py-3 hover:bg-hover-color hover:text-white text-lg"
                    onClick={closeMenu}
                  >
                    <FontAwesomeIcon
                      icon={faWandSparkles}
                      className="mr-3 text-xl"
                    />
                    Themes
                  </Link>
                  <Link
                    href="/publishers"
                    className="block px-6 py-3 hover:bg-hover-color hover:text-white text-lg"
                    onClick={closeMenu}
                  >
                    <FontAwesomeIcon icon={faBook} className="mr-3 text-xl" />
                    Publishers
                  </Link>
                  <Link
                    href="/about"
                    className="block px-6 py-3 hover:bg-hover-color hover:text-white text-lg"
                    onClick={closeMenu}
                  >
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="mr-3 text-xl"
                    />
                    About
                  </Link>
                </div>
              )}
            </div>

            <Link href="/" className="py-2">
              <Image
                src={"/header-logo.svg"}
                alt={"Logo"}
                width="200"
                height="73"
                className={"mb-4 mt-4"}
              />
            </Link>

            <div className="hidden items-center gap-x-4 text-base font-body text-black lg:flex lg:text-lg xl:gap-x-6">
              <Link
                href="/"
                className={`relative px-3 py-1 lg:px-7 transition-opacity duration-300 text-black`}
              >
                <span className="relative group">
                  Home
                  <span
                    className={`absolute left-0 bottom-[-2px] w-full h-[2px] transition-transform duration-300 transform ${
                      activeTab === "/"
                        ? "bg-primary scale-x-100"
                        : "bg-secondary scale-x-0"
                    } group-hover:scale-x-100 group-hover:bg-secondary`}
                  ></span>
                </span>
              </Link>
              <Link
                href="/datasets"
                className={`relative px-3 py-1 lg:px-7 transition-opacity duration-300 text-black`}
              >
                <span className="relative group">
                  Datasets
                  <span
                    className={`absolute left-0 bottom-[-2px] w-full h-[2px] transition-transform duration-300 transform ${
                      activeTab?.includes("datasets")
                        ? "bg-primary scale-x-100"
                        : "bg-secondary scale-x-0"
                    } group-hover:scale-x-100 group-hover:bg-secondary`}
                  ></span>
                </span>
              </Link>
              <Link
                href="/themes"
                className={`relative px-3 py-1 lg:px-7 transition-opacity duration-300 text-black`}
              >
                <span className="relative group">
                  Themes
                  <span
                    className={`absolute left-0 bottom-[-2px] w-full h-[2px] transition-transform duration-300 transform ${
                      activeTab === "/themes"
                        ? "bg-primary scale-x-100"
                        : "bg-secondary scale-x-0"
                    } group-hover:scale-x-100 group-hover:bg-secondary`}
                  ></span>
                </span>
              </Link>
              <Link
                href="/publishers"
                className={`relative px-3 py-1 lg:px-7 transition-opacity duration-300 text-black`}
              >
                <span className="relative group">
                  Publishers
                  <span
                    className={`absolute left-0 bottom-[-2px] w-full h-[2px] transition-transform duration-300 transform ${
                      activeTab === "/publishers"
                        ? "bg-primary scale-x-100"
                        : "bg-secondary scale-x-0"
                    } group-hover:scale-x-100 group-hover:bg-secondary`}
                  ></span>
                </span>
              </Link>
              <Link
                href="/about"
                className={`relative px-3 py-1 lg:px-7 transition-opacity duration-300 text-black`}
              >
                <span className="relative group">
                  About
                  <span
                    className={`absolute left-0 bottom-[-2px] w-full h-[2px] transition-transform duration-300 transform ${
                      activeTab === "/about"
                        ? "bg-primary scale-x-100"
                        : "bg-secondary scale-x-0"
                    } group-hover:scale-x-100 group-hover:bg-secondary`}
                  ></span>
                </span>
              </Link>
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
