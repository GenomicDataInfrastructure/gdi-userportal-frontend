// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";
import { cn } from "@/utils/tailwindMerge";
import React from "react";

interface ChipProps {
  chip: string;
  className?: string;
}

const Chip: React.FC<ChipProps> = ({ chip, className }) => (
  <div
    className={cn(
      "rounded bg-warning px-2.5 py-0.5 text-sm font-semibold",
      className,
    )}
  >
    {chip}
  </div>
);

export default Chip;
