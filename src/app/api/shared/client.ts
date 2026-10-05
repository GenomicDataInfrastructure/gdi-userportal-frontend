// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import axios from "axios";

import serverConfig from "@/config/serverConfig";
import { createApiClient as createDiscoveryApiClient } from "@/app/api/discovery/open-api/schemas";
import { createApiClient as createAccessManagementApiClient } from "@/app/api/access-management/open-api/schemas";

export const discoveryAxiosInstance = axios.create();
export const accessManagementAxiosInstance = axios.create();
// Axios represents HTTP 204 as an empty string. Normalize the empty response
// before the generated client validates endpoints whose response is void.
accessManagementAxiosInstance.interceptors.response.use((response) => {
  if (response.status === 204 && response.data === "")
    response.data = undefined;
  return response;
});

export const discoveryClient = createDiscoveryApiClient(
  serverConfig.discoveryUrl,
  { axiosInstance: discoveryAxiosInstance }
);

export const accessManagementClient = createAccessManagementApiClient(
  serverConfig.daamUrl,
  { axiosInstance: accessManagementAxiosInstance }
);
