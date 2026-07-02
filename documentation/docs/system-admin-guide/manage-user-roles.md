---
slug: /system-admin-guide/manage-user-roles
sidebar_label: "Manage roles and permissions"
sidebar_position: 7
---

# Manage user roles and permissions

Configure and manage **user access levels** within GDI's CKAN data catalogue system. This guide covers platform-wide and organisation-specific role management for system administrators.

## CKAN user role hierarchy

CKAN operates with two levels of roles: platform-level roles that apply across the entire system, and organisation-level roles that control access within specific organisations.

### Platform-level roles

Platform-level roles determine what users can do across the entire CKAN instance. The following table describes the three platform-level roles:

| Role                | Capabilities                                                                                                                                                                              | Notes                                                                 |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| **Visitor**         | Search and view public datasets                                                                                                                                                           | Anonymous/unauthenticated users                                       |
| **Registered user** | Become a member of an organisation (requires admin approval)<br />Publish, edit, or add datasets based on their role in the organisation<br />Manage their own profile                    | The system typically disables organisation creation for regular users |
| **Sysadmin**        | Access and edit any organisations<br />View and change user details<br />Permanently delete datasets<br />Customise the look and feel of the platform<br />Configure system-wide settings | Full administrative control over the entire system                    |

### Organisation-level roles

Organisation-level roles control access to datasets and administrative functions within a specific organisation. The following table describes the three organisation-level roles:

| Role                   | Capabilities                                                                                                                                                                                                                                                                                                                                                              | Use case                                                |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| **Member**             | View the organisation's private datasets                                                                                                                                                                                                                                                                                                                                  | Users who need access to restricted organisational data |
| **Editor**             | All capabilities of a Member<br />Add new datasets to the organisation<br />Edit or delete any of the organisation's datasets<br />Make datasets public or private                                                                                                                                                                                                        | Content contributors and data curators                  |
| **Organisation admin** | All capabilities of an Editor<br />Add users to the organisation, and set their role (member, editor, or admin)<br />Change the role of any user in the organisation, including other admin users<br />Remove members, editors, or other admins from the organisation<br />Edit the organisation's details (e.g., title, description, image)<br />Delete the organisation | Organisational data stewards and managers               |

## Manage user access

Use CKAN's admin interface to configure platform-level and organisation-specific user permissions. Access the admin interface to assign roles, manage organisation memberships, and control system access levels.

### Role assignment best practices

Follow these practices when assigning user roles:

- **Principle of least privilege**: Grant users only the permissions they need to perform their tasks
- **Regular audits**: Review user permissions periodically to ensure they remain appropriate
- **Documentation**: Record role assignments and changes for audit trails
- **Approval workflows**: Implement approval processes for sensitive roles like Sysadmin and Organisation Admin

For detailed role management procedures, see the [CKAN authorisation documentation](https://docs.ckan.org/en/2.9/maintaining/authorization.html).

:::tip Next steps

After configuring user roles:

- [Manage data and services](/system-admin-guide/manage-data-services): Set up data management workflows
- [Monitor and maintain the system](/system-admin-guide/monitor-maintain): Track user activity and audit trails
- [Configure metadata schemas](/system-admin-guide/configure-schemas): Define dataset fields and validation rules

:::
