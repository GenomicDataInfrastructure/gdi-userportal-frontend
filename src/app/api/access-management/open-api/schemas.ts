import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

type ListedApplication = Partial<{
  id: number;
  title: string;
  description: string;
  currentState: string;
  stateChangedAt: string;
  createdAt: string;
  datasets: Array<ApplicationDataset>;
}>;
type ApplicationDataset = Partial<{
  id: number;
  externalId: string;
  title: Array<Label>;
  url: Array<Label>;
}>;
type Label = {
  language: string;
  name: string;
};
type SaveFormsAndDuos = Partial<{
  forms: Array<SaveForm>;
  duoCodes: Array<SaveDUOCode>;
}>;
type SaveForm = Partial<{
  formId: number;
  fields: Array<SaveFormField>;
}>;
type SaveFormField = Partial<{
  fieldId: string;
  value: string;
  tableValues: Array<Array<FormFieldTableValue>>;
}>;
type FormFieldTableValue = Partial<{
  column: string;
  value: string;
}>;
type SaveDUOCode = Partial<{
  duoId: number;
  restrictions: Array<SaveDUOCodeRestriction>;
}>;
type SaveDUOCodeRestriction = Partial<{
  type: string;
  values: Array<string>;
}>;
type RetrievedApplication = Partial<{
  workflow: RetrievedApplicationWorkflow;
  externalId: string;
  id: number;
  applicant: RetrievedApplicationApplicant;
  members: Array<RetrievedApplicationMember>;
  datasets: Array<ApplicationDataset>;
  forms: Array<RetrievedApplicationForm>;
  invitedMembers: Array<RetrievedApplicationInvitedMember>;
  description: string;
  generatedExternalId: string;
  permissions: Array<string>;
  lastActivity: string;
  events: Array<RetrievedApplicationEvent>;
  roles: Array<string>;
  attachments: Array<RetrievedApplicationAttachment>;
  licenses: Array<RetrievedApplicationLicense>;
  createdAt: string;
  state: RetrievedApplicationState;
  modifiedAt: string;
}>;
type RetrievedApplicationWorkflow = Partial<{
  id: number;
  type: string;
}>;
type RetrievedApplicationApplicant = Partial<{
  userId: string;
  name: string;
  email: string;
}>;
type RetrievedApplicationMember = Partial<{
  memberId: string;
  name: string;
  email: string;
}>;
type RetrievedApplicationForm = Partial<{
  id: number;
  internalName: string;
  externalTitle: Array<Label>;
  fields: Array<RetrievedApplicationFormField>;
}>;
type RetrievedApplicationFormField = Partial<{
  id: string;
  value: string;
  optional: boolean;
  private: boolean;
  visible: boolean;
  title: Array<Label>;
  type: FormFieldType;
  tableValues: Array<Array<FormFieldTableValue>>;
  tableColumns: Array<FormFieldTableColumn>;
  infoText: Array<Label>;
  placeholder: Array<Label>;
  maxLength: number;
  privacy: FormFieldPrivacy;
  options: Array<FormFieldOption>;
}>;
type FormFieldType =
  | "text"
  | "texta"
  | "attachment"
  | "phone-number"
  | "date"
  | "email"
  | "header"
  | "option"
  | "multiselect"
  | "label"
  | "table";
type FormFieldTableColumn = Partial<{
  key: string;
  label: Array<Label>;
}>;
type FormFieldPrivacy = "private" | "public";
type FormFieldOption = {
  key: string;
  label: Array<Label>;
};
type RetrievedApplicationInvitedMember = Partial<{
  name: string;
  email: string;
}>;
type RetrievedApplicationEvent = Partial<{
  actorId: string;
  eventTime: string;
  eventType: string;
}>;
type RetrievedApplicationAttachment = Partial<{
  id: number;
  filename: string;
  type: string;
}>;
type RetrievedApplicationLicense = Partial<{
  id: number;
  title: Array<Label>;
  type: LicenseType;
  enabled: boolean;
  archived: boolean;
  link: Array<Label>;
  text: Array<Label>;
  attachmentFilename: Array<Label>;
  attachmentId: Array<Label>;
  acceptedByCurrentUser: boolean;
}>;
type LicenseType = "link" | "attachment" | "text";
type RetrievedApplicationState =
  | "application.state/draft"
  | "application.state/closed"
  | "application.state/approved"
  | "application.state/returned"
  | "application.state/rejected"
  | "application.state/revoked"
  | "application.state/submitted";
