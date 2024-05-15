// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { ExtendedSession } from '@/app/api/auth/auth.types';
import { authOptions } from '@/app/api/auth/config';
import { handleErrorResponse } from '@/app/api/errorHandling';
import { addAttachmentToApplication } from '@/services/daam/index.server';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request, params: { params: { id: string } }) {
  const session: ExtendedSession | null = await getServerSession(authOptions);
  const { id: applicationId } = params.params;

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();

  try {
    const {
      data: { id },
    } = await addAttachmentToApplication(applicationId, formData, session);
    if (id === undefined) {
      throw new Error('Failed to add attachment to application');
    }
    return NextResponse.json({ id }, { status: 200 });
  } catch (error) {
    return handleErrorResponse(error);
  }
}
