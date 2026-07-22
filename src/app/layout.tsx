// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/ScrollToTop";
import { routing, type AppLocale } from "@/i18n/routing";
import { DatasetBasketProvider } from "@/providers/DatasetBasketProvider";
import { AlertProvider } from "@/providers/AlertProvider";
import { NotificationsProvider } from "@/providers/notifications/NotificationsProvider";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { NextIntlClientProvider } from "next-intl";
import { headers } from "next/headers";
import { PublicEnvScript } from "next-runtime-env";
import Footer from "./Footer";
import SessionProviderWrapper from "./SessionProviderWrapper";
import "./globals.css";
config.autoAddCss = false;
import contentConfig from "@/config/contentConfig";
import { FilterProvider } from "@/providers/filters/FilterProvider";
import { getMessages } from "@/i18n/messages";

function isValidLocale(locale: string): locale is AppLocale {
  return (routing.locales as readonly string[]).includes(locale);
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requestHeaders = await headers();
  const headerLocale = requestHeaders.get("x-next-intl-locale");
  const locale =
    headerLocale && isValidLocale(headerLocale)
      ? headerLocale
      : routing.defaultLocale;
  const messages = getMessages(locale);

  return (
    <html lang={locale}>
      <head>
        <title>{contentConfig.siteTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={contentConfig.siteDescription} />
        <link rel="icon" href={contentConfig.favicon} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
        <PublicEnvScript />
        <link rel="stylesheet" href={"/palette.css"} />
        <link rel="stylesheet" href={"/fonts.css"} />
      </head>
      <body>
        <ScrollToTop />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AlertProvider>
            <DatasetBasketProvider>
              <div className="grid h-screen w-full grid-rows-[auto_1fr_auto]">
                <SessionProviderWrapper>
                  <NotificationsProvider>
                    <div>
                      <Header />
                    </div>
                    <FilterProvider>
                      <div>{children}</div>
                    </FilterProvider>
                    <Navbar />
                    <Footer />
                  </NotificationsProvider>
                </SessionProviderWrapper>
              </div>
            </DatasetBasketProvider>
          </AlertProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
