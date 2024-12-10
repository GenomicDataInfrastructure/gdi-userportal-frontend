// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

export enum FilterValueType {
  PUBLISHER = "publisher_name",
  THEME = "theme",
}

export enum FilterType {
  DROPDOWN = "DROPDOWN",
  FREE_TEXT = "FREE_TEXT",
  ENTRIES = "ENTRIES",
}

export enum Operator {
  EQUALS = "=",
  GREATER_THAN = ">",
  LESS_THAN = "<",
  DIFFERENT = "!=",
  CONTAINS = "%",
}
