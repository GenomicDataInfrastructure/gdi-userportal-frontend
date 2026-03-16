---
slug: /developer-guide/create-custom-extensions
sidebar_label: "Create custom extensions"
sidebar_position: 4
description: Create reusable CKAN extensions with plugin interfaces
---
<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

# Create custom extensions

Create reusable CKAN extensions for custom functionality.

## Extension structure

Create new extension:

```bash
ckan generate extension --name myextension
```

Structure:
```
ckanext-myextension/
├── ckanext/
│   └── myextension/
│       ├── __init__.py
│       ├── plugin.py
│       └── templates/
├── setup.py
└── README.md
```

## Implement plugin interface

Create plugin in `plugin.py`:

```python
import ckan.plugins as plugins
import ckan.plugins.toolkit as toolkit

class MyExtensionPlugin(plugins.SingletonPlugin):
    plugins.implements(plugins.IConfigurer)
    plugins.implements(plugins.IPackageController)

    def update_config(self, config):
        toolkit.add_template_directory(config, 'templates')

    def before_create(self, context, pkg_dict):
        # Custom validation or processing
        return pkg_dict
```

## Register plugin

Add to `setup.py`:

```python
entry_points='''
    [ckan.plugins]
    myextension=ckanext.myextension.plugin:MyExtensionPlugin
'''
```

Enable in CKAN config:

```ini
ckan.plugins = ... myextension
```

## Testing extensions

Write tests:

```python
from ckan.tests import helpers

class TestMyExtension(helpers.FunctionalTestBase):
    def test_plugin_loaded(self):
        assert 'myextension' in helpers.plugins()
```

Run tests:

```bash
pytest ckanext/myextension/tests/
```

See [Test CKAN](/developer-guide/test-ckan) for more testing guidance.
