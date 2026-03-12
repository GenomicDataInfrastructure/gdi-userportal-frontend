---
slug: /developer-guide/frontend-architecture
sidebar_label: "Frontend architecture"
sidebar_position: 1
description: "Explore Next.js architecture, routing, and state management"
---
<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

# Frontend architecture

The GDI frontend is built with Next.js 14 using the App Router pattern and TypeScript for type safety.

## Project structure

```
gdi-userportal-frontend/
├── app/                    # Next.js app directory (routes)
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage
│   ├── datasets/           # Dataset routes
│   └── applications/       # Application routes
├── components/             # Reusable React components
│   ├── ui/                 # Base UI components  
│   ├── dataset/            # Dataset-specific components
│   └── layout/             # Layout components
├── lib/                    # Utility functions
│   ├── api/                # API client functions
│   ├── auth/               # Authentication helpers
│   └── utils/              # General utilities
├── types/                  # TypeScript types
├── public/                 # Static assets
│   ├── properties.json     # Runtime configuration
│   └── palette.css         # Theme colours
└── styles/                 # Global styles
```

## Key patterns

Intro sentence: The frontend codebase 

### Server and client components
- Server components (default): Render on server, better performance
- Client components (`'use client'`): For interactivity, state, browser APIs

### Data fetching
- Server components: Use `fetch` with Next.js caching
- Client components: Use React hooks (useState, useEffect) or SWR

### Routing
- File-based routing in `app/` directory
- Dynamic routes: `[id]/page.tsx`
- Route groups: `(auth)/login/page.tsx`

### State management
- Local state: React `useState`
- Global state: React Context API
- Server state: SWR for data fetching

### Authentication
- OIDC flow with Keycloak
- PKCE implementation for security
- Protected routes with middleware
