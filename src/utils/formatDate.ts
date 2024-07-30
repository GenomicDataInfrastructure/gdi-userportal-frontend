// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { enGB } from "date-fns/locale/en-GB";
import { formatInTimeZone } from "date-fns-tz";

function isClient() {
  return typeof window !== "undefined";
}

export function formatDate(inputDate: string): string {
  return _formatDate(inputDate, "d MMMM yyyy");
}

export function formatDateTime(inputDate: string) {
  return _formatDate(inputDate, "d MMMM yyyy, HH.mm (zzz)");
}

function getUserTimezone() {
  if (!isClient()) {
      return "UTC";
  }

  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

function _formatDate(inputDate: string, targetFormat: string) {
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
