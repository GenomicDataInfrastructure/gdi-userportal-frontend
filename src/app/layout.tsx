// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import { exposeFont, tabularFont, satoshiFont } from "../utils/fonts";
import Navbar from "../components/navbar";
import "./globals.css";

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
      <head>
        <title>GDI - User Portal</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
