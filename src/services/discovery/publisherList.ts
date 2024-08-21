// SPDX-FileCopyrightText: 2024 PNED G.I.E.

// SPDX-License-Identifier: Apache-2.0

import axios, { AxiosResponse } from "axios";
import { RetrievedPublisher } from "./types/dataset.types";

export const makePublisherList = (discoveryUrl: string) => {
  return async (): Promise<AxiosResponse<RetrievedPublisher[]>> => {
    return await axios.get(`${discoveryUrl}/api/v1/organizations`);
  };
};
