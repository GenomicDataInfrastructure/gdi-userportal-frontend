// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { ExtendedSession } from '@/app/api/auth/auth.types';
import { SaveDUOCode, SaveForm } from '@/types/application.types';
import { decrypt } from '@/utils/encryption';
import axios, { AxiosResponse } from 'axios';

export function makeSaveFormsAndDuos(daamUrl: string) {
  return async (
    applicationId: string,
    forms: SaveForm[],
    duoCodes: SaveDUOCode[],
    session: ExtendedSession,
  ): Promise<AxiosResponse<void>> => {
    const requestBody = {
      forms: forms,
      duoCodes: duoCodes,
    };
    return await axios.post(`${daamUrl}/api/v1/applications/${applicationId}/save-forms-and-duos`, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${decrypt(session.access_token)}`,
      },
    });
  };
}
