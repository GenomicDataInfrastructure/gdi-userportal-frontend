// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import axios from "axios";
import { CreateApplicationResponse } from "@/types/application.types";

export const createApplication = async (
  datasetIds: string[]
): Promise<CreateApplicationResponse> => {
  const requestBody = {
    datasetIds: datasetIds,
  };

  return await axios.post("/api/applications", requestBody, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
