---
slug: /developer-guide/build-features/add-a-new-ui-component
sidebar_label: "Add a new UI component"
sidebar_position: 1
---
<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

This guide walks you through creating a new React component in the Next.js frontend.

## Component types in Next.js 14

### Server components (default)
- Render on the server
- Can directly access databases and APIs
- Better performance, smaller bundle sizes
- Cannot use browser APIs or React hooks like useState

### Client components
- Marked with `'use client'` directive
- Can use interactivity and React hooks
- Access to browser APIs
- Run in both server and client

## Creating a component

### Step 1: Create the component file

Create a new file in `/components`:

```tsx
// components/dataset-card.tsx
interface DatasetCardProps {
  title: string;
  description: string;
  publisher: string;
}

export function DatasetCard({ title, description, publisher }: DatasetCardProps) {
  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-gray-600 mt-2">{description}</p>
      <p className="text-sm text-gray-500 mt-4">Publisher: {publisher}</p>
    </div>
  );
}
```

### Step 2: Add interactivity (if needed)

For interactive features, use `'use client'`:

```tsx
'use client';

import { useState } from 'react';

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

### Step 3: Use the component

Import and use in a page or other component:

```tsx
import { DatasetCard } from '@/components/dataset-card';

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

## Testing your component

Create a test file:

```tsx
// __tests__/dataset-card.test.tsx
import { render, screen } from '@testing-library/react';
import { DatasetCard } from '@/components/dataset-card';

describe('DatasetCard', () => {
  it('renders dataset information', () => {
    render(<DatasetCard title="Test" description="Desc" publisher="Pub" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

Run tests:

```bash
npm test
```

## Next steps

- Review existing components in `/components` for patterns
- Check the design system in Storybook (if available)
- See [Test frontend](../../5-test-your-changes/test-frontend/) for comprehensive testing
