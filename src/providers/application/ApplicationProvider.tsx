// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { FormFieldType } from "@/app/api/access-management/additional-types";
import {
  ErrorResponse,
  RetrievedApplication,
  RetrievedApplicationForm,
  RetrievedApplicationFormField,
} from "@/app/api/access-management/open-api/schemas";
import {
  addAttachmentIdToFieldValue,
  deleteAttachmentIdFromFieldValue,
  updateFormWithNewAttachment,
  updateFormsInputValues,
} from "@/utils/application";
import debounce from "@/utils/debounce";
import { AxiosError } from "axios";
import { useParams } from "next/navigation";
import {
  Dispatch,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import {
  acceptApplicationTermsApi,
  addAttachmentToApplicationApi,
  deleteApplicationApi,
  retrieveApplicationApi,
  saveFormsAndDuosApi,
  submitApplicationApi,
} from "../../app/api/access-management";
import {
  ApplicationAction,
  ApplicationActionType,
  ApplicationContextState,
  ApplicationState,
  FormAttachmentUpdate,
  FormValueUpdate,
} from "./ApplicationProvider.types";

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

    case ApplicationActionType.APPLICATION_DELETED:
      return {
        ...state,
        isLoading: false,
        application: undefined,
        termsAccepted: false,
        errorResponse: undefined,
      };

    case ApplicationActionType.INPUT_SAVED:
      const payload = action.payload as FormValueUpdate;

      return {
        ...state,
        application: {
          ...state.application,
          forms: updateFormsInputValues(
            state.application!.forms!,
            payload.formId,
            payload.fieldId,
            payload.newValue
          ),
        } as RetrievedApplication,
        isLoading: false,
      };

    case ApplicationActionType.ATTACHMENT_ATTACHED:
      const attachPayload = action.payload as FormAttachmentUpdate;

      return {
        ...state,
        application: {
          ...state.application,
          forms: updateFormWithNewAttachment(
            state.application!.forms!,
            attachPayload.formId,
            attachPayload.fieldId,
            attachPayload.attachmentId,
            addAttachmentIdToFieldValue
          ),
        } as RetrievedApplication,
        isLoading: false,
      };

    case ApplicationActionType.ATTACHMENT_DELETED:
      const deletePayload = action.payload as FormAttachmentUpdate;

      return {
        ...state,
        application: {
          ...state.application,
          forms: updateFormWithNewAttachment(
            state.application!.forms!,
            deletePayload.formId,
            deletePayload.fieldId,
            deletePayload.attachmentId,
            deleteAttachmentIdFromFieldValue
          ),
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

  const params = useParams<{ id: string }>();
  const id = params?.id;

  const fetchApplication = useCallback(async () => {
    if (!id) return;
    dispatch({ type: ApplicationActionType.LOADING });

    try {
      const retrievedApplication = (await retrieveApplicationApi(
        +id
      )) as RetrievedApplication;

      dispatch({
        type: ApplicationActionType.APPLICATION_LOADED,
        payload: retrievedApplication,
      });
    } catch (error) {
      handleErrorResponseAfterAction(error as Error);
    }
  }, [id]);

  useEffect(() => {
    fetchApplication().catch((error) => console.log(error));
  }, [fetchApplication]);

  async function addAttachment(
    formId: number,
    fieldId: string,
    attachment: FormData
  ): Promise<void> {
    dispatch({ type: ApplicationActionType.LOADING });

    try {
      const attachmentId = (await addAttachmentToApplicationApi(
        application!.id!,
        attachment
      )) as number;

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
      await saveFormAndDuos(updatedForms!);
    } catch (error) {
      handleErrorResponseAfterAction(error as Error);
    }
  }

  async function updateInputFields(
    formId: number,
    fieldId: string,
    newValue: string
  ): Promise<void> {
    dispatch({ type: ApplicationActionType.LOADING });

    try {
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

      await saveFormAndDuos(updatedForms!);
    } catch (error) {
      handleErrorResponseAfterAction(error as Error);
    }
  }

  async function deleteAttachment(
    formId: number,
    fieldId: string,
    attachmentId: number
  ) {
    dispatch({ type: ApplicationActionType.LOADING });

    try {
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

      await saveFormAndDuos(updatedForms!);
    } catch (error) {
      handleErrorResponseAfterAction(error as Error);
    }
  }

  async function acceptTerms(acceptedLicenses: number[]) {
    dispatch({ type: ApplicationActionType.LOADING });

    try {
      await acceptApplicationTermsApi(application!.id!, { acceptedLicenses });
      dispatch({ type: ApplicationActionType.ACCEPT_TERMS });
      await fetchApplication();
    } catch (error) {
      handleErrorResponseAfterAction(error as Error);
    }
  }

  async function saveFormAndDuos(forms: RetrievedApplicationForm[]) {
    debouncedSaveFormAndDuos(forms, dispatch, application!.id!);
  }

  async function deleteApplication() {
    dispatch({ type: ApplicationActionType.LOADING });

    try {
      await deleteApplicationApi(application!.id!);
      dispatch({ type: ApplicationActionType.APPLICATION_DELETED });
    } catch (error) {
      handleErrorResponseAfterAction(error as Error);
    }
  }

  async function submitApplication() {
    dispatch({ type: ApplicationActionType.LOADING });

    try {
      const result = await submitApplicationApi(application!.id!);

      if (result.ok) {
        dispatch({ type: ApplicationActionType.CLEAR_ERROR });
        await fetchApplication();
        return;
      }

      dispatch({
        type: ApplicationActionType.REJECTED,
        payload: result.response?.data ?? {
          title: "Error",
          detail: "Failed to submit application",
          status: 500,
        },
      });
    } catch (error) {
      handleErrorResponseAfterAction(error as Error);
    }
  }

  const debouncedSaveFormAndDuos = debounce(
    async (
      forms: RetrievedApplicationForm[],
      dispatch: Dispatch<ApplicationAction>,
      applicationId: number
    ) => {
      dispatch({ type: ApplicationActionType.LOADING });

      try {
        await saveFormsAndDuosApi(
          applicationId,
          forms.map((form: RetrievedApplicationForm) => ({
            formId: form.id,
            fields: form.fields!.map(
              (field: RetrievedApplicationFormField) => ({
                fieldId: field.id,
                value: field.value,
                ...(field.type === FormFieldType.TABLE
                  ? { tableValues: field.tableValues }
                  : {}),
              })
            ),
          })),
          []
        );

        dispatch({ type: ApplicationActionType.FORM_SAVED });
      } catch (error) {
        handleErrorResponseAfterAction(error as Error);
      }
      await fetchApplication();
    },
    200
  );

  function handleErrorResponseAfterAction(error: Error) {
    if (error instanceof AxiosError) {
      dispatch({
        type: ApplicationActionType.REJECTED,
        payload: error.response?.data,
      });
    } else {
      dispatch({
        type: ApplicationActionType.REJECTED,
        payload: {
          title: "Internal server error",
          detail: "An error occurred while processing your request",
          status: 500,
        },
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
        deleteApplication,
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
