<!--
SPDX-FileCopyrightText: 2025 PNED G.I.E.

SPDX-License-Identifier: Apache-2.0
-->

# Frontend Customization Documentation

## Environment Variables

| Variable Name                        | Explanation                                                | Additional Notes                                                      |
| ------------------------------------ | ---------------------------------------------------------- | --------------------------------------------------------------------- |
| NEXT_PUBLIC_DDS_URL                  | URL for the Data Discovery Service API                     | Ensure this points to the correct environment (dev/staging/prod)      |
| NEXT_PUBLIC_DAAM_URL                 | URL for the Data Access and Authorization Management API   | Ensure this points to the correct environment (dev/staging/prod)      |
| NEXTAUTH_URL                         | The base URL of your application                           | Important for authentication callbacks                                |
| NEXTAUTH_SECRET                      | Secret used to encrypt JWT tokens                          | Should be a long, random string. Rotate regularly for security        |
| KEYCLOAK_CLIENT_ID                   | Client ID for Keycloak authentication                      | Obtained from your Keycloak admin console                             |
| KEYCLOAK_CLIENT_SECRET               | Client secret for Keycloak authentication                  | Obtained from your Keycloak admin console. Keep this secret!          |
| KEYCLOAK_ISSUER_URL                  | URL of the Keycloak realm                                  | Ensure this points to the correct realm                               |
| TRUSTED_VISA_ISSUERS                 | Comma-separated GA4GH Visa issuer URL allow-list           | Required for Visa authorization; unset or invalid rejects all         |
| END_SESSION_URL                      | URL for ending the user's session                          | Used for logout functionality                                         |
| REFRESH_TOKEN_URL                    | URL for refreshing authentication tokens                   | Ensures long-lived sessions                                           |
| CSP_HEADER                           | Content Security Policy header                             | Defines allowed sources for various resource types                    |
| NEXT_PUBLIC_SITE_TITLE               | Title of the site                                          | Displayed in browser tab and potentially in the header                |
| NEXT_PUBLIC_SITE_DESCRIPTION         | Brief description of the site                              | Used for SEO and potentially displayed on the site                    |
| NEXT*PUBLIC_COLOR*\*                 | Various color configurations                               | Used to customize the site's color scheme                             |
| NEXT*PUBLIC_SELECTED_FONT*\*         | Font family selections                                     | Defines the typography for the site                                   |
| NEXT_PUBLIC_FOOTER_TEXT              | Text displayed in the footer                               | Typically contains copyright or funding information                   |
| NEXT*PUBLIC*\*\_URL                  | Various social media and contact URLs                      | Used in the footer for external links                                 |
| NEXT_PUBLIC_ENABLE_MULTILINGUAL      | Enables locale-prefixed English/French UI                  | Defaults to `false`; set to `true` to expose `/en` and `/fr`          |
| NEXT_PUBLIC_CRM_EMBED_ENABLED        | Enables the external CRM embed script in the portal header | Defaults to `false`; enable only after security and provider review   |
| NEXT_PUBLIC_CRM_EMBED_ENVIRONMENT    | Declares the CRM embed environment                         | Must be `test` when the feature is enabled                            |
| NEXT_PUBLIC_CRM_EMBED_TEST_PORTAL_ID | Provider-issued test CRM portal UUID                       | Required when the feature is enabled; production IDs must not be used |

When `NEXT_PUBLIC_CRM_EMBED_ENABLED=true`, the deployment must use a
provider-issued test portal ID and the deployment CSP must explicitly allow the
CRM host for the resource types required by the provider. The script is loaded
only while the user is unauthenticated and is not loaded on protected
`requests` or `applications` routes. At minimum, use the exact origin rather
than a wildcard:

```text
script-src ... https://gdi-crm.dyn.cloud.e-infra.cz;
connect-src ... https://gdi-crm.dyn.cloud.e-infra.cz;
```

Do not use `*`, `https:`, `unsafe-inline`, or `unsafe-eval` to make the widget
load. The embed script executes in the portal origin and must not be enabled
in production or authenticated environments. A failed load is reported in the
browser console and through an accessible fallback message.
