// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
export const snakeToCamelCase = (str: string): string => {
  return str.replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace('_', ''));
};
