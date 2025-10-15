// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { enGB } from "date-fns/locale/en-GB";
import { formatInTimeZone } from "date-fns-tz";

function isClient() {
  return typeof window !== "undefined";
}

export function formatDate(inputDate?: string): string {
  return _formatDate("d MMMM yyyy", inputDate);
}

export function formatDateTime(inputDate: string) {
  return _formatDate("d MMMM yyyy, HH.mm (zzz)", inputDate);
}

function getUserTimezone() {
  if (!isClient()) {
    throw new Error("getUserTimezone must be called on the client side");
  }

  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

function _formatDate(targetFormat: string, inputDate?: string) {
  if (!inputDate) {
    return "N/A";
  }

  const date = new Date(inputDate);
  const userTimeZone = getUserTimezone();

  try {
    return formatInTimeZone(date, userTimeZone, targetFormat, { locale: enGB });
  } catch (error) {
    if (process.env.NODE_ENV !== "test") {
      console.error(error);
    }
    return inputDate;
  }
}
