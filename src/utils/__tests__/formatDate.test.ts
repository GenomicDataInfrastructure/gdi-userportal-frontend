// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import { formatDate } from './../formatDate';

describe('formatDate', () => {
  it('formats the date correctly from ISO string', () => {
    const input = '2024-02-09T10:27:47.585Z';
    const expected = '2024-02-09';
    expect(formatDate(input)).toEqual(expected);
  });
});
