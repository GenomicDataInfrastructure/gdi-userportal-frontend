---
title: Publishing a new version
weight: 3
---
<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

> All repositories must follow the same process.
Once all necessary changes are merged to `main`, please follow this process:
- Ensure `CHANGELOG.md` is up to date.
- Push a new tag following the versioning and releases described in this page. The tag name follows `v{major}.{minor}.{patch}`. Example:
```bash
$ git tag -a v1.2.0 -m "GDI MS08"
$ git push origin v1.2.0
```
- Create a new release branch, to simplify bugfixing and security patches. The branch name follows `releases/v{major}.{minor}`. Example:
```bash
$ git checkout -b releases/v1.2
```
- Stage the `CHANGELOG.md`
```bash
$ git add .
```
Commit the `CHANGELOG.md`:
```bash
$ git commit -m "Prepare for release v1.2"
```
Push the branch tot remote repository
```bash
$ git push origin releases/v1.2
```

- Go to GitHub and create a new release, example: 
- Click on "Draft a new release" CHANGELOG
- Select the just created release branch and tag.
- Enter a title for the release that includes the version and possibly a short description.
- Auto-generate release notes.
- Remove unnecessary release notes: ensure that only relevant information for the users is included and matches CHANGELOG.md.
- Double-check all entered information.
- Click on "Publish release" to officially make the release.
- Ensure docker images were built and published correctly.