// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { Country } from "@/components/ApplicationForm/CountryDropdown";
import { listCountriesApi } from "@/app/api/access-management-v1/index";

/**
 * Default countries with dial codes (EU countries + common non-EU countries)
 * Used as fallback when API fails
 */
export function getDefaultCountries(): Country[] {
  return [
    { key: "AT", value: "Austria", iso2: "AT", dialCode: "43" },
    { key: "BE", value: "Belgium", iso2: "BE", dialCode: "32" },
    { key: "BG", value: "Bulgaria", iso2: "BG", dialCode: "359" },
    { key: "HR", value: "Croatia", iso2: "HR", dialCode: "385" },
    { key: "CY", value: "Cyprus", iso2: "CY", dialCode: "357" },
    { key: "CZ", value: "Czech Republic", iso2: "CZ", dialCode: "420" },
    { key: "DK", value: "Denmark", iso2: "DK", dialCode: "45" },
    { key: "EE", value: "Estonia", iso2: "EE", dialCode: "372" },
    { key: "FI", value: "Finland", iso2: "FI", dialCode: "358" },
    { key: "FR", value: "France", iso2: "FR", dialCode: "33" },
    { key: "DE", value: "Germany", iso2: "DE", dialCode: "49" },
    { key: "GR", value: "Greece", iso2: "GR", dialCode: "30" },
    { key: "HU", value: "Hungary", iso2: "HU", dialCode: "36" },
    { key: "IE", value: "Ireland", iso2: "IE", dialCode: "353" },
    { key: "IT", value: "Italy", iso2: "IT", dialCode: "39" },
    { key: "LV", value: "Latvia", iso2: "LV", dialCode: "371" },
    { key: "LT", value: "Lithuania", iso2: "LT", dialCode: "370" },
    { key: "LU", value: "Luxembourg", iso2: "LU", dialCode: "352" },
    { key: "MT", value: "Malta", iso2: "MT", dialCode: "356" },
    { key: "NL", value: "Netherlands", iso2: "NL", dialCode: "31" },
    { key: "PL", value: "Poland", iso2: "PL", dialCode: "48" },
    { key: "PT", value: "Portugal", iso2: "PT", dialCode: "351" },
    { key: "RO", value: "Romania", iso2: "RO", dialCode: "40" },
    { key: "SK", value: "Slovakia", iso2: "SK", dialCode: "421" },
    { key: "SI", value: "Slovenia", iso2: "SI", dialCode: "386" },
    { key: "ES", value: "Spain", iso2: "ES", dialCode: "34" },
    { key: "SE", value: "Sweden", iso2: "SE", dialCode: "46" },
    { key: "GB", value: "United Kingdom", iso2: "GB", dialCode: "44" },
    { key: "US", value: "United States", iso2: "US", dialCode: "1" },
  ];
}

/**
 * Default countries with Europa.eu URI format (for Section3 compatibility)
 * Used as fallback when API fails
 */
