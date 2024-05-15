// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { ExtendedSession } from '@/app/api/auth/auth.types';
import { ListedApplication } from '@/types/application.types';
import { decrypt } from '@/utils/encryption';
import axios, { AxiosResponse } from 'axios';

export const makeListApplications = (daamUrl: string) => {
  return async (session: ExtendedSession): Promise<AxiosResponse<ListedApplication[]>> => {
    return await axios.get(`${daamUrl}/api/v1/applications`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${decrypt(session.access_token)}`,
      },
    });
  };
};
