// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { getZammadConfig } from "@/app/api/helpdesk/config";
import { Agent } from "undici";

type CreateZammadTicketInput = {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  topicLabel: string;
  topicValue: string;
  recipientEmail: string;
  message: string;
  group?: string;
};

type ZammadCreateTicketResponse = {
  id?: number;
  customer_id?: number;
};

type ZammadTicketPayload = {
  title: string;
  group: string;
  customer_id: string;
  article: {
    subject: string;
    body: string;
    type: "email" | "web";
    sender: "Agent" | "Customer";
    internal: boolean;
    to?: string;
    reply_to?: string;
    content_type: "text/plain";
  };
};

const INSECURE_TLS_DISPATCHER = new Agent({
  connect: {
    rejectUnauthorized: false,
  },
});

function formatArticleBody(input: CreateZammadTicketInput): string {
  return [
    `First name: ${input.firstName}`,
    `Last name: ${input.lastName}`,
    `Email: ${input.email}`,
    `Topic: ${input.topicLabel} (${input.topicValue})`,
    `Recipient routing: ${input.recipientEmail}`,
    "",
    "Message:",
    input.message,
  ].join("\n");
}

function buildEmailArticlePayload(
  input: CreateZammadTicketInput,
  targetGroup: string,
  senderEmail: string
): ZammadTicketPayload {
  return {
    title: input.title,
    group: targetGroup,
    customer_id: `guess:${senderEmail}`,
    article: {
      subject: input.title,
      body: formatArticleBody(input),
      type: "email",
      sender: "Agent",
      internal: false,
      to: input.recipientEmail,
      reply_to: senderEmail,
      content_type: "text/plain",
    },
  };
}

function buildFallbackWebPayload(
  input: CreateZammadTicketInput,
  targetGroup: string,
  senderEmail: string
): ZammadTicketPayload {
  return {
    title: input.title,
    group: targetGroup,
    customer_id: `guess:${senderEmail}`,
    article: {
      subject: input.title,
      body: formatArticleBody(input),
      type: "web",
      sender: "Customer",
      internal: false,
      content_type: "text/plain",
    },
  };
}

async function postZammadTicket(
  baseUrl: string,
  apiToken: string,
  payload: ZammadTicketPayload,
  tlsInsecure: boolean
) {
  let response: Response;
  try {
    response = await fetch(`${baseUrl}/api/v1/tickets`, {
      method: "POST",
      headers: {
        Authorization: `Token token=${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      ...(tlsInsecure && baseUrl.startsWith("https://")
        ? { dispatcher: INSECURE_TLS_DISPATCHER }
        : {}),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(
      [
        `Unable to reach Zammad at ${baseUrl}.`,
        `Request error: ${message}.`,
        tlsInsecure
          ? "TLS verification is disabled via HELPDESK_ZAMMAD_TLS_INSECURE=true."
          : "If this host uses an internal/self-signed certificate, set HELPDESK_ZAMMAD_TLS_INSECURE=true.",
      ].join(" ")
    );
  }

  const responseBody = await response.text();
  return { response, responseBody };
}

async function updateZammadCustomerProfile(
  baseUrl: string,
  apiToken: string,
  tlsInsecure: boolean,
  customerId: number,
  firstName: string,
  lastName: string,
  email: string
) {
  try {
    await fetch(`${baseUrl}/api/v1/users/${customerId}`, {
      method: "PUT",
      headers: {
        Authorization: `Token token=${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstname: firstName,
        lastname: lastName,
        email,
      }),
      ...(tlsInsecure && baseUrl.startsWith("https://")
        ? { dispatcher: INSECURE_TLS_DISPATCHER }
        : {}),
    });
  } catch {
    // Ticket creation succeeded, so user profile sync failure should not break contact flow.
  }
}

function parseTicketCreateResponseBody(
  responseBody: string
): ZammadCreateTicketResponse {
  try {
    return JSON.parse(responseBody) as ZammadCreateTicketResponse;
  } catch {
    throw new Error(
      `Zammad ticket creation succeeded but response was not valid JSON: ${responseBody}`
    );
  }
}

function isMissingGroupEmailError(
  status: number,
  responseBody: string
): boolean {
  return (
    status === 500 && responseBody.includes("No email address found for group")
  );
}

export async function createZammadTicket(
  input: CreateZammadTicketInput
): Promise<{ ticketId?: number }> {
  const zammadConfig = getZammadConfig();
  const targetGroup = input.group || zammadConfig.defaultGroup;
  const senderEmail = input.email.toLowerCase();
  const emailPayload = buildEmailArticlePayload(
    input,
    targetGroup,
    senderEmail
  );

  const firstAttempt = await postZammadTicket(
    zammadConfig.baseUrl,
    zammadConfig.apiToken,
    emailPayload,
    zammadConfig.tlsInsecure
  );

  if (
    !firstAttempt.response.ok &&
    isMissingGroupEmailError(
      firstAttempt.response.status,
      firstAttempt.responseBody
    )
  ) {
    const fallbackPayload = buildFallbackWebPayload(
      input,
      targetGroup,
      senderEmail
    );
    const fallbackAttempt = await postZammadTicket(
      zammadConfig.baseUrl,
      zammadConfig.apiToken,
      fallbackPayload,
      zammadConfig.tlsInsecure
    );

    if (!fallbackAttempt.response.ok) {
      throw new Error(
        `Zammad ticket creation failed with status ${fallbackAttempt.response.status}: ${fallbackAttempt.responseBody}`
      );
    }

    const fallbackData = parseTicketCreateResponseBody(
      fallbackAttempt.responseBody
    );
    if (fallbackData.customer_id) {
      await updateZammadCustomerProfile(
        zammadConfig.baseUrl,
        zammadConfig.apiToken,
        zammadConfig.tlsInsecure,
        fallbackData.customer_id,
        input.firstName,
        input.lastName,
        senderEmail
      );
    }
    return { ticketId: fallbackData.id };
  }

  if (!firstAttempt.response.ok) {
    throw new Error(
      `Zammad ticket creation failed with status ${firstAttempt.response.status}: ${firstAttempt.responseBody}`
    );
  }

  const data = parseTicketCreateResponseBody(firstAttempt.responseBody);
  if (data.customer_id) {
    await updateZammadCustomerProfile(
      zammadConfig.baseUrl,
      zammadConfig.apiToken,
      zammadConfig.tlsInsecure,
      data.customer_id,
      input.firstName,
      input.lastName,
      senderEmail
    );
  }
  return { ticketId: data.id };
}
