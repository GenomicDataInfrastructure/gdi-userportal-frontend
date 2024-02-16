import Image from "next/image";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  faBell,
  faDatabase,
  faFolder,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
type User = {
  name?: string;
  email?: string;
  image?: string;
};

type AvatarProps = {
  user?: User;
};

function getInitials(name: string | undefined | null) {
  if (!name) return "";

  return name
    .split(" ")
    .map((n) => n[0])
    .join("");
}

function Avatar({ user }: AvatarProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative rounded-full bg-gray-400 p-[10px] text-sm text-white shadow-sm transition-all duration-300 hover:opacity-90">
          {user?.image ? (
            <Image src={user.image} alt="avatar" className="rounded-full" />
          ) : (
            <p>{getInitials(user?.name)}</p>
          )}
          <div className="absolute right-0 top-0.5 h-3 w-3 rounded-full bg-info shadow-lg"></div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white">
        <DropdownMenuLabel className="font-bold text-gray-600">
          My Account
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="gap-x-3 transition-all duration-300 hover:bg-white-smoke">
            <FontAwesomeIcon icon={faBell} className="text-sm" />
            <span>Notifications (1)</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-x-3 transition-all duration-300 hover:bg-white-smoke">
            <FontAwesomeIcon icon={faDatabase} className="text-sm" />
            <span>Datasets</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-x-3 transition-all duration-300 hover:bg-white-smoke">
            <FontAwesomeIcon icon={faFolder} className="text-sm" />
            <span>Applications</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-x-3 transition-all duration-300 hover:bg-white-smoke">
            <FontAwesomeIcon icon={faGear} className="text-sm" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Avatar;
