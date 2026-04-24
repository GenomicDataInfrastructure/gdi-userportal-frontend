---
slug: /developer-guide/set-up-ckan
sidebar_label: "Set up CKAN"
sidebar_position: 3
description: "Set up CKAN and extensions for local development"
---

<!--
SPDX-FileCopyrightText: 2024 Stichting Health-RI

SPDX-License-Identifier: CC-BY-4.0
-->

# Set up CKAN

Install CKAN and its extensions for local development and testing.

## Prerequisites

- Python 3.10 installed
- PostgreSQL installed and running
- Git installed
- Administrator/sudo access on your machine

## Version alignment

The local setup should match the versions used by the `gdi-userportal-ckan-docker` development image:

| Component      | Version or source                                                                 |
| -------------- | ---------------------------------------------------------------------------------- |
| CKAN           | `2.11.4`                                                                           |
| CKAN base image | `ckan/ckan-dev:2.11.4` for development, `ckan/ckan-base:2.11.4` for production    |
| Python         | `3.10`                                                                             |
| PostgreSQL     | `18-alpine`                                                                        |
| Solr           | `10.0.0-slim`                                                                      |
| Redis          | `7.4.2`                                                                            |
| DCAT extension | `GenomicDataInfrastructure/gdi-userportal-ckanext-dcat@v2.4.2`                    |

## Install CKAN locally

1. **Set up virtual environment:**

   ```commandline
   sudo mkdir -p /etc/ckan/default/  # or other directory of choice
   sudo chown `whoami` /etc/ckan/default
   python3 -m venv /etc/ckan/default
   source /etc/ckan/default/bin/activate
   pip install setuptools
   pip install --upgrade pip
   ```

   :::info Important
   Keep your virtual environment activated throughout the entire installation process.
   :::

2. **Install CKAN as a package into your virtual environment:**

   ```commandline
   pip install -e 'git+https://github.com/ckan/ckan.git@ckan-2.11.4#egg=ckan[requirements]'
   # For development purposes, include dev dependencies:
   pip install -e 'git+https://github.com/ckan/ckan.git@ckan-2.11.4#egg=ckan[requirements,dev]'
   ```

   :::tip Troubleshooting
   If you encounter dependency installation issues, see: [Troubleshooting installation](#troubleshooting-installation).
   :::

3. **Install the required CKAN extensions.** You can install extensions from a local repository or directly from GitHub.

   From a local repository:

   ```commandline
   pip install -e file:///<path to local extension repo>/ckan-fairdatapoint#egg=ckanext-fairdatapoint
   ```

   Example on macOS:

   ```commandline
   pip install -e file:///Users/<username>/Github/gdi-userportal-ckanext-fairdatapoint#egg=ckanext-fairdatapoint
   ```

   Directly from GitHub:

   ```commandline
   pip install -e git+https://github.com/GenomicDataInfrastructure/gdi-userportal-ckanext-dcat.git@v2.4.2#egg=ckanext-dcat
   ```

4. **Install the dependencies for the CKAN extensions:**

   From local repository:

   ```commandline
   pip install -r <path to local extension repo>/requirements.txt
   pip install -r <path to local extension repo>/dev-requirements.txt
   ```

   From GitHub (example for ckanext-harvest):

   ```commandline
   pip install -r https://raw.githubusercontent.com/ckan/ckanext-harvest/master/requirements.txt
   pip install -r https://raw.githubusercontent.com/ckan/ckanext-harvest/master/dev-requirements.txt
   ```

5. **Configure your database connection.** Set up a PostgreSQL database and specify the connection string in both `ckan.ini` and `test-core.ini`.

## Configure testing

Your testing strategy depends on your plugin's functionality. CKAN provides helper functions to generate dummy data and clean up databases after tests. For detailed information, review the [official CKAN documentation](https://docs.ckan.org/en/2.11/extensions/testing-extensions.html).

To set up your test environment, configure plugin testing:

1. **Verify pytest-ckan installation.** This package is typically listed in your plugin's `dev-requirements.txt` and should already be installed.

   Check if it's installed:

   ```commandline
   pip list | grep pytest-ckan
   ```

   If not found, install it:

   ```commandline
   pip install pytest-ckan
   ```

2. **Configure the test.ini file.** Each plugin includes an auto-generated `test.ini` file. Ensure it points to your CKAN installation's `test-core.ini` file:

   ```ini
   [app:main]
   use = config:/etc/ckan/default/src/ckan/test-core.ini
   ```

3. **Update your database connection.** Modify `test-core.ini` with the correct database connection string:

   ```ini
   sqlalchemy.url = postgresql://<user>:<password>@localhost/<db_name>
   ```

   :::tip Best Practice
   If your plugin writes to the database, set up a separate PostgreSQL test database to avoid affecting your development data.
   :::

## Run tests

**For basic tests**, run all tests with the following command:

```commandline
pytest --ckan-ini=test.ini
```

**For advanced test options**, run tests with coverage reporting and suppressed warnings:

```commandline
<path to virtual environment>/default/bin/pytest --ckan-ini=test.ini --disable-warnings ./ckanext/fairdatapoint --cov ./ckanext/fairdatapoint -vv
```

**When developing an extension in Docker**, start the development setup with Docker Compose, then run tests from inside the `ckan-dev` container:

```bash
docker compose exec -it ckan-dev bash
cd /srv/app/src_extensions/ckanext-fairdatapoint
pytest --ckan-ini=test.ini
```

Replace `ckanext-fairdatapoint` with the extension you are developing.

**To run individual test files or unit tests within PyCharm**, set the following environment variable in your run configuration:

```commandline
CKAN_INI=test.ini
```

Add this environment variable in PyCharm by navigating to **Run** > **Edit Configurations** > **Environment variables**.

## Troubleshooting installation

Here are some common issues when installing CKAN and how to resolve them:

- **psycopg2 build failures.** If `psycopg2` installation fails, update the CKAN requirements file:

1. Navigate to `<venv directory>/src/ckan/requirements.txt`
2. Change `psycopg2==2.9.7` to `psycopg2-binary==2.9.9`
3. Reinstall dependencies and CKAN separately:
   ```commandline
   pip install -r <venv directory>/src/ckan/requirements.txt
   pip install -r <venv directory>/src/ckan/dev-requirements.txt
   pip install -e 'git+https://github.com/ckan/ckan.git@ckan-2.11.4#egg=ckan'
   ```
