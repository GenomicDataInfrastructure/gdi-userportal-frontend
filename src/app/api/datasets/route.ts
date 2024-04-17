// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { datasetList } from '@/services/discovery';
import { mapFacetGroups } from '@/services/discovery/utils';
import { ExtendedSession, authOptions } from '@/utils/auth';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  const session: ExtendedSession | null = await getServerSession(authOptions);

  try {
    const { options } = await request.json();
    const response = await datasetList(options, session!);

    const result = {
      datasets: response.data.results,
      count: response.data.count,
      facetGroups: mapFacetGroups(response.data.facetGroups),
    };

    return NextResponse.json(result);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json({ error: error.response?.data }, { status: error.response?.status });
    } else if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: 'Failed to retrive datasets' }, { status: 500 });
  }
}
