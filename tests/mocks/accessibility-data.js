// SPDX-FileCopyrightText: 2026 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0

const labels = (name) => [{ language: "en", name }];
const field = (id, type, title, value = "", extra = {}) => ({
  id,
  type,
  title: labels(title),
  value,
  visible: true,
  optional: false,
  ...extra,
});
const application = () => ({
  id: 89,
  externalId: "A11Y-89",
  state: "application.state/draft",
  applicant: {
    name: "Accessibility Test User",
    email: "accessibility@example.com",
  },
  members: [],
  invitedMembers: [],
  datasets: [],
  attachments: [],
  events: [
    {
      eventType: "application.event/created",
      eventTime: "2026-01-01T12:00:00Z",
    },
  ],
  licenses: [
    {
      id: 1,
      title: labels("Research terms"),
      type: "text",
      text: labels("Use synthetic data for approved research only."),
      link: [],
      acceptedByCurrentUser: false,
    },
  ],
  forms: [
    {
      id: 1,
      externalTitle: labels("Research project"),
      fields: [
        field(
          "purpose",
          "text",
          "Research purpose",
          "Synthetic cohort research"
        ),
        field(
          "summary",
          "texta",
          "Project summary",
          "A study using synthetic records."
        ),
        field("email", "email", "Contact email", "researcher@example.org"),
        field("phone", "phone-number", "Contact phone", "+352621123456"),
        field("start", "date", "Start date", "2026-01-01T00:00:00.000Z"),
        field("method", "option", "Research method", "cohort", {
          options: [
            { key: "cohort", label: labels("Cohort analysis") },
            { key: "other", label: labels("Other method") },
          ],
        }),
        field("topics", "multiselect", "Research topics", "cancer", {
          options: [
            { key: "cancer", label: labels("Cancer") },
            { key: "rare", label: labels("Rare disease") },
          ],
        }),
        field("sites", "table", "Study sites", "", {
          tableColumns: [{ key: "name", label: labels("Site name") }],
          tableValues: [[{ column: "name", value: "Luxembourg" }]],
        }),
        field("protocol", "attachment", "Study protocol"),
        field("section", "header", "Additional information"),
        field("instructions", "label", "Use synthetic data only"),
      ],
    },
  ],
});
const run = {
  runId: "a11y-run",
  startedAt: "2026-01-01T12:00:00Z",
  finishedAt: "2026-01-01T12:01:00Z",
  source: { url: "https://example.org/synthetic-catalogue" },
  mode: "append",
  status: "partial",
  succeeded: 1,
  failed: 1,
  errors: [{ subjectId: "invalid-dataset", message: "Missing dataset title" }],
  warnings: [
    {
      subjectId: "ds-001",
      datasetTitle: "Cancer cohort study",
      type: "missingFields",
      details: ["Missing contact email"],
    },
  ],
  succeededDatasets: [
    { subjectId: "ds-001", datasetTitle: "Cancer cohort study" },
  ],
};

// Used only by the local test server. The dedicated accessibility runner uses
// one worker and resets this state before every test (including retries).
module.exports = ({ sendJson, readBody }) => {
  let scenario;
  let release;
  let draft = application();
  return async (req, res, pathname) => {
    const reply = (status, body) => {
      sendJson(res, status, body);
      return true;
    };
    if (pathname === "/_test/accessibility-release") {
      release?.();
      return reply(200, { ok: true });
    }
    if (pathname === "/_test/accessibility" && req.method === "POST") {
      release?.();
      scenario = JSON.parse(await readBody(req)).scenario;
      draft = application();
      return reply(200, { ok: true });
    }
    if (!scenario) return false;
    if (scenario === "datasets-empty" && pathname === "/api/v1/datasets/search")
      return reply(200, { count: 0, results: [], facets: [] });
    if (scenario === "datasets-error" && pathname === "/api/v1/datasets/search")
      return reply(500, {
        status: 500,
        title: "Discovery unavailable",
        detail: "Please try again later.",
      });
    if (/^\/api\/v1\/filters\/[^/]+\/values$/.test(pathname)) {
      if (scenario === "values-empty") return reply(200, []);
      if (scenario === "values-error")
        return reply(500, {
          status: 500,
          title: "Discovery unavailable",
          detail: "Please try again later.",
        });
    }
    if (pathname === "/api/v1/g_variants") {
      if (scenario === "variants-error")
        return reply(503, {
          status: 503,
          title: "Variant search unavailable",
          detail: "Please try again later.",
        });
      return reply(
        200,
        scenario === "variants-empty"
          ? []
          : [
              {
                beacon: "Synthetic Beacon",
                datasetId: "ds-001",
                population: "FR_M",
                sex: "M",
                countryOfBirth: "FR",
                alleleCount: 2,
                alleleNumber: 100,
                alleleCountHomozygous: 0,
                alleleCountHeterozygous: 2,
                alleleCountHemizygous: 0,
                alleleFrequency: 0.02,
              },
            ]
      );
    }
    if (pathname === "/api/v1/applications") {
      if (scenario === "applications-loading")
        await new Promise((resolve) => {
          release = resolve;
        });
      if (scenario === "applications-error")
        return reply(500, {
          status: 500,
          title: "Applications unavailable",
          detail: "Please try again later.",
        });
      return reply(
        200,
        scenario === "applications-empty"
          ? []
          : [
              {
                id: 89,
                title: "Synthetic research application",
                description: "Synthetic cohort research",
                currentState: draft.state,
                datasets: [],
                createdAt: "2026-01-01T12:00:00Z",
              },
            ]
      );
    }
    if (pathname === "/api/v1/applications/create") {
      if (scenario === "basket-error")
        return reply(500, {
          status: 500,
          title: "Request failed",
          detail: "Please try again later.",
        });
      return reply(200, { applicationId: 89 });
    }
    if (pathname === "/api/v1/applications/89") {
      if (scenario === "application-missing")
        return reply(404, {
          status: 404,
          title: "Not found",
          detail: "Unknown application",
        });
      if (scenario === "application-readonly")
        draft.state = "application.state/submitted";
      return reply(200, draft);
    }
    if (pathname === "/api/v1/applications/89/submit") {
      if (scenario === "application-invalid")
        return reply(400, {
          status: 400,
          title: "Validation failed",
          detail: "Please complete required fields.",
          validationWarnings: [
            { formId: 1, fieldId: "purpose", key: "required" },
          ],
        });
      draft.state = "application.state/submitted";
      return reply(204, undefined);
    }
    if (pathname === "/api/v1/applications/89/accept-terms") {
      draft.licenses[0].acceptedByCurrentUser = true;
      return reply(204, undefined);
    }
    if (pathname === "/api/v1/applications/89/save-forms-and-duos") {
      const body = JSON.parse(await readBody(req));
      for (const form of body.forms)
        for (const updated of form.fields) {
          const target = draft.forms[0].fields.find(
            (item) => item.id === updated.fieldId
          );
          if (target)
            Object.assign(target, {
              value: updated.value,
              ...(updated.tableValues
                ? { tableValues: updated.tableValues }
                : {}),
            });
        }
      return reply(204, undefined);
    }
    if (pathname === "/harvester_logs/_search") {
      if (scenario === "harvester-error")
        return reply(500, { error: "Logs unavailable" });
      return reply(200, {
        hits: {
          total: { value: scenario === "harvester-empty" ? 0 : 1 },
          hits:
            scenario === "harvester-empty"
              ? []
              : [{ _id: run.runId, _source: run }],
        },
      });
    }
    if (pathname === "/harvester_logs/_doc/a11y-run")
      return reply(200, { _id: run.runId, _source: run });
    return false;
  };
};
