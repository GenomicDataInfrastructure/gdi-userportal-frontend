// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import { makeCreateApplication } from './backend/createApplication';
import serverConfig from '../../config/serverConfig';

const createApplication = makeCreateApplication(serverConfig.daamUrl);

export { createApplication };
