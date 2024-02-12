// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import { snakeToCamelCase } from '../snakeToCamelCase';

describe('snakeToCamelCase', () => {
  it('converts snake_case to camelCase', () => {
    expect(snakeToCamelCase('hello_world')).toBe('helloWorld');
  });

  it('converts long snake_case to camelCase', () => {
    expect(snakeToCamelCase('this_is_a_long_snake_case_string')).toBe('thisIsALongSnakeCaseString');
  });

  it('returns an empty string if input is empty', () => {
    expect(snakeToCamelCase('')).toBe('');
  });

  it('returns the same string if no conversion is needed', () => {
    expect(snakeToCamelCase('alreadyCamelCase')).toBe('alreadyCamelCase');
  });

  it('handles strings with leading and trailing underscores', () => {
    expect(snakeToCamelCase('_leading_underscore')).toBe('LeadingUnderscore');
  });
});
