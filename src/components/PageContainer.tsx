// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import React from "react";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div
      className={`container mx-auto  mt-8 px-4 sm:px-2 lg:px-0 ${className}`}
    >
      {children}
    </div>
  );
}

export default PageContainer;
