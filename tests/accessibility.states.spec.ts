// SPDX-FileCopyrightText: 2026 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0
import type { Page } from "@playwright/test";
import {
  test,
  expect,
  authenticate,
  expectNoAccessibilityViolations as scan,
  scenario,
  visaScenario,
} from "./fixtures/accessibility";

const prefix = "/en";
// A selection made before hydration is reset, so retry until the field renders.
const selectGenome = async (page: Page) => {
  await expect(async () => {
    await page.getByRole("combobox").first().selectOption("GRCh38");
    await expect(page.getByRole("textbox").first()).toBeVisible({
      timeout: 1_000,
    });
  }).toPass();
};
test("services expand and collapse with the keyboard", async ({
  page,
}, info) => {
  await page.goto(`${prefix}/services`);
  const card = page.getByRole("button", { name: /Dataset Discovery Service/ });
  await card.focus();
  await page.keyboard.press("Enter");
  await expect(card).toHaveAttribute("aria-expanded", "true");
  await expect(
    page.getByRole("heading", { name: /key features/i })
  ).toBeVisible();
  await scan(page, info);
  await page.keyboard.press("Space");
  await expect(card).toHaveAttribute("aria-expanded", "false");
});

test("dataset accordion supports keyboard navigation and expanded scanning", async ({
  page,
}, info) => {
  await page.goto(`${prefix}/datasets/ds-001`);
  const link = page.getByRole("link", {
    name: "Synthetic Cohort Series",
    exact: true,
  });
  const toggle = page.getByRole("button", {
    name: /open dataset series details.*synthetic cohort series/i,
  });
  await link.focus();
  await page.keyboard.press("Tab");
  await expect(toggle).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await scan(page, info);
  await page.keyboard.press("Space");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await link.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/datasets\/series-001$/);
});

for (const state of ["datasets-empty", "datasets-error"]) {
  test(state, async ({ page }, info) => {
    await scenario(page, state);
    await page.goto(`${prefix}/datasets?page=1&query=nonexistent`);
    await expect(
      page
        .getByText(
          state === "datasets-empty"
            ? /no datasets found/i
            : /Discovery unavailable|something went wrong/i
        )
        .first()
    ).toBeVisible();
    await scan(page, info);
  });
}

for (const route of ["themes", "publishers"])
  for (const state of ["values-empty", "values-error"]) {
    test(`${route} ${state}`, async ({ page }, info) => {
      await scenario(page, state);
      await page.goto(`${prefix}/${route}`);
      await expect(
        state === "values-empty"
          ? page.getByText(/^no (themes|publishers) found\.$/i)
          : page.getByRole("heading", { name: /something went wrong/i })
      ).toBeVisible();
      await scan(page, info);
    });
  }

test("unknown route renders an accessible not found page", async ({
  page,
}, info) => {
  const response = await page.goto(`${prefix}/missing-page`);
  expect(response?.status()).toBe(404);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(
    page.getByRole("heading", { level: 1, name: "404" })
  ).toBeVisible();
  await scan(page, info);
});

test("missing dataset renders the error page", async ({ page }, info) => {
  await page.goto(`${prefix}/datasets/missing-dataset`);
  await expect(
    page.getByRole("heading", { name: /something went wrong/i })
  ).toBeVisible();
  await scan(page, info);
});

for (const state of ["baseline", "variants-empty", "variants-error"]) {
  test(`allele frequency ${state}`, async ({ page }, info) => {
    await authenticate(page);
    await scenario(page, state);
    await page.goto(`${prefix}/allele-frequency`);
    await selectGenome(page);
    await page.getByRole("textbox").first().fill("15-101055236-G-A");
    await page.getByRole("button", { name: /^search$/i }).click();
    if (state === "baseline")
      await expect(page.getByRole("table").first()).toBeVisible();
    else
      await expect(
        page
          .getByText(
            state === "variants-empty" ? /no results/i : /something went wrong/i
          )
          .first()
      ).toBeVisible();
    await scan(page, info);
  });
}

