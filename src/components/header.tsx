// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
"use client";
import {
  faBars,
  faRightFromBracket,
  faRightToBracket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import logo from "../public/egdi-logo-horizontal-full-color-rgb.svg";
import Avatar from "./avatar";
import LogInOutButton from "./logInOutButton";

function Header() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const activeTab = usePathname();

  const buttonMsg = session ? "Log Out" : "Log In";
  const handleClick = session ? handleSignOut : handleSignIn;

  function handleSignIn() {
    signIn("keycloak");
  }

  function handleSignOut() {
    signOut({ callbackUrl: "/" });
  }

  return (
    <div className="flex w-full items-center justify-between bg-white-smoke px-4">
      <Link href="/">
        <Image
          src={logo}
          alt="Logo"
          className="mb-4 mt-4"
          width="190"
          height="69"
        />
      </Link>
      <div className="hidden items-center gap-x-5 text-[16px] text-primary sm:flex md:gap-x-11 md:text-lg">
        <Link
          href="/"
          className={`hover:text-info ${activeTab === "/" ? "text-secondary" : ""}`}
        >
          Home
        </Link>
        <Link
          href="/datasets"
          className={`hover:text-info ${activeTab.includes("datasets") ? "text-secondary" : ""}`}
        >
          Datasets
        </Link>
        <Link
          href="/about"
          className={`hover:text-info ${activeTab === "/about" ? "text-secondary" : ""}`}
        >
          About
        </Link>
        {session && <Avatar user={session?.user} />}
        <LogInOutButton message={buttonMsg} handleClick={handleClick} />
      </div>

      <div className="relative sm:hidden">
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
              className="block px-4 py-2 text-primary hover:bg-secondary hover:text-white"
            >
              Home
            </Link>
            <Link
              href="/datasets"
              className="block px-4 py-2 text-primary hover:bg-secondary hover:text-white"
            >
              Datasets
            </Link>
            <Link
              href="/about"
              className="block px-4 py-2 text-primary hover:bg-secondary hover:text-white"
            >
              About
            </Link>
            {session && (
              <div className="border-b border-gray-200 px-4 py-2">
                <FontAwesomeIcon icon={faUser} className="mr-2" />
                {username()}
              </div>
            )}
            {!isAuthenticated && (
              <button
                onClick={handleSignIn}
                className="block w-full px-4 py-2 text-left text-primary hover:bg-secondary hover:text-white"
              >
                <FontAwesomeIcon icon={faRightToBracket} className="mr-2" />
                Login
              </button>
            )}
            {session && (
              <button
                onClick={handleSignOut}
                className="block w-full px-4 py-2 text-left text-primary hover:bg-secondary hover:text-white"
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
