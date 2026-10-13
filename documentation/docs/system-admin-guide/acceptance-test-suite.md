---
slug: /system-admin-guide/acceptance-test-suite
sidebar_label: "Acceptance test suite"
sidebar_position: 12
---

# GDI User Portal acceptance test suite

This acceptance test suite defines the validation scope for the GDI User Portal across authentication, GA4GH Passport and Visa processing, dataset entitlements, Beacon authorization, catalogue integration, compliance, and accessibility.

**Acceptance baseline**: All high-priority scenarios must pass, no critical or blocker defects may remain open, and execution evidence must be recorded.

## Document control

| Field                            | Value                                                                       |
| -------------------------------- | --------------------------------------------------------------------------- |
| System Under Test                | GDI User Portal (`gdi-userportal-frontend` and backend services)            |
| Target Environment               | ELIXIR.LU OpenStack - Testing / Staging                                     |
| Authentication and Authorization | Keycloak OIDC, LS-AAI, GA4GH Passports and Visas (`ControlledAccessGrants`) |

## Acceptance scope

The suite verifies that users can authenticate, receive and validate GA4GH visas, view dataset entitlements, apply for dataset access, process approval outcomes, access protected Beacon data only when authorized, discover public dataset metadata, and review their access-application history. It also validates public service information and baseline WCAG 2.2 AA accessibility requirements.

## Test ID policy

This suite uses scalable canonical IDs for all test cases:

- `UP-AUTH-xxx`: Authentication and session management
- `UP-DISC-xxx`: Dataset and application discovery
- `UP-VISA-xxx`: GA4GH Passport and visa validation
- `UP-BEAC-xxx`: Beacon permission enforcement
- `UP-ENT-xxx`: Visa-based entitlement management
- `UP-APPL-xxx`: Dataset application and approval workflow
- `UP-COMP-xxx`: Compliance, standards, and accessibility

## Test cases

### 1. Authentication and session management

| Test ID     | Scenario / Feature                     | Preconditions                                                  | Steps / Execution                                                                                | Expected Result                                                                                                                          | Priority |
| ----------- | -------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| UP-AUTH-001 | Standard Keycloak OIDC login           | Active user exists in the Keycloak realm.                      | Navigate to the portal login. Enter valid credentials.                                           | User authenticates successfully, receives JWT session tokens, and lands on the dashboard.                                                | High     |
| UP-AUTH-002 | LS-AAI federated login                 | LS-AAI identity provider is configured and mapped.             | Select the LifeScience Login identity provider. Complete federated authentication.               | The identity is correctly mapped into Keycloak and a User Portal session is established.                                                 | High     |
| UP-AUTH-003 | Unauthenticated protected-route access | User is logged out.                                            | Navigate directly to `/requests?tab=entitlements`, then to an existing `/applications/{id}` URL. | Each protected route redirects to Keycloak login. After successful login, the user returns to the originally requested route.            | High     |
| UP-AUTH-004 | Expired session handling               | User is logged in and the session or refresh token is expired. | Open a protected route or perform an authenticated action.                                       | The protected request is not processed as authenticated. The user is prompted to authenticate again, and no protected data is displayed. | High     |
| UP-AUTH-005 | Manual logout                          | User is logged in.                                             | Select logout, then use browser history or navigate directly to `/requests`.                     | The local session is cleared, protected content is not restored from cache, and the user must authenticate again.                        | High     |

### 2. Dataset and application discovery

| Test ID     | Scenario / Feature                        | Preconditions                                                                                                                        | Steps / Execution                                                                                                                | Expected Result                                                                                                                                                                                   | Priority |
| ----------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| UP-DISC-001 | CKAN / Solr metadata catalogue search     | Named fixture datasets are indexed, including one known match and one known non-match for each tested keyword, DAC, and disease tag. | Search separately by the documented keyword, DAC, and disease tag fixtures. Record returned dataset identifiers.                 | Every expected fixture identifier is returned, every designated non-match is absent, no result is duplicated, and each result exposes the metadata fields defined as mandatory by the fixture.    | High     |
| UP-DISC-002 | Catalogue-only dataset search             | A named Beacon-backed fixture dataset is indexed.                                                                                    | Open `/datasets`, leave "Include Individual-level data discovery" disabled, and run the documented fixture query.                | Catalogue matches are returned without Beacon record counts or individual-level filters, and no individual-level information is requested or displayed.                                           | High     |
| UP-DISC-003 | Authorized individual-level discovery     | The Beacon-backed fixture is indexed. The tester has valid `ResearcherStatus` and `AcceptedTermsAndPolicies` visas.                  | Enable "Include Individual-level data discovery" and run the documented fixture query.                                           | The expected fixture dataset and its permitted aggregate record count are returned, and the individual-level filters are available. No subject-level records or direct identifiers are displayed. | High     |
| UP-DISC-004 | Unauthorized individual-level discovery   | The tester is authenticated but lacks either `ResearcherStatus` or `AcceptedTermsAndPolicies`.                                       | Attempt to enable "Include Individual-level data discovery" and run the documented fixture query.                                | The UI explains the missing requirement, the protected Beacon query is rejected with HTTP 403, and no Beacon-derived count or individual-level information is displayed.                          | High     |
| UP-DISC-005 | Application history and detail navigation | The authenticated user owns at least two access applications with known identifiers and statuses.                                    | Open `/requests?tab=applications`. Compare the displayed identifiers and statuses with the fixtures. Open each application card. | Only applications visible to the current user are listed once, each status matches the fixture, and each card opens `/applications/{id}` for that application.                                    | High     |

