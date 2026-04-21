// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

export type HelpdeskTopicRouting = {
  value: string;
  label: string;
  recipientEmail: string;
  zammadGroup?: string;
};

export type HelpdeskTopicOption = Pick<HelpdeskTopicRouting, "value" | "label">;

const DEFAULT_HELPDESK_TOPIC_ROUTING: HelpdeskTopicRouting[] = [
  {
    value: "general",
    label: "General inquiry",
    recipientEmail: "bechkal198@gmail.com",
    zammadGroup: "Users",
  },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function assertNonEmptyString(value: unknown, fieldName: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Invalid ${fieldName} in HELPDESK_TOPIC_ROUTING.`);
  }

  return value.trim();
}

function parseHelpdeskTopicRoutingEntry(
  item: unknown,
  index: number
): HelpdeskTopicRouting {
  if (!item || typeof item !== "object") {
    throw new Error(
      `Invalid HELPDESK_TOPIC_ROUTING entry at index ${index}: expected object.`
    );
  }

  const candidate = item as Record<string, unknown>;
  const value = assertNonEmptyString(candidate.value, "value");
  const label = assertNonEmptyString(candidate.label, "label");
  const recipientEmail = assertNonEmptyString(
    candidate.recipientEmail,
    "recipientEmail"
  );

  if (!EMAIL_REGEX.test(recipientEmail)) {
    throw new Error(
      `Invalid recipientEmail for HELPDESK_TOPIC_ROUTING entry "${value}".`
    );
  }

  let zammadGroup: string | undefined;
  if (candidate.zammadGroup !== undefined) {
    zammadGroup = assertNonEmptyString(candidate.zammadGroup, "zammadGroup");
  }

  return {
    value,
    label,
    recipientEmail,
    zammadGroup,
  };
}

export function parseHelpdeskTopicRoutingFromEnv(
  rawRoutingConfig = process.env.HELPDESK_TOPIC_ROUTING
): HelpdeskTopicRouting[] {
  if (!rawRoutingConfig || rawRoutingConfig.trim().length === 0) {
    return DEFAULT_HELPDESK_TOPIC_ROUTING;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawRoutingConfig);
  } catch {
    throw new Error(
      "HELPDESK_TOPIC_ROUTING must be a valid JSON array of topic mappings."
    );
  }

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error(
      "HELPDESK_TOPIC_ROUTING must contain at least one topic mapping."
    );
  }

  const routing = parsed.map((entry, index) =>
    parseHelpdeskTopicRoutingEntry(entry, index)
  );

  const duplicateTopic = routing.find(
    (topic, index) =>
      routing.findIndex((candidate) => candidate.value === topic.value) !==
      index
  );

  if (duplicateTopic) {
    throw new Error(
      `Duplicate topic value "${duplicateTopic.value}" in HELPDESK_TOPIC_ROUTING.`
    );
  }

  return routing;
}

export function getHelpdeskTopicOptions(): HelpdeskTopicOption[] {
  return parseHelpdeskTopicRoutingFromEnv().map(({ value, label }) => ({
    value,
    label,
  }));
}

export function getHelpdeskTopicByValue(
  value: string
): HelpdeskTopicRouting | undefined {
  return parseHelpdeskTopicRoutingFromEnv().find(
    (topic) => topic.value === value
  );
}

export function getZammadConfig() {
  const baseUrl = process.env.HELPDESK_ZAMMAD_URL?.trim().replace(/\/$/, "");
  const apiToken = process.env.HELPDESK_ZAMMAD_API_TOKEN?.trim();
  const defaultGroup =
    process.env.HELPDESK_ZAMMAD_DEFAULT_GROUP?.trim() || "Users";
  const tlsInsecure =
    process.env.HELPDESK_ZAMMAD_TLS_INSECURE?.trim().toLowerCase() === "true";

  if (!baseUrl) {
    throw new Error("Missing HELPDESK_ZAMMAD_URL environment variable.");
  }

  if (!apiToken) {
    throw new Error("Missing HELPDESK_ZAMMAD_API_TOKEN environment variable.");
  }

  return {
    baseUrl,
    apiToken,
    defaultGroup,
    tlsInsecure,
  };
}
