# Editorial style guide

## Writing style and voice

Use clear, neutral, and device-agnostic language to ensure documentation is applicable across devices, platforms, and users. These guidelines are especially useful for writing instructions and how-to guides.

### Serial comma

Always use serial comma (Oxford comma) when citing three or more items. This avoids ambiguity.

**Bad**: You need the security combination, code and key. (Do I need one? Two? Or three things?)
**Good**: You need the security combination, code, and key. (Clear. Three requirements.)

**Bad**: I informed my parents, Gary and Lena. (Did you inform two people?)
**Good**: I informed my parents, Gary, and Lena. (Clear. Four people—your parents and two others).

### Active voice not passive

Use active voice whenever possible. This improves clarity and conciseness, and helps users understand who is doing what.

**Bad**: The file must be uploaded to a secure folder. The file is reviewed by the data engineer.
**Good**: Upload the file to a secure folder. The data engineer reviews the file daily.

**Bad**: Roles and Permissions Configuration
**Good**: Manage Roles and Permissions

Use passive voice only when the actor is unknown or irrelevant, or if the outcome is more important than the actor.

**Good**:

- Data is ingested every Monday at 09:00 (CET) (Emphasis on data ingestion)
- During the security breach, all data were deleted. (The actor is unknown)

### "Select" not "click"

Use device-agnostic language.

**Bad**: Click Submit.
**Good**: Select Submit.

### "Enter" not "type"

Use device-agnostic language.

**Bad**: Type your password.
**Good**: Enter your password.

### "They" not "he/she"

Use neutral language.

**Bad**: Contact the affected user and ask for his/her user ID.
**Good**: Contact the affected user and ask for their user ID.

### Navigation terms

Use simple, easy-to-translate words like "Go to" for navigating menus or User Interface (UI).

**Bad**: Navigate to My Profile > Settings.
**Good**: Go to My Profile > Settings.

Use "Open" for launching apps, files, or pages.

**Bad**: Launch the MDC app. Go to the MDC app.
**Good**: Open the MDC app.

State the goal or location before the action, especially for critical actions and tutorials.

**Good**:

- Under the Security section, select Advanced. (Location precedes action)
- To delete all profiles, select Reset. (Critical action. Goal precedes action.)

## Headings and titles

### Don't number headings

Numbered headers are inefficient for two reasons—they cause broken links when renumbered, and they confuse users who arrive from a page or process where the numbering does not reflect their actual journey. Instead of relying on fixed numbers, let the content of each step convey order.

**Bad**: Step 1. Create a Dataset (This may not be the first step for all users)
**Good**: Create a dataset (A clear title conveys the order to the user)

### Do use sentence case for headings and titles

Only capitalise the first word and proper nouns.

**Bad**: How it Works
**Good**: How it works

### Use headers in the correct order

Use H1 for the main title, and use it only once in a document or page. Structure the content logically with H2 > H3 > H4 headers, and avoid skipping levels.

Using proper headers enhances your document in several ways:

- It generates an accurate table of contents.
- It supports accessible navigation for screen readers.
- It enhances linking and search.

## Language and grammar

### UK vs US English

Use UK English by default. We write for European-based partners, and this ensures alignment across content. Avoid switching between UK and US spellings within the same document.

**Bad**: Organization, behavior, analyze
**Good**: Organisation, behaviour, analyse

### Numbered vs bulleted lists

Format your lists accurately according to their purpose to avoid confusion.

- **Numbered list**: to state three or more items whose order cannot change.
- **Bulleted list**: to state three or more items whose order can change.

For longer bullet items, use a "Label: Description" format for better readability.

**Good**:
Key features of MDC include:

- **User access**: Users log in via SSO using their organisation credentials.
- **Deployment options**: MDC supports both cloud and on-premise deployments.

**Tip**: Use a period (.) at the end of a bullet point only when each item completes the introductory sentence.

👉🏻 Also see Formatting numerical data

### Contractions

Avoid using contractions to ensure clarity and maintain consistency with our Tone of Voice. Spell out common contractions—including "don't", "you're", and "it's"—especially in critical instructions or warnings.

