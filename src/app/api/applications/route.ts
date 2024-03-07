// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import axios from 'axios';
import { authOptions, ExtendedSession } from '@/utils/auth';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import serverConfig from '@/config/serverConfig';
import { decrypt } from '@/utils/encryption';

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

    const requestBody = {
      datasetIds: datasetIds,
    };

    await axios.post(`${serverConfig.daamUrl}/api/v1/applications/create-application`, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${decrypt(session.access_token)}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create application' }, { status: 500 });
  }
}
