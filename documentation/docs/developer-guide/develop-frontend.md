---
slug: /developer-guide/develop-frontend
sidebar_label: "Develop frontend features"
sidebar_position: 3
---

# Develop frontend features

:::info content in progress

We are working on this guide.

:::


The GDI User Portal frontend is built with Next.js 13+ using the App Router, TypeScript, and Tailwind CSS. This section covers frontend development including theming, component development, and API integration.

## Frontend architecture

### Technology stack
- **Next.js 13+** with App Router for server-side rendering and routing
- **TypeScript** for type safety and better developer experience  
- **Tailwind CSS** for utility-first styling and responsive design
- **React Hook Form** for form handling and validation
- **SWR** for data fetching and caching
- **Radix UI** for accessible component primitives

### Component organisation
```
src/components/
├── ui/              # Base UI components (Button, Input, etc.)
├── features/        # Feature-specific components
│   ├── datasets/    # Dataset browsing and search
│   ├── auth/        # Authentication components  
│   └── requests/    # Access request components
└── layout/          # Layout and navigation components
```

## Theme customisation and styling

### Customise themes and styling
The GDI User Portal offers extensive customisation options through configuration files and CSS variables.

#### Configuration-based theming
Modify `public/properties.json` for site-wide customisation:

```json
{
  "NEXT_PUBLIC_SITE_TITLE": "Your Portal Title",
  "NEXT_PUBLIC_HOMEPAGE_TITLE": "Welcome Message",
  "NEXT_PUBLIC_SITE_DESCRIPTION": "Portal description",
  "NEXT_PUBLIC_SHOW_BASKET_AND_LOGIN": "true"
}
```

#### CSS customisation
Use `public/palette.css` to define colour schemes:

```css
:root {
  --primary: 210 40% 30%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  --accent: 210 40% 94%;
  /* Additional colour variables */
}
```

#### Custom fonts
1. Add font files to `public/fonts/`
2. Define font faces in `public/fonts.css`
3. Update Tailwind configuration for font usage

### Visual assets
Replace default assets in `/public`:
- `header-logo.svg` - Header logo
- `footer-logo.png` - Footer logo  
- `favicon.ico` - Browser icon
- `homepage-about-background.png` - Homepage background

For detailed theming documentation, see [Frontend Customisation](./theming/).

## Component development

### Build components
Follow established patterns for creating new React components:

```typescript
// components/ui/example-component.tsx
import { forwardRef } from "react";
import { cn } from "@/utils/cn";

interface ExampleComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary";
  size?: "sm" | "md" | "lg";
}

const ExampleComponent = forwardRef<HTMLDivElement, ExampleComponentProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "base-styles",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

ExampleComponent.displayName = "ExampleComponent";
export { ExampleComponent };
```

### Component guidelines
- Use TypeScript for all components
- Implement proper accessibility (ARIA labels, keyboard navigation)
- Follow established naming conventions
- Include comprehensive prop types
- Write unit tests for component logic

### State management
- Use React's built-in state management for local state
- Implement custom hooks for complex state logic
- Use SWR for server state management
- Context providers for global application state

## API integration

### Integrate with APIs
The frontend integrates with multiple backend services using consistent patterns.

#### Data Fetching with SWR
```typescript
// hooks/use-datasets.ts
import useSWR from 'swr';
import { fetcher } from '@/utils/api';

export function useDatasets(query?: string) {
  const { data, error, isLoading } = useSWR(
    query ? `/api/datasets?q=${query}` : '/api/datasets',
    fetcher
  );

  return {
    datasets: data?.datasets || [],
    isLoading,
    isError: error,
    total: data?.total || 0
  };
}
```

#### API Route Handlers
```typescript
// app/api/datasets/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

export async function GET(request: NextRequest) {
  const session = await getServerSession();
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  try {
    const response = await fetch(`${process.env.DDS_API_URL}/datasets`, {
      headers: {
        'Authorization': `Bearer ${session?.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch datasets' },
      { status: 500 }
    );
  }
}
```

### Service integration patterns

#### Dataset Discovery Service integration
- Search and filter datasets
- Retrieve dataset metadata
- Handle pagination and sorting

#### Access Management Service integration
- Submit access requests
- Track application status
- Manage user permissions

#### Authentication integration
- Handle login/logout flows
- Manage user sessions
- Secure API communication

## Testing

### Frontend testing strategy
```bash
# Unit tests with Jest and React Testing Library
npm test

# Component testing  
npm run test:components

# End-to-end tests with Playwright
npm run test:e2e

# Visual regression tests
npm run test:visual
```

### Testing best practices
- Test user interactions, not implementation details
- Use semantic queries for element selection
- Mock external API calls
- Test accessibility compliance
- Implement visual regression testing

## Development tools

### Code quality
- **ESLint** for code linting
- **Prettier** for code formatting  
- **TypeScript** for type checking
- **Husky** for Git hooks

### Development workflow
```bash
# Start development server
npm run dev

# Type checking
npm run type-check

# Linting and formatting
npm run lint
npm run format

# Build for production
npm run build
```

## Performance optimisation

### Next.js optimisation
- Use Next.js Image component for optimised images
- Implement proper code splitting
- Utilise server-side rendering where appropriate
- Optimise bundle size with dynamic imports

### Accessibility
- Follow WCAG guidelines
- Test with screen readers
- Ensure keyboard navigation
- Implement proper ARIA attributes
 