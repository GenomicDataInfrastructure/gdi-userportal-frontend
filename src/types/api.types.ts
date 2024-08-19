// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

export interface ErrorResponse {
  title: string;
  status: number;
  detail: string;
  warnings: ValidationWarning[];
}

export interface ValidationWarning {
  key: string;
  formId: string;
  fieldId: string;
}
