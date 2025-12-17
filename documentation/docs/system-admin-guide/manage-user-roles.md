---
slug: /system-admin-guide/manage-user-roles
sidebar_label: "Manage roles and permissions"
sidebar_position: 6
---

# Manage user roles and permissions

Configure and manage user access levels within the CKAN data catalogue system. This guide covers platform-wide and organisation-specific role management for system administrators.

## CKAN user role hierarchy

Understanding CKAN user roles is essential for effective system administration. CKAN operates with two levels of roles:

### Platform-level roles

#### 1. Visitor

- **Capabilities**: Search and view public datasets
- **Access level**: Anonymous/unauthenticated users

#### 2. Registered User

- **Capabilities**:
  - Become a member of an organisation (requires admin approval)
  - Publish, edit, or add datasets based on their role in the organisation
  - Manage their own profile
- **Configuration note**: Creation of organisations is typically disabled for regular users

#### 3. Sysadmin

- **Capabilities**:
  - Access and edit any organisations
  - View and change user details
  - Permanently delete datasets
  - Customise the look and feel of the platform
  - Configure system-wide settings

### Organisation-level roles

#### 1. Member

- **Capabilities**: View the organisation's private datasets
- **Use case**: Users who need access to restricted organisational data

#### 2. Editor

- **Capabilities**:
  - All capabilities of a Member
  - Add new datasets to the organisation
  - Edit or delete any of the organisation's datasets
  - Make datasets public or private
- **Use case**: Content contributors and data curators

#### 3. Organisation Admin

- **Capabilities**:
  - All capabilities of an Editor
  - Add users to the organisation, and set their role (member, editor, or admin)
  - Change the role of any user in the organisation, including other admin users
  - Remove members, editors, or other admins from the organisation
  - Edit the organisation's details (e.g., title, description, image)
  - Delete the organisation
- **Use case**: Organisational data stewards and managers

## User management procedures

### Configure platform roles

Use CKAN's admin interface to manage platform-level user permissions and system access.

### Set up organisation permissions

Configure organisation-specific roles and manage member access to datasets within organisational boundaries.

### Role assignment best practices

- Follow principle of least privilege
- Regular audit of user permissions
- Document role assignments and changes
- Implement approval workflows for sensitive roles

For detailed role management procedures, see the [CKAN authorisation documentation](https://docs.ckan.org/en/2.9/maintaining/authorization.html).

## Activity monitoring and auditing

Monitor user activity and dataset changes to maintain data integrity and track catalogue usage.

### Enable activity streams

CKAN displays a full history of dataset changes in the Activity Stream. For new installations, this is enabled by default, but upgrades may need manual activation.

To make activity history public, add this to your `ckan.ini` file:

```ini
ckan.auth.public_activity_stream_detail = true
```

**Note**: Since CKAN 2.10, Activity must be activated as a plugin. See the [CKAN 2.10 changelog](https://docs.ckan.org/en/2.10/changelog.html) for details.

### Activity monitoring levels

Configure activity tracking at different levels:

- **Organisation level** - Track all changes within an organisation
- **Dataset level** - Monitor specific dataset modifications
- **Difference view** - See detailed changes between versions
- **User activity** - Track individual user actions and access patterns

### Audit configuration

For complete activity configuration options, see [CKAN activity settings documentation](https://docs.ckan.org/en/2.10/maintaining/configuration.html).

## Next steps

After configuring user roles:

- [Manage data and services](../manage-data-services) - Set up data management workflows
- [Monitor and maintain the system](../monitor-maintain) - Ongoing system maintenance
- [Deploy and manage infrastructure](../deploy-infrastructure) - Infrastructure management