type ListedBasket = Partial<{
  id: number;
  daamUri: string;
  datasets: Array<ListedBasketDataset>;
}>;
type ListedBasketDataset = Partial<{
  id: string;
  title: string;
}>;
type ErrorResponse = {
  title: string;
  status: number;
  detail?: string | undefined;
  validationWarnings?: Array<ValidationWarning> | undefined;
};
type ValidationWarning = {
  key: string;
  formId?: number | undefined;
  fieldId?: string | undefined;
};
type RetrieveGrantedDatasetIdentifiers = {
  entitlements: Array<Entitlement>;
};
type Entitlement = {
  datasetId: string;
  start: string;
  end?: string | undefined;
};

const Label = z
  .object({ language: z.string(), name: z.string() })
  .passthrough();
const ApplicationDataset = z
  .object({
    id: z.number().int(),
    externalId: z.string(),
    title: z.array(Label),
    url: z.array(Label),
  })
  .partial()
  .passthrough();
const ListedApplication: z.ZodType<ListedApplication> = z
  .object({
    id: z.number().int(),
    title: z.string(),
    description: z.string(),
    currentState: z.string(),
    stateChangedAt: z.string().datetime({ offset: true }),
    createdAt: z.string().datetime({ offset: true }),
    datasets: z.array(ApplicationDataset),
  })
  .partial()
  .passthrough();
const RetrievedApplicationWorkflow = z
  .object({ id: z.number().int(), type: z.string() })
  .partial()
  .passthrough();
const RetrievedApplicationApplicant = z
  .object({ userId: z.string(), name: z.string(), email: z.string() })
  .partial()
  .passthrough();
const RetrievedApplicationMember = z
  .object({ memberId: z.string(), name: z.string(), email: z.string() })
  .partial()
  .passthrough();
const FormFieldType = z.enum([
  "text",
  "texta",
  "attachment",
  "phone-number",
  "date",
  "email",
  "header",
  "option",
  "multiselect",
  "label",
  "table",
]);
const FormFieldTableValue = z
  .object({ column: z.string(), value: z.string() })
  .partial()
  .passthrough();
const FormFieldTableColumn = z
  .object({ key: z.string(), label: z.array(Label) })
  .partial()
  .passthrough();
const FormFieldPrivacy = z.enum(["private", "public"]);
const FormFieldOption = z
  .object({ key: z.string(), label: z.array(Label) })
  .passthrough();
const RetrievedApplicationFormField = z
  .object({
    id: z.string(),
    value: z.string(),
    optional: z.boolean(),
    private: z.boolean(),
    visible: z.boolean(),
    title: z.array(Label),
    type: FormFieldType,
    tableValues: z.array(z.array(FormFieldTableValue)),
    tableColumns: z.array(FormFieldTableColumn),
    infoText: z.array(Label),
    placeholder: z.array(Label),
    maxLength: z.number().int(),
    privacy: FormFieldPrivacy,
    options: z.array(FormFieldOption),
  })
  .partial()
  .passthrough();
const RetrievedApplicationForm = z
  .object({
    id: z.number().int(),
    internalName: z.string(),
    externalTitle: z.array(Label),
    fields: z.array(RetrievedApplicationFormField),
  })
  .partial()
  .passthrough();
const RetrievedApplicationInvitedMember = z
  .object({ name: z.string(), email: z.string() })
  .partial()
  .passthrough();
const RetrievedApplicationEvent = z
  .object({
    actorId: z.string(),
    eventTime: z.string().datetime({ offset: true }),
    eventType: z.string(),
  })
  .partial()
  .passthrough();
const RetrievedApplicationAttachment = z
  .object({ id: z.number().int(), filename: z.string(), type: z.string() })
  .partial()
  .passthrough();
