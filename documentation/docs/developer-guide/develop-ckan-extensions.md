---
slug: /developer-guide/develop-ckan-extensions
sidebar_label: "Develop CKAN extensions"
sidebar_position: 5
---

# Develop CKAN extensions

Learn how to develop and test custom CKAN extensions for the GDI User Portal. This guide covers local development setup, extension structure, and testing procedures.

## Local development setup

To develop and test CKAN extensions locally, you need to set up a proper development environment:

### 1. Set up virtual environment

```bash
sudo mkdir -p /etc/ckan/default/  # or other directory of choice
sudo chown `whoami` /etc/ckan/default
python3 -m venv /etc/ckan/default
source /etc/ckan/default/bin/activate
pip install setuptools
pip install --upgrade pip
```

**Note**: Keep the virtual environment activated during the entire installation process.

### 2. Install CKAN as a package

```bash
pip install -e 'git+https://github.com/ckan/ckan.git@ckan-2.10.5#egg=ckan[requirements]'
# or for development purposes:
pip install -e 'git+https://github.com/ckan/ckan.git@ckan-2.10.5#egg=ckan[requirements,dev]'
```

### 3. Troubleshoot common dependency issues

#### psycopg2 building issues

If installation of `psycopg2` fails:

1. Edit the requirements file at `<venv directory>/src/ckan/requirements.txt`
2. Change `psycopg2==2.9.7` to `psycopg2-binary==2.9.9`
3. Reinstall dependencies and CKAN separately:

```bash
pip install -r <venv directory>/src/ckan/requirements.txt
pip install -r <venv directory>/src/ckan/dev-requirements.txt
pip install -e 'git+https://github.com/ckan/ckan.git@ckan-2.10.5#egg=ckan'
```

#### PyYAML compatibility issues

For CKAN v2.9.10, if you encounter this error:

```
TypeError: load() missing 1 required positional argument: 'Loader'
```

Downgrade PyYAML in requirements.txt from `pyyaml==5.4.1` or `pyyaml==6.0.1` to `pyyaml==5.3.1`.

### 4. Install required extensions

Extensions can be installed from local repositories or directly from GitHub.

#### Install from local repository

```bash
pip install -e file:///<path to local extension repo>/ckan-fairdatapoint#egg=ckanext-fairdatapoint
```

Example on macOS:

```bash
pip install -e file:///Users/<username>/Github/gdi-userportal-ckanext-fairdatapoint#egg=ckanext-fairdatapoint
```

#### Install from GitHub

```bash
pip3 install -e git+https://github.com/ckan/ckanext-dcat.git@v2.1.0#egg=ckanext-dcat
```

#### Install extension dependencies

```bash
pip install -r <path to local extension repo>/requirements.txt
pip install -r <path to local extension repo>/dev-requirements.txt
```

Example for ckanext-harvest:

```bash
pip3 install -r https://raw.githubusercontent.com/ckan/ckanext-harvest/master/requirements.txt
pip3 install -r https://raw.githubusercontent.com/ckan/ckanext-harvest/master/dev-requirements.txt
```

### 5. Configure database

Set up PostgreSQL database and specify database connection strings in both `ckan.ini` and `test-core.ini`.

## Testing CKAN extensions

Testing strategy depends on extension functionality. CKAN provides helper functions for generating dummy data and cleaning databases.

### Testing setup

1. **Install pytest-ckan**: Should be in extension's `dev-requirements.txt`

   ```bash
   pip install pytest-ckan  # if not already installed
   ```

2. **Configure test.ini**: Point to CKAN's test configuration

   ```ini
   [app:main]
   use = config:/etc/ckan/default/src/ckan/test-core.ini
   ```

3. **Configure test-core.ini**: Set correct database connection
   ```ini
   sqlalchemy.url = postgresql://<user>:<password>@localhost/<test_db_name>
   ```

**Recommendation**: Use separate test database instance for extensions requiring database writes.

### Running tests

#### Basic test execution

```bash
pytest --ckan-ini=test.ini
```

#### Test with coverage

```bash
pytest --ckan-ini=test.ini --disable-warnings ./ckanext/fairdatapoint --cov ./ckanext/fairdatapoint -vv
```

#### PyCharm configuration

Set environment variable:

```bash
CKAN_INI=test.ini
```

### Testing best practices

- Review [CKAN testing documentation](https://docs.ckan.org/en/2.10/extensions/testing-extensions.html) for detailed guidance
- Use CKAN helper functions for data generation and cleanup
- Write tests for all extension interfaces and validators
- Test schema changes with various data scenarios
- Include integration tests for API endpoints

## Extension development workflow

For detailed extension development procedures, see:

- [Add and modify features](/developer-guide/add-modify-features) - Complete feature development guide
- [Work with backend services](/developer-guide/work-with-backend) - Integration patterns
- [CKAN extensions documentation](https://docs.ckan.org/en/latest/extensions/index.html) - Official guide

## Next steps

After setting up your development environment:

- **[Add and modify features](/developer-guide/add-modify-features)** - Build complete features
- **[Work with backend services](/developer-guide/work-with-backend)** - Integrate with GDI services
- **[Get started](/developer-guide/get-started)** - Review overall development setup