If you must use contractions, use them sparingly and only if they improve comprehension and the overall flow of the sentence or paragraph.

**Bad**: Don't restart your device while updates are... (Critical instruction)
**Good**: Do not restart your device while updates are ongoing.

**Bad**: You're required to back up your data… (Spell out or use active voice)
**Good**: You are required to back up... (or The system requires you to back up…)

Other punctations

Use the right punctations to prevent ambiguity, especially in instructions and policy documents.

Quotation marks:

Use double quotation (“ ”) for direct quotations, or literal values that the user must use or provide.

Use single quotation (' ') for quotes within quotes.

Good:

In the search box, enter “Policy 123”.

The announcement says, “Report all ‘Critical Error 555’ warnings to the IT department”.

Hyphens, en dashes, and em dashes:

Hyphen (-) to join compound words

En dash (–) to show ranges or relationships.

Em dash (—) to insert a break or emphasis in thought, or related independent clauses.

Good:

Access reports with real-time monitoring tools. (Hyphen)

Data ingestion runs from 09:00–12:00 daily. (En dash)

The system completed the job—no further action is required. (Em dash. Also works with a period.)

Tips:

Use hyphens for compound adjectives before nouns (example: real-time data)

Don’t use hyphens when the phrase comes after the noun (example: access data in real time).

#### Colons and semicolons

- **Colons (:)**: to introduce examples or clarify items in lists.
- **Semicolons (;)**: to separate closely related independent clauses or items in a complex list.

**Good**:

- Required fields include: email, password, and key. (Colon)
- The system completed the update; no further action is required. (Semicolon. Also works with a period).

## Visual elements

Keep technical diagrams and screenshots simple and consistent. They should support the content, not distract from it.

### Diagrams

Use the same diagramming tool within the documentation, aligning the brand or theme colour schemes.

**Diagramming tools**:

- Mermaid
- Drawio

### Screenshots

#### Red rectangle as click indicator, if needed

Use it to emphasise areas of interaction such as buttons or fields. Avoid it if the element is visually obvious, such as coloured buttons and single targets. Recommended formatting:

- **Line thickness**: 1.5px
- **Outline colour**: #E51F26 (LNDS red)

#### Subtle grey border

Add a solid, subtle grey border in all screenshots to separate them from the body text. Recommended formatting:

- **Line thickness**: 1px
- **Outline colour**: #D2D9DB (LNDS grey) or #DFE1E6 (Subtle grey for Confluence)

#### What to avoid

- Remove personally identifiable information (PII) and sensitive partner data in screenshots.
- Remove shadows and any decorative elements.

**Good**:

### Pictures and icons

Align all other visuals with the accessibility guidelines and our brand identity guides:

- Style of Pictures for Websites
- LNDS Icons and Visuals

Inclusive and accessible writing

Ensure the documentation can be used by everyone, including people who use assistive technology such as screen readers.

Avoid deep nesting of navigation items: When writing instructions,

Avoid more than three levels of navigation: When writing instructions or when creating nested pages, write up to three levels of navigation. Keep the content hierarchy as flat as possible to helps users find information quickly.

Good:

Go to Settings > Security > Password, and enter your password. (Instructions)

Getting Started > Manage Datasets > Add a Dataset. (Nested pages)

Alternative texts to all images: Provide alternative texts (alt texts) that are descriptive, for users reading with assistive technologies.

Bad: alt="Picture of a diagram"
Good: alt="Diagram of ingestion, transformation, and serving"

Use descriptive links: Avoid “click here”. Use the goal or destination as display texts for links.

Bad: Click here for the template.
Good: Download the template.

Introduce tables and lists: Describe their purpose or summary.

## Enumration formats

When enumerating items within a sentence or paragraph, use the following formats for clarity:

- **Key phrase:** Description of the item.

Example:

- **Publishing dataset records:** Create and maintain comprehensive descriptions of genomic datasets
- **Managing data discoverability:** Ensure datasets can be found by researchers through the GDI User Portal
