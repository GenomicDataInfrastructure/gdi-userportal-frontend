// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
const LABELS = {
  required: "This field is required",
  "invalid-email": "Please enter a valid email address",
  "invalid-phone-number":
    "Please enter a valid phone number (e.g. +1234567890)",
  "invalid-value": "Please enter a valid value",
  "licenses-not-accepted":
    "You must accept all terms and conditions to proceed",
} as {
  [p in string]: string;
};

export function getTranslation(key?: string): string | undefined {
  const translation = key ? LABELS[key] : undefined;
  if (key && !translation) {
    console.error(`translate not found for ${key}.`);
  }
  return translation ?? key;
}
