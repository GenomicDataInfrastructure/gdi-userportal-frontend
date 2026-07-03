---
slug: /system-admin-guide/manage-data-services
sidebar_label: "Manage data and services"
sidebar_position: 8
---

# Manage data and services

Administer core **data management services** including CKAN configuration, harvester management, and database maintenance. This guide covers ongoing administration tasks after initial platform deployment.

:::tip Related guides

For FAIR Data Point setup, see [Set up FAIR Data Point](/system-admin-guide/fdp). For metadata schema configuration, see [Configure metadata schemas](/system-admin-guide/configure-schemas).

:::

## CKAN administration

Administer the CKAN data catalogue system through ongoing configuration, user management, and data lifecycle tasks.

### System configuration

Configure and maintain your CKAN instance:

- **Instance configuration and settings**: Manage core CKAN settings and behaviour
- **Extension management and updates**: Install, configure, and update CKAN extensions
- **Performance tuning and optimisation**: Optimise system performance for your data catalogue
- **Security configuration and updates**: Apply security patches and configure access controls

### User and organisation management

Manage CKAN users and organisational structures:

- **User account administration**: Create and manage user accounts
- **Organisation setup and management**: Configure organisations and their hierarchies
- **Permission and role assignment**: Control user access levels (see [Manage user roles and permissions](/system-admin-guide/manage-user-roles))
- **API key management**: Generate and manage API keys for programmatic access

### Data management

Maintain data quality and system integrity:

- **Dataset lifecycle management**: Manage datasets from creation to archival
- **Metadata quality assurance**: Ensure metadata completeness and accuracy
- **Storage and backup procedures**: Maintain data storage and implement backup strategies
- **Search index maintenance**: Rebuild and optimise SOLR search indexes

## Harvester configuration

Configure automated data harvesting from external sources including other CKAN instances, FAIR Data Points, and DCAT-AP endpoints.

### Harvester setup

Manage harvest sources and scheduling:

- **Configure harvest sources and schedules**: Define data sources and harvesting frequency
- **Set up authentication for protected endpoints**: Configure credentials for secure data sources
- **Monitor harvest job performance**: Track harvesting success rates and timing
- **Troubleshoot harvest failures**: Diagnose and resolve harvesting issues

### Data source integration

Integrate different types of data sources:

- **FAIR Data Point harvesting**: Harvest metadata from FDP endpoints (see [Set up FAIR Data Point](/system-admin-guide/fdp))
- **DCAT-AP endpoint harvesting**: Integrate with DCAT-AP compliant catalogues
- **Custom API integration**: Connect to custom data sources
- **Real-time vs. scheduled synchronisation**: Choose appropriate update strategies

## Database management

Maintain database performance, backups, and integrity across PostgreSQL instances used by CKAN and other services.

### Performance monitoring

Monitor and optimise database performance:

- **Query performance analysis**: Identify and optimise slow queries
- **Index optimisation**: Create and maintain database indexes
- **Connection pool management**: Configure connection pooling for optimal performance
- **Resource utilisation tracking**: Monitor CPU, memory, and disk usage

### Backup and recovery

Implement backup strategies and recovery procedures:

- **Automated backup procedures**: Schedule regular database backups
- **Point-in-time recovery**: Restore databases to specific timestamps
- **Disaster recovery planning**: Prepare for system failures and data loss scenarios
- **Data integrity verification**: Validate backup completeness and data consistency

:::tip Next steps

After configuring data and services:

- [Configure metadata schemas](/system-admin-guide/configure-schemas): Define dataset fields and validation rules.
- [Set up FAIR Data Point](/system-admin-guide/fdp): Deploy FDP instances with GDI-specific requirements.
- [Monitor and maintain the system](/system-admin-guide/monitor-maintain): Set up ongoing monitoring and maintenance.

:::
