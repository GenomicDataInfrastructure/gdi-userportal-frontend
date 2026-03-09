---
slug: /developer-guide/set-up-your-environment
sidebar_label: "Set up your environment"
sidebar_position: 3
description: "Configure your development environment for the GDI platform components."
---
<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

# Set up your environment

Configure your local development environment for the GDI platform components. If you're new to GDI, start with [Platform overview](/developer-guide/platform-overview), then return here to set up the services you want to work on.

## Quick start options

- **Option 1: Component-specific development:** Set up only the component you're working on. This is faster and uses fewer resources but requires mock data or stubs for dependent services.

- **Option 2: Full stack development:** Run all services locally using Docker Compose. This provides the complete platform but requires more CPU and memory (recommended: 16GB RAM, 4+ CPU cores).

## Environment conventions

All GDI repositories follow these conventions:

- **Environment variables**: Stored in `.env` files (never committed to Git)
- **Configuration files**: JSON or YAML in repository root or `/config` directory
- **Port assignments**: Documented in each component's README
- **Docker networks**: Services communicate via `gdi-network` bridge network

After setting up your environment, proceed to [Understand the codebase](/developer-guide/understand-the-codebase) to learn about architectural patterns.


## What would you like to do?

import DocCardList from '@theme/DocCardList';

<DocCardList />

