// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import localFont from 'next/font/local';
import { Roboto } from 'next/font/google';

export const exposeFont = localFont({
  src: [
    {
      path: './../public/fonts/Expose-Regular.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './../public/fonts/Expose-Regular.woff',
      weight: '500',
      style: 'normal',
    },
    {
      path: './../public/fonts/Expose-Regular.ttf',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-medium',
  display: 'swap',
});

export const tabularFont = localFont({
  src: [
    {
      path: './../public/fonts/Tabular-Regular.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './../public/fonts/Tabular-Regular.woff',
      weight: '500',
      style: 'normal',
    },
    {
      path: './../public/fonts/Tabular-Regular.ttf',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-sans',
  display: 'swap',
});

export const satoshiFont = localFont({
  src: [
    {
      path: './../public/fonts/Satoshi-Regular.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './../public/fonts/Satoshi-Regular.woff',
      weight: '500',
      style: 'normal',
    },
    {
      path: './../public/fonts/Satoshi-Regular.ttf',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-light',
  display: 'swap',
});

export const robotoFont = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});
