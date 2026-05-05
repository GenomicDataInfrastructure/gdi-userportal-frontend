---
slug: /developer-guide/test-frontend
sidebar_label: "Test frontend"
sidebar_position: 1
description: Test React components with Jest, React Testing Library, and Playwright
---

<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

# Test frontend

Test React components with Jest and React Testing Library.

## Unit tests

Create `ComponentName.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { DatasetCard } from "./DatasetCard";

describe("DatasetCard", () => {
  it("renders dataset title", () => {
    render(<DatasetCard title="Test Dataset" />);
    expect(screen.getByText("Test Dataset")).toBeInTheDocument();
  });
});
```

Run tests:

```bash
npm test
```

## E2E tests with Playwright

Test complete user flows across pages. Configuration in `playwright.config.ts`.