### 3. GA4GH Passport and visa acceptance

| Test ID     | Scenario / Feature                   | Preconditions                                                                                                                | Steps / Execution                                                           | Expected Result                                                                                                                                                                          | Priority |
| ----------- | ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| UP-VISA-001 | LS-AAI Passport-derived entitlement  | The user can authenticate through LS-AAI and has a valid `ControlledAccessGrants` visa for a named fixture dataset.          | Sign in through LS-AAI and open `/requests?tab=entitlements`.               | The expected dataset entitlement is displayed with the granting authority, source, start date, and end date. No token value is exposed in the UI, evidence, or logs.                     | High     |
| UP-VISA-002 | Valid trusted visa grants permission | The user's Passport contains a valid, active visa from a configured trusted issuer for a named protected fixture.            | Sign in and perform the fixture action that requires the visa.              | The action succeeds and exposes only the data authorized by the visa.                                                                                                                    | High     |
| UP-VISA-003 | Invalid visa fails closed            | Test identities are prepared with an untrusted, expired, malformed, or incorrectly signed visa, one condition per execution. | For each identity, attempt the same protected action used in `UP-VISA-002`. | Every invalid visa grants no permission or entitlement, the protected action is denied, and the portal remains available without exposing token values or internal verification details. | High     |
| UP-VISA-004 | Passport retrieval unavailable       | The LS-AAI Passport cannot be retrieved for the authenticated test user.                                                     | Open `/requests?tab=entitlements`.                                          | No entitlement is granted, and the UI presents the Passport-unavailable state with a recovery action and without exposing tokens or internal endpoint details.                           | High     |

### 4. Beacon permission enforcement

| Test ID     | Scenario / Feature        | Preconditions                                                                                                                                                                      | Steps / Execution                                                                 | Expected Result                                                                                                                                                              | Priority |
| ----------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| UP-BEAC-001 | Authorized Beacon query   | User has valid `ResearcherStatus` and `AcceptedTermsAndPolicies` visas. A fixture query and permitted aggregate response are defined.                                              | Submit the fixture query through the portal.                                      | Authorization succeeds and the documented aggregate response is displayed. The portal does not expose subject-level records or direct identifiers.                           | High     |
| UP-BEAC-002 | Unauthorized Beacon query | Test users lack `ResearcherStatus`, `AcceptedTermsAndPolicies`, or both, or have an otherwise-valid signed visa whose `ga4gh_visa_v1.exp` is expired, one condition per execution. | Attempt the fixture query with each test user and observe the permission message. | Every query is denied, including when the enclosing JWT remains valid, the UI identifies the missing requirement or requirements, and no Beacon-derived result is displayed. | High     |

### 5. Visa-based entitlement management

| Test ID    | Scenario / Feature                           | Preconditions                                                                             | Steps / Execution                                                        | Expected Result                                                                                                                                           | Priority |
| ---------- | -------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| UP-ENT-001 | Visa entitlement listing                     | Valid grants for named dataset fixtures have been issued.                                 | Navigate to `/requests?tab=entitlements`.                                | Each valid grant produces an entitlement for the expected dataset identifier, and no dataset without a valid grant is displayed.                          | Medium   |
| UP-ENT-002 | Consolidated entitlement aggregation         | Valid grants are issued by multiple sources or authorities for distinct fixture datasets. | Open `/requests?tab=entitlements` and compare the cards with the grants. | Every distinct valid grant is represented in one list. No entitlement is lost, and the UI does not introduce duplicate cards for a single returned grant. | High     |
| UP-ENT-003 | Entitlement provenance and validity metadata | An active grant includes `source`, `by`, `iat`, and `exp`.                                | View its entitlement card.                                               | The dataset identifier and metadata are shown together with the granting authority (`by`), source, start date, and end date matching the visa claims.     | High     |

### 6. Dataset application and approval workflow

