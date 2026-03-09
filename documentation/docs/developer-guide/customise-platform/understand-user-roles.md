---
title: Understand user roles
sidebar_position: 2
---

<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

# CKAN user roles

## Platform-level roles

### 1. Visitor
- **Capabilities**:
  - Search and view public datasets.

### 2. Registered User
- **Capabilities**:
  - Become a member of an organisation (requires admin approval).
  - Publish, edit, or add datasets based on their role in the organisation.
  - Manage their own profile.
- **Note**: Creation of organisations is disabled.

### 3. Sysadmin
- **Capabilities**:
  - Access and edit any organisations.
  - View and change user details.
  - Permanently delete datasets.
  - Customise the look and feel of the platform.

## Organisation-level roles

### 1. Member
- **Capabilities**:
  - View the organisation's private datasets.

### 2. Editor
- **Capabilities**:
  - All capabilities of a Member.
  - Add new datasets to the organisation.
  - Edit or delete any of the organisation's datasets.
  - Make datasets public or private.

### 3. Organisation Admin
- **Capabilities**:
  - All capabilities of an Editor.
  - Add users to the organisation, and set their role (member, editor, or admin).
  - Change the role of any user in the organisation, including other admin users.
  - Remove members, editors, or other admins from the organisation.
  - Edit the organisation's details (e.g., title, description, image).
  - Delete the organisation.

## Further information

For more detailed information, please visit the CKAN documentation on authorisation: [CKAN Authorisation Documentation](https://docs.ckan.org/en/2.9/maintaining/authorization.html).

## Next steps

- [Audit user activity](./audit-user-activity.md) - Track changes and activities
- [Customise frontend theming](./customize-frontend-theming.md) - Adapt the platform appearance
