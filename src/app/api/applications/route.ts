// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { authOptions, ExtendedSession } from '@/utils/auth';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { createApplication, listApplications } from '@/services/daam/index.server';
import axios from 'axios';

function handleErrorResponse(error: unknown) {
  if (axios.isAxiosError(error)) {
    return NextResponse.json({ error: error.response?.data }, { status: error.response?.status });
  } else if (error instanceof Error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ error: 'Unexpected error occurred' }, { status: 500 });
}

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
