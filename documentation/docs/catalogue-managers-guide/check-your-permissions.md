---
slug: /catalogue-managers-guide/check-your-permissions
sidebar_label: "Check your permissions"
sidebar_position: 3
---

<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

# Check your permissions

Your permissions in the GDI Data Catalogue depend on two levels of roles: **platform-level** and **organisation-level**.

In this guide  

> [Platform-level roles](#platform-level-roles)  
> [Organisation-level roles](#organisation-level-roles)

## Platform-level roles

Your platform-level role determines your baseline permissions across the entire GDI Data Catalogue. This role is assigned to you by the Sysadmin and applies to all organisations you belong to.

**To check**: Log in to see your access to management features. You can identify your platform-level role by the features available to you in the top navigation bar. Here's an example screenshot of the navigation bar for a sysadmin with access to all management features:

<figure>
    <img src="img/catalogue-managers-guide/check-your-permissions/sysadmin-menus.png" alt="Screenshot of sysadmin menus" />
    <figcaption></figcaption>
</figure>

### Platform-level permissions

| Role | Permissions | Limitations |
|------|-------------|-------------|
| **Visitor (not signed in)** | **Search and view:**<br/>• Datasets<br/>• Organisations<br/>• Groups (dataset groups) | • Cannot access private datasets<br/>• Cannot join organisations or manage content<br/>• Cannot create any resources |
| **Registered user** | **Manage based on [organisation-level role](#organisation-level-roles):**<br/>• Organisations<br/>• Datasets<br/>• Groups (dataset groups) | Depends on [organisation-level role](#organisation-level-roles) |
| **Sysadmin** | **Manage all:**<br/>• Organisations<br/>• Datasets<br/>• Groups<br/>• Harvest sources<br/>• Users | None |


:::tip Need more access?

Contact your Sysadmin to upgrade your platform-level role or to adjust your organisation memberships.

:::

## Organisation-level roles

After verifying your platform-level role, check your permissions within each organisation you belong to. You may have different roles in different organisations.

**To check**: 
1. Select your name on the top right corner of the page. 
2. Select **Organisations**, then select the name of an organisation you belong to.
3. On the organisation page, select the **Members** tab to see your role in that organisation.  

<!-- I have no way to verify this workflow because it is not in the CKAN documentation, we dont have a regular user / creation needs devOps? Please verify the accuracy of these steps. -->

### Organisation-level permissions

Your organisation-level role determines what you can do within each specific organisation.

| Role | Permissions | Key capabilities |
|------|-------------|------------------|
| **Member** | • View private datasets in the organisation<br/>• Request elevated permissions | Read-only access to organisation datasets |
| **Editor** | • All member permissions<br/>• Create new datasets<br/>• Edit any dataset in the organisation<br/>• Delete datasets<br/>• Set dataset visibility (public/private) | Full dataset management within the organisation |
| **Admin** | • All editor permissions<br/>• Invite users to the organisation<br/>• Assign and change user roles<br/>• Remove users from the organisation<br/>• Update organisation settings (title, description, image)<br/>• Delete the organisation | Complete control over organisation and its members |


:::info Organisation admins  

Organisation Admins can manage other Admins, including changing their roles or removing them from the organisation. To request more permissions, contact your organisation Admin.

:::


:::tip Full documentation

For detailed technical information about how permissions work, see the [CKAN authorisation documentation](https://docs.ckan.org/en/2.9/maintaining/authorization.html)<sup>↗</sup>. CKAN is the system that powers the GDI Catalogue Portal.

:::