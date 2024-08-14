// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

interface ListedApplication {
  id: number;
  title: string;
  description: string;
  currentState: string;
  stateChangedAt: string;
  createdAt: string;
  datasets: Dataset[];
}

interface RetrievedApplication {
  id: number;
  externalId: string;
  generatedExternalId: string;
  description: string;
  createdAt: Date;
  modifiedAt: Date;
  lastActivity: Date;
  permissions: string[];
  roles: string[];
  workflow: Workflow;
  applicant: Applicant;
  members: Member[];
  datasets: Dataset[];
  forms: Form[];
  invitedMembers: InvitedMember[];
  events: Event[];
  attachments: Attachment[];
  licenses: RetrievedApplicationLicense[];
  state: State;
}

interface SaveFormAndDuos {
  forms: SaveForm[];
  duoCodes: SaveDUOCode[];
}

interface Workflow {
  id: number;
  type: string;
}

interface Applicant {
  userId: string;
  name: string;
  email: string;
}

interface Member {
  memberId: string;
  name: string;
  email: string;
}

interface Dataset {
  id: number;
  externalId: string;
  title: Label[];
  url: Label[];
}

interface Form {
  id: number;
  internalName: string;
  externalTitle: Label[];
  fields: FormField[];
}

interface FormField {
  id: number;
  value: string;
  optional: boolean;
  private: boolean;
  visible: boolean;
  title: Label[];
  type: FieldType;
}

interface InvitedMember {
  name: string;
  email: string;
}

interface Event {
  actorId: string;
  eventTime: Date;
  eventType: string;
}

interface Attachment {
  id: number;
  filename: string;
  type: string;
}

interface AcceptTermsCommand {
  acceptedLicenses: number[];
}
interface RetrievedApplicationLicense {
  id: number;
  title: Label[];
  type: string;
  enabled: boolean;
  archived: boolean;
  link: Label[];
  text: Label[];
  attachmentFilename: Label[];
  attachmentId: Label[];
  acceptedByCurrentUser: boolean;
}

interface License {
  type: string;
  title: string;
  enabled: boolean;
  archived: boolean;
}

enum State {
  DRAFT = "application.state/draft",
  CLOSED = "application.state/closed",
  APPROVED = "application.state/approved",
  RETURNED = "application.state/returned",
  REJECTED = "application.state/rejected",
  REVOKED = "application.state/revoked",
  SUBMITTED = "application.state/submitted",
}

interface Label {
  language: string;
  name: string;
}

export interface SaveForm {
  formId: number;
  fields: SaveFormField[];
}

export interface SaveFormField {
  fieldId: string;
  value: string;
}

export interface SaveDUOCode {
  duoId: number;
  restrictions: SaveDUOCodeRestriction[];
}

export enum FieldType {
  TEXT = "text",
  TEXT_AREA = "texta",
  ATTACHMENT = "attachment",
  PHONE = "phone-number",
  DATE = "date",
  EMAIL = "email",
}

interface SaveDUOCodeRestriction {
  type: string;
  values: string[];
}

interface AddedAttachment {
  id: number;
}

interface CreateApplicationResponse {
  data: {
    applicationId: number;
  };
}

export type {
  AddedAttachment,
  Applicant,
  Attachment,
  CreateApplicationResponse,
  Dataset,
  Event,
  Form,
  FormField,
  InvitedMember,
  Label,
  License,
  ListedApplication,
  Member,
  RetrievedApplication,
  SaveFormAndDuos,
  Workflow,
  AcceptTermsCommand,
};

export { State };