const LicenseType = z.enum(["link", "attachment", "text"]);
const RetrievedApplicationLicense = z
  .object({
    id: z.number().int(),
    title: z.array(Label),
    type: LicenseType,
    enabled: z.boolean(),
    archived: z.boolean(),
    link: z.array(Label),
    text: z.array(Label),
    attachmentFilename: z.array(Label),
    attachmentId: z.array(Label),
    acceptedByCurrentUser: z.boolean(),
  })
  .partial()
  .passthrough();
const RetrievedApplicationState = z.enum([
  "application.state/draft",
  "application.state/closed",
  "application.state/approved",
  "application.state/returned",
  "application.state/rejected",
  "application.state/revoked",
  "application.state/submitted",
]);
const RetrievedApplication: z.ZodType<RetrievedApplication> = z
  .object({
    workflow: RetrievedApplicationWorkflow,
    externalId: z.string(),
    id: z.number().int(),
    applicant: RetrievedApplicationApplicant,
    members: z.array(RetrievedApplicationMember),
    datasets: z.array(ApplicationDataset),
    forms: z.array(RetrievedApplicationForm),
    invitedMembers: z.array(RetrievedApplicationInvitedMember),
    description: z.string(),
    generatedExternalId: z.string(),
    permissions: z.array(z.string()),
    lastActivity: z.string().datetime({ offset: true }),
    events: z.array(RetrievedApplicationEvent),
    roles: z.array(z.string()),
    attachments: z.array(RetrievedApplicationAttachment),
    licenses: z.array(RetrievedApplicationLicense),
    createdAt: z.string().datetime({ offset: true }),
    state: RetrievedApplicationState,
    modifiedAt: z.string().datetime({ offset: true }),
  })
  .partial()
  .passthrough();
const ValidationWarning = z
  .object({
    key: z.string(),
    formId: z.number().int().optional(),
    fieldId: z.string().optional(),
  })
  .passthrough();
const ErrorResponse: z.ZodType<ErrorResponse> = z
  .object({
    title: z.string(),
    status: z.number().int(),
    detail: z.string().optional(),
    validationWarnings: z.array(ValidationWarning).optional(),
  })
  .passthrough();
const SaveFormField = z
  .object({
    fieldId: z.string(),
    value: z.string(),
    tableValues: z.array(z.array(FormFieldTableValue)),
  })
  .partial()
  .passthrough();
const SaveForm = z
  .object({ formId: z.number().int(), fields: z.array(SaveFormField) })
  .partial()
  .passthrough();
const SaveDUOCodeRestriction = z
  .object({ type: z.string(), values: z.array(z.string()) })
  .partial()
  .passthrough();
const SaveDUOCode = z
  .object({
    duoId: z.number().int(),
    restrictions: z.array(SaveDUOCodeRestriction),
  })
  .partial()
  .passthrough();
const SaveFormsAndDuos: z.ZodType<SaveFormsAndDuos> = z
  .object({ forms: z.array(SaveForm), duoCodes: z.array(SaveDUOCode) })
  .partial()
  .passthrough();
const CreateApplication = z
  .object({ datasetIds: z.array(z.string()) })
  .passthrough();
const CreateApplicationResponse = z
  .object({ applicationId: z.number().int() })
  .passthrough();
const AcceptTermsCommand = z
  .object({ acceptedLicenses: z.array(z.number().int()) })
  .passthrough();
const AddedAttachment = z
  .object({ id: z.number().int() })
  .partial()
  .passthrough();
const RemoveMember = z.object({ memberId: z.string() }).passthrough();
const UpdateDatasets = z
  .object({ datasetIds: z.array(z.string()), comment: z.string().optional() })
  .passthrough();
const AddApplicationEvent = z
  .object({ key: z.string(), description: z.string() })
  .partial()
  .passthrough();
const ListedBasketDataset = z
  .object({ id: z.string(), title: z.string() })
  .partial()
  .passthrough();
const ListedBasket: z.ZodType<ListedBasket> = z
  .object({
    id: z.number().int(),
    daamUri: z.string(),
    datasets: z.array(ListedBasketDataset),
  })
  .partial()
  .passthrough();
const AddDatasetToBasket = z
  .object({ datasetIds: z.array(z.string()) })
  .passthrough();
