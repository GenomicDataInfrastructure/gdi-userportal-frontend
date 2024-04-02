// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import React from "react";

interface ListItemProps {
  children: React.ReactNode;
  className?: string;
}

function ListItem({ children, className }: ListItemProps) {
  return (
    <li
      className={`box break-words rounded-lg border bg-white-smoke p-8 ${className}`}
    >
      {children}
    </li>
  );
}

export default ListItem;
