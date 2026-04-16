---
slug: /developer-guide/follow-git-workflow
sidebar_label: "Follow Git workflow"
sidebar_position: 1
description: Follow Git branching strategy and commit conventions for contributions
---
<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

# Follow Git workflow

Development on GDI follows a trunk-based development model with feature branches and specific commit message conventions to ensure consistency and clarity in contributions. 

Follow these guidelines when contributing code to any of the [GDI repositories](/developer-guide/understand-the-codebase#gdi-repositories).

## Branching strategy

Create feature branches from `main`:

```bash
git checkout -b feature/add-dataset-validation
```

**Branch naming conventions:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring

## Commit messages

Write clear, descriptive commit messages:

```
feat: add dataset validation endpoint

- Validate required metadata fields
- Return 400 for invalid input
- Add unit tests

Closes #123
```

Format: `type: subject` where type is:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `test` - Tests
- `refactor` - Refactoring
- `chore` - Maintenance

## Pull requests

Push your branch and create a pull request on GitHub with description of changes and testing performed.
