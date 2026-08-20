// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

type HarvesterRunDetailFieldProps = {
  label: string;
  children: React.ReactNode;
  className?: string;
};

export default function HarvesterRunDetailField({
  label,
  children,
  className = "",
}: Readonly<HarvesterRunDetailFieldProps>) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className={className}>{children}</p>
    </div>
  );
}
