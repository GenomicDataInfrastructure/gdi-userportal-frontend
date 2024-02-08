// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
"use client";
import React, { useState } from "react";
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
    <div className="flex items-center justify-between bg-info-100 w-full px-4">
      <Link href="/">
        <Image
          src={logo}
          alt="Logo"
          className="mt-4 mb-4"
          width="190"
          height="69"
        />
      </Link>
      <div className="hidden sm:flex items-center text-primary hover:text-secondary text-lg">
        <Link href="/" className="mr-10 hover:text-primary">
          Home
        </Link>
        <Link href="/datasets" className="mr-10 hover:text-primary">
          Datasets
        </Link>
        <Link href="/about" className="mr-10 hover:text-primary">
          About
        </Link>
        {isAuthenticated && <FontAwesomeIcon icon={faUser} />}
        {isAuthenticated && <span>{username()}</span>}
        {!isAuthenticated && (
          <button
            className="bg-secondary border-2 hover:bg-transparent hover:border-2 hover:text-secondary hover:border-secondary text-white text-sm font-bold py-2 px-4 rounded"
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
              <button
                onClick={login}
                className="text-primary hover:bg-secondary hover:text-white block px-4 py-2 w-full text-left"
              >
                <FontAwesomeIcon icon={faRightToBracket} className="mr-2" />
                Login
              </button>
            )}
            {isAuthenticated && (
              <button
                onClick={logout}
                className="text-primary hover:bg-secondary hover:text-white block px-4 py-2 w-full text-left"
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
