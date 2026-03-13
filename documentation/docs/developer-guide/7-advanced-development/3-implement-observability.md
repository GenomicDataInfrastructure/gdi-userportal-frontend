---
slug: /developer-guide/implement-observability
sidebar_label: "Implement observability"
sidebar_position: 3
description: Add logging, metrics, and tracing to monitor application health in prod
---
<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

# Implement observability

Add logging, metrics, and tracing to monitor application health.

## Logging

### Frontend logging

Use structured logging:

```typescript
import { logger } from '@/lib/logger';

logger.info('Dataset fetched', { datasetId, userId });
logger.error('Fetch failed', { error, context });
```

### Backend logging

Use SLF4J with Quarkus:

```java
@Inject
Logger log;

public Dataset findById(Long id) {
    log.info("Fetching dataset {}", id);
    Dataset dataset = repository.findById(id);
    log.debug("Found dataset: {}", dataset);
    return dataset;
}
```

## Metrics

### Quarkus metrics

Enable Micrometer metrics in `application.properties`:

```properties
quarkus.micrometer.enabled=true
quarkus.micrometer.export.prometheus.enabled=true
```

Access metrics at `/q/metrics`.

### Custom metrics

Track business metrics:

```java
@Inject
MeterRegistry registry;

public void recordDatasetCreation() {
    registry.counter("datasets.created").increment();
}
```

## Distributed tracing

Enable OpenTelemetry for request tracing across services:

```properties
quarkus.opentelemetry.enabled=true
quarkus.opentelemetry.tracer.exporter.otlp.endpoint=http://jaeger:4317
```

View traces in Jaeger UI to debug cross-service issues.
