// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import { DatasetBasketProvider } from "@/providers/DatasetBasketProvider";
import { AlertProvider } from "@/providers/AlertProvider";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { PublicEnvScript } from "next-runtime-env";
import Footer from "./Footer";
import SessionProviderWrapper from "./SessionProviderWrapper";
import "./globals.css";
config.autoAddCss = false;
import contentConfig from "@/config/contentConfig";
import { FilterProvider } from "@/providers/filters/FilterProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>{contentConfig.siteTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={contentConfig.siteDescription} />
        <link rel="icon" href="/secondary-logo-v1.png" type="image/png" />
        <PublicEnvScript />
        <link rel="stylesheet" href={"/palette.css"} />
        <link rel="stylesheet" href={"/fonts.css"} />
      </head>
      <body>
        <AlertProvider>
          <DatasetBasketProvider>
            <div className="grid h-screen w-full grid-rows-[auto_1fr_auto]">
              <SessionProviderWrapper>
                <div>
                  <Header />
                </div>
                <FilterProvider>
                  <div>{children}</div>
                </FilterProvider>
                <Navbar />
                <Footer />
              </SessionProviderWrapper>
            </div>
          </DatasetBasketProvider>
        </AlertProvider>
      </body>
    </html>
  );
}
