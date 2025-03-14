// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

export function getInitials(name?: string) {
  if (!name) return null;

  const isAllLowerCase =
    name.split(" ").filter((n) => n[0] === n[0].toUpperCase()).length === 0;

  const includeAllLetters = isAllLowerCase || name.split(" ").length <= 3;

  return name
    .split(" ")
    .filter((n) => (includeAllLetters ? true : n[0] === n[0].toUpperCase()))
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}
