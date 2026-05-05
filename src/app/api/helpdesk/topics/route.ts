// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { getHelpdeskTopicOptions } from "@/app/api/helpdesk/config";

export async function GET() {
  try {
    return Response.json({ topics: getHelpdeskTopicOptions() });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
