---
slug: /developer-guide/add-modify-features
sidebar_label: "Add and Modify Features"
sidebar_position: 6
---

# Add and modify features

:::info content in progress

We are working on this guide.

:::


This section covers advanced development topics including metadata field management, extension development, and comprehensive testing strategies for adding new features to the GDI User Portal.

## Feature development overview

Adding new features to the GDI User Portal typically involves:

1. **Frontend development** - User interface and experience
2. **Backend integration** - API endpoints and data processing  
3. **Metadata management** - Schema updates and field additions
4. **Testing** - Comprehensive testing across all layers
5. **Documentation** - User and developer documentation

## Metadata field management

### Manage metadata fields
Adding, modifying, or deleting metadata fields requires updates across multiple components of the CKAN ecosystem.

#### Process overview
When adding new metadata fields, you must update:

1. **CKAN DCAT model** - Core schema definition
2. **Solr search integration** - Search indexing
3. **FAIR Data Point** - SHACL shapes
4. **SeMPyRO** - Metadata automation
5. **Discovery Service** - API mapping

#### CKAN DCAT model updates
For DCAT-AP 3 compliant fields:

```bash
# 1. Fork and clone the repository
git clone https://github.com/ckan/ckanext-dcat
cd ckanext-dcat

# 2. Add the new field to the schema
# Edit: ckanext/dcat/schemas/dcat_ap_full.yaml
```

Example schema addition:
```yaml
dataset_fields:
  - field_name: custom_field
    label: Custom Field
    preset: text
    help_text: Description of the custom field
    validators: ignore_missing unicode_safe
    form_snippet: text.html
    display_snippet: text.html
```

#### Solr Search Configuration
To make fields searchable:

```xml
<!-- schema.xml -->
<!-- 1. Define the field type and name -->
<field name="custom_field" type="string" indexed="true" stored="true" />

<!-- 2. Add to search fields -->
<copyField source="custom_field" dest="text" />
```

After changes, rebuild the search index:
```bash
ckan -c /etc/ckan/default/ckan.ini search-index rebuild
```

#### FAIR Data Point integration
Add SHACL shapes in FDP:

```turtle
[
  sh:path my:custom-field ;
  sh:nodeKind sh:Literal ;
  sh:minCount 0 ;
  dash:viewer dash:LiteralViewer ;
  dash:editor dash:TextFieldEditor ;
]
```

#### SeMPyRO integration
Add property to relevant class:

```python
custom_field: Optional[str] = Field(
    default=None,
    description="Custom field description",
    rdf_term=CUSTOM.customField,
    rdf_type="rdfs_literal"
)
```

#### Discovery Service mapping
Update OpenAPI definitions and mapping:

```java
// OpenAPI definition update
public class RetrievedDataset {
    @Schema(description = "Custom field value")
    private String customField;
    // getters and setters
}

// Mapping update in PackageShowMapper.java
.customField(source.getCustomField())
```

For complete metadata field procedures, see [Metadata field management](./add-update-metadata-fields/).

## Extension development

### Develop extensions
CKAN extensions provide powerful capabilities to enhance catalogue functionality.

#### Extension structure
```
ckanext-your-extension/
├── ckanext/
│   └── your_extension/
│       ├── __init__.py
│       ├── plugin.py          # Main plugin class
│       ├── views.py           # Web controllers
│       ├── helpers.py         # Template helpers
│       ├── validators.py      # Form validation
│       └── templates/         # Custom templates
├── setup.py
└── requirements.txt
```

#### Plugin development
```python
# ckanext/your_extension/plugin.py
import ckan.plugins as plugins
import ckan.plugins.toolkit as toolkit

class YourExtensionPlugin(plugins.SingletonPlugin):
    plugins.implements(plugins.IConfigurer)
    plugins.implements(plugins.IPackageController)
    
    def update_config(self, config_):
        toolkit.add_template_directory(config_, 'templates')
        toolkit.add_public_directory(config_, 'public')
        toolkit.add_resource('assets', 'your_extension')

    def before_dataset_index(self, dataset_dict):
        # Custom indexing logic
        return dataset_dict

    def after_dataset_create(self, context, pkg_dict):
        # Post-creation processing
        pass
```

#### Custom Validators
```python
# ckanext/your_extension/validators.py
import ckan.plugins.toolkit as toolkit

def custom_validator(value):
    if not value:
        raise toolkit.Invalid('This field is required')
    
    if len(value) < 3:
        raise toolkit.Invalid('Value must be at least 3 characters')
    
    return value

def get_validators():
    return {
        'custom_validator': custom_validator,
    }
```

