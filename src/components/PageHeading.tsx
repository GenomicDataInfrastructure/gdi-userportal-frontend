// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { cn } from "@/utils/tailwindMerge";
import React from "react";

interface PageHeadingProps {
  children: React.ReactNode;
  className?: string;
}

const PageHeading: React.FC<PageHeadingProps> = ({ children, className }) => (
  <h1
    className={cn(
      "text-2xl font-bold text-primary sm:text-3xl lg:text-4xl",
      className
    )}
  >
    {children}
  </h1>
);

export default PageHeading;
