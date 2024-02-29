// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import React from "react";

interface PageSubHeadingProps {
  children: React.ReactNode;
  className?: string;
}

const PageSubHeading: React.FC<PageSubHeadingProps> = ({
  children,
  className,
}) => (
  <h3
    className={`text-lg font-bold text-primary sm:text-xl lg:text-2xl ${className}`}
  >
    {children}
  </h3>
);

export default PageSubHeading;
