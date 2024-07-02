// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { ReactNode } from "react";
import LinkItem from "./LinkItem";

export function createTextItem(item: string) {
  return <span className="break-all">{item}</span>;
}

export function createTextItems(items: string[]) {
  return (
    <ul>
      {items.map((value, index) => {
        return (
          <li key={index} className="break-all">
            <span>{value}</span>
          </li>
        );
      })}
    </ul>
  );
}

export function createLinkItem(link: SidebarLink) {
  return <LinkItem link={link}></LinkItem>;
}

export function createLinkItems(links: SidebarLink[]) {
  return (
    <ul>
      {links.map((link, index) => (
        <li key={index} className="list-none">
          {createLinkItem(link)}
        </li>
      ))}
    </ul>
  );
}

type SidebarLink = {
  label: string;
  url: string;
};

type SidebarItem = {
  label: string;
  value: ReactNode;
};

interface SidebarProps {
  items: SidebarItem[];
}

function Sidebar({ items }: SidebarProps) {
  return (
    <div className="border-gray flex flex-col gap-3 rounded-sm border-2 bg-surface p-5 text-black">
      {items.map((item) => (
        <div className="mb-3" key={item.label}>
          <h3 className="text-base text-primary sm:text-lg lg:text-xl">
            {item.label}
          </h3>
          <span className="text-sm sm:text-base lg:text-lg">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

export type { SidebarItem, SidebarLink };
export default Sidebar;
