// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import React from "react";

interface CenteredListContainerProps {
  children: React.ReactNode;
  className?: string;
}

function CenteredListContainer({
  children,
  className,
}: CenteredListContainerProps) {
  return (
    <div
      className={`m-auto mt-8 flex w-full flex-col items-center gap-4 lg:w-2/3 ${className}`}
    >
      {children}
    </div>
  );
}

export default CenteredListContainer;