export function getDefaultCountriesWithEuropaKeys(): Country[] {
  return [
    {
      key: "http://publications.europa.eu/resource/authority/country/NLD",
      value: "Netherlands",
      iso2: "NL",
      dialCode: "31",
    },
    {
      key: "http://publications.europa.eu/resource/authority/country/DEU",
      value: "Germany",
      iso2: "DE",
      dialCode: "49",
    },
    {
      key: "http://publications.europa.eu/resource/authority/country/FRA",
      value: "France",
      iso2: "FR",
      dialCode: "33",
    },
    {
      key: "http://publications.europa.eu/resource/authority/country/ESP",
      value: "Spain",
      iso2: "ES",
      dialCode: "34",
    },
    {
      key: "http://publications.europa.eu/resource/authority/country/LUX",
      value: "Luxembourg",
      iso2: "LU",
      dialCode: "352",
    },
    {
      key: "http://publications.europa.eu/resource/authority/country/AUT",
      value: "Austria",
      iso2: "AT",
      dialCode: "43",
    },
    {
      key: "http://publications.europa.eu/resource/authority/country/BEL",
      value: "Belgium",
      iso2: "BE",
      dialCode: "32",
    },
    {
      key: "http://publications.europa.eu/resource/authority/country/BGR",
      value: "Bulgaria",
      iso2: "BG",
      dialCode: "359",
    },
    {
      key: "http://publications.europa.eu/resource/authority/country/HRV",
      value: "Croatia",
      iso2: "HR",
      dialCode: "385",
    },
    {
      key: "http://publications.europa.eu/resource/authority/country/CYP",
      value: "Cyprus",
      iso2: "CY",
      dialCode: "357",
    },
    {
      key: "http://publications.europa.eu/resource/authority/country/CZE",
      value: "Czech Republic",
      iso2: "CZ",
      dialCode: "420",
    },
    {
      key: "http://publications.europa.eu/resource/authority/country/DNK",
      value: "Denmark",
      iso2: "DK",
      dialCode: "45",
    },
    {
      key: "http://publications.europa.eu/resource/authority/country/EST",
      value: "Estonia",
      iso2: "EE",
      dialCode: "372",
    },
    {
      key: "http://publications.europa.eu/resource/authority/country/FIN",
      value: "Finland",
      iso2: "FI",
      dialCode: "358",
    },
    {
      key: "http://publications.europa.eu/resource/authority/country/GRC",
      value: "Greece",
      iso2: "GR",
      dialCode: "30",
    },
    {
      key: "http://publications.europa.eu/resource/authority/country/HUN",
      value: "Hungary",
      iso2: "HU",
      dialCode: "36",
    },
    {
      key: "http://publications.europa.eu/resource/authority/country/IRL",
      value: "Ireland",
      iso2: "IE",
      dialCode: "353",
    },
    {
      key: "http://publications.europa.eu/resource/authority/country/ITA",
      value: "Italy",
      iso2: "IT",
      dialCode: "39",
    },
    {
      key: "http://publications.europa.eu/resource/authority/country/LVA",
      value: "Latvia",
      iso2: "LV",
      dialCode: "371",
    },
    {
      key: "http://publications.europa.eu/resource/authority/country/LTU",
      value: "Lithuania",
      iso2: "LT",
      dialCode: "370",
    },
    {
      key: "http://publications.europa.eu/resource/authority/country/MLT",
      value: "Malta",
      iso2: "MT",
      dialCode: "356",
    },
    {
      key: "http://publications.europa.eu/resource/authority/country/POL",
      value: "Poland",
      iso2: "PL",
      dialCode: "48",
    },
    {
      key: "http://publications.europa.eu/resource/authority/country/PRT",
      value: "Portugal",
      iso2: "PT",
      dialCode: "351",
    },
    {
      key: "http://publications.europa.eu/resource/authority/country/ROU",
      value: "Romania",
      iso2: "RO",
      dialCode: "40",
    },
    {
      key: "http://publications.europa.eu/resource/authority/country/SVK",
      value: "Slovakia",
      iso2: "SK",
      dialCode: "421",
    },
    {
      key: "http://publications.europa.eu/resource/authority/country/SVN",
      value: "Slovenia",
      iso2: "SI",
      dialCode: "386",
    },
    {
      key: "http://publications.europa.eu/resource/authority/country/SWE",
      value: "Sweden",
      iso2: "SE",
      dialCode: "46",
    },
  ];
}

/**
 * Extract ISO2 code from Europa.eu resource authority URI
 * @param key - Europa.eu URI like "http://publications.europa.eu/resource/authority/country/NLD"
 * @returns ISO2 code like "NL"
 */
