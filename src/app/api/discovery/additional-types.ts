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
  DATETIME = "DATETIME",
  NUMBER = "NUMBER",
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

const COUNTRY_DATA = [
  ["AT", "aut", "AUSTRIA"],
  ["BE", "bel", "BELGIUM"],
  ["BG", "bgr", "BULGARIA"],
  ["HR", "hrv", "CROATIA"],
  ["CY", "cyp", "CYPRUS"],
  ["CZ", "cze", "CZECH REPUBLIC"],
  ["DK", "dnk", "DENMARK"],
  ["EE", "est", "ESTONIA"],
  ["FI", "fin", "FINLAND"],
  ["FR", "fra", "FRANCE"],
  ["DE", "deu", "GERMANY"],
  ["GR", "grc", "GREECE"],
  ["HU", "hun", "HUNGARY"],
  ["IE", "irl", "IRELAND"],
  ["IT", "ita", "ITALY"],
  ["LV", "lva", "LATVIA"],
  ["LT", "ltu", "LITHUANIA"],
  ["LU", "lux", "LUXEMBOURG"],
  ["MT", "mlt", "MALTA"],
  ["NL", "nld", "NETHERLANDS"],
  ["PL", "pol", "POLAND"],
  ["PT", "prt", "PORTUGAL"],
  ["RO", "rou", "ROMANIA"],
  ["SK", "svk", "SLOVAKIA"],
  ["SI", "svn", "SLOVENIA"],
  ["ES", "esp", "SPAIN"],
  ["SE", "swe", "SWEDEN"],
] as const;

export const EU_COUNTRIES_OPTIONS = COUNTRY_DATA.map(([iso2, , name]) => ({
  value: iso2,
  label: name,
}));

export const ISO2_TO_ISO3_MAP: Record<string, string> = Object.fromEntries(
  COUNTRY_DATA.map(([iso2, iso3]) => [iso2, iso3])
);

export const PopulationReverseMap: Record<string, string> = Object.fromEntries(
  COUNTRY_DATA.map(([, iso3, name]) => [iso3, name])
);

export const VALID_ISO2_CODES = Object.keys(ISO2_TO_ISO3_MAP);

const SEX_DISPLAY_MAP = { M: "Male", F: "Female" } as const;
const SEX_VALUES = Object.keys(
  SEX_DISPLAY_MAP
) as (keyof typeof SEX_DISPLAY_MAP)[];
const SEX_CHARS = new Set(SEX_VALUES);
const SEPARATOR = "_";

const ISO2_NAME_MAP = Object.fromEntries(COUNTRY_DATA.map(([iso2, , name]) => [iso2, name]));

export const parseGoEPopulation = (
  populationName: string
): { country: string | null; sex: "M" | "F" | null } => {
  if (SEX_CHARS.has(populationName as "M" | "F")) {
    return { country: null, sex: populationName as "M" | "F" };
  }

  const parts = populationName.split(SEPARATOR);
  if (parts.length === 2) {
    const [country, sex] = parts;
    if (VALID_ISO2_CODES.includes(country) && SEX_CHARS.has(sex as "M" | "F")) {
      return { country, sex: sex as "M" | "F" };
    }
  }

  if (VALID_ISO2_CODES.includes(populationName)) {
    return { country: populationName, sex: null };
  }

  return { country: null, sex: null };
};

export const formatPopulationDisplay = (populationCode: string): string => {
  const goeParsed = parseGoEPopulation(populationCode);

  if (goeParsed.country && goeParsed.sex) {
    const countryName = ISO2_NAME_MAP[goeParsed.country] || goeParsed.country;
    const sexLabel = SEX_DISPLAY_MAP[goeParsed.sex];
    return `${countryName} (${sexLabel})`;
  }

  if (goeParsed.sex && !goeParsed.country) {
    return SEX_DISPLAY_MAP[goeParsed.sex];
  }

  if (goeParsed.country && !goeParsed.sex) {
    return ISO2_NAME_MAP[goeParsed.country] || goeParsed.country;
  }

  const countryName =
    PopulationReverseMap[populationCode] || populationCode.toUpperCase();
  return countryName;
};
