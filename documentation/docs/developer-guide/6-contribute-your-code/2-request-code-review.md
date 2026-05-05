---
slug: /developer-guide/request-code-review
sidebar_label: "Request code review"
sidebar_position: 2
description: Submit pull requests for review with description and testing checklist
---

<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

# Request code review

Submit pull requests for code review before merging.

## Pull request checklist

Before requesting review:

- [ ] All tests pass
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] SPDX headers added
- [ ] No merge conflicts

## Write PR description

Include:

- **What**: Summary of changes
- **Why**: Motivation and context
- **How**: Implementation approach
- **Testing**: How you verified changes

Example:

```markdown
## Add dataset validation

Implements validation for required metadata fields to prevent incomplete datasets.

### Changes

- New validation endpoint `/api/datasets/validate`
- Schema validation using JSON Schema
- Error messages for missing fields

### Testing

- Unit tests for validator
- Integration tests for endpoint
- Manual testing with invalid payloads
```

## Respond to feedback

- Address review comments promptly
- Ask questions if feedback is unclear
- Update PR with requested changes
- Mark conversations as resolved when complete
