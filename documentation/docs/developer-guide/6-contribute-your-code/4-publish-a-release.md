---
slug: /developer-guide/publish-a-release
sidebar_label: "Publish a release"
sidebar_position: 4
description: Publish releases using automated GitHub Actions workflow
---

<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

# Publish a release

Create and publish new releases across GDI repositories using the automated GitHub Actions workflow. This process applies to all [GDI repositories](/developer-guide/understand-the-codebase#gdi-repositories).

## Understanding version numbering

Releases follow semantic versioning `v{major}.{minor}.{patch}`:

- **Major** - Breaking changes or major new features
- **Minor** - New features, backwards compatible
- **Patch** - Bug fixes and minor improvements

Examples: `v1.2.0`, `v2.0.1`, `v1.3.5`

## Publish a release

The release process is automated through GitHub Actions:

1. Go to the relevant repository on GitHub. See list of [GDI repositories](/developer-guide/understand-the-codebase#gdi-repositories).

2. Select the **Actions** tab.

3. In the left panel under **Workflows**, select **Publish Release**.

4. Select **Run workflow** on the upper right corner of the workflow page.

5. In the **Use workflow from** dropdown, select **Branch: main**.

6. Enter the version increment. For example: `v1.2.0`.

7. Select **Run workflow**.

The workflow will automatically:

- Create the release tag
- Create the release branch
- Update the changelog
- Build and publish Docker images
- Create the GitHub release with generated notes

## Verify the release

After the workflow completes, verify the release:

- Check that the workflow completed successfully in the Actions tab
- Verify the release appears on the releases page
- Confirm Docker images were built and published correctly
- Test the release in a staging environment if available

If the workflow fails, check the GitHub Actions logs for errors and re-run the workflow after addressing any issues.
