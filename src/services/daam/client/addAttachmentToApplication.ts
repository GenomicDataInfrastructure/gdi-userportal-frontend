// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { AddedAttachment } from "@/types/application.types";
import axios, { AxiosResponse } from "axios";

export async function addAttachmentToApplication(
  applicationId: number,
  attachment: FormData
): Promise<AxiosResponse<AddedAttachment>> {
  return await axios.post(
    `/api/applications/${applicationId}/attachments`,
    attachment
  );
}
