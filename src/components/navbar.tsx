// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
"use client";
import React, { useState, useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../public/egdi-logo-horizontal-full-color-rgb.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faRightToBracket,
  faRightFromBracket,
  faBars,
} from "@fortawesome/free-solid-svg-icons";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Mock authentication state and functions
  const isAuthenticated = false;
  const username = () => "User";
  const login = () => console.log("Login");
  const logout = () => console.log("Logout");

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between pr-4">
        <Link href="/">
          <Image
            src={logo}
            alt="Logo"
            className="mt-4 mb-4"
            width="190"
            height="69"
          />
        </Link>
        <div className="hidden sm:flex text-primary hover:text-secondary">
          {isAuthenticated && <FontAwesomeIcon icon={faUser} />}
          {isAuthenticated && <span>{username()}</span>}
          {!isAuthenticated && (
            <button className="cursor-pointer" onClick={login}>
              <FontAwesomeIcon icon={faRightToBracket} /> Login
            </button>
          )}
          {isAuthenticated && (
            <button onClick={logout}>
              <FontAwesomeIcon icon={faRightFromBracket} />
            </button>
          )}
        </div>
        <div className="sm:hidden relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-primary focus:outline-none"
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
          {isMenuOpen && (
            <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white">
              <Link
                href="/"
                className="text-primary hover:bg-secondary hover:text-white block px-4 py-2"
              >
                Home
              </Link>
              <Link
                href="/datasets"
                className="text-primary hover:bg-secondary hover:text-white block px-4 py-2"
              >
                Datasets
              </Link>
              <Link
                href="/about"
                className="text-primary hover:bg-secondary hover:text-white block px-4 py-2"
              >
                About
              </Link>
              {isAuthenticated && (
                <div className="px-4 py-2 border-b border-gray-200">
                  <FontAwesomeIcon icon={faUser} className="mr-2" />
                  {username()}
                </div>
              )}
              {!isAuthenticated && (
                <a
                  onClick={login}
                  className="text-primary hover:bg-secondary hover:text-white block px-4 py-2"
                >
                  <FontAwesomeIcon icon={faRightToBracket} className="mr-2" />
                  Login
                </a>
              )}
              {isAuthenticated && (
                <a
                  onClick={logout}
                  className="text-primary hover:bg-secondary hover:text-white block px-4 py-2"
                >
                  <FontAwesomeIcon icon={faRightFromBracket} className="mr-2" />
                  Logout
                </a>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end bg-info border-t-8 border-secondary pr-4 py-4 text-lg text-white">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        <Link href="/datasets" className="ml-4 hover:text-primary">
          Datasets
        </Link>
        <Link href="/about" className="ml-4 hover:text-primary">
          About
        </Link>
      </div>
    </div>
  );
}

export default Header;
