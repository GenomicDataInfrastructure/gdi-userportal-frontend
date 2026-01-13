// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import axios from "axios";

import serverConfig from "@/config/serverConfig";
import { createApiClient as createDiscoveryApiClient } from "@/app/api/discovery/open-api/schemas";
import { createApiClient as createAccessManagementApiClient } from "@/app/api/access-management/open-api/schemas";
import { createAuthHeaders } from "@/app/api/shared/headers";

export const discoveryAxiosInstance = axios.create();
export const accessManagementAxiosInstance = axios.create();

export const discoveryClient = createDiscoveryApiClient(
  serverConfig.discoveryUrl,
  { axiosInstance: discoveryAxiosInstance }
);

export const accessManagementClient = createAccessManagementApiClient(
  serverConfig.daamUrl,
  { axiosInstance: accessManagementAxiosInstance }
);

export const accessManagementClientHDEu = axios.create({
  baseURL: serverConfig.hdeuDaamUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const discoveryHdEuClient = axios.create({
  baseURL: serverConfig.discoveryHdEuUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Apply auth headers to accessManagementClientHDEu as well
accessManagementClientHDEu.interceptors.request.use(async (config) => {
  const headers = await createAuthHeaders();
  Object.entries(headers).forEach(([key, value]) => {
    if (config.headers) {
      config.headers[key] = value;
    }
  });
  return config;
});

// Apply auth headers to filterClientHDEu as well
discoveryHdEuClient.interceptors.request.use(async (config) => {
  const headers = await createAuthHeaders();
  Object.entries(headers).forEach(([key, value]) => {
    if (config.headers) {
      config.headers[key] = value;
    }
  });
  return config;
});
