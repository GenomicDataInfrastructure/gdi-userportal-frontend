---
title: Test extensions
sidebar_position: 3
---

<!--
SPDX-FileCopyrightText: 2024 Stichting Health-RI

SPDX-License-Identifier: CC-BY-4.0
-->

# Test CKAN extensions

Implement effective testing strategies and configure test environments for CKAN extensions.

## Testing Strategy

Testing strategy for a plugin depends on plugin functionality. CKAN provides helper functions for generating dummy data in the database or cleaning the database afterwards.

**Official documentation**: [Testing extensions documentation](https://docs.ckan.org/en/2.10/extensions/testing-extensions.html)

## Configure Testing Environment

Ensure the following settings are configured correctly:

### 1. Install pytest-ckan

Make sure `pytest-ckan` is installed in the virtual environment. Normally this dependency is listed in `dev-requirements.txt` of a plugin and gets installed automatically.

If you don't see it in `pip list` output:

```bash
pip install pytest-ckan
```

### 2. Configure test.ini File

Each plugin has an auto-generated `test.ini` file. Make sure it points to the `test-core.ini` file of your CKAN installation:

```ini
[app:main]
use = config:/etc/ckan/default/src/ckan/test-core.ini
```

### 3. Modify test-core.ini

Modify `test-core.ini` so configuration is correct. Most likely you need to modify the `sqlalchemy.url` parameter to contain correct connection information:

```ini
sqlalchemy.url = postgresql://<user>:<password>@localhost/<db_name>
```

:::info Test Database
If testing of your plugin requires writing to the database, it is recommended to set up a separate test instance of PostgreSQL database.
:::

## Run Tests

### Basic Test Execution

Tests can be run via a simple command:

```bash
pytest --ckan-ini=test.ini
```

### Extended Test Execution with Options

Run tests with coverage:

```bash
<path to virtual environment>/default/bin/pytest --ckan-ini=test.ini --disable-warnings ./ckanext/fairdatapoint --cov ./ckanext/fairdatapoint -vv
```

### Run Tests in PyCharm

To run tests per file or individual unit test within PyCharm, ensure the following user environment variable is set:

```bash
CKAN_INI=test.ini
```

## Common Test Patterns

### Using CKAN Test Helpers

CKAN provides test helpers for common operations:

```python
import ckan.tests.helpers as helpers

# Create test data
dataset = helpers.call_action('package_create', name='test-dataset')

# Clean up test data
helpers.reset_db()
```

### Database Testing

For plugins that interact with the database:

```python
import ckan.tests.factories as factories

# Create test factories
org = factories.Organization()
dataset = factories.Dataset(owner_org=org['id'])
```

## Test Coverage

Monitor test coverage to ensure adequate testing:

```bash
pytest --ckan-ini=test.ini --cov=./ckanext/your_extension --cov-report=html
```

View coverage report in `htmlcov/index.html`.

## Continuous Integration

For CI/CD pipelines, ensure:

- Test database is configured
- All dependencies are installed
- Environment variables are set correctly
- Tests run in isolation

## Troubleshooting

### Database Connection Errors

Verify PostgreSQL is running and connection string is correct in `test-core.ini`.

### Import Errors

Ensure the extension is installed in the virtual environment:

```bash
pip install -e .
```

### Configuration Errors

Check that `test.ini` points to the correct `test-core.ini` file path.

## Next Steps

- [Understand CKAN schemas](./understand-ckan-schemas.md) - Learn schema structure
- [CKAN resources](./ckan-resources.md) - Find testing documentation
- [Add metadata fields](../work-with-metadata/add-new-metadata-fields.md) - Extend functionality