const Entitlement = z
  .object({
    datasetId: z.string(),
    start: z.string().datetime({ offset: true }),
    end: z.string().datetime({ offset: true }).optional(),
  })
  .passthrough();
const RetrieveGrantedDatasetIdentifiers: z.ZodType<RetrieveGrantedDatasetIdentifiers> =
  z.object({ entitlements: z.array(Entitlement) }).passthrough();

export {
  ApplicationDataset,
  Entitlement,
  ErrorResponse,
  FormFieldOption,
  FormFieldPrivacy,
  FormFieldTableColumn,
  FormFieldTableValue,
  FormFieldType,
  Label,
  LicenseType,
  ListedApplication,
  ListedBasket,
  ListedBasketDataset,
  RetrievedApplication,
  RetrievedApplicationApplicant,
  RetrievedApplicationAttachment,
  RetrievedApplicationEvent,
  RetrievedApplicationForm,
  RetrievedApplicationFormField,
  RetrievedApplicationInvitedMember,
  RetrievedApplicationLicense,
  RetrievedApplicationMember,
  RetrievedApplicationState,
  RetrievedApplicationWorkflow,
  RetrieveGrantedDatasetIdentifiers,
  SaveDUOCode,
  SaveDUOCodeRestriction,
  SaveForm,
  SaveFormField,
  SaveFormsAndDuos,
  ValidationWarning,
};

export const schemas = {
  Label,
  ApplicationDataset,
  ListedApplication,
  RetrievedApplicationWorkflow,
  RetrievedApplicationApplicant,
  RetrievedApplicationMember,
  FormFieldType,
  FormFieldTableValue,
  FormFieldTableColumn,
  FormFieldPrivacy,
  FormFieldOption,
  RetrievedApplicationFormField,
  RetrievedApplicationForm,
  RetrievedApplicationInvitedMember,
  RetrievedApplicationEvent,
  RetrievedApplicationAttachment,
  LicenseType,
  RetrievedApplicationLicense,
  RetrievedApplicationState,
  RetrievedApplication,
  ValidationWarning,
  ErrorResponse,
  SaveFormField,
  SaveForm,
  SaveDUOCodeRestriction,
  SaveDUOCode,
  SaveFormsAndDuos,
  CreateApplication,
  CreateApplicationResponse,
  AcceptTermsCommand,
  AddedAttachment,
  RemoveMember,
  UpdateDatasets,
  AddApplicationEvent,
  ListedBasketDataset,
  ListedBasket,
  AddDatasetToBasket,
  Entitlement,
  RetrieveGrantedDatasetIdentifiers,
};

