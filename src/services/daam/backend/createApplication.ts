// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import axios from 'axios';
import { decrypt } from '@/utils/encryption';
import { ExtendedSession } from '@/utils/auth';

export const makeCreateApplication = (daamUrl: string) => {
  return async (datasetIds: string[], session: ExtendedSession): Promise<void> => {
    const requestBody = {
      datasetIds: datasetIds,
    };
    await axios.post(`${daamUrl}/api/v1/applications/create-application`, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${decrypt(session.access_token)}`,
      },
    });
  };
};
