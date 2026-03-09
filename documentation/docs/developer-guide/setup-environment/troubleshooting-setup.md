---
title: Troubleshoot setup
sidebar_position: 4
---

<!--
SPDX-FileCopyrightText: 2024 Stichting Health-RI

SPDX-License-Identifier: CC-BY-4.0
-->

# Troubleshoot setup issues

***NEW CONTENT NEEDED***

Resolve common setup issues and find solutions for GDI User Portal component configurations.

## CKAN Extension Development Issues

### psycopg2 Build Failure

**Problem**: Installation of `psycopg2` fails during CKAN dependencies installation.

**Solution**: 

1. Navigate to CKAN requirements.txt located at `<venv directory>/src/ckan/requirements.txt`
2. Change `psycopg2==2.9.7` to `psycopg2-binary==2.9.9`
3. Rerun installation of the dependencies and install CKAN itself separately:

```bash
pip install -r <venv directory>/src/ckan/requirements.txt
pip install -r <venv directory>/src/ckan/dev-requirements.txt
pip install -e 'git+https://github.com/ckan/ckan.git@ckan-2.10.5#egg=ckan'
```

### PyYAML Compatibility Error

**Problem**: Runtime error `TypeError: load() missing 1 required positional argument: 'Loader'` when using CKAN v2.9.10.

**Solution**:

In requirements.txt, if `pyyaml` is set as `pyyaml==5.4.1` or `pyyaml==6.0.1`, downgrade it to `pyyaml==5.3.1`.

## Docker Issues

### Container Fails to Start

**Problem**: Docker containers fail to start or exit immediately.

**Solution**:

1. Check container logs:
   ```bash
   docker compose logs <service-name>
   ```

2. Verify environment variables are correctly set in `.env` files

3. Ensure required ports are not already in use:
   ```bash
   netstat -ano | findstr :<port-number>
   ```

### Docker Network Issues

**Problem**: Containers cannot communicate with each other.

**Solution**:

1. Verify containers are on the same network:
   ```bash
   docker network ls
   docker network inspect <network-name>
   ```

2. Ensure service names match those defined in `docker-compose.yml`

## Frontend Development Issues

### Module Not Found Errors

**Problem**: Import errors for dependencies after installation.

**Solution**:

1. Clear npm cache:
   ```bash
   npm cache clean --force
   ```

2. Delete `node_modules` and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### Hot Reload Not Working

**Problem**: Changes to source files don't trigger automatic reloads.

**Solution**:

1. Verify you're running the dev server:
   ```bash
   npm run dev
   ```

2. Check file watcher limits (Linux/Mac):
   ```bash
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   ```

## Authentication Issues

### Keycloak Connection Fails

**Problem**: Cannot connect to Keycloak instance.

**Solution**:

1. Verify Keycloak is running and accessible
2. Check firewall settings and port forwarding
3. Verify client credentials in configuration files
4. Review Keycloak logs for specific error messages

### LS-AAI Token Fetch Fails

**Problem**: Cannot retrieve access token from LS-AAI.

**Solution**:

1. Verify `Store Tokens` and `Stored tokens readable` are enabled in Keycloak
2. Delete existing LS-AAI users in Keycloak to ensure proper initialisation
3. Check that scopes include `openid profile email elixir_id`
4. Verify the LS-AAI service registration is approved

## Database Issues

### PostgreSQL Connection Errors

**Problem**: Cannot connect to PostgreSQL database.

**Solution**:

1. Verify PostgreSQL is running:
   ```bash
   psql --version
   ```

2. Check connection string format:
   ```
   postgresql://<user>:<password>@localhost/<db_name>
   ```

3. Ensure database exists:
   ```bash
   psql -l
   ```

4. Verify user permissions:
   ```bash
   psql -U <user> -d <db_name>
   ```

## Getting More Help

If you continue to experience issues:

- Check the [CKAN community chat](https://app.gitter.im/#/room/#ckan_chat:gitter.im)
- Review component-specific documentation in [reference section](../reference/index.md)
- Open an issue in the relevant [GDI repository](../reference/component-repositories.md)
