// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { RetrievedApplication } from '@/types/application.types';

export type ApplicationAction = {
  type: ApplicationActionType;
  payload?: RetrievedApplication | { fieldId: number; formId: number; attachmentId: number } | string;
};

export enum ApplicationActionType {
  LOADING = 'loading',
  APPLICATION_LOADED = 'application/loaded',
  ATTACHMENT_ATTACHED = 'application/attachment/attached',
  ATTACHMENT_DELETED = 'application/attachment/deleted',
  FORM_SAVED = 'application/form/saved',
  REJECTED = 'rejected',
  CLEAR_ERROR = 'clear_error',
}

export type ApplicationState = {
  application: RetrievedApplication | null;
  isLoading: boolean;
  error: string | null;
};

export type ApplicationContextState = ApplicationState & {
  addAttachment: (formId: number, fieldId: number, formData: FormData) => Promise<void>;
  deleteAttachment: (formId: number, fieldId: number, attachmentId: number) => void;
  submitApplication: () => void;
  clearError: () => void;
};
