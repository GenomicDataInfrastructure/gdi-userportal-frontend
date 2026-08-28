// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

// MDC's skos:prefLabel for licenses is often just a version number (e.g.
// "1.0"), not the full license name, so the portal must resolve known
// license URIs to their full names for display. Sourced from MDC's own
// License seed data (key / eng_label / canonical_uri).
const LICENSE_LABELS_BY_HOST_AND_PATH: Record<string, string> = {
  "apache.org/licenses/LICENSE-2.0": "Apache License 2.0",
  "opensource.org/licenses/BSD-3-Clause": "BSD 3-Clause License",
  "creativecommons.org/licenses/by/4.0/": "Creative Commons Attribution 4.0",
  "creativecommons.org/licenses/by-nc/4.0/":
    "Creative Commons Attribution Non Commercial 4.0",
  "creativecommons.org/licenses/by-nd/4.0/":
    "Creative Commons Attribution No Derivatives 4.0",
  "creativecommons.org/licenses/by-sa/4.0/":
    "Creative Commons Attribution Share Alike 4.0",
  "creativecommons.org/publicdomain/zero/1.0/":
    "Creative Commons Zero v1.0 Universal",
  "opensource.org/licenses/GPL-3.0": "GNU General Public License v3.0",
  "opensource.org/licenses/MIT": "MIT License",
  "opendatacommons.org/licenses/by/1.0/":
    "Open Data Commons Attribution License v1.0",
  "opendatacommons.org/licenses/pddl/1.0/":
    "Open Data Commons Public Domain Dedication and License v1.0",
  "opendatacommons.org/licenses/odbl/1.0/": "Open Database License v1.0",
  "publications.europa.eu/resource/authority/licence/no_license": "No License",
};

const normalizeLicenseUri = (uri: string): string =>
  uri
    .trim()
    .replace(/^https?:\/\/(www\.)?/, "")
    .replace(/\/legalcode$/, "/");

export default function formatLicenseLabel(uri: string): string | undefined {
  return LICENSE_LABELS_BY_HOST_AND_PATH[normalizeLicenseUri(uri)];
}
