// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";
import Chip from "./Chip";
import React from "react";

interface ChipsProps {
  chips: string[];
  className?: string;
}

const Chips: React.FC<ChipsProps> = ({ chips, className }) => (
  <div className={`flex flex-wrap gap-2 text-xs sm:text-[14px] font-title`}>
    {chips.map((chip, index) => (
      <Chip key={index} chip={chip} className={className} />
    ))}
  </div>
);

export default Chips;
