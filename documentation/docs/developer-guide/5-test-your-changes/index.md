---
slug: /developer-guide/test-your-changes
sidebar_label: "Test your changes"
sidebar_position: 6
---
<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

Test your code across all layers to ensure reliability and catch regressions early.

## Testing strategy

GDI uses comprehensive testing:
- **Unit tests**: Test individual functions and classes
- **Integration tests**: Test component interactions
- **End-to-end tests**: Test complete user flows
- **API contract tests**: Ensure API compatibility

## Choose your testing path

| I want to... | Guide |
|------------|-------|
| Test React components | [Test frontend](test-frontend) |
| Test Java services | [Test backend](test-backend) |
| Test CKAN extensions | [Test CKAN](test-ckan) |
| Test cross-component workflows | [Test integration](test-integration) |
