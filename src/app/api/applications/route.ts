// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { authOptions, ExtendedSession } from '@/utils/auth';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { createApplication } from '@/services/daam/index.server';

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

    await createApplication(datasetIds, session);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create application' }, { status: 500 });
  }
}
