// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
"use client";
import React from "react";

interface PageHeadingProps {
  children: React.ReactNode;
  className?: string;
}

const PageHeading: React.FC<PageHeadingProps> = ({ children, className }) => (
  <h1
    className={`text-2xl font-bold text-primary sm:text-3xl lg:text-4xl ${className}`}
  >
    {children}
  </h1>
);

export default PageHeading;