for (const authenticated of [false, true]) {
  test(`populated basket ${authenticated ? "authenticated" : "anonymous"}`, async ({
    page,
  }, info) => {
    if (authenticated) await authenticate(page);
    await visaScenario(page, "empty");
    await page.goto(`${prefix}/datasets/ds-001`);
    await page.getByRole("button", { name: /add to basket/i }).click();
    await page.goto(`${prefix}/basket`);
    await expect(
      page.getByRole("link", { name: /cancer cohort study/i })
    ).toBeVisible();
    await expect(
      page.getByRole("button", {
        name: authenticated ? /request now/i : /login to request/i,
      })
    ).toBeEnabled();
    await scan(page, info);
  });
}

test("basket request error is announced", async ({ page }, info) => {
  await authenticate(page);
  await visaScenario(page, "empty");
  await scenario(page, "basket-error");
  await page.goto(`${prefix}/datasets/ds-001`);
  await page.getByRole("button", { name: /add to basket/i }).click();
  await page.goto(`${prefix}/basket`);
  await page.getByRole("button", { name: /request now/i }).click();
  await expect(
    page.getByRole("alert").filter({ hasText: /request failed/i })
  ).toBeVisible();
  await scan(page, info);
});

for (const state of [
  "applications-empty",
  "applications-error",
  "application-missing",
  "application-readonly",
]) {
  test(state, async ({ page }, info) => {
    await authenticate(page);
    await scenario(page, state);
    await page.goto(
      `${prefix}/${state.startsWith("applications-") ? "requests?tab=applications" : "applications/89"}`
    );
    if (state === "application-readonly")
      await expect(
        page.getByRole("textbox", { name: "Research purpose", exact: true })
      ).toBeDisabled();
    else
      await expect(
        page
          .getByText(
            state === "applications-empty"
              ? /don't have any applications/i
              : state === "application-missing"
                ? /error occurred while processing/i
                : /Applications unavailable|something went wrong/i
          )
          .first()
      ).toBeVisible();
    await scan(page, info);
  });
}

test("application fields, option menu, validation and file picker are accessible", async ({
  page,
}, info) => {
  await authenticate(page);
  await scenario(page, "application-invalid");
  await page.goto(`${prefix}/applications/89`);
  const purpose = page.getByRole("textbox", {
    name: "Research purpose",
    exact: true,
  });
  await expect(purpose).toBeVisible();
  const option = page.getByRole("button", { name: /Research method/i });
  await option.focus();
  await page.keyboard.press("Space");
  await expect(page.getByRole("listbox")).toBeVisible();
  await scan(page, info);
  await page.keyboard.press("Escape");
  await expect(option).toBeFocused();
  const upload = page.getByRole("button", { name: /upload file/i });
  await upload.focus();
  const chooser = page.waitForEvent("filechooser");
  await page.keyboard.press("Enter");
  await chooser;
  await page.getByRole("button", { name: /^submit$/i }).click();
  await expect(
    page.getByRole("alert").filter({ hasText: /complete required fields/i })
  ).toBeVisible();
  await expect(purpose).toHaveAttribute("aria-invalid", "true");
  await expect(purpose).toHaveAccessibleDescription(/required/i);
  await scan(page, info);
});

test("application participant form and terms are accessible", async ({
  page,
}, info) => {
  await authenticate(page);
  await page.goto(`${prefix}/applications/89`);
  await page.getByRole("button", { name: /add participant/i }).click();
  await expect(page.getByRole("textbox", { name: /^name$/i })).toBeVisible();
  await scan(page, info);
  await page.getByRole("button", { name: /^cancel$/i }).click();
  await page.getByRole("button", { name: /accept all/i }).click();
  await expect(
    page.getByText(/^accepted$/i).filter({ visible: true })
  ).toBeVisible();
  await scan(page, info);
});

for (const state of ["default", "empty", "fallback", "multiple"]) {
  test(`entitlements ${state}`, async ({ page }, info) => {
    await authenticate(page);
    await visaScenario(page, state);
    await page.goto(`${prefix}/requests?tab=entitlements`);
    await expect(
      page
        .getByText(
          state === "empty"
            ? /do not have any active entitlements/i
            : state === "fallback"
              ? /unknown-dataset-id-999/i
              : /cancer cohort study/i
        )
        .first()
    ).toBeVisible();
    await scan(page, info);
  });
}

