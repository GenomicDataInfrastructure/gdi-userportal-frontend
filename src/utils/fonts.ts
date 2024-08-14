// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import localFont from "next/font/local";

export const exposeFont = localFont({
  src: [
    {
      path: "./../public/fonts/Expose-Regular.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./../public/fonts/Expose-Regular.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "./../public/fonts/Expose-Regular.ttf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-medium",
  display: "swap",
});

export const tabularFont = localFont({
  src: [
    {
      path: "./../public/fonts/Tabular-Regular.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./../public/fonts/Tabular-Regular.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "./../public/fonts/Tabular-Regular.ttf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-sans",
  display: "swap",
});

export const satoshiFont = localFont({
  src: [
    {
      path: "./../public/fonts/Satoshi-Regular.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./../public/fonts/Satoshi-Regular.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "./../public/fonts/Satoshi-Regular.ttf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-light",
  display: "swap",
});

export const quicksandFont = localFont({
  src: [
    {
      path: "./../public/fonts/Quicksand-Regular.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./../public/fonts/Quicksand-Regular.woff",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-light",
  display: "swap",
});

export const quicksandMFont = localFont({
  src: [
    {
      path: "./../public/fonts/Quicksand-Regular.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./../public/fonts/Quicksand-Regular.woff",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-medium",
  display: "swap",
});

export const nunitoFont = localFont({
  src: [
    {
      path: "./../public/fonts/Nunito-Regular.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./../public/fonts/Nunito-Regular.woff",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-sans",
  display: "swap",
});

export const fontMap = {
  expose: exposeFont,
  tabular: tabularFont,
  satoshi: satoshiFont,
  nunito: nunitoFont,
  nunitom: quicksandMFont,
  quicksand: quicksandFont,
};
