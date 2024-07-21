// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { Form, RetrievedApplication } from "@/types/application.types";

export type ApplicationAction = {
  type: ApplicationActionType;
  payload?:
    | RetrievedApplication
    | { fieldId: number; formId: number; attachmentId: number }
    | { fieldId: number; formId: number; newValue: string }
    | { message: string; statusCode: number }
    | string;
};

export enum ApplicationActionType {
  LOADING = "loading",
  APPLICATION_LOADED = "application/loaded",
  ATTACHMENT_ATTACHED = "application/attachment/attached",
  ATTACHMENT_DELETED = "application/attachment/deleted",
  INPUT_SAVED = "application/form/input_saved",
  FORM_SAVED = "application/form/saved",
  REJECTED = "rejected",
  CLEAR_ERROR = "clear_error",
}

export type ApplicationState = {
  application: RetrievedApplication | null;
  isLoading: boolean;
  error: string | null;
  errorStatusCode: number | null;
};

export type ApplicationContextState = ApplicationState & {
  addAttachment: (
    formId: number,
    fieldId: number,
    formData: FormData
  ) => Promise<void>;
  deleteAttachment: (
    formId: number,
    fieldId: number,
    attachmentId: number
  ) => void;
  updateInputFields: (
    formId: number,
    fieldId: number,
    newValue: string
  ) => Promise<void>;
  submitApplication: () => void;
  clearError: () => void;
  saveFormAndDuos: (forms: Form[]) => Promise<Response>;
};
