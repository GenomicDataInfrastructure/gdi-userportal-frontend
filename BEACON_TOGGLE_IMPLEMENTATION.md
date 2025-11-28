# Beacon Toggle Feature Implementation Guide

**Last Updated**: 2025-11-27  
**Status**: Pending Implementation  
**Goal**: Allow users to optionally include Beacon Network data in dataset searches via a simple checkbox toggle

---

## Table of Contents

1. [Overview](#overview)
2. [Current Behavior](#current-behavior)
3. [Desired Behavior](#desired-behavior)
4. [Backend Changes](#backend-changes)
5. [Frontend Changes](#frontend-changes)
6. [Testing](#testing)
7. [Deployment Strategy](#deployment-strategy)

---

## Overview

### Problem Statement

Currently, the dataset discovery service automatically queries both CKAN and Beacon Network when a user is authenticated and has Beacon access. This causes:

- **Slower searches** (2-5 seconds vs < 500ms for CKAN only)
- **No user control** over when to include Beacon data
- **Automatic cost** for every search (Beacon queries can be expensive)

### Solution

Implement a **simple checkbox toggle** that allows users to opt-in to Beacon Network queries:

- **Default (unchecked)**: Fast CKAN-only search
- **Checked**: Comprehensive search with Beacon Network (slower, shows record counts)
- **Role-based**: Only visible to users with Beacon access
- **Filter visibility**: Beacon filters only shown when toggle is ON

---

## Current Behavior

### How It Works Now

1. **User searches** → API receives authenticated request
2. **Backend automatically**:
   - Queries CKAN for datasets
   - Queries Beacon Network for record counts (if user has access token)
   - Returns **intersection** of datasets found in both sources
3. **Frontend displays** results with record counts from Beacon

### Backend Logic (Current)

```java
// SearchDatasetsQuery.java
public DatasetsSearchResponse execute(DatasetSearchQuery query, String accessToken, String preferredLanguage) {
    // Automatically collects from ALL sources (CKAN + Beacon)
    var datasetIdsByRecordCount = collectors
        .stream()
        .map(collector -> collector.collect(query, accessToken))
        .filter(Objects::nonNull)
        .reduce(this::findIdsIntersection)  // Intersection logic
        .orElseGet(Map::of);
    
    var datasets = repository.search(
        datasetIdsByRecordCount.keySet(),
        query.getSort(),
        query.getRows(),
        query.getStart(),
        accessToken,
        preferredLanguage
    );
    
    var enhancedDatasets = datasets.stream()
        .map(dataset -> dataset.toBuilder()
            .recordsCount(datasetIdsByRecordCount.get(dataset.getIdentifier()))
            .build())
        .toList();
    
    return DatasetsSearchResponse.builder()
        .count(datasetIdsByRecordCount.size())
        .results(enhancedDatasets)
        .build();
}
```

### Data Flow (Current)

```
Frontend → searchDatasetsApi()
    ↓
Backend → SearchDatasetsQuery.execute()
    ↓
    ├─ CkanDatasetIdsCollector.collect() → Returns CKAN dataset IDs
    └─ BeaconDatasetIdsCollector.collect() → Returns Beacon dataset IDs + record counts
    ↓
Intersection (datasets in BOTH sources)
    ↓
Frontend ← Results with record counts
```

### Issues with Current Approach

- ❌ Other clients (not just frontend) use this API
- ❌ Changing default behavior would break existing integrations
- ❌ No opt-out mechanism for faster searches
- ❌ Users can't browse catalog without waiting for Beacon

---

## Desired Behavior

### New User Flow

#### **Scenario A: Fast Catalog Search (Default)**

```
1. User lands on /datasets?page=1
2. Checkbox "Include Beacon Network" is UNCHECKED
3. Search executes with includeBeacon=false
4. Fast results from CKAN only (< 500ms)
5. No record counts shown
6. Only CKAN filters visible in sidebar
```

#### **Scenario B: Comprehensive Search with Beacon**

```
1. User checks "Include Beacon Network" checkbox
2. URL updates to /datasets?page=1&beacon=true
3. Page reloads/re-searches
4. Search executes with includeBeacon=true
5. Slower results (2-5s) with loading indicator
6. Results show with record counts from Beacon
7. Beacon filters now visible in sidebar
8. User can apply Beacon filters
```

#### **Scenario C: Toggle Off**

```
1. User unchecks the checkbox
2. URL updates to /datasets?page=1 (beacon param removed)
3. Page reloads/re-searches
4. Fast CKAN-only search
5. Beacon filters hidden
6. Any active Beacon filters automatically cleared
```

### UI Components

```
┌────────────────────────────────────────────────────────────┐
│  Search: [cancer___________________]  🔍 Search           │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ ☐ Include Beacon Network                             │ │
│  │   Filter by individual-level data and see counts     │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  Found 45 datasets                                         │
│                                                            │
├─────────────────────┬──────────────────────────────────────┤
│ FILTERS             │ [Dataset Cards]                      │
│                     │                                      │
│ 📂 Catalog Filters  │ ┌──────────────────────────────────┐│
│ ▼ Theme             │ │ Dataset Title                    ││
│ ▼ Publisher         │ │ Description...                   ││
│ ▼ Keywords          │ │ • Created on: 2024-01-01         ││
│                     │ └──────────────────────────────────┘│
│ (Beacon filters     │                                      │
│  hidden when        │                                      │
│  toggle is OFF)     │                                      │
└─────────────────────┴──────────────────────────────────────┘

When Checkbox is CHECKED:
├─────────────────────┬──────────────────────────────────────┤
│ FILTERS             │ [Dataset Cards]                      │
│                     │                                      │
│ 📂 Catalog Filters  │ ┌──────────────────────────────────┐│
│ ▼ Theme             │ │ Dataset Title                    ││
│ ▼ Publisher         │ │ Description...                   ││
│                     │ │ • Created on: 2024-01-01         ││
│ 🔬 Beacon Filters   │ │ 📖 45 Records ← FROM BEACON      ││
│ ▼ Age Range         │ └──────────────────────────────────┘│
│ ▼ Sex               │                                      │
│ ▼ Disease           │                                      │
└─────────────────────┴──────────────────────────────────────┘
```

---

## Backend Changes

### Repository

**Location**: `gdi-userportal-dataset-discovery-service`  
**Primary File**: `src/main/java/io/github/genomicdatainfrastructure/discovery/datasets/application/usecases/SearchDatasetsQuery.java`

### 1. Add `includeBeacon` Parameter to Query Model

**File**: `src/main/java/io/github/genomicdatainfrastructure/discovery/model/DatasetSearchQuery.java`

```java
package io.github.genomicdatainfrastructure.discovery.model;

import lombok.Builder;
import lombok.Value;
import java.util.List;

@Value
@Builder
public class DatasetSearchQuery {
    String query;
    List<DatasetSearchQueryFacet> facets;
    String sort;
    Integer rows;
    Integer start;
    
    // NEW: Optional parameter for Beacon inclusion
    Boolean includeBeacon;  // null = default to true (backward compatible)
}
```

### 2. Update OpenAPI Specification

**File**: `src/main/resources/META-INF/openapi.yaml` (or equivalent)

```yaml
components:
  schemas:
    DatasetSearchQuery:
      type: object
      properties:
        query:
          type: string
          description: Search query text
        facets:
          type: array
          items:
            $ref: '#/components/schemas/DatasetSearchQueryFacet'
        sort:
          type: string
          description: Sort order
        rows:
          type: integer
          description: Number of results per page
          minimum: 1
          maximum: 1000
        start:
          type: integer
          description: Offset for pagination
          minimum: 0
        includeBeacon:
          type: boolean
          default: true
          description: |
            Whether to include Beacon Network results in the search.
            - true (default): Search both CKAN and Beacon, return intersection with record counts
            - false: Search CKAN only (faster, no Beacon query, no record counts)
            
            For backward compatibility, if not provided, defaults to true.
```

### 3. Modify SearchDatasetsQuery Logic

**File**: `src/main/java/io/github/genomicdatainfrastructure/discovery/datasets/application/usecases/SearchDatasetsQuery.java`

```java
package io.github.genomicdatainfrastructure.discovery.datasets.application.usecases;

import io.github.genomicdatainfrastructure.discovery.datasets.application.ports.DatasetIdsCollector;
import io.github.genomicdatainfrastructure.discovery.datasets.application.ports.DatasetsRepository;
import io.github.genomicdatainfrastructure.discovery.model.DatasetSearchQuery;
import io.github.genomicdatainfrastructure.discovery.model.DatasetsSearchResponse;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.inject.Instance;
import jakarta.inject.Inject;
import lombok.RequiredArgsConstructor;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import static java.lang.Math.min;
import static java.util.Objects.nonNull;

@ApplicationScoped
@RequiredArgsConstructor(onConstructor = @__(@Inject))
public class SearchDatasetsQuery {

    private final DatasetsRepository repository;
    private final Instance<DatasetIdsCollector> collectors;

    public DatasetsSearchResponse execute(
            DatasetSearchQuery query, 
            String accessToken,
            String preferredLanguage
    ) {
        // NEW: Check if Beacon should be included
        // Default to true for backward compatibility with existing clients
        boolean includeBeacon = query.getIncludeBeacon() == null 
            ? true 
            : query.getIncludeBeacon();

        if (!includeBeacon) {
            // NEW: Fast path - CKAN only
            return searchCkanOnly(query, accessToken, preferredLanguage);
        }

        // EXISTING: Original behavior (CKAN + Beacon intersection)
        return searchWithBeacon(query, accessToken, preferredLanguage);
    }

    /**
     * NEW METHOD: Fast CKAN-only search without Beacon
     */
    private DatasetsSearchResponse searchCkanOnly(
            DatasetSearchQuery query,
            String accessToken,
            String preferredLanguage
    ) {
        // Get only CKAN collector (skip Beacon)
        var ckanCollector = collectors.stream()
            .filter(collector -> collector.getClass().getSimpleName().equals("CkanDatasetIdsCollector"))
            .findFirst()
            .orElseThrow(() -> new IllegalStateException("CKAN collector not found"));

        var datasetIds = ckanCollector.collect(query, accessToken);

        var datasets = repository.search(
            datasetIds.keySet(),
            query.getSort(),
            query.getRows(),
            query.getStart(),
            accessToken,
            preferredLanguage
        );

        // Return datasets WITHOUT record counts (Beacon not queried)
        return DatasetsSearchResponse.builder()
            .count(datasetIds.size())
            .results(datasets)
            .build();
    }

    /**
     * EXISTING METHOD: Comprehensive search with Beacon (intersection)
     */
    private DatasetsSearchResponse searchWithBeacon(
            DatasetSearchQuery query,
            String accessToken,
            String preferredLanguage
    ) {
        // EXISTING CODE: No changes to this logic
        var datasetIdsByRecordCount = collectors.stream()
            .map(collector -> collector.collect(query, accessToken))
            .filter(Objects::nonNull)
            .reduce(this::findIdsIntersection)
            .orElseGet(Map::of);

        var datasets = repository.search(
            datasetIdsByRecordCount.keySet(),
            query.getSort(),
            query.getRows(),
            query.getStart(),
            accessToken,
            preferredLanguage
        );

        var enhancedDatasets = datasets.stream()
            .map(dataset -> dataset.toBuilder()
                .recordsCount(datasetIdsByRecordCount.get(dataset.getIdentifier()))
                .build())
            .toList();

        return DatasetsSearchResponse.builder()
            .count(datasetIdsByRecordCount.size())
            .results(enhancedDatasets)
            .build();
    }

    /**
     * EXISTING METHOD: No changes
     */
    private Map<String, Integer> findIdsIntersection(
            Map<String, Integer> a,
            Map<String, Integer> b
    ) {
        var newMap = new HashMap<String, Integer>();
        for (var entryA : a.entrySet()) {
            if (b.containsKey(entryA.getKey())) {
                var recordCountA = entryA.getValue();
                var recordCountB = b.get(entryA.getKey());

                var newRecordCount = recordCountA;
                if (nonNull(recordCountA) && nonNull(recordCountB)) {
                    newRecordCount = min(recordCountA, recordCountB);
                } else if (nonNull(recordCountB)) {
                    newRecordCount = recordCountB;
                }

                newMap.put(entryA.getKey(), newRecordCount);
            }
        }
        return newMap;
    }
}
```

### 4. Add Unit Tests

**File**: `src/test/java/io/github/genomicdatainfrastructure/discovery/datasets/application/usecases/SearchDatasetsQueryTest.java`

```java
package io.github.genomicdatainfrastructure.discovery.datasets.application.usecases;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

class SearchDatasetsQueryTest {

    @Test
    void testBackwardCompatibility_NoIncludeBeaconParameter() {
        // OLD client - doesn't send includeBeacon
        var query = DatasetSearchQuery.builder()
            .query("cancer")
            .build();
        
        var response = searchDatasetsQuery.execute(query, token, "en");
        
        // Should still include Beacon (default behavior)
        assertThat(response.getResults())
            .isNotEmpty()
            .allMatch(dataset -> dataset.getRecordsCount() != null);
    }

    @Test
    void testNewBehavior_IncludeBeaconFalse() {
        // NEW client - explicitly sets includeBeacon=false
        var query = DatasetSearchQuery.builder()
            .query("cancer")
            .includeBeacon(false)
            .build();
        
        var response = searchDatasetsQuery.execute(query, token, "en");
        
        // Should NOT include Beacon data (fast CKAN only)
        assertThat(response.getResults())
            .isNotEmpty()
            .allMatch(dataset -> dataset.getRecordsCount() == null);
    }

    @Test
    void testExplicitTrue_IncludeBeaconTrue() {
        // Client explicitly requests Beacon
        var query = DatasetSearchQuery.builder()
            .query("cancer")
            .includeBeacon(true)
            .build();
        
        var response = searchDatasetsQuery.execute(query, token, "en");
        
        // Should include Beacon data
        assertThat(response.getResults())
            .isNotEmpty()
            .allMatch(dataset -> dataset.getRecordsCount() != null);
    }

    @Test
    void testCkanOnlyReturnsMoreResults() {
        var queryWithBeacon = DatasetSearchQuery.builder()
            .query("cancer")
            .includeBeacon(true)
            .build();
        
        var queryWithoutBeacon = DatasetSearchQuery.builder()
            .query("cancer")
            .includeBeacon(false)
            .build();
        
        var responseWithBeacon = searchDatasetsQuery.execute(queryWithBeacon, token, "en");
        var responseWithoutBeacon = searchDatasetsQuery.execute(queryWithoutBeacon, token, "en");
        
        // CKAN-only should return more or equal results (no intersection filter)
        assertThat(responseWithoutBeacon.getCount())
            .isGreaterThanOrEqualTo(responseWithBeacon.getCount());
    }
}
```

### Backend Summary

**Changes Required**:
1. ✅ Add `includeBeacon` Boolean field to `DatasetSearchQuery` model
2. ✅ Update OpenAPI spec with new parameter (default: true)
3. ✅ Split `execute()` into two paths: `searchCkanOnly()` and `searchWithBeacon()`
4. ✅ Maintain backward compatibility (null = true)
5. ✅ Add unit tests for all scenarios

**Backward Compatibility**:
- ✅ Existing clients continue to work (default behavior unchanged)
- ✅ New clients can opt-in to fast mode
- ✅ No breaking changes

---

## Frontend Changes

### Repository

**Location**: `gdi-userportal-frontend`

### 1. Update OpenAPI Schema

**File**: `src/app/api/discovery/open-api/discovery.yml`

Add the new parameter to the search query schema:

```yaml
# Around line 250-280 (in DatasetSearchQuery schema)
DatasetSearchQuery:
  type: object
  properties:
    query:
      type: string
      title: Query
    facets:
      type: array
      items:
        $ref: "#/components/schemas/DatasetSearchQueryFacet"
    sort:
      type: string
      title: Sort
    rows:
      type: integer
      minimum: 0
      maximum: 1000
      default: 10
      title: Rows
    start:
      type: integer
      minimum: 0
      default: 0
      title: Start
    includeBeacon:  # NEW
      type: boolean
      default: true
      title: Include Beacon
      description: Whether to include Beacon Network in search results
```

### 2. Regenerate TypeScript Types

```bash
npm run generate:discovery
```

This will update `src/app/api/discovery/open-api/schemas.ts` with the new `includeBeacon` property.

### 3. Create BeaconToggle Component

**File**: `src/app/datasets/BeaconToggle.tsx` (NEW FILE)

```tsx
// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function BeaconToggle() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  // Check if user has Beacon access (adjust role name as needed)
  const hasBeaconAccess = session?.user?.roles?.includes("BEACON_USER");

  // Get current state from URL parameter
  const includeBeacon = searchParams.get("beacon") === "true";

  // Don't show toggle if user doesn't have Beacon access
  if (!hasBeaconAccess) {
    return null;
  }

  const handleToggle = (checked: boolean) => {
    setIsLoading(true);

    const params = new URLSearchParams(searchParams);

    if (checked) {
      params.set("beacon", "true");
    } else {
      params.delete("beacon");
    }

    // Reset to page 1 when toggling
    params.set("page", "1");

    // Navigate to updated URL (will trigger re-search)
    router.push(`/datasets?${params.toString()}`);
  };

  return (
    <div className="mb-6">
      <div
        className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-colors ${
          includeBeacon
            ? "bg-blue-50 border-blue-300"
            : "bg-gray-50 border-gray-200"
        }`}
      >
        <input
          type="checkbox"
          id="beacon-toggle"
          checked={includeBeacon}
          onChange={(e) => handleToggle(e.target.checked)}
          disabled={isLoading}
          className="mt-1 w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary cursor-pointer disabled:opacity-50"
        />
        <label
          htmlFor="beacon-toggle"
          className="flex-1 cursor-pointer select-none"
        >
          <div className="flex items-center gap-2 font-semibold text-base mb-1">
            <span>🔬</span>
            <span>Include Beacon Network</span>
            {includeBeacon && (
              <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">
                Active
              </span>
            )}
          </div>
          <div className="text-sm text-gray-600">
            {includeBeacon ? (
              <>
                Showing datasets with available individual-level data and record
                counts from Beacon Network.{" "}
                <span className="text-blue-600">
                  (Searches may be slower)
                </span>
              </>
            ) : (
              <>
                Get individual-level data filters and record counts by enabling
                Beacon Network.
              </>
            )}
          </div>
        </label>
      </div>
    </div>
  );
}
```

### 4. Update DatasetsProvider

**File**: `src/providers/datasets/DatasetsProvider.tsx`

```tsx
// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { AxiosError } from "axios";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import {
  DatasetsAction,
  DatasetsActionType,
  DatasetsState,
} from "./DatasetProvider.types";
import { useFilters } from "@/providers/filters/FilterProvider";
import { searchDatasetsApi } from "../../app/api/discovery";
import {
  DatasetSearchQuery,
  DatasetSearchQueryFacet,
  Operator,
} from "@/app/api/discovery/open-api/schemas";
import { ActiveFilter } from "@/providers/filters/FilterProvider.types";
import { FilterType } from "@/app/api/discovery/additional-types";
import { UrlSearchParams } from "@/app/params";

function convertActiveFiltersToFacets(
  activeFilters: ActiveFilter[]
): DatasetSearchQueryFacet[] {
  return activeFilters
    .map((filter) => {
      const baseFacet = {
        source: filter.source,
        type: filter.type,
        key: filter.key,
      };

      if (filter.type === FilterType.ENTRIES) {
        return {
          ...baseFacet,
          entries: filter.entries,
        };
      }

      return filter.values!.map(
        (value: { value: string; label?: string; operator?: Operator }) => ({
          ...baseFacet,
          value: value.value,
          operator: value.operator,
        })
      );
    })
    .flat();
}

const DatasetsContext = createContext<DatasetsState | undefined>(undefined);

function reducer(state: DatasetsState, action: DatasetsAction): DatasetsState {
  switch (action.type) {
    case DatasetsActionType.LOADING:
      return { ...state, isLoading: true };
    case DatasetsActionType.DATASETS_LOADED:
      return {
        ...state,
        isLoading: false,
        datasets: action.payload?.datasets,
        datasetCount: action.payload?.datasetCount,
      };
    case DatasetsActionType.REJECTED:
      return {
        ...state,
        isLoading: false,
        errorCode: action.payload?.errorCode,
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

const DATASET_PER_PAGE = 12;

const initialState = {
  datasets: undefined,
  datasetCount: undefined,
  isLoading: false,
  errorCode: undefined,
};

type DatasetsProviderProps = {
  children: React.ReactNode;
  searchParams: UrlSearchParams;
};

export default function DatasetsProvider({
  children,
  searchParams,
}: DatasetsProviderProps) {
  const { activeFilters } = useFilters();
  const [{ datasets, datasetCount, isLoading, errorCode }, dispatch] =
    useReducer(reducer, initialState);
  const { page, q, sort, beacon } = searchParams;

  const fetchDatasets = useCallback(async () => {
    dispatch({ type: DatasetsActionType.LOADING });

    // NEW: Get Beacon preference from URL parameter
    const includeBeacon = beacon === "true";

    const options: DatasetSearchQuery = {
      query: q,
      facets: convertActiveFiltersToFacets(activeFilters),
      sort: sort || "score desc, metadata_modified desc",
      start: page ? (Number(page) - 1) * DATASET_PER_PAGE : 0,
      rows: DATASET_PER_PAGE,
      includeBeacon,  // NEW: Pass to backend
    };

    try {
      const data = await searchDatasetsApi(options);
      dispatch({
        type: DatasetsActionType.DATASETS_LOADED,
        payload: {
          datasets: data.results,
          datasetCount: data.count,
        },
      });
    } catch (error) {
      const errorCode =
        error instanceof AxiosError ? error.response?.status : 500;
      dispatch({
        type: DatasetsActionType.REJECTED,
        payload: { errorCode },
      });
      console.error(error);
    }
  }, [activeFilters, page, q, sort, beacon]);  // NEW: Added beacon dependency

  useEffect(() => {
    fetchDatasets();
  }, [fetchDatasets, activeFilters, page, q, sort, beacon]);  // NEW: Added beacon dependency

  return (
    <DatasetsContext.Provider
      value={{
        datasets,
        datasetCount,
        isLoading,
        errorCode,
      }}
    >
      {children}
    </DatasetsContext.Provider>
  );
}

function useDatasets() {
  const context = useContext(DatasetsContext);
  if (context === undefined) {
    throw new Error("useDatasets must be used within a DatasetsProvider");
  }
  return context;
}

export { DATASET_PER_PAGE, DatasetsProvider, useDatasets };
```

### 5. Update FilterList to Hide/Show Beacon Filters

**File**: `src/app/datasets/FilterList/index.tsx`

```tsx
// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import FilterItem from "./FilterItem";
import { useFilters } from "@/providers/filters/FilterProvider";

export default function FilterList() {
  const { data: session } = useSession();
  const { filters } = useFilters();
  const searchParams = useSearchParams();

  // Check if Beacon is enabled via URL parameter
  const includeBeacon = searchParams.get("beacon") === "true";

  // Check if user has Beacon access
  const hasBeaconAccess = session?.user?.roles?.includes("BEACON_USER");

  // Filter what to show based on beacon toggle and user access
  const visibleFilters = filters.filter((filter) => {
    if (filter.source === "beacon") {
      // Only show Beacon filters if:
      // 1. User has Beacon access AND
      // 2. Beacon toggle is ON
      return includeBeacon && hasBeaconAccess;
    }
    // Always show CKAN filters
    return true;
  });

  // Group filters by source
  const ckanFilters = visibleFilters.filter((f) => f.source === "ckan");
  const beaconFilters = visibleFilters.filter((f) => f.source === "beacon");

  return (
    <div className="flex flex-col gap-y-8">
      {/* CKAN Filters Section */}
      {ckanFilters.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4 tracking-wide">
            📂 Catalog Filters
          </h3>
          <ul className="flex flex-col gap-y-6">
            {ckanFilters.map((filter) => (
              <li key={filter.key} className="list-none">
                <FilterItem filter={filter} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Beacon Filters Section - Only when toggle is ON */}
      {beaconFilters.length > 0 && (
        <section>
          <div className="border-t pt-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2 tracking-wide">
              🔬 Beacon Network Filters
            </h3>
            <p className="text-xs text-gray-600 mb-4">
              Filter by individual-level data characteristics
            </p>
            <ul className="flex flex-col gap-y-6">
              {beaconFilters.map((filter) => (
                <li key={filter.key} className="list-none">
                  <FilterItem filter={filter} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}
```

### 6. Clear Beacon Filters When Toggle is Turned Off

**File**: `src/providers/filters/FilterProvider.tsx`

Add this effect to automatically clear Beacon filters when toggle is turned off:

```tsx
// Add this import at the top
import { useSearchParams } from "next/navigation";

// Inside FilterProvider component, add this effect:
export default function FilterProvider({ children }: FilterProviderProps) {
  const searchParams = useSearchParams();
  
  // ... existing code ...

  // NEW: Clear Beacon filters when toggle is turned off
  useEffect(() => {
    const includeBeacon = searchParams.get("beacon") === "true";

    if (!includeBeacon) {
      // Find all active Beacon filters
      const beaconFiltersActive = activeFilters.filter(
        (f) => f.source === "beacon"
      );

      // Remove them
      if (beaconFiltersActive.length > 0) {
        beaconFiltersActive.forEach((filter) => {
          removeActiveFilter(filter.key, filter.source);
        });
      }
    }
  }, [searchParams.get("beacon")]);

  // ... rest of the code ...
}
```

### 7. Update Main Datasets Page

**File**: `src/app/datasets/page.tsx`

```tsx
// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { redirect } from "next/navigation";
import DatasetCount from "./DatasetCount";
import DatasetListContainer from "./DatasetListContainer";
import FilterList from "./FilterList";
import NoDatasetMessage from "./NoDatasetMessage";
import { useFilters } from "@/providers/filters/FilterProvider";
import { use } from "react";
import PageContainer from "@/components/PageContainer";
import SearchBar from "@/components/Searchbar";
import ActiveFilters from "@/app/datasets/ActiveFilters";
import DatasetsProvider from "@/providers/datasets/DatasetsProvider";
import Error from "@/app/error";
import { UrlSearchParams } from "@/app/params";
import BeaconToggle from "./BeaconToggle";  // NEW IMPORT

type DatasetsPageProps = {
  searchParams: Promise<UrlSearchParams>;
};

export default function DatasetsPage({ searchParams }: DatasetsPageProps) {
  const _searchParams = use(searchParams);

  if (!_searchParams.page) {
    redirect("/datasets?page=1");
  }

  const currentPage = Number(_searchParams.page);

  const { error } = useFilters();

  if (error) {
    return <Error statusCode={error.statusCode} />;
  }

  return (
    <PageContainer searchParams={_searchParams}>
      <div className="grid grid-cols-12">
        <div className="col-start-0 col-span-12 flex items-center justify-between xl:col-span-10 xl:col-start-2">
          <SearchBar searchParams={_searchParams} />
        </div>

        {/* NEW: Beacon Toggle Component */}
        <div className="col-start-0 col-span-12 xl:col-span-10 xl:col-start-2">
          <BeaconToggle />
        </div>

        <DatasetsProvider searchParams={_searchParams}>
          <DatasetCount />
          <div className="col-start-0 col-span-12 flex flex-col gap-4 sm:block xl:hidden">
            <div className="my-4 h-fit">
              <FilterList />
            </div>
          </div>
          <div className="col-start-0 col-span-4 flex flex-col gap-y-6">
            <div className="col-start-0 col-span-4 mr-6 hidden h-fit xl:block px-6">
              <FilterList />
            </div>
          </div>
          <div className="col-span-12 xl:col-span-8">
            <ActiveFilters />
            <NoDatasetMessage />
            <DatasetListContainer currentPage={currentPage} />
          </div>
        </DatasetsProvider>
      </div>
    </PageContainer>
  );
}
```

### 8. Update URL Parameter Types

**File**: `src/app/params.ts`

```typescript
// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

export type UrlSearchParams = {
  page?: string;
  q?: string;
  sort?: string;
  beacon?: string;  // NEW: Add beacon parameter
};
```

### Frontend Summary

**Files Modified**:
1. ✅ `src/app/api/discovery/open-api/discovery.yml` - Add includeBeacon parameter
2. ✅ `src/app/datasets/BeaconToggle.tsx` - NEW component
3. ✅ `src/providers/datasets/DatasetsProvider.tsx` - Pass includeBeacon to API
4. ✅ `src/app/datasets/FilterList/index.tsx` - Hide/show Beacon filters
5. ✅ `src/providers/filters/FilterProvider.tsx` - Clear Beacon filters on toggle off
6. ✅ `src/app/datasets/page.tsx` - Add BeaconToggle component
7. ✅ `src/app/params.ts` - Add beacon URL parameter type

**Commands to Run**:
```bash
# Regenerate TypeScript types from OpenAPI spec
npm run generate:discovery

# Run type check
npm run type-check

# Run linting
npm run lint

# Run formatting
npm run format
```

---

## Testing

### Backend Testing

#### Unit Tests

```bash
# Run backend tests
./mvnw test

# Run specific test class
./mvnw test -Dtest=SearchDatasetsQueryTest
```

#### Integration Tests

Test both paths:
1. `includeBeacon=false` → Fast CKAN only
2. `includeBeacon=true` → CKAN + Beacon intersection
3. `includeBeacon=null` → Default to true (backward compatibility)

#### Manual API Testing

```bash
# Test CKAN only (fast)
curl -X POST http://localhost:8080/api/v1/datasets/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "query": "cancer",
    "includeBeacon": false,
    "rows": 10,
    "start": 0
  }'

# Test with Beacon (slow)
curl -X POST http://localhost:8080/api/v1/datasets/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "query": "cancer",
    "includeBeacon": true,
    "rows": 10,
    "start": 0
  }'

# Test backward compatibility (no includeBeacon param)
curl -X POST http://localhost:8080/api/v1/datasets/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "query": "cancer",
    "rows": 10,
    "start": 0
  }'
```

### Frontend Testing

#### Manual Testing Checklist

**Test Case 1: Default Behavior (Checkbox Unchecked)**
- [ ] User lands on `/datasets?page=1`
- [ ] Checkbox is unchecked
- [ ] Fast results (< 1 second)
- [ ] Only CKAN filters visible
- [ ] No record counts shown on dataset cards

**Test Case 2: Enable Beacon**
- [ ] User checks "Include Beacon Network"
- [ ] URL updates to `/datasets?page=1&beacon=true`
- [ ] Page reloads/re-searches
- [ ] Slower results (2-5 seconds)
- [ ] Beacon filters now visible in sidebar
- [ ] Record counts shown on dataset cards (e.g., "45 Records")

**Test Case 3: Apply Beacon Filter**
- [ ] With Beacon enabled, apply a Beacon filter (e.g., Age Range)
- [ ] Results update with intersection
- [ ] Only datasets with matching Beacon data shown

**Test Case 4: Disable Beacon**
- [ ] User unchecks the checkbox
- [ ] URL updates to `/datasets?page=1`
- [ ] Page reloads
- [ ] Fast CKAN-only results
- [ ] Beacon filters hidden
- [ ] Active Beacon filters cleared automatically

**Test Case 5: Non-Beacon User**
- [ ] Login as user without Beacon role
- [ ] Beacon checkbox is NOT visible
- [ ] Search returns CKAN-only results
- [ ] No Beacon filters in sidebar

**Test Case 6: URL Persistence**
- [ ] Enable Beacon (`?beacon=true`)
- [ ] Copy URL and paste in new tab
- [ ] Beacon toggle should be checked
- [ ] Beacon filters should be visible

**Test Case 7: Pagination with Beacon**
- [ ] Enable Beacon
- [ ] Navigate to page 2
- [ ] URL should be `/datasets?page=2&beacon=true`
- [ ] Beacon state persists across pages

**Test Case 8: Search with Beacon**
- [ ] Enable Beacon
- [ ] Enter search query "cancer"
- [ ] URL should include both: `?q=cancer&beacon=true`
- [ ] Results should include Beacon data

#### Automated Tests

```bash
# Run frontend tests
npm run test

# Run E2E tests
npm run test:e2e
```

**Example E2E Test** (Playwright):

```typescript
// tests/datasets-beacon-toggle.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Beacon Toggle Feature', () => {
  test('should show checkbox for users with Beacon access', async ({ page }) => {
    // Login as user with Beacon role
    await page.goto('/datasets?page=1');
    
    const checkbox = page.locator('#beacon-toggle');
    await expect(checkbox).toBeVisible();
    await expect(checkbox).not.toBeChecked();
  });

  test('should reload with Beacon when checkbox is checked', async ({ page }) => {
    await page.goto('/datasets?page=1');
    
    // Check the checkbox
    await page.click('#beacon-toggle');
    
    // Wait for navigation
    await page.waitForURL('**/datasets?*beacon=true*');
    
    // Verify Beacon filters are visible
    const beaconSection = page.locator('text=Beacon Network Filters');
    await expect(beaconSection).toBeVisible();
  });

  test('should hide Beacon filters when unchecked', async ({ page }) => {
    await page.goto('/datasets?page=1&beacon=true');
    
    // Verify Beacon filters are visible
    await expect(page.locator('text=Beacon Network Filters')).toBeVisible();
    
    // Uncheck the checkbox
    await page.click('#beacon-toggle');
    
    // Wait for navigation
    await page.waitForURL('**/datasets?page=1');
    
    // Verify Beacon filters are hidden
    await expect(page.locator('text=Beacon Network Filters')).not.toBeVisible();
  });
});
```

---

## Deployment Strategy

### Phase 1: Backend Deployment (No Breaking Changes)

**Goal**: Deploy backend with new parameter, default to existing behavior

**Steps**:
1. Deploy updated backend to DEV environment
2. Test with both old and new clients
3. Verify backward compatibility
4. Deploy to STAGING
5. Deploy to PRODUCTION

**Verification**:
```bash
# Test backward compatibility (should work like before)
curl -X POST https://api.portal.dev.gdi.lu/discovery/api/v1/datasets/search \
  -H "Authorization: Bearer TOKEN" \
  -d '{"query": "cancer"}'

# Test new parameter (should return faster)
curl -X POST https://api.portal.dev.gdi.lu/discovery/api/v1/datasets/search \
  -H "Authorization: Bearer TOKEN" \
  -d '{"query": "cancer", "includeBeacon": false}'
```

### Phase 2: Frontend Deployment (Opt-in to New Behavior)

**Goal**: Update frontend to use new Beacon toggle

**Steps**:
1. Update frontend OpenAPI spec
2. Regenerate TypeScript types
3. Add BeaconToggle component
4. Update DatasetsProvider to pass includeBeacon
5. Update FilterList to hide/show Beacon filters
6. Test locally
7. Deploy to DEV environment
8. User acceptance testing
9. Deploy to STAGING
10. Deploy to PRODUCTION

**Verification Checklist**:
- [ ] Checkbox visible for Beacon users
- [ ] Default search is fast (< 1s)
- [ ] Enabling Beacon shows filters and record counts
- [ ] Disabling Beacon hides filters and clears active Beacon filters
- [ ] URL parameter persists state
- [ ] No errors in browser console

### Phase 3: Communication to Other Clients (Optional)

**Goal**: Inform other teams about new optimization option

**Action**: Send email to API consumers

**Template**:
```markdown
Subject: New Dataset Search API Feature - Optional Beacon Inclusion

Hi Team,

We've added a new optional parameter to the Dataset Search API that can
significantly improve search performance for certain use cases.

**What's New:**
- New parameter: `includeBeacon` (boolean, optional)
- Default: `true` (existing behavior, no changes required)

**Your Integration:**
✅ No action required - your existing code will continue to work

**New Option (Optional):**
If you want faster searches without Beacon Network data:

```json
POST /api/v1/datasets/search
{
  "query": "cancer",
  "includeBeacon": false  // NEW: Skip Beacon for speed
}
```

**When to use `false`:**
- Quick catalog browsing
- Initial broad searches
- Users without Beacon access
- Performance optimization

**When to use `true` (or omit):**
- Need record counts from Beacon
- Final dataset selection
- Current default behavior

**Documentation:** [Link to API docs]

Questions? Contact: [your team]
```

### Rollback Plan

If issues are discovered after deployment:

**Backend Rollback**:
```bash
# Revert to previous version
kubectl rollout undo deployment/dataset-discovery-service

# Or deploy specific version
kubectl set image deployment/dataset-discovery-service \
  app=dataset-discovery-service:previous-version
```

**Frontend Rollback**:
```bash
# Revert to previous version
git revert <commit-hash>
npm run build
# Deploy reverted version
```

**Quick Fix** (if minor issue):
- Backend: Set `includeBeacon` default to false temporarily
- Frontend: Remove BeaconToggle component, always pass false

---

## Configuration

### Backend Configuration

**File**: `src/main/resources/application.properties`

Existing configuration (no changes needed):
```properties
# Beacon is enabled by default
sources.beacon=true

# Beacon endpoint (already configured)
beacon.url=https://beacon-network.example.com
```

### Frontend Environment Variables

**File**: `.env.local`

No new environment variables needed. The feature is controlled by:
1. User role (hasBeaconAccess)
2. URL parameter (?beacon=true)

---

## Monitoring & Metrics

### Backend Metrics to Track

```java
// Add to SearchDatasetsQuery.java
@Inject
MeterRegistry meterRegistry;

public DatasetsSearchResponse execute(...) {
    boolean includeBeacon = query.getIncludeBeacon() == null ? true : query.getIncludeBeacon();
    
    // Track usage
    meterRegistry.counter("dataset.search.requests", 
        "beacon_enabled", String.valueOf(includeBeacon)
    ).increment();
    
    long startTime = System.currentTimeMillis();
    
    // ... execute search ...
    
    long duration = System.currentTimeMillis() - startTime;
    meterRegistry.timer("dataset.search.duration",
        "beacon_enabled", String.valueOf(includeBeacon)
    ).record(duration, TimeUnit.MILLISECONDS);
}
```

### Frontend Analytics

```typescript
// Track toggle usage
const handleToggle = (checked: boolean) => {
  // Analytics event
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'beacon_toggle', {
      event_category: 'search',
      event_label: checked ? 'enabled' : 'disabled',
    });
  }
  
  // ... rest of toggle logic
};
```

### Key Metrics to Monitor

1. **Search Performance**:
   - Average response time with Beacon: `dataset.search.duration{beacon_enabled=true}`
   - Average response time without Beacon: `dataset.search.duration{beacon_enabled=false}`
   - Target: CKAN-only < 1s, with Beacon < 5s

2. **Usage Patterns**:
   - % of searches with Beacon enabled
   - % of users who toggle Beacon on
   - Number of Beacon filter applications

3. **Error Rates**:
   - Beacon query failures
   - Timeout errors
   - API error rates by beacon status

4. **Business Metrics**:
   - User engagement with Beacon features
   - Datasets with record counts
   - Conversion to dataset access requests

---

## Troubleshooting

### Issue: Checkbox not visible

**Possible Causes**:
- User doesn't have Beacon role
- Session not loaded yet

**Solution**:
```tsx
// Check user session
console.log('User session:', session);
console.log('User roles:', session?.user?.roles);

// Verify role name matches backend
const hasBeaconAccess = session?.user?.roles?.includes('BEACON_USER');
```

### Issue: Beacon toggle doesn't reload page

**Possible Causes**:
- Router not working
- URL parameter not updating

**Solution**:
```tsx
// Add debug logging
const handleToggle = (checked: boolean) => {
  console.log('Toggle clicked:', checked);
  const params = new URLSearchParams(searchParams);
  console.log('Current params:', params.toString());
  
  if (checked) {
    params.set('beacon', 'true');
  } else {
    params.delete('beacon');
  }
  
  const newUrl = `/datasets?${params.toString()}`;
  console.log('Navigating to:', newUrl);
  router.push(newUrl);
};
```

### Issue: Beacon filters not showing

**Possible Causes**:
- Filters not fetched from API
- Filter source not "beacon"
- Toggle state not read correctly

**Solution**:
```tsx
// Debug filter visibility
console.log('All filters:', filters);
console.log('Include beacon:', includeBeacon);
console.log('Has beacon access:', hasBeaconAccess);
console.log('Beacon filters:', filters.filter(f => f.source === 'beacon'));
```

### Issue: Backend not respecting includeBeacon parameter

**Possible Causes**:
- Parameter not deserialized correctly
- Logic not implemented
- Null check failing

**Solution**:
```java
// Add debug logging
@Override
public DatasetsSearchResponse execute(DatasetSearchQuery query, String accessToken, String preferredLanguage) {
    log.info("Received query with includeBeacon: {}", query.getIncludeBeacon());
    
    boolean includeBeacon = query.getIncludeBeacon() == null ? true : query.getIncludeBeacon();
    log.info("Resolved includeBeacon to: {}", includeBeacon);
    
    // ... rest of method
}
```

### Issue: Slow performance even with includeBeacon=false

**Possible Causes**:
- Backend still querying Beacon
- CKAN itself is slow
- Network issues

**Solution**:
```bash
# Check which collectors are running
# Add logging in SearchDatasetsQuery.java

if (!includeBeacon) {
    log.info("Skipping Beacon collectors");
    return searchCkanOnly(query, accessToken, preferredLanguage);
}
```

---

## Future Enhancements

### Possible Improvements

1. **Remember User Preference**:
   - Store toggle state in localStorage
   - Auto-enable for users who frequently use Beacon
   
2. **Progressive Loading**:
   - Show CKAN results immediately
   - Load Beacon data in background
   - Update UI when Beacon data arrives

3. **Beacon Status Indicator**:
   - Show which datasets have Beacon data available
   - Add badge: "Beacon Available"

4. **Performance Optimization**:
   - Cache Beacon results
   - Debounce Beacon queries
   - Batch Beacon requests

5. **Advanced Mode**:
   - Let users choose: "Fast", "Balanced", "Comprehensive"
   - "Balanced" = CKAN + Beacon for top 50 results only

---

## References

### Documentation

- **Backend Repository**: `gdi-userportal-dataset-discovery-service`
- **Frontend Repository**: `gdi-userportal-frontend`
- **Beacon Network Docs**: [Beacon Network API](https://beacon-network.org/)

### Related Issues

- [Issue #XXX] - Performance optimization request
- [Issue #YYY] - Role-based Beacon access

### Related PRs

- [PR #AAA] - CKAN data type compatibility fixes
- [PR #BBB] - DATETIME and NUMBER filter components

---

## Contact

For questions or issues during implementation:

- **Backend Team**: [backend-team@example.com]
- **Frontend Team**: [frontend-team@example.com]
- **DevOps**: [devops@example.com]

---

**End of Implementation Guide**

Last Updated: 2025-11-28
