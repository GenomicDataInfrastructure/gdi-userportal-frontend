// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";
import Chip from "./Chip";
import React from "react";

interface ChipsProps {
  chips: string[];
  className?: string;
  hrefs?: Array<string | undefined>;
}

const Chips: React.FC<ChipsProps> = ({ chips, className, hrefs }) => (
  <div className={`flex flex-wrap gap-2 text-xs sm:text-[14px] font-title`}>
    {chips.map((chip, index) => (
      <Chip
        key={index}
        chip={chip}
        className={className}
        href={hrefs?.[index]}
      />
    ))}
  </div>
);

export default Chips;
