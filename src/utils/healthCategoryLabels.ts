// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

// HealthDCAT-AP dataset subject classification (health category) codes.
// MDC emits these as skos:prefLabel on the health category concept, so the
// portal must expand them to their full labels for display.
const HEALTH_CATEGORY_LABELS: Record<string, string> = {
  EHRS: "Electronic Health Data from EHRs",
  MRMR: "Data from medical registries and mortality registries",
  HPML: "Other human molecular data such as proteomic, transcriptomic, metabolomic, lipidomic and other omic data",
  IDHP: "Data on professional status, and on the specialisation and institution of health professionals involved in the treatment of a natural person",
  RMMD: "Data from registries for medicinal products and medical devices",
  DIOH: "Data on factors impacting on health, including socio-economic, environmental and behavioural determinants of health",
  RQSH: "Data from research cohorts, questionnaires and surveys related to health, after the first publication of the related results",
  EMRD: "Other health data from medical devices",
  EHCT: "Data from clinical trials, clinical studies, clinical investigations and performance studies subject to Regulation (EU) No 536/2014, (EU) 2024/1938, (EU) 2017/745 and (EU) 2017/746",
  NRPE: "Aggregated data on healthcare needs, resources allocated to healthcare, provision of/access to healthcare, expenditure and financing",
  PGEH: "Personal electronic health data automatically generated through medical devices",
  HGPD: "Human genetic, epigenomic and genomic data",
  EINS: "Health data from biobanks and associated databases",
  RPDG: "Data on pathogens that impact human health",
  HRAD: "Healthcare-related administrative data, including dispensations, reimbursement claims and reimbursements",
  PHDR: "Data from population-based health data registries such as public health registries",
  WELA: "Data from wellness applications",
};

export default function formatHealthCategoryLabel(
  code: string
): string | undefined {
  return HEALTH_CATEGORY_LABELS[code.toUpperCase()];
}
