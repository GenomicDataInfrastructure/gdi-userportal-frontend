// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";
import { cn } from "@/utils/tailwindMerge";
import React from "react";

interface ChipProps {
  chip: string | { value: string; label: string };
  className?: string;
}

const Chip: React.FC<ChipProps> = ({ chip, className }) => {
  const displayText = typeof chip === "string" ? chip : chip.label;
  return (
    <div className={cn("px-4 py-2 rounded-lg bg-warning", className)}>
      {displayText}
    </div>
  );
};

export default Chip;
