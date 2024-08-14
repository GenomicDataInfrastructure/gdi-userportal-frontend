// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import "dotenv/config";
import {
  exposeFont,
  tabularFont,
  satoshiFont,
  robotoFont,
  nunitoFont,
  quicksandFont,
} from "./fonts";
import { themeConfig } from "@/config/theme";

const fontMap = {
  expose: exposeFont,
  tabular: tabularFont,
  satoshi: satoshiFont,
  roboto: robotoFont,
  nunito: nunitoFont,
  quicksand: quicksandFont,
};

export function getSelectedFonts(): string {
  return Object.values(themeConfig.fonts)
    .map((fontName) => {
      const font = fontMap[fontName as keyof typeof fontMap];
      return font ? font.variable : "";
    })
    .filter(Boolean)
    .join(" ");
}

export const fontVariables = getSelectedFonts();
