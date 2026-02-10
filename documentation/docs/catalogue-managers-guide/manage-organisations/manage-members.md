---
slug: /catalogue-managers-guide/manage-organisations/manage-members
sidebar_label: "Manage members"
sidebar_position: 3
---

<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

# Manage members

Invite team members to your organisation and control their access by assigning roles or removing members.

In this guide

> [Add members](#add-members)  
> [Edit member role](#edit-member-role)  
> [Remove member](#remove-member)

<br/>

:::tip Full documentation

For a complete guide to organisation management, see the [CKAN documentation](https://docs.ckan.org/en/2.11/user-guide.html#managing-an-organization)<sup>↗</sup>. CKAN is the system that powers the GDI Catalogue Portal.

:::

## Add members

Invite team members to your organisation and assign roles to control their access permissions.

1. Go to **Organizations** and select your organization from the list.  

2. Select **Manage** and then **Members**.  

3. Select **Add Member**.  

4. The next steps depend on whether the member already has an account in the GDI Data Catalogue:

    - **For existing users:** Select their username under **Existing User**. 
    - **For new users:** Enter their email address under **New User** to send them an invitation. Then, come back to this step after they create their account. 

5. Enter the member's username and select their role:  

   - **Admin:** Full control over organization and all datasets
   - **Editor:** Can add and edit datasets
   - **Member:** Can view private datasets

6. Select **Add** to save the member. Repeat the steps above to add more team members as needed. 

## Edit member role

Change a team member's role to adjust their access permissions.

1. Go to **Organizations** and select your organization from the list.

2. Select **Manage** and then **Members**.

3. Find the member whose role you want to change.

4. Select the **Role** dropdown next to their name and choose the new role:
   - **Admin:** Full control over organization and all datasets
   - **Editor:** Can add and edit datasets  
   - **Member:** Can view private datasets

5. The role change takes effect immediately.

:::info Understanding roles

See [User roles and permissions](../check-your-permissions#organisation-level-roles) for detailed information about what each role can do. Role changes are immediate—the member's access is updated as soon as you change their role.

:::

## Remove member

Remove team members who no longer need access to your organisation's datasets.

1. Go to **Organizations** and select your organization from the list.

2. Select **Manage** and then **Members**.

3. Find the member you want to remove.

4. Select the **Delete** (x) icon next to their name.

5. Confirm the deletion when prompted.

:::warning What happens when you remove a member

- The member loses access to all private datasets in your organisation
- The member can no longer edit or manage datasets in your organisation
- The member's user account remains active in the catalogue
- The member can still be added to other organisations

:::

:::danger Removing organisation admins

When removing an organisation admin, ensure at least one other admin remains to manage the organisation. If you remove all admins, you'll need to contact a system administrator to regain access.

:::
