---
title: CKAN API reference
sidebar_position: 1
---

<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

# CKAN API reference

Access links to CKAN documentation, API references, and community resources.

## Official CKAN documentation

### Core Documentation

- [CKAN Documentation](https://docs.ckan.org/en/latest/contents.html) - Complete CKAN documentation
- [User Guide](https://docs.ckan.org/en/latest/user-guide.html) - Guide for end users
- [Sysadmin Guide](https://docs.ckan.org/en/latest/sysadmin-guide.html) - System administration guide
- [Maintaining CKAN](https://docs.ckan.org/en/latest/maintaining/index.html) - Maintenance and configuration
- [API Documentation](https://docs.ckan.org/en/latest/api/index.html) - Complete API reference
- [Extensions Guide](https://docs.ckan.org/en/latest/extensions/index.html) - Developing CKAN extensions
- [Theming Guide](https://docs.ckan.org/en/latest/theming/index.html) - Customise CKAN appearance

### Additional Resources

- [CKAN Technology Overview](https://hackmd.io/@V9jXur4GSfWQJP5TAFnk9w/HkeIXsXnu) - Technical overview

## CKAN API tools

### Python API Module

- [ckanapi Python Module](https://github.com/ckan/ckanapi/blob/master/README.md#ckanapi-python-module) - Python client for CKAN API

### API Testing Tools

- [Postman Collection for CKAN API](https://www.postman.com/api-evangelist/workspace/data-gov/collection/35240-bc9332c4-d7ba-4398-b9a9-51c6aaf5271c) - Pre-configured API calls for testing

## Community resources

### GitHub

- [CKAN Community Repositories](https://github.com/orgs/ckan/repositories?language=&q=&sort=&type=all) - All CKAN community projects

### Support Channels

- [CKAN Community Chat](https://app.gitter.im/#/room/#ckan_chat:gitter.im) - Gitter community chat

## Common API endpoints

CKAN provides a comprehensive REST API for interacting with datasets, organisations, and users. Key endpoints include:

- **package_list**: List all packages (datasets)
- **package_show**: Retrieve package details
- **package_create**: Create a new package
- **package_update**: Update an existing package
- **package_delete**: Delete a package
- **organization_list**: List all organisations
- **organization_show**: Retrieve organisation details
- **user_list**: List all users
- **user_show**: Retrieve user details

## API authentication

Most CKAN API calls require authentication via API key. Include the API key in the `Authorization` header:

```
Authorization: YOUR-API-KEY
```

## Next steps

- [Component repositories](./component-repositories.md) - GDI component repositories
- [External documentation](./external-documentation.md) - Additional resources