for (const state of ["harvester-empty", "harvester-error"]) {
  test(state, async ({ page }, info) => {
    await authenticate(page);
    await scenario(page, state);
    await page.goto(`${prefix}/harvester-logs?page=1`);
    await expect(
      page
        .getByText(
          state === "harvester-empty"
            ? /no harvester runs/i
            : /something went wrong/i
        )
        .first()
    ).toBeVisible();
    await scan(page, info);
  });
}

test("harvester details have accessible disclosures and restore focus", async ({
  page,
}, info) => {
  await authenticate(page);
  await page.goto(`${prefix}/harvester-logs?page=1`);
  const trigger = page.getByRole("button", { name: /synthetic-catalogue/i });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByText("a11y-run", { exact: true })).toBeVisible();
  await dialog.getByRole("button", { name: /show.*succeeded/i }).click();
  await expect(dialog.getByText("ds-001", { exact: true })).toBeVisible();
  await scan(page, info);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("account menu is accessible and restores focus", async ({
  page,
}, info) => {
  await authenticate(page);
  await page.goto(`${prefix}/basket`);
  const trigger = page.getByRole("button", {
    name: "Accessibility Test User",
    exact: true,
  });
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("menuitem", { name: /log\s*out/i })
  ).toBeFocused();
  await scan(page, info);
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});

test("application loading status and loaded content are accessible", async ({
  page,
}, info) => {
  await authenticate(page);
  await scenario(page, "applications-loading");
  await page.goto(`${prefix}/requests?tab=applications`);
  await expect(
    page.getByRole("status").filter({ hasText: /retrieving applications/i })
  ).toBeVisible();
  await scan(page, info);
  await page.request.post(
    `http://localhost:${process.env.MOCK_API_PORT || 4010}/_test/accessibility-release`
  );
  await expect(
    page.getByRole("link", { name: /synthetic research application/i })
  ).toBeVisible();
  await scan(page, info);
});

test("invalid variant is described and prevents submission", async ({
  page,
}, info) => {
  await page.goto(`${prefix}/allele-frequency`);
  await selectGenome(page);
  const variant = page.getByRole("textbox").first();
  await variant.fill("invalid");
  await expect(variant).toHaveAttribute("aria-invalid", "true");
  await expect(variant).toHaveAccessibleDescription(/variant/i);
  await expect(page.getByRole("button", { name: /^search$/i })).toBeDisabled();
  await scan(page, info);
});

test("phone country picker supports keyboard dismissal", async ({
  page,
}, info) => {
  await authenticate(page);
  await page.goto(`${prefix}/applications/89`);
  const trigger = page.getByRole("button", { name: /Search country/i });
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("combobox").filter({ visible: true }).first()
  ).toBeVisible();
  await scan(page, info);
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});

test("application options menu is accessible", async ({ page }, info) => {
  await authenticate(page);
  await page.goto(`${prefix}/applications/89`);
  const trigger = page.getByRole("button", { name: /^options$/i });
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("menu")).toBeVisible();
  await scan(page, info);
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});

for (const succeeds of [true, false]) {
  test(`contact dialog ${succeeds ? "success" : "error"}`, async ({
    page,
  }, info) => {
    await page.route("**/api/helpdesk/topics", (route) =>
      route.fulfill({
        json: { topics: [{ value: "general", label: "General enquiry" }] },
      })
    );
    await page.route("**/api/helpdesk/contact", (route) =>
      route.fulfill({
        status: succeeds ? 200 : 503,
        json: succeeds ? { ok: true } : { error: "Helpdesk unavailable" },
      })
    );
    await page.goto(`${prefix}/about`);
    const trigger = page.getByRole("button", { name: /get in touch/i });
    await trigger.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog");
    await expect(dialog.getByLabel(/first name/i)).toBeFocused();
    await expect(dialog.getByRole("combobox")).toBeEnabled();
    await scan(page, info);
    await dialog.getByLabel(/first name/i).fill("Test");
    await dialog.getByLabel(/last name/i).fill("Researcher");
    await dialog.getByLabel(/^email/i).fill("test@example.org");
    await dialog.getByLabel(/^title$/i).fill("Accessibility check");
    await dialog
      .getByLabel(/^message/i)
      .fill("Synthetic test message; intercepted locally.");
    await dialog.getByRole("button", { name: /^submit$/i }).click();
    await expect(dialog.getByRole(succeeds ? "status" : "alert")).toBeVisible();
    await scan(page, info);
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });
}
