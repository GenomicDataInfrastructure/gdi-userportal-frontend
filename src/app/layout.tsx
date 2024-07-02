// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import Header from "@/components/Header";
import { DatasetBasketProvider } from "@/providers/DatasetBasketProvider";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { PublicEnvScript } from "next-runtime-env";
import Footer from "./Footer";
import SessionProviderWrapper from "./SessionProviderWrapper";
import "./globals.css";
config.autoAddCss = false;
import { fontVariables } from "@/utils/fontSelector";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={fontVariables}>
      <head>
        <title>{process.env.NEXT_PUBLIC_SITE_TITLE}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content={process.env.NEXT_PUBLIC_SITE_DESCRIPTION}
        />
        <PublicEnvScript />
        {process.env.NEXT_PUBLIC_CUSTOM_STYLE_URL && (
          <link
            rel="stylesheet"
            href={process.env.NEXT_PUBLIC_CUSTOM_STYLE_URL}
          />
        )}
      </head>
      <body>
        <DatasetBasketProvider>
          <div className="grid h-screen w-full grid-rows-[auto_1fr_auto]">
            <SessionProviderWrapper>
              <div>
                <Header />
              </div>
              <div>{children}</div>
              <Footer />
            </SessionProviderWrapper>
          </div>
        </DatasetBasketProvider>
      </body>
    </html>
  );
}
