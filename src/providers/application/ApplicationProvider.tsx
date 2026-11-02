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
import { signIn } from "next-auth/react";
import {
  Dispatch,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
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

  const handleErrorResponseAfterAction = useCallback((error: Error) => {
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
  }, []);

  const isRedirectingToLogin = useRef(false);
  const reauthenticate = useCallback(async () => {
    if (isRedirectingToLogin.current) return;
    isRedirectingToLogin.current = true;
    try {
      await signIn("keycloak", { callbackUrl: window.location.href });
    } catch (error) {
      isRedirectingToLogin.current = false;
      handleErrorResponseAfterAction(error as Error);
    }
  }, [handleErrorResponseAfterAction]);

  const fetchApplication = useCallback(async () => {
    if (!id) return;
    dispatch({ type: ApplicationActionType.LOADING });

    try {
      const result = await retrieveApplicationApi(+id);
      if (!result.ok) {
        await reauthenticate();
        return;
      }

      dispatch({
        type: ApplicationActionType.APPLICATION_LOADED,
        payload: result.data,
      });
    } catch (error) {
      handleErrorResponseAfterAction(error as Error);
    }
  }, [id, reauthenticate, handleErrorResponseAfterAction]);

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
      const result = await addAttachmentToApplicationApi(
        application!.id!,
        attachment
      );
      if (!result.ok) {
        await reauthenticate();
        return;
      }
      const attachmentId = result.data;
      if (attachmentId === undefined) {
        throw new Error("Attachment response is missing an ID");
      }

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
      const result = await acceptApplicationTermsApi(application!.id!, {
        acceptedLicenses,
      });
      if (!result.ok) {
        await reauthenticate();
        return;
      }
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
      const result = await deleteApplicationApi(application!.id!);
      if (!result.ok) {
        await reauthenticate();
        return;
      }
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

      if (result.response?.status === 401) {
        await reauthenticate();
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
        const result = await saveFormsAndDuosApi(
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

        if (!result.ok) {
          await reauthenticate();
          return;
        }
        dispatch({ type: ApplicationActionType.FORM_SAVED });
      } catch (error) {
        handleErrorResponseAfterAction(error as Error);
      }
      await fetchApplication();
    },
    200
  );

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
