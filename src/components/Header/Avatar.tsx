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
import { User } from "@/types/user.types";
import { keycloackSessionLogOut } from "@/utils/auth";
import { faSignOut } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signOut } from "next-auth/react";
import Image from "next/image";

type AvatarProps = {
  user: User;
};

function getInitials(name?: string) {
  if (!name) return null;

  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function handleSignOut() {
  keycloackSessionLogOut().then(() => signOut({ callbackUrl: "/" }));
}

function Avatar({ user }: AvatarProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-info p-[8px] text-xs text-white shadow-sm transition-all duration-300 hover:bg-hover-color md:p-[10px] md:text-[13px] lg:h-9 lg:w-9">
          {user?.image ? (
            <Image src={user.image} alt="avatar" className="rounded-full" />
          ) : (
            <p className="flex items-center justify-center">
              {getInitials(user?.name)}
            </p>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white">
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer gap-x-3 transition-all duration-300 hover:bg-hover-color hover:text-white"
            onClick={handleSignOut}
          >
            <FontAwesomeIcon icon={faSignOut} className="text-sm" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Avatar;
