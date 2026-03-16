---
slug: /developer-guide/prerequisites
sidebar_label: "Prerequisites"
sidebar_position: 1
description: "Ensure you have the necessary tools to start developing"
---

<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->


# Prerequisites

Before you start developing for the GDI platform, ensure you have the following tools and accounts set up.

## Required tools

- ### Version control
    - **Git** (v2.30+): For source code management
    - **GitHub account**: To access repositories and create pull requests

- ### Container tools
    - **Docker** (v20.10+): For running services locally
    - **Docker Compose** (v2.0+): For orchestrating multiple containers

## Development tools by contribution area

- ### Frontend development (Next.js)
    - **Node.js** (v18 LTS or v20 LTS)
    - **npm** (v9+) or **pnpm** (v8+)
    - Code editor with TypeScript support (VS Code recommended)

- ### Backend services (Java/Quarkus)
    - **Java Development Kit (JDK)** (v17 or v21)
    - **Maven** (v3.8+)
    - IDE with Java support (IntelliJ IDEA or Eclipse recommended)

- ### CKAN development (Python)
    - **Python** (v3.9+)
    - **pip** and **virtualenv**
    - PostgreSQL client tools (optional, for database inspection)

## Recommended tools

- **REST API client**: Postman, Insomnia, or HTTPie for API testing
- **Database client**: DBeaver or pgAdmin for PostgreSQL inspection
- **Terminal**: Modern terminal emulator (Windows Terminal, iTerm2, or similar)

## Verify installation

Once you install your relevant tools, verify your installation:

```bash
git --version
docker --version
docker compose version
node --version  # For frontend
java --version  # For backend
python --version  # For CKAN
```
