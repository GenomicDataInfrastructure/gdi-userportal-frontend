---
slug: /developer-guide/accessibility-compliance
sidebar_label: "Test accessibility compliance"
sidebar_position: 5
description: Manual and automated WCAG 2.2 Level AA release test protocol
---

<!--
SPDX-FileCopyrightText: 2026 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

# Test WCAG 2.2 Level AA accessibility

A successful automated scan is necessary but does not establish WCAG conformance.
Complete this protocol against the deployed release candidate with production-like
data. Test English and French, anonymous and authenticated journeys. Record the
date, tester, build, browser, operating system, assistive technology, result,
evidence, and defect reference for every test.

## Automated release gate

Run:

```bash
npm run test:a11y
```

The suite must report no failures. It scans every application route with axe's
WCAG 2.0, 2.1 and 2.2 A/AA tags, checks focusable names, keyboard interactions,
validation and dynamic states, English and French pages, and 320 CSS pixel reflow.
CI retains the HTML report, axe JSON, traces and screenshots. Also scan the real
identity-provider pages and notification-provider UI, which mocked tests do not
exercise.

## Manual test matrix

Use NVDA with Firefox or Chrome on Windows and VoiceOver with Safari on macOS or
iOS. Include keyboard-only, mouse and touch runs.

### Keyboard, focus and bypass (2.1.1, 2.1.2, 2.1.4, 2.4.1, 2.4.3, 2.4.7, 2.4.11)

1. From the top of each representative page, press Tab and activate the skip link.
2. Complete login, dataset search/filtering, dataset selection, basket, application
   submission and logout without a pointer.
3. Exercise tabs, accordions, menus, date and country pickers, file upload and all
   dialogs with Tab, Shift+Tab, Enter, Space, arrows and Escape.
4. Trigger validation and close every overlay.

Pass when every action is reachable and operable, focus order is logical, the
indicator is clearly visible and not obscured, no trap exists, dialogs contain
focus, and focus returns to the trigger. Single-character shortcuts must be
disabled, remappable or active only while their component has focus.

### Screen-reader semantics and status (1.1.1, 1.3.1, 2.4.2, 2.4.4, 2.4.6, 3.3.1, 3.3.2, 3.3.3, 4.1.2, 4.1.3)

1. Read each page from the top and list headings, landmarks, links, buttons and
   form controls.
2. Exercise expanded, selected, checked, required, invalid and disabled states.
3. Cause loading, empty, success, error and validation states without moving
   screen-reader focus manually.

Pass when titles and headings describe the page, landmarks and labels are logical,
images have appropriate alternatives, controls expose name/role/value/state, link
purpose is understandable, and dynamic messages are announced once with useful
correction instructions.

### Visual presentation and reflow (1.4.1, 1.4.3, 1.4.4, 1.4.10, 1.4.11, 1.4.12)

1. Measure text contrast in default, hover, focus, selected, disabled, success and
   error states. Measure control boundaries, icons and focus indicators.
2. Test at 200% browser zoom, 200% text-only zoom, and a 320 CSS pixel viewport.
3. Increase text spacing to line-height 1.5, paragraph spacing 2, letter spacing
   0.12em and word spacing 0.16em.
4. Inspect long titles, identifiers, URLs, tables, dialogs and translated content.

Pass when normal text is at least 4.5:1, large text and essential non-text UI are
at least 3:1, color is not the only cue, content is not clipped or overlapped, and
two-dimensional page scrolling is unnecessary. Data tables may scroll within
their own labelled region.

### Hover/focus content, motion and timing (1.4.13, 2.2.1, 2.2.2, 2.3.1)

1. Trigger every tooltip and disclosure with hover and keyboard focus; move the
   pointer into it and press Escape.
2. Leave loading and animated states active for more than five seconds, then test
   with reduced motion enabled.
3. Exercise session expiry and every time-limited flow.

Pass when additional content is dismissible, hoverable and persistent; no content
flashes over three times per second; non-essential prolonged motion can be stopped;
and time limits can be extended unless a documented WCAG exception applies.

### Pointer, touch and orientation (1.3.4, 2.5.1, 2.5.2, 2.5.3, 2.5.7, 2.5.8)

1. Test portrait and landscape while forms and dialogs are open.
2. Perform every action with one pointer and verify a non-drag alternative for any
   drag interaction.
3. Press down, move away, and release to confirm accidental activation is avoided.
4. Measure controls at mobile size and use voice control with visible labels.

Pass when orientation is unrestricted, state is retained, accessible names contain
visible labels, controls are at least 24 by 24 CSS pixels or meet a WCAG exception,
and complex gestures or dragging have simple alternatives.

### Forms, authentication and error prevention (1.3.5, 3.3.4, 3.3.7, 3.3.8)

1. Verify browser autofill identifies name, email and telephone purposes correctly.
2. Test the real login, logout, invalid-credential, timeout and recovery journeys
   with password-manager paste and autofill.
3. Reopen a draft, revisit previously entered data, and submit or delete important
   information.

Pass when personal-data fields expose correct autocomplete purposes, previously
entered information is available without unnecessary re-entry, authentication
does not require an unsupported cognitive test, and consequential submissions can
be reviewed, corrected, confirmed or reversed as applicable.

### Language, consistency and realistic content (3.1.1, 3.1.2, 3.2.3, 3.2.4, 3.2.6)

1. Read English and French pages and foreign-language passages with a screen reader.
2. Compare navigation, help, contact mechanisms and repeated icons across routes.
3. Repeat key workflows with long values, missing optional content, large result
   sets, special-character filenames, backend errors and an expired session.

Pass when language changes are announced, repeated functions have consistent names
and placement, help is consistently available, and realistic content does not
break understanding, operation, focus or announcements.

## Sign-off

Do not claim WCAG 2.2 Level AA conformance until all automated and applicable
manual tests pass. Every exception must identify the success criterion, affected
content, user impact, owner, remediation date and approval. Retest resolved defects
and keep the evidence with the release record.
