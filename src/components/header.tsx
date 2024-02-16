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
import { Session } from "next-auth";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import logo from "../public/egdi-logo-horizontal-full-color-rgb.svg";
import Button from "@/components/Button";
import Avatar from "./avatar";
import LogInOutButton from "./logInOutButton";

async function keycloackSessionLogOut() {
  try {
    await fetch("/api/auth/logout");
  } catch (error) {
    console.error(error);
  }
}

type SessionExtended = Session & { error: string };

function logOutIfSessionError(session: SessionExtended | null, status: string) {
  if (session && status !== "loading" && session?.error) {
    signOut({ callbackUrl: "/" });
  }
}

function Header() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const activeTab = usePathname();

  const buttonMsg = session ? "Log Out" : "Log In";
  const handleClick = session ? handleSignOut : handleSignIn;

  function handleSignIn() {
    signIn("keycloak");
  }

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
      <div className="flex justify-between gap-x-24">
        <Link href="/">
          <Image
            src={logo}
            alt="Logo"
            className="mb-4 mt-4"
            width="190"
            height="69"
          />
        </Link>
        <div className="hidden items-center gap-x-2 text-[14px] font-semibold text-primary sm:flex md:gap-x-5 md:text-lg">
          <Link
            href="/"
            className={`rounded-full border-[1.5px] border-white-smoke px-3 py-1 transition-colors duration-300 hover:border-zinc-200 hover:shadow-sm md:px-7 ${activeTab === "/" ? "bg-zinc-200" : ""}`}
          >
            Home
          </Link>
          <Link
            href="/datasets"
            className={`rounded-full border-[1.5px] border-white-smoke px-3 py-1 transition-colors duration-300 hover:border-zinc-200 hover:shadow-sm md:px-7 ${activeTab.includes("datasets") ? "bg-zinc-200" : ""}`}
          >
            Datasets
          </Link>
          <Link
            href="/about"
            className={`rounded-full border-[1.5px] border-white-smoke px-3 py-1 transition-colors duration-300 hover:border-zinc-200 hover:shadow-sm md:px-7 ${activeTab === "/about" ? "bg-zinc-200" : ""}`}
          >
            About
          </Link>
        </div>
      </div>
      <div className="mr-3 flex items-center gap-x-7">
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
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link
              href="/datasets"
              className="block px-4 py-2 text-primary hover:bg-secondary hover:text-white"
              onClick={closeMenu}
            >
              Datasets
            </Link>
            <Link
              href="/about"
              className="block px-4 py-2 text-primary hover:bg-secondary hover:text-white"
              onClick={closeMenu}
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
