// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import Header from "@/components/Header";
import Disclaimer from "@/components/disclaimer";
import Footer from "@/components/footer";
import SessionProviderWrapper from "@/components/utils/sessionProviderWrapper";
import { ApplicationDetailsProvider } from "@/providers/ApplicationProvider";
import { DatasetBasketProvider } from "@/providers/DatasetBasketProvider";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { PublicEnvScript } from "next-runtime-env";
import { exposeFont, satoshiFont, tabularFont } from "../utils/fonts";
import "./globals.css";
config.autoAddCss = false;

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
        <PublicEnvScript />
      </head>
      <body>
        <DatasetBasketProvider>
          <ApplicationDetailsProvider>
            <div className="grid h-screen w-full grid-rows-[auto_1fr_auto]">
              <SessionProviderWrapper>
                <div>
                  <Header />
                </div>
                <div>{children}</div>
                <div>
                  <Disclaimer />
                  <Footer />
                </div>
              </SessionProviderWrapper>
            </div>
          </ApplicationDetailsProvider>
        </DatasetBasketProvider>
      </body>
    </html>
  );
}
