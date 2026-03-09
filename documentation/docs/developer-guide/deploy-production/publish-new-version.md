---
title: Publish new version
sidebar_position: 3
---

<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

# Publishing a new version

> All repositories must follow the same process.

Once all necessary changes are merged to `main`, please follow this process:

## Step 1: Update CHANGELOG

Ensure `CHANGELOG.md` is up to date.

## Step 2: Push a New Tag

Push a new tag following the versioning and releases described in this page. The tag name follows `v{major}.{minor}.{patch}`. Example:

```bash
git tag -a v1.2.0 -m "GDI MS08"
git push origin v1.2.0
```

## Step 3: Create Release Branch

Create a new release branch, to simplify bugfixing and security patches. The branch name follows `releases/v{major}.{minor}`. Example:

```bash
git checkout -b releases/v1.2
```

## Step 4: Stage CHANGELOG

```bash
git add .
```

## Step 5: Commit CHANGELOG

```bash
git commit -m "Prepare for release v1.2"
```

## Step 6: Push Release Branch

Push the branch to remote repository:

```bash
git push origin releases/v1.2
```

## Step 7: Create GitHub Release

- Go to GitHub and create a new release
- Click on "Draft a new release"
- Select the just created release branch and tag
- Enter a title for the release that includes the version and possibly a short description
- Auto-generate release notes
- Remove unnecessary release notes: ensure that only relevant information for the users is included and matches CHANGELOG.md
- Double-check all entered information
- Click on "Publish release" to officially make the release
- Ensure docker images were built and published correctly

## Versioning

The versioning follows semantic versioning:
- **Major** version: Breaking changes
- **Minor** version: New features, backwards compatible
- **Patch** version: Bug fixes and security patches

## Next steps

- [Deploy to Azure](./deploy-to-azure.md) - Deploy new version to Azure
- [Deploy to ELIXIR Luxembourg](./deploy-to-elixir-lu.md) - Deploy to ELIXIR LU