export function extractIso2FromKey(key: string): string {
  // Extract last part from URI
  const parts = key.split("/");
  const code = parts[parts.length - 1];

  // Convert 3-letter codes to 2-letter ISO codes
  const mapping: { [key: string]: string } = {
    NLD: "NL",
    DEU: "DE",
    FRA: "FR",
    ESP: "ES",
    LUX: "LU",
    AUT: "AT",
    BEL: "BE",
    BGR: "BG",
    HRV: "HR",
    CYP: "CY",
    CZE: "CZ",
    DNK: "DK",
    EST: "EE",
    FIN: "FI",
    GRC: "GR",
    HUN: "HU",
    IRL: "IE",
    ITA: "IT",
    LVA: "LV",
    LTU: "LT",
    MLT: "MT",
    POL: "PL",
    PRT: "PT",
    ROU: "RO",
    SVK: "SK",
    SVN: "SI",
    SWE: "SE",
    GBR: "GB",
    USA: "US",
  };

  return mapping[code] || code.substring(0, 2);
}

/**
 * Fetch countries from API with fallback to default countries
 * @param useEuropaKeys - Whether to use Europa.eu URI format for keys
 * @returns Promise<Country[]>
 */
export async function fetchCountriesFromAPI(
  useEuropaKeys: boolean = false
): Promise<Country[]> {
  try {
    const countries = await listCountriesApi();
    const dialCodeMap = getDialCodeMapping();

    // Map API response to include iso2 codes and dial codes
    if (useEuropaKeys) {
      // Convert ISO2 keys to Europa.eu URI format
      return countries.map((country) => ({
        key: getEuropaKeyFromIso2(country.key),
        value: country.value,
        iso2: country.key,
        dialCode: dialCodeMap[country.key] || "",
      }));
    }

    // Keep ISO2 keys and add dial codes
    return countries.map((country) => ({
      key: country.key,
      value: country.value,
      iso2: country.key,
      dialCode: dialCodeMap[country.key] || "",
    }));
  } catch (error) {
    console.error("Failed to fetch countries:", error);
    return useEuropaKeys
      ? getDefaultCountriesWithEuropaKeys()
      : getDefaultCountries();
  }
}

/**
 * Convert ISO2 code to Europa.eu URI format
 * @param iso2 - ISO2 country code like "NL"
 * @returns Europa.eu URI like "http://publications.europa.eu/resource/authority/country/NLD"
 */
function getEuropaKeyFromIso2(iso2: string): string {
  const reverseMapping: { [iso2: string]: string } = {
    NL: "NLD",
    DE: "DEU",
    FR: "FRA",
    ES: "ESP",
    LU: "LUX",
    AT: "AUT",
    BE: "BEL",
    BG: "BGR",
    HR: "HRV",
    CY: "CYP",
    CZ: "CZE",
    DK: "DNK",
    EE: "EST",
    FI: "FIN",
    GR: "GRC",
    HU: "HUN",
    IE: "IRL",
    IT: "ITA",
    LV: "LVA",
    LT: "LTU",
    MT: "MLT",
    PL: "POL",
    PT: "PRT",
    RO: "ROU",
    SK: "SVK",
    SI: "SVN",
    SE: "SWE",
    GB: "GBR",
    US: "USA",
  };

  const iso3 = reverseMapping[iso2.toUpperCase()] || iso2.toUpperCase();
  return `http://publications.europa.eu/resource/authority/country/${iso3}`;
}

/**
 * Create a phone country selection handler
 * @param setSelectedCountry - State setter for selected country
 * @param setPhone - State setter for phone object
 * @param phone - Current phone state
 * @returns Handler function
 */
export function createPhoneCountrySelectHandler<
  T extends { countryCode: string; number: string; isoCode: string },
>(
  setSelectedCountry: (country: Country | null) => void,
  setPhone: (phone: T) => void,
  phone: T
) {
  return (country: Country) => {
    setSelectedCountry(country);
    setPhone({
      ...phone,
      countryCode: country.dialCode || "",
      isoCode: country.iso2 || country.key,
    });
  };
}

/**
 * Get dial code mapping for ISO2 codes
 * @returns Map of ISO2 codes to dial codes
 */
export function getDialCodeMapping(): { [iso2: string]: string } {
  const countries = getDefaultCountries();
  const mapping: { [iso2: string]: string } = {};

  countries.forEach((country) => {
    if (country.iso2 && country.dialCode) {
      mapping[country.iso2] = country.dialCode;
    }
  });

  return mapping;
}
