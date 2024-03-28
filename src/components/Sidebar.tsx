// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

function createTextItems(values: string[]) {
  return (
    <ul>
      {values.map((value, index) => (
        <li key={index}>
          <span>{value as string}</span>
        </li>
      ))}
    </ul>
  );
}

function createLinkItem(link: SidebarLink) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noreferrer"
      className="hover:underline"
    >
      {link.label}
    </a>
  );
}

function createLinkItems(links: SidebarLink[]) {
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

function renderItemValue(
  item: SidebarItem,
): string | string[] | JSX.Element | JSX.Element[] {
  if (Array.isArray(item.value) && item.isLink) {
    return createLinkItems(item.value as SidebarLink[]);
  } else if (Array.isArray(item.value)) {
    return createTextItems(item.value as string[]);
  } else if (item.isLink) {
    return createLinkItem(item.value as SidebarLink);
  }
  return item.value as string;
}

type SidebarLink = {
  label: string;
  url: string;
};

type SidebarItem = {
  label: string;
  value: string | string[] | SidebarLink | SidebarLink[];
  isLink: boolean;
};

interface SidebarProps {
  items: SidebarItem[];
}

function Sidebar({ items }: SidebarProps) {
  return (
    <div className="border-gray flex flex-col gap-3 rounded-sm border-2 bg-white-smoke p-5 text-black">
      {items.map((item) => (
        <div className="mb-3" key={item.label}>
          <h3 className="text-base text-primary sm:text-lg lg:text-xl">
            {item.label}
          </h3>
          <span className="text-sm sm:text-base lg:text-lg">
            {renderItemValue(item)}
          </span>
        </div>
      ))}
    </div>
  );
}

export type { SidebarItem, SidebarLink };
export default Sidebar;
