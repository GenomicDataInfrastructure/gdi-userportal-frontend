// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import { cn } from "@/utils/tailwindMerge";
import React from "react";

interface ListProps {
  className?: string;
  children: React.ReactNode;
}

function List({ children, className }: ListProps) {
  return (
    <ul className={cn("flex w-full flex-col gap-y-4", className)}>
      {children}
    </ul>
  );
}

cn();
export default List;
