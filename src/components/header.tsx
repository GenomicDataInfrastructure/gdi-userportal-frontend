// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
"use client";
import { User } from "@/types/user.types";
import { keycloackSessionLogOut } from "@/utils/auth";
import {
  faBars,
  faDatabase,
  faHome,
  faInfoCircle,
  faRightFromBracket,
  faRightToBracket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import logo from "../public/egdi-logo-horizontal-full-color-rgb.svg";
import Avatar from "./avatar";
import Button from "./button";
import Notification from "./notification";

function Header() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const activeTab = usePathname();

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

  return (
    <div className="flex w-full items-center justify-between bg-white-smoke px-4">
      <div className="flex justify-between gap-x-12 lg:gap-x-24">
        <Link href="/">
          <Image
            src={logo}
            alt="Logo"
            className="mb-4 mt-4"
            width="190"
            height="69"
          />
        </Link>
        <div className="hidden items-center gap-x-3 text-base font-semibold text-primary sm:flex md:text-lg">
          <Link
            href="/"
            className={`rounded-full border-[1.5px] border-white-smoke px-3 py-1 transition-colors duration-300 hover:border-secondary hover:shadow-sm md:px-7 ${activeTab === "/" ? "bg-secondary text-white" : ""}`}
          >
            Home
          </Link>
          <Link
            href="/datasets"
            className={`rounded-full border-[1.5px] border-white-smoke px-3 py-1 transition-colors duration-300 hover:border-secondary hover:shadow-sm md:px-7 ${activeTab.includes("datasets") ? "bg-secondary text-white" : ""}`}
          >
            Datasets
          </Link>
          <Link
            href="/about"
            className={`rounded-full border-[1.5px] border-white-smoke px-3 py-1 transition-colors duration-300 hover:border-secondary hover:shadow-sm md:px-7 ${activeTab === "/about" ? "bg-secondary text-white" : ""}`}
          >
            About
          </Link>
        </div>
      </div>
      <div className="mr-3 hidden items-center gap-x-5 sm:flex md:gap-x-8">
        {session ? (
          <>
            <Notification />
            <Avatar user={session.user as User} />
          </>
        ) : (
          <Button
            text="Log in"
            type="secondary"
            onClick={() => signIn("keycloak")}
          />
        )}
      </div>

      <div className="menu-container relative sm:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-primary focus:outline-none"
        >
          <FontAwesomeIcon icon={faBars} className="text-xl" />
        </button>
        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg">
            <Link
              href="/"
              className="block px-4 py-2 hover:bg-secondary hover:text-white"
              onClick={closeMenu}
            >
              <FontAwesomeIcon icon={faHome} className="mr-2" />
              Home
            </Link>
            <Link
              href="/datasets"
              className="block px-4 py-2 hover:bg-secondary hover:text-white"
              onClick={closeMenu}
            >
              <FontAwesomeIcon icon={faDatabase} className="mr-2" />
              Datasets
            </Link>
            <Link
              href="/about"
              className="block px-4 py-2 hover:bg-secondary hover:text-white"
              onClick={closeMenu}
            >
              <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
              About
            </Link>
            {session && (
              <div className="border-b border-gray-200 px-4 py-2">
                <FontAwesomeIcon icon={faUser} className="mr-2" />
                {session?.user?.name}
              </div>
            )}
            {!session && (
              <button
                onClick={() => signIn("keycloak")}
                className="block w-full px-4 py-2 text-left hover:bg-secondary hover:text-white"
              >
                <FontAwesomeIcon icon={faRightToBracket} className="mr-2" />
                Login
              </button>
            )}
            {session && (
              <button
                onClick={handleSignOut}
                className="block w-full px-4 py-2 text-left hover:bg-secondary hover:text-white"
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
