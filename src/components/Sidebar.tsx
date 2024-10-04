// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { ReactNode } from "react";

export function createTextItem(item: string) {
  return <span className="break-all">{item}</span>;
}

export function createTextItems(items: string[]) {
  return (
    <ul>
      {items.map((value, index) => {
        return (
          <li key={index} className="break-words">
            <span>{value}</span>
          </li>
        );
      })}
    </ul>
  );
}

type SidebarItem = {
  label: string;
  value: ReactNode;
  hideItem?: boolean;
};

interface SidebarProps {
  items: SidebarItem[];
}

function Sidebar({ items }: Readonly<SidebarProps>) {
  return (
    <aside className="flex flex-col gap-5">
      {items.map(
        (item) =>
          !item.hideItem && (
            <div
              className="flex flex-col rounded-2xl px-7 py-5 gap-y-4"
              style={{ backgroundColor: "var(--color-surface)" }}
              key={item.label}
            >
              <h3 className="sm:text-md lg:text-lg font-bold">{item.label}</h3>
              <span className="text-sm sm:text-base lg:text-lg">
                {item.value}
              </span>
            </div>
          )
      )}
    </aside>
  );
}

export type { SidebarItem };
export default Sidebar;
