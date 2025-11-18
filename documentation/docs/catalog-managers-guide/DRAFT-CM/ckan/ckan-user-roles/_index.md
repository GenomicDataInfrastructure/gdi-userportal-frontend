---
title: CKAN User Roles
---
<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->
## Platform-Level Roles

### 1. Visitor
- **Capabilities**:
  - Search and view public datasets.

### 2. Registered User
- **Capabilities**:
  - Become a member of an organization (requires admin approval).
  - Publish, edit, or add datasets based on their role in the organization.
  - Manage their own profile.
- **Note**: Creation of organizations is disabled.

### 3. Sysadmin
- **Capabilities**:
  - Access and edit any organizations.
  - View and change user details.
  - Permanently delete datasets.
  - Customize the look and feel of the platform.

## Organization-Level Roles

### 1. Member
- **Capabilities**:
  - View the organization’s private datasets.

### 2. Editor
- **Capabilities**:
  - All capabilities of a Member.
  - Add new datasets to the organization.
  - Edit or delete any of the organization's datasets.
  - Make datasets public or private.

### 3. Organization Admin
- **Capabilities**:
  - All capabilities of an Editor.
  - Add users to the organization, and set their role (member, editor, or admin).
  - Change the role of any user in the organization, including other admin users.
  - Remove members, editors, or other admins from the organization.
  - Edit the organization's details (e.g., title, description, image).
  - Delete the organization.

---

For more detailed information, please visit the CKAN documentation on authorization: [CKAN Authorization Documentation](https://docs.ckan.org/en/2.9/maintaining/authorization.html).
