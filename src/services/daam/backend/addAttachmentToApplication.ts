// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { ExtendedSession } from '@/app/api/auth/auth.types';
import { AddedAttachment } from '@/types/application.types';
import { decrypt } from '@/utils/encryption';
import axios, { AxiosResponse } from 'axios';

export function makeAddAttachmentToApplication(daamUrl: string) {
  return async (
    applicationId: string,
    attachment: FormData,
    session: ExtendedSession,
  ): Promise<AxiosResponse<AddedAttachment>> => {
    return await axios.post(`${daamUrl}/api/v1/applications/${applicationId}/attachments`, attachment, {
      headers: {
        Authorization: `Bearer ${decrypt(session.access_token)}`,
      },
    });
  };
}
