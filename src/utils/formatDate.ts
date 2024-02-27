// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import { format } from 'date-fns';

export function formatDate(inputDate: string): string {
  const date = new Date(inputDate);
  return format(date, 'yyyy-MM-dd');
}
