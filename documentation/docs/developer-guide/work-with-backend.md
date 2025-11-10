---
slug: /developer-guide/work-with-backend
sidebar_label: "Work with backend services"
sidebar_position: 4
---

# Work with backend services

The GDI User Portal integrates with multiple backend services to provide comprehensive genomic data infrastructure functionality. This section covers integration patterns, API communication, and service orchestration.

## Backend architecture

### Service overview
The platform consists of several interconnected services:

- **Dataset Discovery Service (DDS)** - Data catalogue API abstraction
- **Access Management Service (AMS)** - Access control and requests  
- **CKAN** - Core data catalogue system
- **Keycloak** - Authentication and authorisation
- **PostgreSQL** - Data persistence
- **Solr** - Search and indexing

### Service communication
Services communicate using:
- REST APIs with JSON payloads
- OAuth2/OpenID Connect for authentication
- Service-to-service authentication tokens
- Event-driven patterns for asynchronous operations

## Dataset Discovery Service integration

### Integrate Dataset Discovery Service
The DDS provides a clean API layer over CKAN, abstracting complex CKAN operations and providing enhanced functionality.

#### API Endpoints
```typescript
// Common DDS endpoints
const DDS_ENDPOINTS = {
  datasets: '/api/v1/datasets',
  dataset: '/api/v1/datasets/{id}',
  search: '/api/v1/search',
  facets: '/api/v1/facets',
  organizations: '/api/v1/organizations'
};
```

#### Dataset Search and Retrieval
```typescript
// utils/dds-client.ts
export class DDSClient {
  private baseUrl: string;
  private token?: string;

  constructor(baseUrl: string, token?: string) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  async searchDatasets(params: SearchParams): Promise<SearchResults> {
    const url = new URL(`${this.baseUrl}/api/v1/search`);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) url.searchParams.append(key, String(value));
    });

    const response = await fetch(url.toString(), {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`DDS API error: ${response.status}`);
    }

    return response.json();
  }

  async getDataset(id: string): Promise<Dataset> {
    const response = await fetch(`${this.baseUrl}/api/v1/datasets/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Dataset not found: ${id}`);
    }

    return response.json();
  }

  private getAuthHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
    };
  }
}
```

#### React Integration
```typescript
// hooks/use-dds.ts
import { useSession } from 'next-auth/react';
import { DDSClient } from '@/utils/dds-client';

export function useDDS() {
  const { data: session } = useSession();
  
  const client = useMemo(() => {
    return new DDSClient(
      process.env.NEXT_PUBLIC_DDS_API_URL!,
      session?.accessToken
    );
  }, [session?.accessToken]);

  return client;
}
```

## Access Management Service integration

### Connect Access Management Service
The AMS handles all aspects of data access requests, user permissions, and compliance tracking.

#### Access Request Flow
```typescript
// types/access-request.ts
export interface AccessRequest {
  id: string;
  datasetId: string;
  userId: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  requestData: {
    purpose: string;
    organization: string;
    ethicsApproval?: string;
    participants: Participant[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface Participant {
  name: string;
  email: string;
  role: 'principal_investigator' | 'researcher' | 'analyst';
  organization: string;
}
```

#### AMS Client Implementation
```typescript
// utils/ams-client.ts
export class AMSClient {
  constructor(private baseUrl: string, private token?: string) {}

  async submitAccessRequest(request: CreateAccessRequest): Promise<AccessRequest> {
    const response = await fetch(`${this.baseUrl}/api/v1/requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to submit access request');
    }

    return response.json();
  }

  async getAccessRequest(id: string): Promise<AccessRequest> {
    const response = await fetch(`${this.baseUrl}/api/v1/requests/${id}`, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Access request not found');
    }

    return response.json();
  }

  async getUserRequests(): Promise<AccessRequest[]> {
    const response = await fetch(`${this.baseUrl}/api/v1/requests`, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user requests');
    }

    const data = await response.json();
    return data.requests;
  }
}
```

## Authentication flow implementation

### Implement authentication flows
Integration with Keycloak and LS-AAI requires careful handling of OAuth2 flows and token management.

#### NextAuth Configuration
```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';

