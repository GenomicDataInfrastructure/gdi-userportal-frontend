---
slug: /system-admin-guide/monitor-maintain
sidebar_label: "Monitor and maintain the platform"
sidebar_position: 11
---

# Monitor and maintain the platform

Monitor and maintain your GDI platform deployment to ensure reliability, security, and optimal performance. This guide covers performance monitoring, security auditing, backup procedures, and update management.

## Performance monitoring

Track system performance metrics to ensure optimal platform operation and identify potential issues before they impact users.

Monitor key performance indicators:

- **Response times**: Track application response times to identify performance bottlenecks
- **Resource utilisation**: Monitor CPU, memory, and disk usage across all components
- **User activity**: Track user sessions, concurrent users, and usage patterns
- **Database performance**: Monitor query execution times and connection pool usage
- **API performance**: Track API endpoint response times and error rates

## Security auditing

Implement comprehensive security monitoring to protect your deployment and maintain compliance with data protection regulations.

Establish security monitoring procedures:

- **Access logging**: Record all authentication attempts and user access to sensitive data
- **Intrusion detection**: Monitor for suspicious activity and potential security threats
- **Compliance verification**: Ensure adherence to data protection and security policies
- **Audit trails**: Maintain detailed logs of administrative actions and system changes
- **Vulnerability scanning**: Regularly scan for security vulnerabilities in deployed components

### Activity monitoring and auditing

Monitor user activity and dataset changes to maintain data integrity and track catalogue usage.

#### Enable activity streams

CKAN displays a full history of dataset changes in the Activity Stream. New installations enable this by default, but you may need to activate it manually for upgrades.

To make activity history public, add this to your `ckan.ini` file:

```ini
ckan.auth.public_activity_stream_detail = true
```

:::info CKAN 2.11.3 plugin requirement

Since CKAN 2.11.3, you must activate Activity as a plugin. See the [CKAN 2.11 changelog](https://docs.ckan.org/en/2.11/changelog.html) for details.

:::

#### Activity monitoring levels

Configure activity tracking at different levels:

- **Organisation level**: Track all changes within an organisation
- **Dataset level**: Monitor specific dataset modifications
- **Difference view**: See detailed changes between versions
- **User activity**: Track individual user actions and access patterns

#### Audit configuration

For complete activity configuration options, see [CKAN activity settings documentation](https://docs.ckan.org/en/2.11/maintaining/configuration.html).

## Data backup

Establish reliable backup procedures to protect critical data and enable recovery from system failures or data loss.

Implement comprehensive backup strategies:

- **CKAN databases**: Schedule regular backups of CKAN data and metadata
- **Configuration files**: Back up all system configuration files and secrets
- **User data**: Protect user accounts, roles, and permissions data
- **Backup verification**: Regularly test backup restoration procedures
- **Retention policies**: Define and implement appropriate backup retention periods

For database backup procedures, see [Manage data and services](/system-admin-guide/manage-data-services).

## Platform updates

Manage platform updates and version deployments to maintain security, stability, and feature currency while minimising service disruption.

Follow these practices when deploying updates:

- **Minimal downtime**: Plan updates during maintenance windows to reduce user impact
- **Rollback procedures**: Prepare rollback plans before applying major updates
- **Testing**: Validate updates in development environments before production deployment
- **Version control**: Track deployed versions and maintain change documentation
- **Communication**: Notify users of scheduled maintenance and expected downtime

:::tip Next steps

After setting up monitoring and maintenance:

- [Manage data and services](/system-admin-guide/manage-data-services): Review database backup and performance monitoring
- [Publish new versions](/system-admin-guide/publishing-new-version): Deploy updates and manage releases
- [Manage user roles and permissions](/system-admin-guide/manage-user-roles): Review and adjust user access levels

:::
