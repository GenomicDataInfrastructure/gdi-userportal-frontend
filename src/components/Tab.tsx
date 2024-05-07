// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import List from "./List";
import ListItem from "./List/ListItem";

type ITabItem = {
  name: string;
  icon: IconDefinition;
};

type TabItemProps = {
  tabItem: ITabItem;
  activeTab: string;
  setActiveTab: (activeTab: string) => void;
};

function TabItem({ tabItem, activeTab, setActiveTab }: TabItemProps) {
  return (
    <button
      onClick={() => setActiveTab(tabItem.name)}
      className={`flex w-full items-center justify-center gap-x-3 py-4 hover:bg-white-smoke focus:text-primary lg:px-20 xl:px-32 ${tabItem.name.toLowerCase() === activeTab ? "text-primary" : "text-black"} transition-all duration-300 ease-linear`}
    >
      <FontAwesomeIcon icon={tabItem.icon} />
      <span>{tabItem.name.toUpperCase()}</span>
    </button>
  );
}

type TabComponentProps = {
  tabItems: ITabItem[];
  activeTab: string;
  setActiveTab: (activeTab: string) => void;
};

function TabComponent({
  tabItems,
  activeTab,
  setActiveTab,
}: TabComponentProps) {
  return (
    <>
      <List className="flex-row">
        {tabItems.map((tabItem: ITabItem) => (
          <ListItem
            className="w-full break-normal border-0 bg-white p-0"
            key={tabItem.name}
          >
            <TabItem
              tabItem={tabItem}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </ListItem>
        ))}
      </List>
      <List className="flex flex-row justify-around">
        {tabItems.map((tabItem: ITabItem) => (
          <ListItem
            className="w-full break-normal border-0 bg-white p-0"
            key={tabItem.name}
          >
            <div
              className={`relative -top-0.5 w-full flex-1 border transition-all duration-300 ease-linear ${tabItem.name.toLowerCase() === activeTab ? "border-primary" : "borders-white-smoke"}`}
            ></div>
          </ListItem>
        ))}
      </List>
    </>
  );
}

export { TabComponent, TabItem, type ITabItem };
