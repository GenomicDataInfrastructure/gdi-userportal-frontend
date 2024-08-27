// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
const LABELS = {
  "t.form.validation/required": "Required",
  "t.form.validation/invalid-email": "Invalid email",
  "t.form.validation/invalid-phone-number": "Invalid phone number",
  "t.actions.errors/licenses-not-accepted":
    "Terms and conditions were not accepted.",
} as {
  [p in string]: string;
};

export function getTranslation(key?: string): string | undefined {
  const translation = key ? LABELS[key] : undefined;
  if (key && !translation) {
    console.error(`translate not found for ${key}.`);
  }
  return translation || key;
}
