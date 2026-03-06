// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

export interface BasketSubmission {
  dataset_id: string;
  distribution_id: string;
}
export interface DatasetSubmission {
  title: string;
  inputLanguage: string;
  datasets: Dataset[];
}

export interface Dataset {
  dataset_id: string;
  catalog_id: string;
  distributions: Distribution[];
  distributions_sample: DistributionSample[];
  date_added?: string;
  publisher?: Publisher;
  title?: Record<string, string>;
  country?: Country;
  hdab?: Publisher;
  provenance?: Record<string, string>;
}

export interface Distribution {
  distribution_id: string;
  title?: Record<string, string>;
}

export interface DistributionSample {
  datasetId: string;
  variables: VariableDefinition[];
}

export interface VariableDefinition {
  name: string;
  titles: Record<string, string>;
  datatype: string;
  description: Record<string, string>;
  propertyUrl: string;
}

export interface Publisher {
  type?: string;
  name?: string;
  email?: string;
  homepage?: string;
}

export interface Country {
  label?: string;
  resource?: string;
  country_id?: string;
}
