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
