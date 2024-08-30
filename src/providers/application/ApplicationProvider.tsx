// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { addAttachmentToApplication } from "@/services/daam/index.client";
import {
  Form,
  FormField,
  RetrievedApplication,
  AcceptTermsCommand,
  FieldType,
} from "@/types/application.types";
import {
  addAttachmentIdToFieldValue,
  deleteAttachmentIdFromFieldValue,
  updateFormWithNewAttachment,
  updateFormsInputValues,
} from "@/utils/application";
import debounce from "@/utils/debounce";
import { useParams } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  Dispatch,
} from "react";
import {
  ApplicationAction,
  ApplicationActionType,
  ApplicationContextState,
  ApplicationState,
} from "./ApplicationProvider.types";
import { ErrorResponse } from "@/types/api.types";

const ApplicationContext = createContext<ApplicationContextState | undefined>(
  undefined
);

function reducer(
  state: ApplicationState,
  action: ApplicationAction
): ApplicationState {
  switch (action.type) {
    case ApplicationActionType.LOADING:
      return { ...state, isLoading: true, errorResponse: undefined };

    case ApplicationActionType.APPLICATION_LOADED:
      return {
        ...state,
        application: action.payload as RetrievedApplication,
        isLoading: false,
      };

    case ApplicationActionType.INPUT_SAVED:
      const payload = action.payload as {
        formId: number;
        fieldId: string;
        newValue: string;
      };

      return {
        ...state,
        application: {
          ...state.application,
          forms: updateFormsInputValues(
            state.application!.forms,
            payload.formId,
            payload.fieldId,
            payload.newValue
          ),
        } as RetrievedApplication,
        isLoading: false,
      };

    case ApplicationActionType.ATTACHMENT_ATTACHED:
      const attachPayload = action.payload as {
        formId: number;
        fieldId: string;
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
            addAttachmentIdToFieldValue
          ) as Form[],
        } as RetrievedApplication,
        isLoading: false,
      };

    case ApplicationActionType.ATTACHMENT_DELETED:
      const deletePayload = action.payload as {
        formId: number;
        fieldId: string;
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
            deleteAttachmentIdFromFieldValue
          ) as Form[],
        } as RetrievedApplication,
        isLoading: false,
      };

    case ApplicationActionType.FORM_SAVED:
      return { ...state, isLoading: false };

    case ApplicationActionType.CLEAR_ERROR:
      return { ...state, errorResponse: undefined };

    case ApplicationActionType.REJECTED:
      const errorResponse = action.payload as ErrorResponse;
      return {
        ...state,
        errorResponse: errorResponse,
        isLoading: false,
      };

    case ApplicationActionType.ACCEPT_TERMS:
      return { ...state, termsAccepted: true, isLoading: false };

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

const debouncedSaveFormAndDuos = debounce(
  async (
    forms: Form[],
    dispatch: Dispatch<ApplicationAction>,
    applicationId: number,
    handleErrorResponseAfterAction: (response: Response) => Promise<void>
  ) => {
    dispatch({ type: ApplicationActionType.LOADING });
    const response = await fetch(
      `/api/applications/${applicationId}/save-forms-and-duos`,
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
              ...(field.type === FieldType.TABLE
                ? { tableValues: field.tableValues }
                : {}),
            })),
          })),
          duoCodes: [],
        }),
      }
    );

    dispatch({ type: ApplicationActionType.FORM_SAVED });

    await handleErrorResponseAfterAction(response);
  },
  2000
);

type ApplicationProviderProps = {
  children: React.ReactNode;
};

function ApplicationProvider({ children }: ApplicationProviderProps) {
  const initialState: ApplicationState = {
    isLoading: false,
    termsAccepted: false,
  };

  const [{ application, isLoading, errorResponse, termsAccepted }, dispatch] =
    useReducer(reducer, initialState);

  const clearError = () => {
    dispatch({ type: ApplicationActionType.CLEAR_ERROR });
  };

  const { id } = useParams<{ id: string }>();

  const fetchApplication = useCallback(async () => {
    dispatch({ type: ApplicationActionType.LOADING });
    const response = await fetch(`/api/applications/${id}`);

    if (response.ok) {
      const retrievedApplication = await response.json();
      dispatch({
        type: ApplicationActionType.APPLICATION_LOADED,
        payload: retrievedApplication,
      });
    } else {
      const errorResponse = (await response.json()) as ErrorResponse;
      dispatch({
        type: ApplicationActionType.REJECTED,
        payload: errorResponse,
      });
    }
  }, [id]);

  useEffect(() => {
    fetchApplication().catch((error) => console.log(error));
  }, [fetchApplication]);

  async function addAttachment(
    formId: number,
    fieldId: string,
    formData: FormData
  ): Promise<void> {
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
      {
        application,
        isLoading,
        errorResponse,
        termsAccepted,
      },
      action
    ).application as RetrievedApplication;
    await saveFormAndDuos(updatedForms);
  }

  async function updateInputFields(
    formId: number,
    fieldId: string,
    newValue: string
  ): Promise<void> {
    dispatch({ type: ApplicationActionType.LOADING });

    const action = {
      type: ApplicationActionType.INPUT_SAVED,
      payload: {
        formId: formId,
        fieldId: fieldId,
        newValue: newValue,
      },
    };

    dispatch(action);

    const { forms: updatedForms } = reducer(
      {
        application,
        isLoading,
        errorResponse,
        termsAccepted,
      },
      action
    ).application as RetrievedApplication;
    await saveFormAndDuos(updatedForms);
  }

  async function deleteAttachment(
    formId: number,
    fieldId: string,
    attachmentId: number
  ) {
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
      {
        application,
        isLoading,
        errorResponse,
        termsAccepted,
      },
      action
    ).application as RetrievedApplication;

    await saveFormAndDuos(updatedForms);
  }

  async function saveFormAndDuos(forms: Form[]) {
    await debouncedSaveFormAndDuos(
      forms,
      dispatch,
      application!.id,
      handleErrorResponseAfterAction
    );
  }

  async function submitApplication() {
    dispatch({ type: ApplicationActionType.LOADING });

    const response = await fetch(
      `/api/applications/${application!.id}/submit`,
      { method: "POST" }
    );

    await handleErrorResponseAfterAction(response);
  }

  async function acceptTerms(acceptedLicenses: number[]) {
    dispatch({ type: ApplicationActionType.LOADING });

    const response = await fetch(
      `/api/applications/${application!.id}/accept-terms`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          acceptedLicenses,
        } as AcceptTermsCommand),
      }
    );

    dispatch({ type: ApplicationActionType.ACCEPT_TERMS });
    await handleErrorResponseAfterAction(response);
  }

  async function handleErrorResponseAfterAction(response: Response) {
    if (response.ok) {
      dispatch({ type: ApplicationActionType.CLEAR_ERROR });
      await fetchApplication();
    } else {
      const errorResponse = await response.json();
      dispatch({
        type: ApplicationActionType.REJECTED,
        payload: errorResponse,
      });
    }
  }

  return (
    <ApplicationContext.Provider
      value={{
        application,
        isLoading,
        errorResponse,
        termsAccepted,
        addAttachment,
        deleteAttachment,
        submitApplication,
        updateInputFields,
        clearError,
        acceptTerms,
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
      "useAttachmentUpload must be used within a AttachmentUploadProvider"
    );
  }
  return context;
}

export { ApplicationProvider, useApplicationDetails };
