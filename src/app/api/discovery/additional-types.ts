// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

export enum QueryOperator {
  OR = "OR",
  AND = "AND",
}

export enum FilterType {
  DROPDOWN = "DROPDOWN",
  FREE_TEXT = "FREE_TEXT",
  ENTRIES = "ENTRIES",
}

export enum FilterValueType {
  PUBLISHER = "publisher_name",
  THEME = "theme",
}

export enum Operator {
  EQUALS = "=",
  GREATER_THAN = ">",
  LESS_THAN = "<",
  DIFFERENT = "!=",
  CONTAINS = "%",
}

export const PopulationReverseMap: Record<string, string> = {
  aut: "AUSTRIA",
  bel: "BELGIUM",
  bgr: "BULGARIA",
  hrv: "CROATIA",
  cyp: "CYPRUS",
  cze: "CZECH REPUBLIC",
  dnk: "DENMARK",
  est: "ESTONIA",
  fin: "FINLAND",
  fra: "FRANCE",
  deu: "GERMANY",
  grc: "GREECE",
  hun: "HUNGARY",
  irl: "IRELAND",
  ita: "ITALY",
  lva: "LATVIA",
  ltu: "LITHUANIA",
  lux: "LUXEMBOURG",
  mlt: "MALTA",
  nld: "NETHERLANDS",
  pol: "POLAND",
  prt: "PORTUGAL",
  rou: "ROMANIA",
  svk: "SLOVAKIA",
  svn: "SLOVENIA",
  esp: "SPAIN",
  swe: "SWEDEN",
};
