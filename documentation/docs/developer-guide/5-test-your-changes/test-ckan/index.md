---
slug: /developer-guide/test-your-changes/test-ckan
sidebar_label: "Test CKAN"
sidebar_position: 3
---
<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

Test CKAN extensions with pytest.

## Setup

Install CKAN dev requirements:

```bash
pip install -r dev-requirements.txt
```

## Write tests

Create `test_plugin.py`:

```python
import pytest
from ckan.tests import helpers

class TestMyExtension:
    def test_schema_validation(self):
        dataset = helpers.call_action('package_create', 
            name='test-dataset',
            title='Test Dataset'
        )
        assert dataset['title'] == 'Test Dataset'
```

Run tests:

```bash
pytest ckanext/gdi/tests/
```
