// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { KeyboardEvent, useRef } from "react";

type ITabItem = {
  name: string;
  label: string;
  icon: IconDefinition;
};

type TabItemProps = {
  tabItem: ITabItem;
  activeTab: string;
  setActiveTab: (activeTab: string) => void;
  panelId: string;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
};

function TabItem({
  tabItem,
  activeTab,
  setActiveTab,
  panelId,
  onKeyDown,
}: Readonly<TabItemProps>) {
  const selected = tabItem.name.toLowerCase() === activeTab;

  return (
    <button
      id={`requests-${tabItem.name}-tab`}
      type="button"
      role="tab"
      aria-selected={selected}
      aria-controls={panelId}
      tabIndex={selected ? 0 : -1}
      onClick={() => setActiveTab(tabItem.name)}
      onKeyDown={onKeyDown}
      className={`flex w-full items-center justify-center gap-x-3 py-4 hover:bg-surface focus:text-primary lg:px-20 xl:px-32 ${
        selected ? "text-primary" : "text-black"
      } rounded-md transition-all duration-300 ease-linear focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring`}
    >
      <FontAwesomeIcon icon={tabItem.icon} />
      <span>{tabItem.label}</span>
    </button>
  );
}

type TabComponentProps = {
  tabItems: ITabItem[];
  activeTab: string;
  setActiveTab: (activeTab: string) => void;
  panelId: string;
};

function TabComponent({
  tabItems,
  activeTab,
  setActiveTab,
  panelId,
}: Readonly<TabComponentProps>) {
  const tabListRef = useRef<HTMLDivElement>(null);

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
      return;
    }

    event.preventDefault();
    const tabs = Array.from(
      tabListRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ??
        []
    );
    const currentIndex = tabs.indexOf(event.currentTarget);
    const nextIndex =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? tabs.length - 1
          : (currentIndex +
              (event.key === "ArrowRight" ? 1 : -1) +
              tabs.length) %
            tabs.length;
    const nextTab = tabItems[nextIndex];
    if (!nextTab) return;

    tabs[nextIndex]?.focus();
    setActiveTab(nextTab.name);
  }

  return (
    <>
      <div ref={tabListRef} role="tablist" className="flex w-full flex-row">
        {tabItems.map((tabItem: ITabItem) => (
          <div className="w-full bg-white" key={tabItem.name}>
            <TabItem
              tabItem={tabItem}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              panelId={panelId}
              onKeyDown={handleKeyDown}
            />
          </div>
        ))}
      </div>
      <div aria-hidden="true" className="flex w-full flex-row justify-around">
        {tabItems.map((tabItem: ITabItem) => (
          <div className="w-full bg-white" key={tabItem.name}>
            <div
              className={`relative -top-0.5 w-full flex-1 border transition-all duration-300 ease-linear ${
                tabItem.name.toLowerCase() === activeTab
                  ? "border-primary"
                  : "borders-surface"
              }`}
            ></div>
          </div>
        ))}
      </div>
    </>
  );
}

export { TabComponent, TabItem, type ITabItem };
