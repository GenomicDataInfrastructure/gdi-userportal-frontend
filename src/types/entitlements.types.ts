// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

export interface Entitlement {
  datasetId: string;
  start: string;
  end: string;
}

export interface RetrieveGrantedDatasetIdentifiers {
  entitlements: Entitlement[];
}
