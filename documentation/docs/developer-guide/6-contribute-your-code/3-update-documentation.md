---
slug: /developer-guide/contribute-your-code/update-documentation
sidebar_label: "Update documentation"
sidebar_position: 3
description: Keep documentation synchronized with code changes in comments and guides
---
<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

# Update documentation

Keep documentation synchronised with code changes.

## When to update docs

Update documentation when you:
- Add new features or APIs
- Change existing behaviour
- Fix bugs that affect usage
- Update configuration options

## Types of documentation

### Code comments

Add inline comments for complex logic:

```java
// Calculate retention period based on data sensitivity level
// Level 1 (public): 5 years, Level 2 (internal): 3 years, Level 3 (sensitive): 1 year
int retentionYears = calculateRetention(dataset.getSensitivityLevel());
```

### API documentation

Use OpenAPI annotations:

```java
@Operation(summary = "Create a new dataset")
@APIResponse(responseCode = "201", description = "Dataset created")
@APIResponse(responseCode = "400", description = "Invalid input")
@POST
public Response createDataset(Dataset dataset) {
    // ...
}
```

### User guides

Update markdown files in `content/developer-guide/` for developer-facing changes or `content/user-guide/` for user-facing features.

## SPDX headers

Add licence headers to new files:

```markdown
<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->
```
