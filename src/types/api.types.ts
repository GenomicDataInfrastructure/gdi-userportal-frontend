// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

export interface ErrorResponse {
  title: string;
  status: number;
  detail: string;
  errorMessages: string[];
}

export interface ValidationWarnings {
  key: string;
  formId: string;
  fieldId: string;
  fieldValidationKey: string;
}
