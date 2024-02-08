// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import Disclaimer from "@/components/disclaimer";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { exposeFont, satoshiFont, tabularFont } from "../utils/fonts";
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
        <div className="grid h-screen grid-rows-[auto_1fr_auto] w-screen">
          <div className="bg-[#f5f5f5]">
            <Navbar />
          </div>
          <div>{children}</div>
          <div>
            <Disclaimer />
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
