// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import axios, { AxiosInstance } from "axios";
import https from "node:https";

import { enforceAcceptEncoding } from "@/app/api/shared/accept-encoding";

export const createOpenSearchClient = (params: {
  baseUrl: string;
  username?: string;
  password?: string;
  apiKey?: string;
  insecureTls?: boolean;
}): AxiosInstance => {
  const headers: Record<string, string> = {};
  if (params.apiKey) {
    headers.Authorization = `ApiKey ${params.apiKey}`;
  }

  return enforceAcceptEncoding(
    axios.create({
      baseURL: params.baseUrl,
      headers,
      httpsAgent: params.insecureTls
        ? new https.Agent({ rejectUnauthorized: false })
        : undefined,
      auth:
        params.username && params.password
          ? { username: params.username, password: params.password }
          : undefined,
    })
  );
};

export const formatSearchBackendError = (
  error: unknown,
  requestLabel = "OpenSearch request"
): string => {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : String(error);
  }

  const status = error.response?.status;
  const reason =
    error.response?.data &&
    typeof error.response.data === "object" &&
    "error" in error.response.data
      ? JSON.stringify((error.response.data as { error?: unknown }).error)
      : null;

  if (status && reason) {
    return `${requestLabel} failed (${status}): ${reason}`;
  }

  if (status) {
    return `${requestLabel} failed (${status}): ${error.message}`;
  }

  return error.message;
};

export const isIndexAlreadyExistsError = (error: unknown): boolean =>
  axios.isAxiosError(error) &&
  error.response?.status === 400 &&
  JSON.stringify(error.response.data).includes("resource_already_exists");

export const isIndexCreateBlockedError = (error: unknown): boolean =>
  axios.isAxiosError(error) &&
  error.response?.status === 403 &&
  JSON.stringify(error.response.data).includes("create-index blocked");

export const ensureIndexInitialized = async (
  client: AxiosInstance,
  indexName: string,
  createMappings: () => { mappings: unknown }
): Promise<void> => {
  let initializationError: unknown;
  try {
    await client.put(`/${indexName}`, createMappings());
  } catch (error) {
    initializationError = error;
  }

  if (!initializationError) {
    return;
  }

  if (
    !isIndexAlreadyExistsError(initializationError) &&
    !isIndexCreateBlockedError(initializationError)
  ) {
    throw initializationError;
  }

  try {
    await client.put(`/${indexName}/_mapping`, createMappings().mappings);
  } catch (mappingError) {
    if (
      isIndexCreateBlockedError(initializationError) &&
      axios.isAxiosError(mappingError) &&
      mappingError.response?.status === 404
    ) {
      throw initializationError;
    }

    console.warn(
      `[OpenSearch] Could not update mapping for index "${indexName}" — ` +
        `one or more field types may have changed. Delete and recreate the index to apply the new schema. ` +
        `Error: ${formatSearchBackendError(mappingError)}`
    );
  }
};
