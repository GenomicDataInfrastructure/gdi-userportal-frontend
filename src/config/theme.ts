// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import 'dotenv/config';

export const themeConfig = {
  colors: {
    primary: process.env.NEXT_PUBLIC_COLOR_PRIMARY || 'var(--color-primary)',
    secondary: process.env.NEXT_PUBLIC_COLOR_SECONDARY || 'var(--color-secondary)',
    info: process.env.NEXT_PUBLIC_COLOR_INFO || 'var(--color-info)',
    warning: process.env.NEXT_PUBLIC_COLOR_WARNING || 'var(--color-warning)',
    'hover-color': process.env.NEXT_PUBLIC_COLOR_HOVER_COLOR || 'var(--color-hover)',
    disclaimer: process.env.NEXT_PUBLIC_COLOR_DISCLAIMER || 'var(--color-disclaimer)',
    surface: process.env.NEXT_PUBLIC_COLOR_SURFACE || 'var(--color-surface)',
  },
  fonts: {
    light: process.env.NEXT_PUBLIC_SELECTED_FONT_LIGHT || 'satoshi',
    medium: process.env.NEXT_PUBLIC_SELECTED_FONT_MEDIUM || 'expose',
    sans: process.env.NEXT_PUBLIC_SELECTED_FONT_SANS || 'tabular',
  },
};
