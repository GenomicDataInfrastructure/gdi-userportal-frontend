// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@/types/user.types";
import { keycloackSessionLogOut } from "@/utils/auth";
import {
  faDatabase,
  faFolder,
  faGear,
  faSignOut,
} from "@fortawesome/free-solid-svg-icons";
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
        <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-info p-[8px] text-xs text-white shadow-sm transition-all duration-300 hover:opacity-90 md:h-9 md:w-9 md:p-[10px] md:text-[13px]">
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
          <DropdownMenuItem className="cursor-pointer gap-x-3 transition-all duration-300 hover:bg-primary hover:text-white">
            <FontAwesomeIcon icon={faDatabase} className="text-sm" />
            <span>Datasets</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer gap-x-3 transition-all duration-300 hover:bg-primary hover:text-white">
            <FontAwesomeIcon icon={faFolder} className="text-sm" />
            <span>Applications</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer gap-x-3 transition-all duration-300 hover:bg-primary hover:text-white">
            <FontAwesomeIcon icon={faGear} className="text-sm" />
            <span>Settings</span>
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
  );
}

export default Avatar;
