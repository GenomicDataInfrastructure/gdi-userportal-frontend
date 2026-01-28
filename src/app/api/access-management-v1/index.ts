// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use server";

import { accessManagementClientHDEu as accessManagementClient } from "@/app/api/shared/client";
import { createHeaders } from "@/app/api/shared/headers";
import { isAxiosError } from "axios";
import {
  BasketSubmission,
  DatasetSubmission,
} from "@/app/api/access-management-v1/additional-types";

export const createApplicationApi = async (
  datasetSubmissionApplication: DatasetSubmission
) => {
  const headers = await createHeaders();
  try {
    const client = accessManagementClient;
    const requestPath = "data-request/application"; // avoid leading slash so baseURL path is preserved
    const fullUrl = `${client.defaults.baseURL?.replace(/\/$/, "")}/${requestPath}`;
    console.log("Creating application with URL:", fullUrl);
    const response = await client.post(
      requestPath,
      datasetSubmissionApplication,
      {
        headers,
      }
    );

    console.debug("✅ AMS request succeeded", { status: response.status });
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("❌ AMS request failed", {
        status: error.response?.status,
        message: error.message,
        responseData: error.response?.data,
      });
      throw error;
    } else {
      console.error("❌ Non-Axios error", error);
      throw error;
    }
  }
};

export const createAddDatasetToBasketApi = async (
  basketSubmissionApplication: BasketSubmission
) => {
  const headers = await createHeaders();
  try {
    const client = accessManagementClient;
    const requestPath = "basket";
    const fullUrl = `${client.defaults.baseURL?.replace(/\/$/, "")}/${requestPath}`;
    console.log("Creating Basket with URL:", fullUrl);
    const response = await client.put(
      requestPath,
      basketSubmissionApplication,
      {
        headers,
      }
    );

    console.debug("✅ AMS request succeeded", { status: response.status });
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("❌ AMS request failed", {
        status: error,
        message: error.message,
        responseData: error.response?.data,
      });
      throw error;
    } else {
      console.error("❌ Non-Axios error", error);
      throw error;
    }
  }
};


export const removeDatasetFromBasketApi = async (
  datasetId: string
) => {
  const headers = await createHeaders();
  try {
    const client = accessManagementClient;
    const requestPath = "basket/" + encodeURIComponent(datasetId);
    const fullUrl = `${client.defaults.baseURL?.replace(/\/$/, "")}/${requestPath}`;
    console.log("Deleting Basket with URL:", fullUrl);
    const response = await client.delete(
      requestPath,
      {
        headers,
      }
    );

    console.debug("✅ AMS request succeeded", { status: response.status });
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("❌ AMS request failed", {
        status: error.response?.status,
        message: error.message,
        responseData: error.response?.data,
      });
      throw error;
    } else {
      console.error("❌ Non-Axios error", error);
      throw error;
    }
  }
};



export const listApplicationsApi = async () => {
  const headers = await createHeaders();
  try {
    const client = accessManagementClient;
    const requestPath = "data-access/application?limit=1000";
    const fullUrl = `${client.defaults.baseURL?.replace(/\/$/, "")}/${requestPath}`;
    console.log("Getting all applications URL:", fullUrl);
    const response = await client.get(
      requestPath,
      {
        headers,
      }
    );

    console.debug("✅ AMS request succeeded", { status: response.status });
    console.log("Applications data:", response.data);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("❌ AMS request failed", {
        status: error.response?.status,
        message: error.message,
        responseData: error.response?.data,
      });
      throw error;
    } else {
      console.error("❌ Non-Axios error", error);
      throw error;
    }
  }
};
