// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import type { Metadata } from "next";
import Navbar from "../components/navbar";
import { exposeFont, satoshiFont, tabularFont } from "../utils/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "GDI User Portal",
  description: "GDI User Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${exposeFont.variable} ${tabularFont.variable} ${satoshiFont.variable}`}
    >
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
