/** @jest-environment jsdom */
// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import Page from "../page";

jest.mock("react", () => ({ ...jest.requireActual("react"), use: () => ({}) }));
const mockSignIn = jest.fn();
let mockStatus = "unauthenticated";
jest.mock("next-auth/react", () => ({
  useSession: () => ({ status: mockStatus }),
  signIn: (...args: unknown[]) => mockSignIn(...args),
}));
const mockCreate = jest.fn();
jest.mock("@/app/api/access-management", () => ({
  createApplicationApi: (...args: unknown[]) => mockCreate(...args),
}));
jest.mock("@/i18n/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));
jest.mock("@/providers/AlertProvider", () => ({
  useAlert: () => ({ setAlert: jest.fn() }),
}));
let mockAuthorization = {
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
let mockAccessLoading = false;
const mockBasket = {
  basket: [
    { id: "owned", identifier: "owned-id" },
    { id: "new", identifier: "new-id" },
  ],
  isLoading: false,
  emptyBasket: jest.fn(),
  hasDatasetAccess: (dataset: { id: string }) => dataset.id === "owned",
};
jest.mock("@/providers/DatasetBasketProvider", () => ({
  useDatasetBasket: () => ({
    ...mockBasket,
    isAccessLoading: mockAccessLoading,
  }),
}));
jest.mock("@/components/Button", () => ({
  __esModule: true,
  default: ({
    text,
    onClick,
    disabled,
  }: {
    text: string;
    onClick?: () => void;
    disabled?: boolean;
  }) => createElement("button", { onClick, disabled }, text),
}));
jest.mock("@/components/ListContainer", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
}));
jest.mock("@/components/PageContainer", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
}));
jest.mock("@/components/PageHeading", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("@/components/LoadingContainer", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("../../datasets/DatasetList", () => ({
  __esModule: true,
  default: () => null,
}));

it("requires login, waits for grants, and requests only datasets without access", async () => {
  (
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true;
  const container = document.createElement("div");
  const root = createRoot(container);
  const render = () =>
    root.render(createElement(Page, { searchParams: Promise.resolve({}) }));
  const button = (label: string) =>
    Array.from(container.querySelectorAll("button")).find(
      (item) => item.textContent === label
    )!;
  try {
    await act(async () => render());
    await act(async () => button("basket.loginToRequest").click());
    expect(mockSignIn).toHaveBeenCalledWith("keycloak", {
      callbackUrl: window.location.href,
    });
    expect(mockCreate).not.toHaveBeenCalled();

    mockStatus = "authenticated";
    mockAccessLoading = true;
    await act(async () => render());
    expect(button("basket.requestNow").disabled).toBe(true);
    mockAccessLoading = false;
    await act(async () => render());
    mockCreate.mockResolvedValue({ ok: false, response: { status: 401 } });
    await act(async () => button("basket.requestNow").click());
    expect(mockSignIn).toHaveBeenCalledTimes(2);
    expect(mockBasket.emptyBasket).not.toHaveBeenCalled();
    mockCreate.mockResolvedValue({
      ok: true,
      applicationId: 123,
      response: null,
    });
    await act(async () => button("basket.requestNow").click());
    expect(mockCreate).toHaveBeenCalledWith({ datasetIds: ["new-id"] });
  } finally {
    act(() => root.unmount());
  }
});

it.each([
  [false, true, "basket.researcherRequired"],
  [true, false, "basket.termsRequired"],
  [false, false, "basket.applicationRequirementsMissing"],
])(
  "prevents an ineligible user from applying (Researcher: %s, T&C: %s)",
  async (hasResearcherStatus, hasAcceptedTC, expectedMessage) => {
    mockCreate.mockClear();
    (
      globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
    ).IS_REACT_ACT_ENVIRONMENT = true;
    mockStatus = "authenticated";
    mockAuthorization = {
      status: "ready",
      auth: { hasResearcherStatus, hasAcceptedTC },
    };
    const container = document.createElement("div");
    const root = createRoot(container);

    try {
      await act(async () =>
        root.render(createElement(Page, { searchParams: Promise.resolve({}) }))
      );
      const requestButton = Array.from(
        container.querySelectorAll("button")
      ).find((item) => item.textContent === "basket.requestNow")!;

      expect(requestButton.disabled).toBe(true);
      const alert = container.querySelector('[role="alert"]');
      expect(alert?.querySelector("h3")?.textContent).toBe(
        "basket.applicationRequirementsTitle"
      );
      expect(alert?.querySelector("p")?.textContent).toBe(expectedMessage);
      expect(alert?.className).toContain("border-l-warning");
      expect(alert?.className).toContain("bg-warning/10");
      expect(mockCreate).not.toHaveBeenCalled();
    } finally {
      act(() => root.unmount());
      mockStatus = "unauthenticated";
      mockAuthorization = {
        status: "ready",
        auth: { hasResearcherStatus: true, hasAcceptedTC: true },
      };
      mockCreate.mockClear();
    }
  }
);
