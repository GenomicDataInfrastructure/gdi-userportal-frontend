// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { RetrievedApplication } from "@/types/application.types";
import { ErrorResponse } from "@/types/api.types";

export type ApplicationAction = {
  type: ApplicationActionType;
  payload?:
    | RetrievedApplication
    | ErrorResponse
    | FormAttachmentUpdate
    | FormValueUpdate
    | number[]
    | string;
};

export interface FormUpdate {
  fieldId: string;
  formId: number;
}

export interface FormAttachmentUpdate extends FormUpdate {
  attachmentId: number;
}

export interface FormValueUpdate extends FormUpdate {
  newValue: string;
}

export enum ApplicationActionType {
  LOADING = "loading",
  APPLICATION_LOADED = "application/loaded",
  APPLICATION_DELETED = "application/deleted",
  ATTACHMENT_ATTACHED = "application/attachment/attached",
  ATTACHMENT_DELETED = "application/attachment/deleted",
  INPUT_SAVED = "application/form/input_saved",
  FORM_SAVED = "application/form/saved",
  REJECTED = "rejected",
  CLEAR_ERROR = "clear_error",
  ACCEPT_TERMS = "application/terms/accepted",
}

export type ApplicationState = {
  isLoading: boolean;
  termsAccepted: boolean;
  application?: RetrievedApplication;
  errorResponse?: ErrorResponse;
};

export type ApplicationContextState = ApplicationState & {
  addAttachment: (
    formId: number,
    fieldId: string,
    formData: FormData
  ) => Promise<void>;
  deleteAttachment: (
    formId: number,
    fieldId: string,
    attachmentId: number
  ) => Promise<void>;
  updateInputFields: (
    formId: number,
    fieldId: string,
    newValue: string
  ) => Promise<void>;
  acceptTerms: (acceptedLicenses: number[]) => Promise<void>;
  deleteApplication: () => Promise<void>;
  submitApplication: () => Promise<void>;
  clearError: () => void;
};