| Test ID     | Scenario / Feature                                    | Preconditions                                                                                                        | Steps / Execution                                                                                                                    | Expected Result                                                                                                                                                                                 | Priority |
| ----------- | ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| UP-APPL-001 | Dataset access application submission                 | User is authenticated and a controlled-access dataset is available.                                                  | Open a controlled-access dataset detail page. Start a new access request. Complete required fields and submit the application.       | The request is created successfully, receives a unique identifier, and is visible with status `Submitted` in the requester view.                                                                | High     |
| UP-APPL-002 | Application approval decision processing              | A submitted application exists and approver workflow is configured.                                                  | As an approver, review the submitted request and approve it. As the requester, refresh application status.                           | The application state transitions to `Approved`, the decision is auditable (actor and timestamp), and the requester sees the updated status without inconsistent states.                        | High     |
| UP-APPL-003 | Approved application visibility and access effects    | An application has been approved for a controlled dataset and the documented grant-propagation interval has elapsed. | As requester, open `/requests?tab=applications`, then `/requests?tab=entitlements`.                                                  | The application appears once with status `Approved`; when policy issues a visa, the matching dataset entitlement appears within the documented interval with the expected source and authority. | High     |
| UP-APPL-004 | Application rejection handling and requester feedback | A submitted application exists and approver workflow is configured.                                                  | As an approver, reject a submitted request with a reason. As the requester, refresh application status and open application details. | The application state transitions to `Rejected`, rejection reason and decision timestamp are visible to the requester, and no access grant is added to entitlements.                            | High     |
| UP-APPL-005 | Required-field validation                             | User is authenticated and has started a draft application.                                                           | Leave each required field empty in turn and attempt submission.                                                                      | Submission is blocked, each invalid field has an associated error message, focus moves to or is announced at the first error, and no submitted application is created.                          | High     |
| UP-APPL-006 | Unauthorized decision attempt                         | A submitted application exists and the tester is neither its authorized approver nor an administrator.               | Attempt to approve or reject the application through the UI and API.                                                                 | Decision controls are unavailable and the API returns HTTP 403. The application status and audit history remain unchanged.                                                                      | High     |

### 7. Compliance, standards, and accessibility

| Test ID     | Scenario / Feature               | Preconditions                                                                  | Steps / Execution                                                                                                                                                               | Expected Result                                                                                                                                                                       | Priority |
| ----------- | -------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| UP-COMP-001 | Public service catalogue access  | User is unauthenticated.                                                       | Open `/services` directly and follow every service link shown on the page.                                                                                                      | The service catalogue loads without authentication, each configured service entry is present, and every link resolves without a 4xx or 5xx response.                                  | High     |
| UP-COMP-002 | Automated WCAG 2.2 AA scan       | A deployed portal build and the project-approved scanner/version are recorded. | Scan `/`, `/datasets`, one dataset detail page, `/services`, login, `/requests`, and one application form at desktop and mobile viewports.                                      | The report contains no unapproved critical or serious WCAG 2.2 A/AA violations. Every approved exception has an owner, rationale, and expiry date.                                    | High     |
| UP-COMP-003 | Keyboard and focus accessibility | The same route and workflow fixtures as `UP-COMP-002` are available.           | Complete login, dataset search, individual-level toggle, application submission, and logout using only the keyboard. Exercise dialogs, validation errors, and navigation menus. | Every interactive control is reachable and operable; focus is visible and follows a logical order; dialogs trap and restore focus; and validation errors are announced and focusable. | High     |

## Execution and evidence

For every test case, record the execution date, tester, environment, build or release identifier, result, defect reference, and supporting evidence such as screenshots, logs, API responses, or scan reports.

Detailed protocol and cryptographic checks—including JWT parsing, `jku` validation, issuer-to-JWKS origin binding, signature algorithms, and JWKS timeout behavior—belong to the automated integration and security suites. Their successful completion for the candidate build is a prerequisite for acceptance sign-off; they are not repeated as manual acceptance cases here.

| Evidence item          | Required content                                                                                      |
| ---------------------- | ----------------------------------------------------------------------------------------------------- |
| Test result            | Pass, fail, blocked, or not run, with execution timestamp.                                            |
| Environment            | Testing or staging endpoint, configuration version, and relevant service health state.                |
| Security evidence      | Automated integration and security suite result, invalid-visa denial outcome, and sanitized logs.     |
| Authorization evidence | Entitlement response, Beacon status code, and UI behavior for both authorized and unauthorized paths. |
| Defect traceability    | Linked defect identifier and severity for every failed or blocked case.                               |

## Acceptance sign-off criteria

1. Achieve a 100% pass rate for every test case whose Priority is `High`.
2. Confirm that no critical or blocker defects remain open.
3. Confirm that token exchange, visa validation, and data-access boundaries have no unresolved defects.

**Release gate**: A failed high-priority test, an unresolved critical or blocker defect, or missing evidence for a security or authorization boundary prevents acceptance.
