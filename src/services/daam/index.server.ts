// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

if (typeof window !== "undefined") {
  throw new Error(
    "This module is intended for server-side use only and should not be included in client-side components."
  );
}

import serverConfig from "../../config/serverConfig";
import { makeAddAttachmentToApplication } from "./backend/addAttachmentToApplication";
import { makeCreateApplication } from "./backend/createApplication";
import { makeListApplications } from "./backend/listApplications";
import { makeRetrieveApplication } from "./backend/retrieveApplication";
import { makeRetrieveEntitlements } from "./backend/retrieveEntitlements";
import { makeSaveFormsAndDuos } from "./backend/saveFormAndDuos";
import { makeSubmitApplication } from "./backend/submitApplication";
import { makeSaveTermsAcceptance } from "./backend/saveTermsAcceptance";

const createApplication = makeCreateApplication(serverConfig.daamUrl);
const listApplications = makeListApplications(serverConfig.daamUrl);
const retrieveApplication = makeRetrieveApplication(serverConfig.daamUrl);
const addAttachmentToApplication = makeAddAttachmentToApplication(
  serverConfig.daamUrl
);
const saveFormAndDuos = makeSaveFormsAndDuos(serverConfig.daamUrl);
const submitApplication = makeSubmitApplication(serverConfig.daamUrl);
const retrieveEntitlements = makeRetrieveEntitlements(serverConfig.daamUrl);
const saveTermsAcceptance = makeSaveTermsAcceptance(serverConfig.daamUrl);

export {
  addAttachmentToApplication,
  createApplication,
  listApplications,
  retrieveApplication,
  saveFormAndDuos,
  submitApplication,
  retrieveEntitlements,
  saveTermsAcceptance,
};
