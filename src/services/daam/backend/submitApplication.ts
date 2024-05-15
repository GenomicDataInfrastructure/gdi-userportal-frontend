// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { ExtendedSession } from '@/app/api/auth/auth.types';
import { ErrorResponse, ValidationWarnings } from '@/types/api.types';
import { decrypt } from '@/utils/encryption';
import axios, { AxiosResponse } from 'axios';

export function makeSubmitApplication(daamUrl: string) {
  return async (
    applicationId: string,
    session: ExtendedSession,
  ): Promise<AxiosResponse<void | ErrorResponse | ValidationWarnings>> => {
    const response = await axios.post(`${daamUrl}/api/v1/applications/${applicationId}/submit`, null, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${decrypt(session.access_token)}`,
      },
      validateStatus: () => true,
    });
    return response;
  };
}