#### Template Customization
```html
<!-- templates/package/read.html -->
{% ckan_extends %}

{% block package_additional_info %}
  {{ super() }}
  <tr>
    <th scope="row">{{ _('Custom Field') }}</th>
    <td>{{ pkg.custom_field or _('Not specified') }}</td>
  </tr>
{% endblock %}
```

## Testing Strategies

### Write and Run Tests
Comprehensive testing ensures feature reliability and maintainability.

#### Frontend Testing
```typescript
// components/__tests__/dataset-card.test.tsx
import { render, screen } from '@testing-library/react';
import { DatasetCard } from '../dataset-card';

describe('DatasetCard', () => {
  const mockDataset = {
    id: 'test-dataset',
    title: 'Test Dataset',
    description: 'Test description',
    organization: { name: 'Test Org' },
  };

  it('renders dataset information correctly', () => {
    render(<DatasetCard dataset={mockDataset} />);
    
    expect(screen.getByText('Test Dataset')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('Test Org')).toBeInTheDocument();
  });

  it('handles missing optional fields gracefully', () => {
    const minimalDataset = { id: 'test', title: 'Test' };
    render(<DatasetCard dataset={minimalDataset} />);
    
    expect(screen.getByText('Test')).toBeInTheDocument();
    // Should not crash when optional fields are missing
  });
});
```

#### API Integration Testing
```typescript
// api/__tests__/datasets.test.ts
import { GET } from '../datasets/route';
import { NextRequest } from 'next/server';

// Mock external dependencies
jest.mock('@/utils/dds-client');

describe('/api/datasets', () => {
  it('returns datasets successfully', async () => {
    const request = new NextRequest('http://localhost:3000/api/datasets');
    const response = await GET(request);
    
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('datasets');
    expect(Array.isArray(data.datasets)).toBe(true);
  });

  it('handles search queries', async () => {
    const request = new NextRequest('http://localhost:3000/api/datasets?q=test');
    const response = await GET(request);
    
    expect(response.status).toBe(200);
    // Verify search functionality
  });
});
```

#### E2E Testing
```typescript
// e2e/dataset-discovery.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Dataset Discovery', () => {
  test('user can search for datasets', async ({ page }) => {
    await page.goto('/datasets');
    
    // Search for datasets
    await page.fill('[data-testid="search-input"]', 'genomic');
    await page.click('[data-testid="search-button"]');
    
    // Verify results
    await expect(page.locator('[data-testid="dataset-card"]')).toHaveCount.greaterThan(0);
    await expect(page.locator('text=genomic')).toBeVisible();
  });

  test('user can filter by category', async ({ page }) => {
    await page.goto('/datasets');
    
    // Apply category filter
    await page.click('[data-testid="filter-category"]');
    await page.click('text=Health');
    
    // Verify filtered results
    await expect(page.locator('[data-testid="active-filter"]')).toHaveText('Health');
  });
});
```

#### Extension Testing
```python
# tests/test_plugin.py
import pytest
import ckan.tests.factories as factories
import ckan.tests.helpers as helpers
from ckanext.your_extension.plugin import YourExtensionPlugin

@pytest.mark.usefixtures("clean_db", "with_plugins")
class TestYourExtension:
    
    def test_custom_validator(self):
        dataset = factories.Dataset(custom_field='test value')
        assert dataset['custom_field'] == 'test value'
    
    def test_before_dataset_index(self):
        plugin = YourExtensionPlugin()
        dataset_dict = {'id': 'test', 'title': 'Test Dataset'}
        
        result = plugin.before_dataset_index(dataset_dict)
        
        # Assert custom indexing logic
        assert 'custom_index_field' in result
```

## Performance Considerations

### Optimization Strategies
- **Database Indexing** - Ensure proper indexes for new fields
- **Caching** - Implement appropriate caching for expensive operations
- **Lazy Loading** - Load heavy components only when needed
- **Bundle Optimization** - Minimize JavaScript bundle size

### Monitoring
```typescript
// utils/performance-monitor.ts
export class PerformanceMonitor {
  static trackUserInteraction(action: string, metadata?: Record<string, any>) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, {
        ...metadata,
        timestamp: Date.now(),
      });
    }
  }

  static trackAPICall(endpoint: string, duration: number, success: boolean) {
    this.trackUserInteraction('api_call', {
      endpoint,
      duration,
      success,
    });
  }
}
``` 