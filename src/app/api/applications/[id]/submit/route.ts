// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { handleErrorResponse } from '@/app/api/errorHandling';
import { submitApplication } from '@/services/daam/index.server';
import { ExtendedSession, authOptions } from '@/utils/auth';
import { AxiosResponse } from 'axios';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

interface BackendErrorResponse {
  detail: string;
  errorMessages: string[];
}

function formatBackendErrors({ detail, errorMessages }: BackendErrorResponse): string {
  const formattedErrors = errorMessages.map((errorMsg) => {
    const [fieldId, validationKey] = errorMsg.split(' ');
    let errorMessage = `- Field ${fieldId}`;
    switch (validationKey) {
      case 't.form.validation/required':
        errorMessage += ' is required.';
        break;
      case 't.form.validation/format_error':
        errorMessage += ' had invalid format.';
        break;
      default:
        errorMessage += ' has unknown error.';
        break;
    }
    return errorMessage;
  });
  return `${detail}\n${formattedErrors.join('\n')}`;
}

export async function POST(request: Request, params: { params: { id: string } }): Promise<Response> {
  const session: ExtendedSession | null = await getServerSession(authOptions);
  const { id } = params.params;

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const response = (await submitApplication(id, session)) as AxiosResponse<BackendErrorResponse>;
    if (response.status !== 200 && response.data) {
      const combinedErrorMessage = formatBackendErrors(response.data);
      return NextResponse.json({ error: combinedErrorMessage }, { status: response.status });
    }
    return NextResponse.json({ status: 200 });
  } catch (error) {
    return handleErrorResponse(error);
  }
}
