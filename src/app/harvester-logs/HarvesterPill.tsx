// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

type HarvesterPillProps = {
  children: React.ReactNode;
  className?: string;
};

export default function HarvesterPill({
  children,
  className = "",
}: Readonly<HarvesterPillProps>) {
  return (
    <span
      className={`shrink-0 px-2 py-0.5 rounded-full text-xs border ${className}`}
    >
      {children}
    </span>
  );
}
