---
slug: /developer-guide/publish-a-release
sidebar_label: "Publish a release"
sidebar_position: 4
description: Publish releases following version tags and GitHub release workflow steps
---
<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

# Publish a release

Create and publish new releases across GDI repositories using version tags and GitHub's release workflow. This process applies to all [GDI repositories](/developer-guide/understand-the-codebase#gdi-repositories).

In this guide

> [Prepare the release](#prepare-the-release)  
> [Create release tag](#create-release-tag)  
> [Create release branch](#create-release-branch)  
> [Publish on GitHub](#publish-on-github)  
> [Verify the release](#verify-the-release)

## Prepare the release

Update the changelog with all changes included in the release:

1. Review all merged pull requests since the last release
2. Add new changes to `CHANGELOG.md` following the existing format
3. Commit the updated changelog:

```bash
git add CHANGELOG.md
git commit -m "Update changelog for v1.2.0"
git push origin main
```

## Create release tag

Tag the release commit following semantic versioning `v{major}.{minor}.{patch}`:

```bash
git tag -a v1.2.0 -m "GDI MS08"
git push origin v1.2.0
```

**Version numbering:**
- **Major** - Breaking changes or major new features
- **Minor** - New features, backwards compatible
- **Patch** - Bug fixes and minor improvements

## Create release branch

Create a release branch for bug fixes and security patches:

```bash
git checkout -b releases/v1.2
git push origin releases/v1.2
```

Release branches follow the pattern `releases/v{major}.{minor}` (without the patch version).

## Publish on GitHub

Create the release in GitHub's interface:

1. Go to the relevant repository on GitHub. See list of [GDI repositories](/developer-guide/understand-the-codebase#gdi-repositories).
2. Select **Releases** in the right sidebar.
3. Select **Draft a new release**.
4. Select the tag you created (e.g., `v1.2.0`).
5. Set the target to the release branch (e.g., `releases/v1.2`).
6. Enter a release title (e.g., "v1.2.0 - GDI MS08").
7. Select **Generate release notes** to auto-generate the notes.
8. Review and edit the release notes:
   - Remove internal or non-user-facing changes.
   - Ensure consistency with `CHANGELOG.md`.
   - Focus on what users and developers need to know.
9. Double-check all information.
10. Select **Publish release**.

## Verify the release

After publishing, verify the release was successful:

- Check that Docker images were built and published correctly
- Verify the release appears on the releases page
- Test the release in a staging environment if available
- Monitor for any immediate issues

If you encounter build failures, check the GitHub Actions logs and address any errors before republishing.