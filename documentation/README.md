# Documentation site

In this guide
- [Overview](#overview)
- [Features](#features)
- [Technical implementation](#technical-implementation)
- [Project structure](#project-structure)
- [Technologies used](#technologies-used)
- [Local development](#local-development)
- [Contributing to the documentation site](#contributing-to-the-documentation-site)

---

## Overview

This repository contains the source code for the GDI User Portal documentation site.

The documentation is built using [Docusaurus](https://docusaurus.io/), a modern static website generator. It is organized into three main sections, each targeting a specific audience.
features three main guides:
- [User guide](./docs/user-guide/welcome.md): For end users encompassing 2 user groups: 
    - **Data users**/requesters (front office) 
    - **Catalogue managers** (back office / CKAN users)
- [Developer guide](./docs/developer-guide/welcome.md): Instructions for developers on contributing to the platform.
- [System admin guide](./docs/system-admin-guide/welcome.md): Instructions for system admins (Ops) on deploying and maintaining the GDI User Portal.

## Features

This is a Docusaurus documentation site featuring advanced navigation and context-aware search  functionality.

- **Context-aware search:** Search results are automatically filtered based on the current guide section. E.g., When searching from the User Guide, search returns only User Guide results. When on the homepage, search returns results from all sections.

- **Dynamic navigation:** The top navigation bar adapts based on the current page context, hiding irrelevant links on the left navigation.
    - **Top navigation bar:** Quick access to main guide sections (User Guide, System Admin Guide, Developer Guide).
    - **Left navigation bar:** Adapts based on the current page context, hiding irrelevant links. E.g., When in the User Guide, only User Guide topics are shown.

## Technical Implementation

### Custom Components

The following components were created to achieve the desired functionality, on top of standard Docusaurus features:

- **Custom `Navbar` Component**: Handles conditional visibility of navigation items
- **Custom `SearchBar` Component**: Implements scoped search functionality with visual indicators
- **Scoped Search Hook**: Uses `MutationObserver` to filter search results dynamically

### Search Configuration
- **Lunr Search Plugin**: Enhanced with custom metadata for scope detection
- **Dynamic Result Filtering**: Real-time filtering of search results based on current context
- **Visual Scope Indicators**: Shows which section is being searched with colored indicators

### Styling
- **Custom CSS**: Enhanced styling for search scopes and navigation
- **Responsive Design**: Works seamlessly across different screen sizes
- **Theme Integration**: Properly integrated with Docusaurus theming system

### Documentation metadata

Located in `documentation/package.json`

- `browserslist`: Defines target browsers for compatibility. See [documentation site](https://docusaurus.io/docs/browser-support#default-values). Keep Docusaurus defaults unless specific needs arise.
- `engines`: Specifies the required Node.js version for the project (for development and build).

### Engines

```
"engines": {
  "node": ">=18.0"  // Requires Node.js version 18.0 or higher
}
```

## Contrutibuting to the documentation site

## Project Structure

The documentation project is located in the `documentation/` directory and follows this structure:

```
├── docs/                          # Documentation content
│   ├── user-guide/               # User guide documentation
│   ├── system-admin-guide/       # System admin guide documentation
│   ├── developer-guide/          # Developer guide documentation
│   └── key-concepts/             # Shared concepts documentation
├── src/
│   ├── components/               # Reusable React components
│   ├── hooks/                    # Custom React hooks
│   ├── theme/                    # Theme overrides
│   │   ├── Navbar/              # Custom navbar component
│   │   └── SearchBar/           # Custom search component
│   ├── css/                      # Custom styling
│   └── pages/                    # Custom pages
├── static/                       # Static assets
├── docusaurus.config.ts          # Main configuration
└── sidebars.ts                   # Sidebar configuration
```

## Technologies Used

- **Docusaurus 3.x**: Static site generator
- **React 18**: Component framework
- **TypeScript**: Type-safe configuration
- **Lunr.js**: Full-text search engine
- **CSS3**: Custom styling and animations
- **Git**: Version control


## Local development

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development
```bash
npm start
```

### Build
```bash
npm run build
```

### Deployment
```bash
npm run serve
```

---

