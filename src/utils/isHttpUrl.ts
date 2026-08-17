// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

export default function isHttpUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}
