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
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import logo from "../public/egdi-logo-horizontal-full-color-rgb.svg";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const activeTab = usePathname();

  // Mock authentication state and functions
  const isAuthenticated = false;
  const username = () => "User";
  const login = () => console.log("Login");
  const logout = () => console.log("Logout");

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
      <div className="items-center text-lg text-primary sm:flex">
        <Link
          href="/"
          className={`mr-10 hover:text-info ${activeTab === "/" ? "text-secondary" : ""}`}
        >
          Home
        </Link>
        <Link
          href="/datasets"
          className={`mr-10 hover:text-info ${activeTab.includes("datasets") ? "text-secondary" : ""}`}
        >
          Datasets
        </Link>
        <Link
          href="/about"
          className={`mr-10 hover:text-info ${activeTab === "/about" ? "text-secondary" : ""}`}
        >
          About
        </Link>
        {isAuthenticated && <FontAwesomeIcon icon={faUser} />}
        {isAuthenticated && <span>{username()}</span>}
        {!isAuthenticated && (
          <button
            className="rounded border-2 bg-secondary px-4 py-2 text-sm font-bold text-white hover:border-2 hover:border-secondary hover:bg-transparent hover:text-secondary"
            onClick={login}
          >
            <FontAwesomeIcon icon={faRightToBracket} /> Sign In
          </button>
        )}
        {isAuthenticated && (
          <button onClick={logout}>
            <FontAwesomeIcon icon={faRightFromBracket} />
          </button>
        )}
      </div>
      <div className="relative sm:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-primary focus:outline-none"
        >
          <FontAwesomeIcon icon={faBars} />
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
            {isAuthenticated && (
              <div className="border-b border-gray-200 px-4 py-2">
                <FontAwesomeIcon icon={faUser} className="mr-2" />
                {username()}
              </div>
            )}
            {!isAuthenticated && (
              <button
                onClick={login}
                className="block w-full px-4 py-2 text-left text-primary hover:bg-secondary hover:text-white"
              >
                <FontAwesomeIcon icon={faRightToBracket} className="mr-2" />
                Login
              </button>
            )}
            {isAuthenticated && (
              <button
                onClick={logout}
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
