---
slug: /developer-guide/update-documentation
sidebar_label: "Update documentation"
sidebar_position: 3
description: Keep documentation synchronised with code changes in comments and guides
---

<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

# Update documentation

Keep documentation synchronised with code changes across inline comments, API docs, and user-facing guides.

In this guide

> [When to update documentation](#when-to-update-documentation)  
> [Write inline code comments](#write-inline-code-comments)  
> [Document APIs with OpenAPI](#document-apis-with-openapi)  
> [Update user guides](#update-user-guides)  
> [Add SPDX licence headers](#add-spdx-licence-headers)

## When to update documentation

Update documentation whenever you:

- Add new features or APIs
- Change existing behaviour
- Fix bugs that affect usage
- Update configuration options
- Modify deployment procedures

## Write inline code comments

Add comments to explain complex logic, business rules, or non-obvious implementations:

```java
// Calculate retention period based on data sensitivity level
// Level 1 (public): 5 years, Level 2 (internal): 3 years, Level 3 (sensitive): 1 year
int retentionYears = calculateRetention(dataset.getSensitivityLevel());
```

**Guidelines:**

- Focus on the "why", not the "what"
- Keep comments concise and up to date
- Use British English spelling

## Document APIs with OpenAPI

GDI uses API-first development. API contracts are defined in OpenAPI YAML files located in `src/main/openapi/` before implementation.

**For details on working with OpenAPI specifications:**

- **[Add metadata fields](/developer-guide/add-metadata-fields#discovery-service):** Shows the complete OpenAPI workflow including updating YAML files and regenerating code.
- **[Add API endpoint](/developer-guide/add-api-endpoint):** General guidance on API development.

View generated API documentation at `http://localhost:8080/q/swagger-ui/` during development.

## Update user guides

The documentation site uses [Docusaurus](https://docusaurus.io/), a modern static site generator built with React.

### Documentation structure

Update the appropriate guide based on your changes:

- **`docs/user-guide/`:** End-user documentation for data requesters and catalogue managers
- **`docs/catalog-managers-guide/`:** End-user documentation for catalogue managers (users of CKAN admin interface)
- **`docs/developer-guide/`:** Developer onboarding, setup, and contribution guides (you're here!)
- **`docs/system-admin-guide/`:** Deployment and operations documentation

### Run documentation locally

Test your documentation changes locally before committing:

```bash
cd documentation
npm install
npm start
```

The documentation site opens at `http://localhost:3000` with live reload.

### Write effective documentation

Follow these guidelines:

- **Use sentence case:** For headers (capitalise only the first word unless it's a proper noun)
- **Write in active voice:** "Select the button" instead of "The button should be selected"
- **Use British English spelling:** "organise" not "organize", "behaviour" not "behavior"
- **Keep it concise:** Get to the point quickly
- **Add code examples:** Show, don't just tell
- **Include screenshots:** for UI changes (save in `documentation/static/img/`)

### Markdown features

Docusaurus supports MDX with additional components:

**Admonitions:**

```markdown
:::tip
Helpful tip for readers
:::

:::warning
Important warning
:::

:::info Note
Additional context
:::
```

**Code blocks with syntax highlighting:**

````markdown
```typescript
const greeting: string = "Hello, GDI!";
```
````

**Tabs:**

```markdown
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="npm" label="npm">
    npm install
  </TabItem>
  <TabItem value="yarn" label="Yarn">
    yarn install
  </TabItem>
</Tabs>
```

### Reference other pages

Link to other documentation pages using relative paths or slugs:

```markdown
See [Set up frontend](/developer-guide/set-up-frontend) for more details.
```

## Add SPDX licence headers

Add licence headers to all new files to comply with REUSE standards:

**For Markdown files:**

```markdown
<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->
```

**For code files:**

```java
// SPDX-FileCopyrightText: 2024 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0
```

Check licence compliance with:

```bash
reuse lint
```

## Learn more

- [Documentation README](https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/blob/main/documentation/README.md) - Technical details about the documentation site
- [Docusaurus documentation](https://docusaurus.io/docs) - Official Docusaurus guides
- [REUSE guidelines](https://reuse.software/) - Licence compliance standards
