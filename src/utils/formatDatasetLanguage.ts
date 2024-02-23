// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import { iso6393 } from 'iso-639-3/iso6393';

export default function formatDatasetLanguage(language: string) {
  const code = language.split('/').pop();
  return iso6393.find((lang) => lang.iso6393 === code?.toLowerCase())?.name;
}
