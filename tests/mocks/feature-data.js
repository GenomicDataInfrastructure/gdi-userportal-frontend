// SPDX-FileCopyrightText: 2026 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0

const labels = (name) => [{ language: "en", name }];

const application = (id, state, accepted) => ({
  id,
  externalId: `E2E-${id}`,
  state,
  applicant: {
    name: "Acceptance Test User",
    email: "acceptance@example.com",
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
      acceptedByCurrentUser: accepted,
    },
  ],
  forms: [
    {
      id: 1,
      externalTitle: labels("Research project"),
      fields: [
        {
          id: "purpose",
          type: "text",
          title: labels("Research purpose"),
          value: "Synthetic cohort research",
          visible: true,
          optional: false,
        },
      ],
    },
  ],
});

module.exports = ({ sendJson }) => {
  const states = new Map();
  const acceptedTerms = new Set();

  return async (req, res, pathname) => {
    const reply = (status, body) => {
      sendJson(res, status, body);
      return true;
    };

    const testStateMatch = pathname.match(
      /^\/_test\/e2e\/applications\/(\d+)$/
    );
    if (testStateMatch && req.method === "GET") {
      const id = Number(testStateMatch[1]);
      return reply(200, {
        state: states.get(id) || "application.state/draft",
      });
    }

    const applicationMatch = pathname.match(/^\/api\/v1\/applications\/(\d+)$/);
    if (applicationMatch && req.method === "GET") {
      const id = Number(applicationMatch[1]);
      const approved = id === 90 || id === 92;
      return reply(
        200,
        application(
          id,
          approved
            ? "application.state/approved"
            : states.get(id) || "application.state/draft",
          acceptedTerms.has(id) || id === 89 || id === 91
        )
      );
    }

    const submitMatch = pathname.match(
      /^\/api\/v1\/applications\/(\d+)\/submit$/
    );
    if (submitMatch && req.method === "POST") {
      states.set(Number(submitMatch[1]), "application.state/submitted");
      return reply(204);
    }

    const termsMatch = pathname.match(
      /^\/api\/v1\/applications\/(\d+)\/accept-terms$/
    );
    if (termsMatch && req.method === "POST") {
      acceptedTerms.add(Number(termsMatch[1]));
      return reply(204);
    }

    if (pathname === "/api/v1/g_variants" && req.method === "POST") {
      return reply(200, [
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
      ]);
    }

    return false;
  };
};
