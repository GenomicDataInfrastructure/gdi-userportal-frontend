// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { ListedApplication } from "@/types/application.types";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export default function ApplicationItem({
  application,
  collapsable,
}: {
  application: ListedApplication;
  collapsable: boolean;
}) {
  const [collapsed, setCollapsed] = useState(true);
  const toggleCollapsed = () => setCollapsed(!collapsed);

  return collapsable && collapsed ? (
    <button
      className="flex w-full cursor-pointer items-center justify-between"
      onClick={toggleCollapsed}
    >
      <span className="text-xl text-primary">
        Application Id: {application.id}
      </span>
      <FontAwesomeIcon
        icon={collapsed ? faChevronDown : faChevronUp}
        className="text-sm"
      />
    </button>
  ) : (
    <div className="flex w-full flex-col items-center">
      <div className="w-full">
        <button
          className="flex w-full cursor-pointer items-center justify-between"
          onClick={toggleCollapsed}
        >
          <span className="text-xl text-primary">
            Application Id: {application.id}
          </span>
          {collapsable ? (
            <FontAwesomeIcon
              icon={collapsed ? faChevronDown : faChevronUp}
              className="text-sm"
            />
          ) : (
            <div></div>
          )}
        </button>
      </div>

      <div className="flex justify-center gap-10 p-6">
        <span className="px-2">State: {application.currentState}</span>
        <span className="px-2">
          State Modified: {application.stateChangedAt?.split("T")[0]}
        </span>
      </div>
    </div>
  );
}
