---
slug: /developer-guide/optimise-performance
sidebar_label: "Optimise performance"
sidebar_position: 1
description: Optimise frontend, backend, and CKAN application performance
---
<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

# Optimise performance

Profile and optimise GDI application performance.

## Frontend performance

### React optimisation

Use React DevTools Profiler to identify slow components:

```tsx
import { memo } from 'react';

// Memoize expensive components
export const DatasetList = memo(({ datasets }) => {
  return datasets.map(dataset => <DatasetCard key={dataset.id} {...dataset} />);
});
```

### Bundle analysis

Analyse bundle size:

```bash
npm run build
npm run analyze
```

Reduce bundle size with dynamic imports:

```tsx
const HeavyComponent = dynamic(() => import('./HeavyComponent'));
```

## Backend performance

### Database optimisation

Add indexes for frequent queries:

```sql
CREATE INDEX idx_dataset_owner ON datasets(owner_id);
```

Use connection pooling in `application.properties`:

```properties
quarkus.datasource.jdbc.max-size=20
quarkus.datasource.jdbc.min-size=5
```

### Caching

Cache frequent queries with `@CacheResult`:

```java
@CacheResult(cacheName = "datasets")
public Dataset findById(Long id) {
    return repository.findById(id);
}
```

## CKAN performance

Optimise Solr queries and enable result caching. See CKAN performance documentation.
