// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";
import { cn } from "@/utils/tailwindMerge";
import React from "react";

interface ChipProps {
  chip: string;
  className?: string;
  href?: string;
}

const Chip: React.FC<ChipProps> = ({ chip, className, href }) => {
  const chipClassName = cn("px-4 py-2 rounded-lg bg-warning", className);

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(chipClassName, "hover:underline")}
      >
        {chip}
      </a>
    );
  }

  return <div className={chipClassName}>{chip}</div>;
};

export default Chip;
