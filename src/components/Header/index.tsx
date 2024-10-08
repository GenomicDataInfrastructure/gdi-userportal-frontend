// SPDX-FileCopyrightText: 2024 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useDatasetBasket } from "@/providers/DatasetBasketProvider";
import { User } from "@/types/user.types";
import { keycloackSessionLogOut } from "@/utils/logout";
import {
  faBars,
  faBook,
  faDatabase,
  faFolderOpen,
  faHome,
  faInfoCircle,
  faRightFromBracket,
  faRightToBracket,
  faShoppingCart,
  faUser,
  faWandSparkles,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signIn, signOut, useSession } from "next-auth/react";
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

  function handleSignOut() {
    keycloackSessionLogOut().then(() => signOut({ callbackUrl: "/" }));
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
    <div className="bg-gray-50 py-3">
      <div className="container mx-auto ">
        <div className="flex items-center justify-between px-4">
          <div className="flex justify-between gap-x-5 md:gap-x-12 lg:gap-x-24">
            <Link href="/">
              <Image
                src={"/header-logo.svg"}
                alt={"Logo"}
                width="190"
                height="69"
                className={"mb-4 mt-4"}
              />
            </Link>
            <div className="hidden items-center gap-x-3 text-base font-body text-black lg:flex lg:text-lg">
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
          <div className="font-body mr-3 hidden items-center gap-x-5 lg:flex md:gap-x-8">
            {contentConfig.showBasketAndLogin && !isLoading && (
              <Link
                href="/basket"
                className={`relative flex items-center text-info hover:text-secondary transition-opacity duration-300 ${
                  activeTab?.includes("basket") ? "text-primary" : ""
                }`}
              >
                <FontAwesomeIcon
                  icon={faShoppingCart}
                  className="text-xl lg:text-2xl"
                />
                {basket.length > 0 && (
                  <span className="absolute right-0 top-0 inline-flex -translate-y-1/2 translate-x-1/2 transform items-center justify-center rounded-full bg-secondary px-2 py-1 text-xs font-bold leading-none text-white">
                    {basket.length}
                  </span>
                )}
              </Link>
            )}
            {loginBtn}
          </div>

          <div className="menu-container relative lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-primary focus:outline-none"
            >
              <FontAwesomeIcon icon={faBars} className="text-xl" />
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg">
                {contentConfig.showBasketAndLogin && session && (
                  <div className="border-b-[1.5px] border-surface px-4 py-2">
                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                    {session?.user?.name}
                  </div>
                )}
                <Link
                  href="/"
                  className="block px-4 py-2 hover:bg-hover-color hover:text-white"
                  onClick={closeMenu}
                >
                  <FontAwesomeIcon icon={faHome} className="mr-2" />
                  Home
                </Link>
                <Link
                  href="/datasets"
                  className="block px-4 py-2 hover:bg-hover-color hover:text-white"
                  onClick={closeMenu}
                >
                  <FontAwesomeIcon icon={faDatabase} className="mr-2" />
                  Datasets
                </Link>
                <Link
                  href="/themes"
                  className="block px-4 py-2 hover:bg-hover-color hover:text-white"
                  onClick={closeMenu}
                >
                  <FontAwesomeIcon icon={faWandSparkles} className="mr-2" />
                  Themes
                </Link>
                <Link
                  href="/publishers"
                  className="block px-4 py-2 hover:bg-hover-color hover:text-white"
                  onClick={closeMenu}
                >
                  <FontAwesomeIcon icon={faBook} className="mr-2" />
                  Publishers
                </Link>
                <Link
                  href="/about"
                  className="block border-b-[2px] border-surface px-4 py-2 hover:bg-hover-color hover:text-white"
                  onClick={closeMenu}
                >
                  <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                  About
                </Link>
                {contentConfig.showBasketAndLogin && (
                  <>
                    <Link
                      href="/requests"
                      className="block px-4 py-2 hover:bg-hover-color hover:text-white"
                      onClick={closeMenu}
                    >
                      <FontAwesomeIcon icon={faFolderOpen} className="mr-2" />
                      Requests
                    </Link>
                    <Link
                      href="/basket"
                      className="block border-b-[2px] border-surface px-4 py-2 hover:bg-hover-color hover:text-white"
                      onClick={closeMenu}
                    >
                      <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
                      {isLoading ? "Basket" : `Basket (${basket.length})`}
                    </Link>
                    {!session && (
                      <button
                        onClick={() => signIn("keycloak")}
                        className="block w-full px-4 py-2 text-left hover:bg-hover-color hover:text-white"
                      >
                        <FontAwesomeIcon
                          icon={faRightToBracket}
                          className="mr-2"
                        />
                        Login
                      </button>
                    )}
                    {session && (
                      <button
                        onClick={handleSignOut}
                        className="block w-full px-4 py-2 text-left hover:bg-hover-color hover:text-white"
                      >
                        <FontAwesomeIcon
                          icon={faRightFromBracket}
                          className="mr-2"
                        />
                        Logout
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
