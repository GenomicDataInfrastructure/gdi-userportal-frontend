---
title: Set up local development
sidebar_position: 1
---

<!--
SPDX-FileCopyrightText: 2024 Stichting Health-RI

SPDX-License-Identifier: CC-BY-4.0
-->

# Set up local CKAN extension development

Set up a local development environment to develop and test CKAN extensions.

## Prerequisites

- Python 3 installed
- PostgreSQL installed and running
- Virtual environment tools (venv)
- Git for version control

## Step 1: Set Up Virtual Environment

Create and activate a virtual environment:

```bash
sudo mkdir -p /etc/ckan/default/  # or other directory of choice
sudo chown `whoami` /etc/ckan/default
python3 -m venv /etc/ckan/default
source /etc/ckan/default/bin/activate
pip install setuptools
pip install --upgrade pip
```

**Note**: The virtual environment should stay activated during the entire installation process.

## Step 2: Install CKAN

Install CKAN as a package into the virtual environment:

```bash
pip install -e 'git+https://github.com/ckan/ckan.git@ckan-2.10.5#egg=ckan[requirements]'
```

For development purposes with additional tools:

```bash
pip install -e 'git+https://github.com/ckan/ckan.git@ckan-2.10.5#egg=ckan[requirements,dev]'
```

### Troubleshooting Installation

Installation of dependencies may fail due to compatibility issues. Common problems are documented in the [troubleshoot setup guide](../setup-environment/troubleshooting-setup.md).

**psycopg2 build failure**: If installation of `psycopg2` fails, modify CKAN requirements.txt located at `<venv directory>/src/ckan/requirements.txt`, change `psycopg2==2.9.7` to `psycopg2-binary==2.9.9`, then rerun:

```bash
pip install -r <venv directory>/src/ckan/requirements.txt
pip install -r <venv directory>/src/ckan/dev-requirements.txt
pip install -e 'git+https://github.com/ckan/ckan.git@ckan-2.10.5#egg=ckan'
```

**PyYAML compatibility**: For CKAN v2.9.10, if you encounter `TypeError: load() missing 1 required positional argument: 'Loader'`, downgrade PyYAML to version 5.3.1 in requirements.txt.

## Step 3: Install Required Extensions

An extension can be cloned first to a desired location and then installed to the virtual environment from file:

```bash
pip install -e file:///<path to local extension repo>/ckan-fairdatapoint#egg=ckanext-fairdatapoint
```

**Example on macOS**:
```bash
pip install -e file:///Users/<username>/Github/gdi-userportal-ckanext-fairdatapoint#egg=ckanext-fairdatapoint
```

**Or install directly from GitHub**:
```bash
pip3 install -e git+https://github.com/ckan/ckanext-dcat.git@v2.1.0#egg=ckanext-dcat
```

### Install Extension Dependencies

Then install dependencies:

```bash
pip install -r <path to local extension repo>/requirements.txt
pip install -r <path to local extension repo>/dev-requirements.txt
```

**Example for ckanext-harvest**:
```bash
pip3 install -r https://raw.githubusercontent.com/ckan/ckanext-harvest/master/requirements.txt
pip3 install -r https://raw.githubusercontent.com/ckan/ckanext-harvest/master/dev-requirements.txt
```

## Step 4: Database Configuration

Set up a PostgreSQL database and specify the database connection string in `ckan.ini` and `test-core.ini`:

```
sqlalchemy.url = postgresql://<user>:<password>@localhost/<db_name>
```

## Integration with Docker Build

To contribute to a CKAN extension and run it on your local machine, it must be integrated into the Docker build that will run as your backend service, connected to your DDS instance.

For detailed instructions, see [Installing new extensions](https://github.com/GenomicDataInfrastructure/gdi-userportal-ckan-docker?tab=readme-ov-file#5-installing-new-extensions) in the CKAN Docker repository.

## Next Steps

- [Understand CKAN schemas](./understand-ckan-schemas.md) - Learn about schema structure
- [Test extensions](./test-extensions.md) - Set up testing environment
- [CKAN resources](./ckan-resources.md) - Access documentation and community help
