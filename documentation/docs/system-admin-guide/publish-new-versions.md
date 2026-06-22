---
slug: /system-admin-guide/publishing-new-version
sidebar_label: "Publish new versions"
sidebar_position: 12
---

# Publish new versions

Publish new versions of GDI User Portal components using semantic versioning and GitHub releases. The release process is primarily automated through GitHub Actions, with manual steps available as fallback options.

:::info Automated process

The GDI User Portal uses automated workflows to handle versioning, release branch creation, and Docker image publication. This guide describes the automated release workflow and includes manual verification steps.

:::

## Automated release workflow

The release process is triggered automatically when you push a version tag to the repository.

1. **Update changelog:** Verify that `CHANGELOG.md` reflects all changes included in the release.

2. **Create and push version tag:** Push a new tag following semantic versioning `v{major}.{minor}.{patch}`:

   ```bash
   git tag -a v1.2.0 -m "GDI MS08"
   git push origin v1.2.0
   ```

The automated workflow then:

- Creates a release branch following the pattern `releases/v{major}.{minor}`
- Generates a GitHub release with auto-generated release notes
- Builds and publishes Docker images to the container registry

## Verify automated release

After the automated workflow completes, verify that the release was created successfully.

1. **Check GitHub release:** Navigate to the repository's Releases page and verify the new release appears with generated notes.

2. **Review release notes:** Ensure auto-generated notes match the changelog. Edit the release if necessary to remove unnecessary information and include only relevant information for users.

3. **Verify Docker images:** Confirm that Docker images built and published correctly to the container registry.

4. **Confirm release branch:** Check that the release branch `releases/v{major}.{minor}` was created for bug fixes and security patches.

## Manual release process (fallback)

If the automated workflow fails or is unavailable, you can create releases manually.

1. **Create release branch:** Create a release branch to simplify bug fixing and security patches. Branch name follows `releases/v{major}.{minor}`:

   ```bash
   git checkout -b releases/v1.2
   ```

2. **Stage and commit changelog:** Add and commit the updated changelog:

   ```bash
   git add .
   git commit -m "Prepare for release v1.2"
   ```

3. **Push release branch:** Push the branch to the remote repository:

   ```bash
   git push origin releases/v1.2
   ```

4. **Create GitHub release:** Go to GitHub, select **Create a new release**, select the release branch and tag, add a release title, generate release notes, review for accuracy, and publish the release.

5. **Verify Docker images:** Confirm that Docker images built and published correctly.

:::tip Next steps

After publishing a new version:

- [Monitor and maintain the system](/system-admin-guide/monitor-maintain): Track deployment and performance
- [Manage data and services](/system-admin-guide/manage-data-services): Update configurations if needed
- Notify users of the new release and any required actions

:::
