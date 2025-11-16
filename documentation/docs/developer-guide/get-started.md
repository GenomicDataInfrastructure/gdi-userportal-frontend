---
slug: /developer-guide/get-started
sidebar_label: "Get started"
sidebar_position: 2
---

# Get started

:::info content in progress

We are working on this guide.

:::


This guide helps you set up a complete development environment for the GDI User Portal platform, including all necessary tools and dependencies.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **Git** for version control
- **Docker** and **Docker Compose** for containerised services
- **Java 11+** (for backend services)
- **PostgreSQL** (for local database development)

## Development environment setup

### 1. Clone the repository

```bash
git clone https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend.git
cd gdi-userportal-frontend
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment configuration

Copy the example environment file and configure for local development:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your local configuration settings:

```env
# API Configuration
NEXT_PUBLIC_DDS_API_URL=http://localhost:8080
NEXT_PUBLIC_AMS_API_URL=http://localhost:8081

# Authentication
NEXT_PUBLIC_KEYCLOAK_URL=http://localhost:8443
NEXT_PUBLIC_KEYCLOAK_REALM=your-realm
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=your-client-id

# Feature Flags
NEXT_PUBLIC_SHOW_BASKET_AND_LOGIN=true
```

### 4. Start development services

Use Docker Compose to start the required backend services:

```bash
docker-compose -f docker-compose.dev.yml up -d
```

This starts:
- CKAN instance with GDI extensions
- PostgreSQL database
- Keycloak authentication server
- Dataset Discovery Service
- Access Management Service

### 5. Start the development server

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`.

## Project structure

Understanding the codebase organisation:

```
src/
├── app/                 # Next.js 13+ app directory
│   ├── (pages)/        # Page components
│   ├── api/            # API route handlers
│   └── globals.css     # Global styles
├── components/          # Reusable React components
│   ├── ui/             # UI components (buttons, forms, etc.)
│   └── features/       # Feature-specific components
├── config/             # Configuration files
├── hooks/              # Custom React hooks
├── providers/          # Context providers
└── utils/              # Utility functions
```

## Local development workflow

### 1. Feature development
- Create feature branches from `main`
- Use descriptive commit messages
- Follow the established coding conventions
- Write tests for new functionality

### 2. Testing
Run the test suite before committing:

```bash
npm test           # Unit tests
npm run test:e2e   # End-to-end tests
npm run lint       # Linting
npm run type-check # TypeScript checking
```

### 3. Code quality
Maintain code quality with automated tools:

```bash
npm run prettier  # Format code
npm run eslint    # Check for linting issues
```

## Backend services integration

### Dataset Discovery Service
The DDS provides abstraction over CKAN APIs. For local development:

- Repository: [gdi-userportal-dataset-discovery-service](https://github.com/GenomicDataInfrastructure/gdi-userportal-dataset-discovery-service)
- Local URL: `http://localhost:8080`

### Access Management Service  
The AMS handles access requests and user permissions:

- Repository: [gdi-userportal-access-management-service](https://github.com/GenomicDataInfrastructure/gdi-userportal-access-management-service)
- Local URL: `http://localhost:8081`


