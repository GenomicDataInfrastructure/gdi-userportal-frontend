---
slug: /developer-guide/add-ui-component
sidebar_label: "Add a new UI component"
sidebar_position: 1
description: "Create React components for the frontend"
---

<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

# Add a new UI component

Create new React components in the Next.js frontend. GDI uses Next.js 14 with server and client components.

In this guide

> [Component types in Next.js 14](#component-types-in-nextjs-14)  
> [Create the component file](#create-the-component-file)  
> [Add interactivity](#add-interactivity-if-needed)  
> [Use the component](#use-the-component)  
> [Styling with TailwindCSS](#styling-with-tailwindcss)  
> [Test your component](#test-your-component)

## Component types in Next.js 14

Next.js 14 supports two types of components:

- **Server components (default)**
  - Render on the server
  - Can directly access databases and APIs
  - Better performance, smaller bundle sizes
  - Cannot use browser APIs or React hooks like useState

- **Client components**
  - Marked with `'use client'` directive
  - Can use interactivity and React hooks
  - Access to browser APIs
  - Run in both server and client

## Create the component file

Create a new file in `/components`:

```tsx
// components/dataset-card.tsx
interface DatasetCardProps {
  title: string;
  description: string;
  publisher: string;
}

export function DatasetCard({
  title,
  description,
  publisher,
}: DatasetCardProps) {
  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-gray-600 mt-2">{description}</p>
      <p className="text-sm text-gray-500 mt-4">Publisher: {publisher}</p>
    </div>
  );
}
```

## Add interactivity (if needed)

For interactive features, use `'use client'`:

```tsx
"use client";

import { useState } from "react";

export function DatasetCard({ title, description }: DatasetCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div onClick={() => setIsExpanded(!isExpanded)}>
      <h3>{title}</h3>
      {isExpanded && <p>{description}</p>}
    </div>
  );
}
```

## Use the component

Import and use in a page or other component:

```tsx
import { DatasetCard } from "@/components/dataset-card";

export default function DatasetsPage() {
  return (
    <div>
      <DatasetCard
        title="Genomics Dataset"
        description="Cancer research data"
        publisher="Research Institute"
      />
    </div>
  );
}
```

## Styling with TailwindCSS

GDI uses Tailwind for styling. Common patterns:

```tsx
// Flexbox layout
<div className="flex items-center justify-between">

// Responsive design
<div className="w-full md:w-1/2 lg:w-1/3">

// Conditional styles
<button className={\`btn \${isActive ? 'bg-blue-500' : 'bg-gray-300'}\`}>
```

## Test your component

Create a test file:

```tsx
// __tests__/dataset-card.test.tsx
import { render, screen } from "@testing-library/react";
import { DatasetCard } from "@/components/dataset-card";

describe("DatasetCard", () => {
  it("renders dataset information", () => {
    render(<DatasetCard title="Test" description="Desc" publisher="Pub" />);
    expect(screen.getByText("Test")).toBeInTheDocument();
  });
});
```

Run tests:

```bash
npm test
```
