// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type ActiveFilterPillProps = {
  onRemove: () => void;
  removeLabel: string;
  children: React.ReactNode;
};

export default function ActiveFilterPill({
  onRemove,
  removeLabel,
  children,
}: ActiveFilterPillProps) {
  return (
    <div className="flex items-center gap-2 bg-surface rounded-lg px-3 py-1">
      <span className="font-body text-md">{children}</span>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`${removeLabel}: ${String(children)}`}
        className="flex min-h-6 min-w-6 items-center justify-center rounded-sm text-info hover:text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
      >
        <FontAwesomeIcon
          icon={faTimes}
          className="h-4 w-4"
          aria-hidden="true"
        />
      </button>
    </div>
  );
}
