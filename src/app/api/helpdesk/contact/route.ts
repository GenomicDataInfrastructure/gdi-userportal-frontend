// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { getHelpdeskTopicByValue } from "@/app/api/helpdesk/config";
import { createZammadTicket } from "@/app/api/helpdesk/zammad";
import { z } from "zod";

type ContactRequestBody = {
  firstName?: string;
  lastName?: string;
  email?: string;
  topic?: string;
  title?: string;
  message?: string;
};

const MAX_TITLE_LENGTH = 160;
const MAX_MESSAGE_LENGTH = 4000;
const EMAIL_SCHEMA = z.string().email();
const GENERIC_SUBMISSION_ERROR =
  "Your request could not be submitted. Please try again.";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactRequestBody;

    const firstName = body.firstName?.trim();
    const lastName = body.lastName?.trim();
    const email = body.email?.trim();
    const topic = body.topic?.trim();
    const title = body.title?.trim();
    const message = body.message?.trim();

    if (!firstName) {
      return Response.json(
        { error: 'Missing required field "firstName"' },
        { status: 400 }
      );
    }

    if (!lastName) {
      return Response.json(
        { error: 'Missing required field "lastName"' },
        { status: 400 }
      );
    }

    if (!email) {
      return Response.json(
        { error: 'Missing required field "email"' },
        { status: 400 }
      );
    }

    if (!EMAIL_SCHEMA.safeParse(email).success) {
      return Response.json(
        { error: 'Field "email" must be a valid email address' },
        { status: 400 }
      );
    }

    if (!topic) {
      return Response.json(
        { error: 'Missing required field "topic"' },
        { status: 400 }
      );
    }

    if (!title) {
      return Response.json(
        { error: 'Missing required field "title"' },
        { status: 400 }
      );
    }

    if (title.length > MAX_TITLE_LENGTH) {
      return Response.json(
        {
          error: `Field "title" must not exceed ${MAX_TITLE_LENGTH} characters`,
        },
        { status: 400 }
      );
    }

    if (!message) {
      return Response.json(
        { error: 'Missing required field "message"' },
        { status: 400 }
      );
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return Response.json(
        {
          error: `Field "message" must not exceed ${MAX_MESSAGE_LENGTH} characters`,
        },
        { status: 400 }
      );
    }

    const selectedTopic = getHelpdeskTopicByValue(topic);
    if (!selectedTopic) {
      return Response.json(
        { error: `Unknown topic "${topic}"` },
        { status: 400 }
      );
    }

    const result = await createZammadTicket({
      title,
      firstName,
      lastName,
      email,
      message,
      topicLabel: selectedTopic.label,
      topicValue: selectedTopic.value,
      recipientEmail: selectedTopic.recipientEmail,
      group: selectedTopic.zammadGroup,
    });

    return Response.json({
      success: true,
      ticketId: result.ticketId,
    });
  } catch (error) {
    console.error("Helpdesk contact submission failed", error);
    return Response.json({ error: GENERIC_SUBMISSION_ERROR }, { status: 500 });
  }
}
