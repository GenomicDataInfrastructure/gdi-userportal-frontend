// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { ExtendedSession } from '@/app/api/auth/auth.types';
import { RetrievedApplication } from '@/types/application.types';
import { decrypt } from '@/utils/encryption';
import axios, { AxiosResponse } from 'axios';

export function makeRetrieveApplication(daamUrl: string) {
  return async (applicationId: string, session: ExtendedSession): Promise<AxiosResponse<RetrievedApplication>> => {
    return await axios.get(`${daamUrl}/api/v1/applications/${applicationId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${decrypt(session.access_token)}`,
      },
    });
  };
}
