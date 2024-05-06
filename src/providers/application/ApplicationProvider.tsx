// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { addAttachmentToApplication } from "@/services/daam/index.client";
import {
  Form,
  FormField,
  RetrievedApplication,
} from "@/types/application.types";
import {
  addAttachmentIdToFieldValue,
  deleteAttachmentIdFromFieldValue,
  updateFormWithNewAttachment,
} from "@/utils/application";
import { useParams } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import {
  ApplicationAction,
  ApplicationActionType,
  ApplicationContextState,
  ApplicationState,
} from "./ApplicationProvider.types";

const ApplicationContext = createContext<ApplicationContextState | undefined>(
  undefined,
);

function reducer(
  state: ApplicationState,
  action: ApplicationAction,
): ApplicationState {
  switch (action.type) {
    case ApplicationActionType.LOADING:
      return { ...state, isLoading: true, error: null };

    case ApplicationActionType.APPLICATION_LOADED:
      return {
        ...state,
        application: action.payload as RetrievedApplication,
        isLoading: false,
      };

    case ApplicationActionType.ATTACHMENT_ATTACHED:
      const attachPayload = action.payload as {
        formId: number;
        fieldId: number;
        attachmentId: number;
      };

      return {
        ...state,
        application: {
          ...state.application,
          forms: updateFormWithNewAttachment(
            state.application!.forms,
            attachPayload.formId,
            attachPayload.fieldId,
            attachPayload.attachmentId,
            addAttachmentIdToFieldValue,
          ) as Form[],
        } as RetrievedApplication,
        isLoading: false,
      };

    case ApplicationActionType.ATTACHMENT_DELETED:
      const deletePayload = action.payload as {
        formId: number;
        fieldId: number;
        attachmentId: number;
      };
      return {
        ...state,
        application: {
          ...state.application,
          forms: updateFormWithNewAttachment(
            state.application!.forms,
            deletePayload.formId,
            deletePayload.fieldId,
            deletePayload.attachmentId,
            deleteAttachmentIdFromFieldValue,
          ) as Form[],
        } as RetrievedApplication,
        isLoading: false,
      };

    case ApplicationActionType.FORM_SAVED:
      return { ...state, isLoading: false };

    case ApplicationActionType.CLEAR_ERROR:
      return { ...state, error: null };

    case ApplicationActionType.REJECTED:
      return { ...state, error: action.payload as string, isLoading: false };

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

type ApplicationProviderProps = {
  children: React.ReactNode;
};

function ApplicationProvider({ children }: ApplicationProviderProps) {
  const initialState: ApplicationState = {
    application: null,
    isLoading: false,
    error: null,
  };

  const [{ application, isLoading, error }, dispatch] = useReducer(
    reducer,
    initialState,
  );

  const clearError = () => {
    dispatch({ type: ApplicationActionType.CLEAR_ERROR });
  };

  const { id } = useParams<{ id: string }>();

  const fetchApplication = useCallback(async () => {
    dispatch({ type: ApplicationActionType.LOADING });
    try {
      const response = await fetch(`/api/applications/${id}`);
      const retrievedApplication = await response.json();
      dispatch({
        type: ApplicationActionType.APPLICATION_LOADED,
        payload: retrievedApplication,
      });
    } catch {
      dispatch({
        type: ApplicationActionType.REJECTED,
        payload: "Failed to fetch application",
      });
    }
  }, [id]);

  useEffect(() => {
    fetchApplication();
  }, [fetchApplication]);

  async function addAttachment(
    formId: number,
    fieldId: number,
    formData: FormData,
  ): Promise<void> {
    try {
      dispatch({ type: ApplicationActionType.LOADING });

      const {
        data: { id: attachmentId },
      } = await addAttachmentToApplication(application!.id, formData);

      const action = {
        type: ApplicationActionType.ATTACHMENT_ATTACHED,
        payload: {
          attachmentId,
          formId,
          fieldId,
        },
      };

      dispatch(action);

      const { forms: updatedForms } = reducer(
        { application, isLoading, error },
        action,
      ).application as RetrievedApplication;
      const response = await saveFormAndDuos(updatedForms);
      if (response.ok) fetchApplication();
    } catch (error) {
      dispatch({
        type: ApplicationActionType.REJECTED,
        payload: "Failed to add attachment",
      });
    }
  }

  async function deleteAttachment(
    formId: number,
    fieldId: number,
    attachmentId: number,
  ) {
    try {
      dispatch({ type: ApplicationActionType.LOADING });

      const action = {
        type: ApplicationActionType.ATTACHMENT_DELETED,
        payload: {
          attachmentId,
          formId,
          fieldId,
        },
      };
      dispatch(action);

      const { forms: updatedForms } = reducer(
        { application, isLoading, error },
        action,
      ).application as RetrievedApplication;

      const response = await saveFormAndDuos(updatedForms);
      if (response.ok) fetchApplication();
    } catch (error) {
      dispatch({
        type: ApplicationActionType.REJECTED,
        payload: "Failed to delete attachment",
      });
    }
  }

  async function saveFormAndDuos(forms: Form[]) {
    dispatch({ type: ApplicationActionType.LOADING });
    const response = await fetch(
      `/api/applications/${application!.id}/save-forms-and-duos`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          forms: forms.map((form: Form) => ({
            formId: form.id,
            fields: form.fields.map((field: FormField) => ({
              fieldId: field.id,
              value: field.value,
            })),
          })),
          duoCodes: [],
        }),
      },
    );
    dispatch({ type: ApplicationActionType.FORM_SAVED });
    return response;
  }

  async function submitApplication() {
    dispatch({ type: ApplicationActionType.LOADING });

    try {
      const response = await fetch(
        `/api/applications/${application!.id}/submit`,
        { method: "POST" },
      );

      if (response.ok) {
        dispatch({ type: ApplicationActionType.CLEAR_ERROR });
        fetchApplication();
      } else {
        const errorResponse = await response.json();
        const errorMessage =
          errorResponse.error || "An unexpected error occurred.";
        dispatch({
          type: ApplicationActionType.REJECTED,
          payload: errorMessage,
        });
      }
    } catch (error) {
      dispatch({
        type: ApplicationActionType.REJECTED,
        payload:
          "Failed to submit application due to a network or server issue.",
      });
    }
  }

  return (
    <ApplicationContext.Provider
      value={{
        application,
        isLoading,
        error,
        addAttachment,
        deleteAttachment,
        submitApplication,
        clearError,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
}

function useApplicationDetails() {
  const context = useContext(ApplicationContext);
  if (context === undefined) {
    throw new Error(
      "useAttachmentUpload must be used within a AttachmentUploadProvider",
    );
  }
  return context;
}

export { ApplicationProvider, useApplicationDetails };
