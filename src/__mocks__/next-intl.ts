// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

// Manual mock for Jest — returns translation keys as-is instead of loading
// next-intl's ESM-only runtime, which Jest cannot parse.
export function useTranslations(namespace?: string) {
  return (key: string) => (namespace ? `${namespace}.${key}` : key);
}
