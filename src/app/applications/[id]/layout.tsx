// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { ApplicationProvider } from "@/providers/application/ApplicationProvider";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ApplicationProvider>
      <div>{children}</div>
    </ApplicationProvider>
  );
}