const handler = NextAuth({
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
      issuer: process.env.KEYCLOAK_ISSUER,
      authorization: {
        params: {
          scope: 'openid profile email',
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
});

export { handler as GET, handler as POST };
```

#### Token management
```typescript
// utils/token-manager.ts
export class TokenManager {
  static async getValidToken(session: Session): Promise<string | null> {
    if (!session?.accessToken) return null;

    // Check if token is still valid
    const isValid = await this.validateToken(session.accessToken);
    
    if (isValid) {
      return session.accessToken;
    }

    // Attempt to refresh token
    return this.refreshToken(session.refreshToken);
  }

  private static async validateToken(token: string): Promise<boolean> {
    try {
      const response = await fetch(`${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/userinfo`, {
        headers: { 'Authorisation': `Bearer ${token}` },
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  private static async refreshToken(refreshToken: string): Promise<string | null> {
    // Implement token refresh logic
    // Return new access token or null if refresh fails
  }
}
```

## Error handling and resilience

### Service error handling
Implement robust error handling for service communication:

```typescript
// utils/api-error-handler.ts
export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public service: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export async function handleServiceResponse<T>(
  response: Response,
  serviceName: string
): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new APIError(
      errorData.message || `${serviceName} service error`,
      response.status,
      serviceName
    );
  }

  return response.json();
}
```

### Retry logic
```typescript
// utils/retry-client.ts
export class RetryClient {
  constructor(private maxRetries = 3, private backoffMs = 1000) {}

  async withRetry<T>(operation: () => Promise<T>): Promise<T> {
    let lastError: Error;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt < this.maxRetries && this.isRetryableError(error)) {
          await this.delay(this.backoffMs * Math.pow(2, attempt));
          continue;
        }
        
        throw error;
      }
    }

    throw lastError!;
  }

  private isRetryableError(error: any): boolean {
    return error instanceof APIError && error.status >= 500;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

## Service monitoring and logging

### Health checks
Implement service health monitoring:

```typescript
// utils/health-checker.ts
export class HealthChecker {
  async checkServiceHealth(): Promise<ServiceHealthStatus> {
    const services = ['dds', 'ams', 'keycloak'];
    const healthStatus: ServiceHealthStatus = {};

    await Promise.all(
      services.map(async (service) => {
        try {
          const endpoint = this.getHealthEndpoint(service);
          const response = await fetch(endpoint, { timeout: 5000 });
          healthStatus[service] = {
            status: response.ok ? 'healthy' : 'unhealthy',
            responseTime: response.headers.get('x-response-time') || 'unknown',
          };
        } catch (error) {
          healthStatus[service] = {
            status: 'unreachable',
            error: error.message,
          };
        }
      })
    );

    return healthStatus;
  }

  private getHealthEndpoint(service: string): string {
    const endpoints = {
      dds: `${process.env.DDS_API_URL}/health`,
      ams: `${process.env.AMS_API_URL}/health`,
      keycloak: `${process.env.KEYCLOAK_ISSUER}/health/ready`,
    };
    return endpoints[service];
  }
}
```

## Testing backend integration

### Integration testing
```typescript
// tests/integration/services.test.ts
import { DDSClient } from '@/utils/dds-client';
import { AMSClient } from '@/utils/ams-client';

describe('Service Integration', () => {
  let ddsClient: DDSClient;
  let amsClient: AMSClient;

  beforeEach(() => {
    ddsClient = new DDSClient(process.env.TEST_DDS_URL!);
    amsClient = new AMSClient(process.env.TEST_AMS_URL!);
  });

  it('should search datasets successfully', async () => {
    const results = await ddsClient.searchDatasets({
      q: 'test',
      limit: 10,
    });

    expect(results).toHaveProperty('datasets');
    expect(Array.isArray(results.datasets)).toBe(true);
  });

  it('should handle service errors gracefully', async () => {
    const invalidClient = new DDSClient('http://invalid-url');
    
    await expect(
      invalidClient.searchDatasets({ q: 'test' })
    ).rejects.toThrow('DDS API error');
  });
});
```

### Mocking services
```typescript
// tests/mocks/service-mocks.ts
import { rest } from 'msw';

export const serviceMocks = [
  rest.get(`${process.env.DDS_API_URL}/api/v1/datasets`, (req, res, ctx) => {
    return res(
      ctx.json({
        datasets: mockDatasets,
        total: mockDatasets.length,
      })
    );
  }),

  rest.post(`${process.env.AMS_API_URL}/api/v1/requests`, (req, res, ctx) => {
    return res(
      ctx.json({
        id: 'mock-request-id',
        status: 'submitted',
      })
    );
  }),
];
```

## Next steps

After mastering backend integration:
- **[Add and modify features](../add-modify-features)** - Build complete features
- **[Develop frontend features](../develop-frontend)** - Enhance user interfaces
- **[Get started](../get-started)** - Review development setup