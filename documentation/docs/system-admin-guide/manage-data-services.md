---
slug: /system-admin-guide/manage-data-services
sidebar_label: "Manage data and services"
sidebar_position: 5
---

# Manage data and services

:::info content in progress

We are working on this guide.

:::


This section covers the administration of core data management services including CKAN administration, FAIR Data Point deployment, harvester configuration, and database management.

## Data service components

### Administer CKAN
CKAN serves as the core data catalogue system. Learn about user management, organisation setup, dataset administration, and system maintenance.

### Set up FAIR Data Points
FAIR Data Points provide standardised metadata endpoints that support FAIR principles. Configure FDP instances with GDI-specific SHACL shapes and metadata requirements.

### Configure harvesters
Set up automated data harvesting from external sources including other CKAN instances, FAIR Data Points, and DCAT-AP endpoints.

### Manage databases
Maintain database performance, backups, and integrity across PostgreSQL instances used by CKAN and other services.

## CKAN administration

### System configuration
- Instance configuration and settings
- Extension management and updates
- Performance tuning and optimisation
- Security configuration and updates

### User and organisation management
- User account administration
- Organisation setup and management
- Permission and role assignment
- API key management

### Data management
- Dataset lifecycle management
- Metadata quality assurance
- Storage and backup procedures
- Search index maintenance

## FAIR Data Point setup

### Installation and configuration
Deploy FDP instances with GDI-specific requirements and configure metadata schemas using SHACL shapes.

### Metadata schema configuration
Install and configure GDI-specific SHACL shapes for consistent metadata representation across the network.

### Supported metadata fields
Comprehensive coverage of dataset and distribution metadata fields including contact points, creators, themes, and access rights.

## Harvesting configuration

### Harvester setup
- Configure harvest sources and schedules
- Set up authentication for protected endpoints
- Monitor harvest job performance
- Troubleshoot harvest failures

### Data source integration
- FAIR Data Point harvesting
- DCAT-AP endpoint harvesting
- Custom API integration
- Real-time vs. scheduled synchronisation

## Database management

### Performance monitoring
- Query performance analysis
- Index optimisation
- Connection pool management
- Resource utilisation tracking

### Backup and recovery
- Automated backup procedures
- Point-in-time recovery
- Disaster recovery planning
- Data integrity verification

