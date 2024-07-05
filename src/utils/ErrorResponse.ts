// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
export interface ErrorResponse {
  response: {
    status: number;
    data: {
      title: string;
      detail: string;
    };
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isErrorResponse(error: any): error is ErrorResponse {
  return error && error.response && typeof error.response.status === 'number' && error.response.data;
}
