// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
"use client";
import React from "react";

interface ChipsProps {
  chips: string[];
  className?: string;
}

const Chips: React.FC<ChipsProps> = ({ chips, className }) => (
  <div className={`flex flex-row flex-wrap gap-3 ${className}`}>
    {chips.map((chip, index) => (
      <div
        key={index}
        className="rounded bg-info px-2.5 py-0.5 text-sm font-semibold text-white"
      >
        {chip}
      </div>
    ))}
  </div>
);

export default Chips;
