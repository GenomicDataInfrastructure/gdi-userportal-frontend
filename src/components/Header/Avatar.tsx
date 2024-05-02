// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import { useWindowSize } from "@/hooks";
import { User } from "@/types/user.types";
import { keycloackSessionLogOut } from "@/utils/auth";
import { pixelWidthToScreenSize } from "@/utils/windowSize";
import {
  faAngleDown,
  faDatabase,
  faFile,
  faSignOut,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

type AvatarProps = {
  user: User;
};

function handleSignOut() {
  keycloackSessionLogOut().then(() => signOut({ callbackUrl: "/" }));
}

function getInitials(name?: string) {
  if (!name) return null;

  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function Avatar({ user }: AvatarProps) {
  const { width } = useWindowSize();
  const screenSize = pixelWidthToScreenSize(width);

  const username =
    screenSize === "SM" || screenSize === "MD"
      ? getInitials(user?.name)
      : user?.name;

  return (
    <div className="flex gap-x-2">
      <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-info p-[8px] text-xs text-white shadow-sm transition-colors duration-300 hover:bg-primary md:h-9 md:w-9 md:p-[10px] md:text-[13px]">
        <Link href="/profile">
          {user?.image ? (
            <Image src={user.image} alt="avatar" className="rounded-full" />
          ) : (
            <FontAwesomeIcon icon={faUser} />
          )}
        </Link>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-x-1 md:gap-x-2">
            <p className="text-[10px] font-bold md:text-xs">{username}</p>
            <FontAwesomeIcon
              icon={faAngleDown}
              className="text-sm text-gray-500"
            />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white">
          <DropdownMenuGroup>
            <DropdownMenuItem className="cursor-pointer gap-x-3 transition-all duration-300 hover:bg-primary hover:text-white">
              <FontAwesomeIcon icon={faFile} className="text-sm" />
              <span>Applications</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer gap-x-3 transition-all duration-300 hover:bg-primary hover:text-white">
              <FontAwesomeIcon icon={faDatabase} className="text-sm" />
              <span>My Datasets</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer gap-x-3 transition-all duration-300 hover:bg-primary hover:text-white"
              onClick={handleSignOut}
            >
              <FontAwesomeIcon icon={faSignOut} className="text-sm" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default Avatar;
