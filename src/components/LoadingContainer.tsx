// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import React from "react";

interface LoadingContainerProps {
  text: string;
  className?: string;
}

function LoadingContainer({
  text,
  className,
}: Readonly<LoadingContainerProps>) {
  return (
    <div
      className={`w-full ${className}`}
      style={{ height: "calc(100vh - 100px)" }}
    >
      <div className="flex h-full items-center justify-center">
        <div className="text-lg font-semibold text-primary">{text}</div>
      </div>
    </div>
  );
}

export default LoadingContainer;
