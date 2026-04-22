// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  getHelpdeskTopicByValue,
  parseHelpdeskTopicRoutingFromEnv,
} from "@/app/api/helpdesk/config";

describe("helpdesk config", () => {
  const originalRouting = process.env.HELPDESK_TOPIC_ROUTING;

  afterEach(() => {
    process.env.HELPDESK_TOPIC_ROUTING = originalRouting;
  });

  test("returns default routing when env is not set", () => {
    delete process.env.HELPDESK_TOPIC_ROUTING;

    const routing = parseHelpdeskTopicRoutingFromEnv();

    expect(routing).toEqual([
      {
        value: "general",
        label: "General inquiry",
        recipientEmail: "helpdesk@example.org",
        zammadGroup: "Users",
      },
    ]);
  });

  test("parses valid routing from env", () => {
    process.env.HELPDESK_TOPIC_ROUTING = JSON.stringify([
      {
        value: "technical",
        label: "Technical issue",
        recipientEmail: "tech@example.org",
        zammadGroup: "2nd Level",
      },
    ]);

    const routing = parseHelpdeskTopicRoutingFromEnv();

    expect(routing).toEqual([
      {
        value: "technical",
        label: "Technical issue",
        recipientEmail: "tech@example.org",
        zammadGroup: "2nd Level",
      },
    ]);
  });

  test("throws when same topic value appears twice", () => {
    process.env.HELPDESK_TOPIC_ROUTING = JSON.stringify([
      {
        value: "general",
        label: "General",
        recipientEmail: "one@example.org",
      },
      {
        value: "general",
        label: "General duplicate",
        recipientEmail: "two@example.org",
      },
    ]);

    expect(() => parseHelpdeskTopicRoutingFromEnv()).toThrow(
      'Duplicate topic value "general" in HELPDESK_TOPIC_ROUTING.'
    );
  });

  test("getHelpdeskTopicByValue returns matching topic", () => {
    process.env.HELPDESK_TOPIC_ROUTING = JSON.stringify([
      {
        value: "ops",
        label: "Operations",
        recipientEmail: "ops@example.org",
      },
    ]);

    expect(getHelpdeskTopicByValue("ops")).toEqual({
      value: "ops",
      label: "Operations",
      recipientEmail: "ops@example.org",
      zammadGroup: undefined,
    });
  });
});
