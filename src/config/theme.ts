// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import "dotenv/config";

export const themeConfig = {
  colors: {
    primary: "var(--color-primary)",
    secondary: "var(--color-secondary)",
    info: "var(--color-info)",
    warning: "var(--color-warning)",
    "hover-color": "var(--color-hover)",
    disclaimer: "var(--color-disclaimer)",
    surface: "var(--color-surface)",
  },
  fonts: {
    light: process.env.NEXT_PUBLIC_SELECTED_FONT_LIGHT || "satoshi",
    medium: process.env.NEXT_PUBLIC_SELECTED_FONT_MEDIUM || "expose",
    sans: process.env.NEXT_PUBLIC_SELECTED_FONT_SANS || "tabular",
  },
};
