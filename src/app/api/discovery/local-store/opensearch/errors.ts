// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import axios from "axios";

export const isIndexAlreadyExistsError = (error: unknown): boolean =>
  axios.isAxiosError(error) &&
  error.response?.status === 400 &&
  JSON.stringify(error.response.data).includes("resource_already_exists");

export const isIndexCreateBlockedError = (error: unknown): boolean =>
  axios.isAxiosError(error) &&
  error.response?.status === 403 &&
  JSON.stringify(error.response.data).includes("create-index blocked");