const endpoints = makeApi([
  {
    method: "get",
    path: "/api/v1/applications",
    alias: "list_applications_v1",
    requestFormat: "json",
    response: z.array(ListedApplication),
  },
  {
    method: "get",
    path: "/api/v1/applications/:id",
    alias: "retrieve_application_v1",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: z
      .object({
        workflow: RetrievedApplicationWorkflow,
        externalId: z.string(),
        id: z.number().int(),
        applicant: RetrievedApplicationApplicant,
        members: z.array(RetrievedApplicationMember),
        datasets: z.array(ApplicationDataset),
        forms: z.array(RetrievedApplicationForm),
        invitedMembers: z.array(RetrievedApplicationInvitedMember),
        description: z.string(),
        generatedExternalId: z.string(),
        permissions: z.array(z.string()),
        lastActivity: z.string().datetime({ offset: true }),
        events: z.array(RetrievedApplicationEvent),
        roles: z.array(z.string()),
        attachments: z.array(RetrievedApplicationAttachment),
        licenses: z.array(RetrievedApplicationLicense),
        createdAt: z.string().datetime({ offset: true }),
        state: RetrievedApplicationState,
        modifiedAt: z.string().datetime({ offset: true }),
      })
      .partial()
      .passthrough(),
    errors: [
      {
        status: 404,
        description: `No application found`,
        schema: z
          .object({
            title: z.string(),
            status: z.number().int(),
            detail: z.string().optional(),
            validationWarnings: z.array(ValidationWarning).optional(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "delete",
    path: "/api/v1/applications/:id",
    alias: "delete_application_v1",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 403,
        description: `Application does not belong to applicant`,
        schema: z
          .object({
            title: z.string(),
            status: z.number().int(),
            detail: z.string().optional(),
            validationWarnings: z.array(ValidationWarning).optional(),
          })
          .passthrough(),
      },
      {
        status: 404,
        description: `Application not found`,
        schema: z
          .object({
            title: z.string(),
            status: z.number().int(),
            detail: z.string().optional(),
            validationWarnings: z.array(ValidationWarning).optional(),
          })
          .passthrough(),
      },
      {
        status: 409,
        description: `Application not in draft state`,
        schema: z
          .object({
            title: z.string(),
            status: z.number().int(),
            detail: z.string().optional(),
            validationWarnings: z.array(ValidationWarning).optional(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "post",
    path: "/api/v1/applications/:id/accept-terms",
    alias: "accept_application_terms_v1",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `Accept terms data`,
        type: "Body",
        schema: z
          .object({ acceptedLicenses: z.array(z.number().int()) })
          .passthrough(),
      },
      {
        name: "id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: z
          .object({
            title: z.string(),
            status: z.number().int(),
            detail: z.string().optional(),
            validationWarnings: z.array(ValidationWarning).optional(),
          })
          .passthrough(),
      },
      {
        status: 403,
        description: `Application does not belong to applicant`,
        schema: z
          .object({
            title: z.string(),
            status: z.number().int(),
            detail: z.string().optional(),
            validationWarnings: z.array(ValidationWarning).optional(),
          })
          .passthrough(),
      },
      {
        status: 404,
        description: `Application not found`,
        schema: z
          .object({
            title: z.string(),
            status: z.number().int(),
            detail: z.string().optional(),
            validationWarnings: z.array(ValidationWarning).optional(),
          })
          .passthrough(),
      },
      {
        status: 409,
        description: `Application not in submittable state`,
        schema: z
          .object({
            title: z.string(),
            status: z.number().int(),
            detail: z.string().optional(),
            validationWarnings: z.array(ValidationWarning).optional(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "post",
    path: "/api/v1/applications/:id/attachments",
    alias: "add_attachment_to_application_v1",
    requestFormat: "form-data",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z
          .object({ file: z.instanceof(File) })
          .partial()
          .passthrough(),
      },
      {
        name: "id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: z.object({ id: z.number().int() }).partial().passthrough(),
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: z
          .object({
            title: z.string(),
            status: z.number().int(),
            detail: z.string().optional(),
            validationWarnings: z.array(ValidationWarning).optional(),
          })
          .passthrough(),
      },
      {
        status: 403,
        description: `Application does not belong to applicant`,
        schema: z
          .object({
            title: z.string(),
            status: z.number().int(),
            detail: z.string().optional(),
            validationWarnings: z.array(ValidationWarning).optional(),
          })
          .passthrough(),
      },
      {
        status: 404,
        description: `Application not found`,
        schema: z
          .object({
            title: z.string(),
            status: z.number().int(),
            detail: z.string().optional(),
            validationWarnings: z.array(ValidationWarning).optional(),
          })
          .passthrough(),
      },
      {
        status: 409,
        description: `Application not in submittable state`,
        schema: z
          .object({
            title: z.string(),
            status: z.number().int(),
            detail: z.string().optional(),
            validationWarnings: z.array(ValidationWarning).optional(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/applications/:id/attachments/:attachmentId",
    alias: "retrieve_attachment_from_application_v1",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.number().int(),
      },
      {
        name: "attachmentId",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/v1/applications/:id/cancel",
    alias: "cancel_application_v1",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/v1/applications/:id/copy-as-new",
    alias: "copy_application_as_new_v1",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/v1/applications/:id/events",
    alias: "add_event_to_application_v1",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z
          .object({ key: z.string(), description: z.string() })
          .partial()
          .passthrough(),
      },
      {
        name: "id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/v1/applications/:id/invite-member",
    alias: "invite_member_to_application_v1",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/v1/applications/:id/remove-member",
    alias: "remove_member_from_application_v1",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ memberId: z.string() }).passthrough(),
      },
      {
        name: "id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/v1/applications/:id/save-forms-and-duos",
    alias: "save_application_forms_and_duos_v1",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z
          .object({ forms: z.array(SaveForm), duoCodes: z.array(SaveDUOCode) })
          .partial()
          .passthrough(),
      },
      {
        name: "id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 403,
        description: `Application does not belong to applicant`,
        schema: z
          .object({
            title: z.string(),
            status: z.number().int(),
            detail: z.string().optional(),
            validationWarnings: z.array(ValidationWarning).optional(),
          })
          .passthrough(),
      },
      {
        status: 404,
        description: `Application not found`,
        schema: z
          .object({
            title: z.string(),
            status: z.number().int(),
            detail: z.string().optional(),
            validationWarnings: z.array(ValidationWarning).optional(),
          })
          .passthrough(),
      },
      {
        status: 409,
        description: `Application not in submittable state`,
        schema: z
          .object({
            title: z.string(),
            status: z.number().int(),
            detail: z.string().optional(),
            validationWarnings: z.array(ValidationWarning).optional(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "post",
    path: "/api/v1/applications/:id/submit",
    alias: "submit_application_v1",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: z
          .object({
            title: z.string(),
            status: z.number().int(),
            detail: z.string().optional(),
            validationWarnings: z.array(ValidationWarning).optional(),
          })
          .passthrough(),
      },
      {
        status: 403,
        description: `Application does not belong to applicant`,
        schema: z
          .object({
            title: z.string(),
            status: z.number().int(),
            detail: z.string().optional(),
            validationWarnings: z.array(ValidationWarning).optional(),
          })
          .passthrough(),
      },
      {
        status: 404,
        description: `Application not found`,
        schema: z
          .object({
            title: z.string(),
            status: z.number().int(),
            detail: z.string().optional(),
            validationWarnings: z.array(ValidationWarning).optional(),
          })
          .passthrough(),
      },
      {
        status: 409,
        description: `Application not in submittable state`,
        schema: z
          .object({
            title: z.string(),
            status: z.number().int(),
            detail: z.string().optional(),
            validationWarnings: z.array(ValidationWarning).optional(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "post",
    path: "/api/v1/applications/:id/update-datasets",
    alias: "update_datasets_of_application_v1",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.array(UpdateDatasets),
      },
      {
        name: "id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/v1/applications/create",
    alias: "create_application_v1",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ datasetIds: z.array(z.string()) }).passthrough(),
      },
    ],
    response: z.object({ applicationId: z.number().int() }).passthrough(),
    errors: [
      {
        status: 400,
        description: `Create application retrieves errors`,
        schema: z
          .object({
            title: z.string(),
            status: z.number().int(),
            detail: z.string().optional(),
            validationWarnings: z.array(ValidationWarning).optional(),
          })
          .passthrough(),
      },
      {
        status: 404,
        description: `Catalogue Item not found`,
        schema: z
          .object({
            title: z.string(),
            status: z.number().int(),
            detail: z.string().optional(),
            validationWarnings: z.array(ValidationWarning).optional(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/baskets",
    alias: "list_baskets_v1",
    requestFormat: "json",
    response: z.array(ListedBasket),
  },
  {
    method: "post",
    path: "/api/v1/baskets/:id/create-application",
    alias: "create_application_from_basket_v1",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/v1/baskets/add-dataset",
    alias: "add_dataset_to_baskets_v1",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ datasetIds: z.array(z.string()) }).passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "get",
    path: "/api/v1/entitlements",
    alias: "retrieve_granted_dataset_identifiers",
    requestFormat: "json",
    response: z.object({ entitlements: z.array(Entitlement) }).passthrough(),
  },
  {
    method: "post",
    path: "/api/v1/test/:test",
    alias: "test_v1",
    requestFormat: "json",
    parameters: [
      {
        name: "test",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 404,
        description: `Application not found`,
        schema: z
          .object({
            title: z.string(),
            status: z.number().int(),
            detail: z.string().optional(),
            validationWarnings: z.array(ValidationWarning).optional(),
          })
          .passthrough(),
      },
    ],
  },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
