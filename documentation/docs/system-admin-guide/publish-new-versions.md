---
slug: /system-admin-guide/publishing-new-version
sidebar_label: "Publish new versions"
sidebar_position: 12
---

# Publish new versions

Publish new versions of GDI User Portal components using semantic versioning and GitHub releases. This guide covers the standardised release process for all repositories, including tagging, release branch creation, and Docker image publication.

:::info Standardised process

Apply this release process consistently across all GDI User Portal repositories to maintain version control and release quality.

:::

## Prepare for release

Ensure all necessary changes are merged to the `main` branch before beginning the release process.

1. **Update changelog:** Verify that `CHANGELOG.md` reflects all changes included in the release.

2. **Create version tag:** Push a new tag following semantic versioning `v{major}.{minor}.{patch}`:

   ```bash
   git tag -a v1.2.0 -m "GDI MS08"
   git push origin v1.2.0
   ```

3. **Create release branch:** Create a release branch to simplify bug fixing and security patches. Branch name follows `releases/v{major}.{minor}`:

   ```bash
   git checkout -b releases/v1.2
   ```

4. **Stage changelog:** Add the updated changelog to staging:

   ```bash
   git add .
   ```

5. **Commit changelog:** Commit the changelog with a descriptive message:

   ```bash
   git commit -m "Prepare for release v1.2"
   ```

6. **Push release branch:** Push the branch to the remote repository:

   ```bash
   git push origin releases/v1.2
   ```

## Create GitHub release

Create and publish the release on GitHub with appropriate documentation.

1. **Draft new release:** Go to GitHub and select "Draft a new release".

2. **Select branch and tag:** Choose the release branch and tag you created.

3. **Add release title:** Enter a title that includes the version and a short description.

4. **Generate release notes:** Select auto-generate release notes to populate initial content.

5. **Review release notes:** Remove unnecessary information and ensure notes match the changelog. Include only relevant information for users.

6. **Verify information:** Review all entered information for accuracy and completeness.

7. **Publish release:** Select "Publish release" to make the release official.

8. **Verify Docker images:** Confirm that Docker images built and published correctly.

:::tip Next steps

After publishing a new version:

- [Monitor and maintain the system](/system-admin-guide/monitor-maintain): Track deployment and performance
- [Manage data and services](/system-admin-guide/manage-data-services): Update configurations if needed
- Notify users of the new release and any required actions

:::
