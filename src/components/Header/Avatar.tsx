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
import { User } from "@/app/api/auth/types/user.types";
import { keycloackSessionLogOut } from "@/utils/logout";
import { faSignOut, faUser } from "@fortawesome/free-solid-svg-icons";
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

function Avatar({ user }: Readonly<AvatarProps>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-disclaimer p-[10px] text-sm text-white shadow-sm transition-all duration-300 hover:bg-hover-color md:p-[12px] md:text-base lg:h-11 lg:w-11">
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
          <div className="border-b-[1.5px] border-surface px-4 py-3 text-base">
            <FontAwesomeIcon icon={faUser} className="mr-2 text-lg" />
            {user?.name}
          </div>
          <DropdownMenuItem
            className="cursor-pointer gap-x-3 px-4 py-3 text-base transition-all duration-300 hover:bg-hover-color hover:text-white"
            onClick={handleSignOut}
          >
            <FontAwesomeIcon icon={faSignOut} className="text-lg" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Avatar;
