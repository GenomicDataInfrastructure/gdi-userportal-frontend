// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useWindowSize } from "@/hooks";
import { SCREEN_SIZE } from "@/hooks/useWindowSize";
import { useDatasetBasket } from "@/providers/DatasetBasketProvider";
import logo from "@/public/egdi-logo-horizontal-full-color-rgb.svg";
import { User } from "@/types/user.types";
import { keycloackSessionLogOut } from "@/utils/logout";
import {
  faBars,
  faDatabase,
  faFolderOpen,
  faHome,
  faInfoCircle,
  faRightFromBracket,
  faRightToBracket,
  faShoppingCart,
  faUser,
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

function Header() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const activeTab = usePathname();
  const { basket, isLoading } = useDatasetBasket();
  const screenSize = useWindowSize();

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

  if (status !== "loading") {
    loginBtn = session ? (
      <>
        <RequestIcon isActive={activeTab.includes("requests")} />
        <Avatar user={session.user as User} />
      </>
    ) : (
      <Button
        icon={faUser}
        text="Login"
        type="primary"
        onClick={() => signIn("keycloak")}
      />
    );
  }

  return (
    <div className="flex w-full items-center justify-between bg-white-smoke px-4">
      <div className="flex justify-between gap-x-8 md:gap-x-12 lg:gap-x-24">
        <Link href="/">
          <Image
            src={logo}
            alt="Logo"
            className="mb-4 mt-4"
            width={`${screenSize === SCREEN_SIZE.SM || screenSize === SCREEN_SIZE.MD ? "158" : "190"}`}
            height={`${screenSize === SCREEN_SIZE.SM || screenSize === SCREEN_SIZE.MD ? "57" : "69"}`}
          />
        </Link>
        <div className="hidden items-center gap-x-3 text-base font-semibold text-primary sm:flex lg:text-lg">
          <Link
            href="/"
            className={`rounded-lg border-[1.5px] border-white-smoke px-3 py-1 transition-colors duration-300 hover:border-hover-color lg:px-7 ${activeTab === "/" ? "bg-primary text-white" : ""}`}
          >
            Home
          </Link>
          <Link
            href="/datasets"
            className={`rounded-lg border-[1.5px] border-white-smoke px-3 py-1 transition-colors duration-300 hover:border-hover-color lg:px-7 ${activeTab.includes("datasets") ? "bg-primary text-white" : ""}`}
          >
            Datasets
          </Link>
          <Link
            href="/about"
            className={`rounded-lg border-[1.5px] border-white-smoke px-3 py-1 transition-colors duration-300 hover:border-hover-color lg:px-7 ${activeTab === "/about" ? "bg-primary text-white" : ""}`}
          >
            About
          </Link>
        </div>
      </div>
      <div className="mr-3 hidden items-center gap-x-5 sm:flex md:gap-x-8">
        {!isLoading && (
          <Link
            href="/basket"
            className={`relative flex items-center text-info hover:text-hover-color ${activeTab.includes("basket") ? "text-primary" : ""}`}
          >
            <FontAwesomeIcon
              icon={faShoppingCart}
              className="text-xl lg:text-2xl"
            />
            {basket.length > 0 && (
              <span className="absolute right-0 top-0 inline-flex -translate-y-1/2 translate-x-1/2 transform items-center justify-center rounded-full bg-primary px-2 py-1 text-xs font-bold leading-none text-red-100">
                {basket.length}
              </span>
            )}
          </Link>
        )}
        {loginBtn}
      </div>

      <div className="menu-container relative sm:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-primary focus:outline-none"
        >
          <FontAwesomeIcon icon={faBars} className="text-xl" />
        </button>
        {isMenuOpen && (
          <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg">
            {session && (
              <div className="border-b-[1.5px] border-white-smoke px-4 py-2">
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
              href="/about"
              className="block border-b-[2px] border-white-smoke px-4 py-2 hover:bg-hover-color hover:text-white"
              onClick={closeMenu}
            >
              <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
              About
            </Link>
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
              className="block border-b-[2px] border-white-smoke px-4 py-2 hover:bg-hover-color hover:text-white"
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
                <FontAwesomeIcon icon={faRightToBracket} className="mr-2" />
                Login
              </button>
            )}
            {session && (
              <button
                onClick={handleSignOut}
                className="block w-full px-4 py-2 text-left hover:bg-hover-color hover:text-white"
              >
                <FontAwesomeIcon icon={faRightFromBracket} className="mr-2" />
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
