/** @jest-environment jsdom */
// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import Page from "./page";

jest.mock("react", () => ({ ...jest.requireActual("react"), use: () => ({}) }));
jest.mock("next-intl");
jest.mock("next-auth/react", () => ({
  useSession: () => ({ status: "authenticated" }),
}));
jest.mock("@/i18n/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

type MockAuthorization =
  | { status: "loading" }
  | { status: "error" }
  | {
      status: "ready";
      auth: { hasResearcherStatus: boolean; hasAcceptedTC: boolean };
    };

let mockAuthorization: MockAuthorization = {
  status: "ready" as const,
  auth: { hasResearcherStatus: true, hasAcceptedTC: true },
};
jest.mock("@/providers/beacon/BeaconAuthorizationProvider", () => ({
  BeaconAuthorizationProvider: ({ children }: { children: React.ReactNode }) =>
    children,
  useBeaconAuthorization: () => mockAuthorization,
  isBeaconAuthorized: (auth?: {
    hasResearcherStatus: boolean;
    hasAcceptedTC: boolean;
  }) => !!auth?.hasResearcherStatus && !!auth?.hasAcceptedTC,
  getBeaconAuthReason: (auth?: {
    hasResearcherStatus: boolean;
    hasAcceptedTC: boolean;
  }) => ({
    hasResearcherStatus: !!auth?.hasResearcherStatus,
    hasAcceptedTC: !!auth?.hasAcceptedTC,
  }),
}));

const submitApplication = jest.fn();
jest.mock("@/providers/application/ApplicationProvider", () => ({
  useApplicationDetails: () => ({
    application: {
      id: 639,
      externalId: "APP-639",
      state: "application.state/draft",
      events: [
        {
          eventType: "application.event/created",
          eventTime: "2026-10-15T09:00:00Z",
        },
      ],
      forms: [],
    },
    errorResponse: undefined,
    deleteApplication: jest.fn(),
    submitApplication,
    clearError: jest.fn(),
    isLoading: false,
  }),
}));

jest.mock("@/components/PageContainer", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
}));
jest.mock("@/components/PageHeading", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) =>
    createElement("h1", null, children),
}));
jest.mock("@/components/Sidebar", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("@/components/Chip", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("@/components/Alert", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("./ApplicationOptionsMenu", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("./FormContainer", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("./sidebarItems", () => ({
  createApplicationSidebarItems: () => [],
}));
jest.mock("@/components/Button", () => ({
  __esModule: true,
  default: ({
    text,
    disabled,
    onClick,
    buttonProps,
  }: {
    text: string;
    disabled?: boolean;
    onClick?: () => void;
    buttonProps?: React.ComponentPropsWithoutRef<"button">;
  }) => createElement("button", { disabled, onClick, ...buttonProps }, text),
}));

describe("application submission eligibility", () => {
  let container: HTMLDivElement;
  let root: ReturnType<typeof createRoot>;

  beforeEach(() => {
    mockAuthorization = {
      status: "ready",
      auth: { hasResearcherStatus: true, hasAcceptedTC: true },
    };
    submitApplication.mockReset();
    container = document.createElement("div");
    root = createRoot(container);
    (
      globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
    ).IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterEach(async () => {
    await act(async () => root.unmount());
  });

  async function renderPage() {
    await act(async () => {
      root.render(createElement(Page, { searchParams: Promise.resolve({}) }));
    });
  }

  function submitButton(): HTMLButtonElement {
    return Array.from(container.querySelectorAll("button")).find(
      (button) => button.textContent === "application.submit"
    )!;
  }

  test("enables submission when both required visas are present", async () => {
    await renderPage();

    expect(submitButton().disabled).toBe(false);
    expect(container.querySelector('[role="alert"]')).toBeNull();
  });

  test.each([
    [false, false, "basket.applicationRequirementsMissing"],
    [false, true, "basket.researcherRequired"],
    [true, false, "basket.termsRequired"],
  ])(
    "disables submission and explains missing eligibility (%s, %s)",
    async (hasResearcherStatus, hasAcceptedTC, expectedMessage) => {
      mockAuthorization = {
        status: "ready",
        auth: { hasResearcherStatus, hasAcceptedTC },
      };

      await renderPage();

      expect(submitButton().disabled).toBe(true);
      expect(container.querySelector('[role="alert"]')?.textContent).toContain(
        expectedMessage
      );
    }
  );

  test("disables submission while eligibility is loading", async () => {
    mockAuthorization = { status: "loading" };

    await renderPage();

    expect(submitButton().disabled).toBe(true);
  });

  test("disables submission and warns when eligibility cannot be checked", async () => {
    mockAuthorization = { status: "error" };

    await renderPage();

    expect(submitButton().disabled).toBe(true);
    expect(container.querySelector('[role="alert"]')?.textContent).toContain(
      "basket.authorizationUnavailable"
    );
  });
});
