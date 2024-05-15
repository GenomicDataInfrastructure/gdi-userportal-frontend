// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { createApplication, listApplications } from '@/services/daam/index.server';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { ExtendedSession } from '../auth/auth.types';
import { handleErrorResponse } from '../errorHandling';
import { authOptions } from '../auth/config';

export async function POST(request: Request) {
  const session: ExtendedSession | null = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { datasetIds } = await request.json();
    if (!datasetIds) {
      return NextResponse.json({ error: 'datasetIds are required' }, { status: 400 });
    }

    const response = await createApplication(datasetIds, session);

    return NextResponse.json(response.data);
  } catch (error) {
    return handleErrorResponse(error);
  }
}

export async function GET() {
  const session: ExtendedSession | null = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const response = await listApplications(session);
    return NextResponse.json(response.data);
  } catch (error) {
    return handleErrorResponse(error);
  }
}
