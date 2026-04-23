---
slug: /developer-guide/set-up-frontend
sidebar_label: "Set up frontend"
sidebar_position: 1
description: "Set up the Next.js frontend for local development"
---

<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

# Set up frontend

Set up the Next.js frontend for local development and testing.

## Prerequisites

- Node.js (v18 LTS or v20 LTS)
- npm (v9+) or pnpm (v8+)
- Git

## Clone the repository

```bash
git clone https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend.git
cd gdi-userportal-frontend
```

## Install dependencies

Using npm:

```bash
npm install
```

Using pnpm (recommended):

```bash
pnpm install
```

## Configure environment variables

Create a `.env.local` file in the project root:

```bash
# Copy example environment file
cp .env.example .env.local
```

Edit `.env.local` to configure:

```plaintext
# API endpoints
NEXT_PUBLIC_DDS_API_URL=http://localhost:8080
NEXT_PUBLIC_AMS_API_URL=http://localhost:8081

# Authentication
NEXT_PUBLIC_KEYCLOAK_URL=http://localhost:8180
NEXT_PUBLIC_KEYCLOAK_REALM=gdi
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=gdi-portal

# Feature flags
NEXT_PUBLIC_SHOW_BASKET_AND_LOGIN=true
```

## Run the development server

```bash
npm run dev
# or
pnpm dev
```

The application will start at `http://localhost:3000`.

## Development workflow

### Hot reload

The development server supports hot module replacement (HMR). Changes to components are reflected immediately without full page reload.

### TypeScript checking

Run type checking separately:

```bash
npm run type-check
```

### Linting

Check code style:

```bash
npm run lint
```

### Formatting

Format code with Prettier:

```bash
npm run format
```

## Common issues

- **Port 3000 already in use:** Change the port.

  ```bash
  PORT=3001 npm run dev
  ```

- **Module not found errors:** Clear node_modules and reinstall.

  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

- **Environment variables not loading:** Ensure `.env.local` exists and restart the development server.
