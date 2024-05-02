// SPDX-FileCopyrightText: 2024 PNED G.I.E.
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
  <div className={`flex flex-row flex-wrap gap-3 break-all`}>
    {chips.map((chip, index) => (
      <Chip key={index} chip={chip} className={className} />
    ))}
  </div>
);

export default Chips;
