// SPDX-FileCopyrightText: 2024 PNED G.I.E.

// SPDX-License-Identifier: Apache-2.0

import axios, { AxiosResponse } from "axios";
import { RetrievedOrganization } from "./types/dataset.types";

export const makeOrganizationList = (discoveryUrl: string) => {
  return async (): Promise<RetrievedOrganization[]> => {
    const response: AxiosResponse<RetrievedOrganization[]> = await axios.get(
      `${discoveryUrl}/api/v1/organizations`
    );
    return response.data;
  };
};
