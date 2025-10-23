// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type ActiveFilterPillProps = {
  onRemove: () => void;
  children: React.ReactNode;
};

export default function ActiveFilterPill({
  onRemove,
  children,
}: ActiveFilterPillProps) {
  return (
    <div className="flex items-center gap-2 bg-surface rounded-lg px-3 py-1">
      <span className="font-body text-md">{children}</span>
      <button onClick={onRemove} className="text-info hover:text-secondary">
        <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
      </button>
    </div>
  );
}
