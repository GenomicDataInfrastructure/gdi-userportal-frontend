// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { getLocalDiscoveryStore } from "@/app/api/discovery/local-store/factory";
import { getLocalAiModelStore } from "@/app/api/discovery/local-store/ai-model-factory";
import {
  LocalDiscoveryAiModel,
  LocalDiscoveryDataset,
  LocalDistributionRole,
  getDistributionRoles,
} from "@/app/api/discovery/local-store/types";
import {
  getLocalDiscoveryDatasetExportMimeType,
  serializeLocalDiscoveryDataset,
} from "@/app/api/discovery/harvester/dcat-dataset-rdf-generator";
import { BasePlaceholderDiscoveryProvider } from "@/app/api/discovery/providers/base-placeholder-provider";
import { listLocalFilters } from "@/app/api/discovery/local-store/filter-registry";
import {
  DiscoveryAgent,
  DiscoveryAiModelSearchQuery,
  DiscoveryAiModelsSearchResponse,
  DiscoveryDatasetBase,
  DiscoveryFilter,
  DiscoveryDatasetSearchQuery,
  DiscoveryDatasetsSearchResponse,
  DiscoveryRetrievedAiModel,
  DiscoveryRetrievedDataset,
  DiscoverySearchedAiModel,
  DiscoveryValueLabel,
} from "@/app/api/discovery/providers/types";

export class LocalIndexDiscoveryProvider extends BasePlaceholderDiscoveryProvider {
  readonly key = "local-index";

  readonly capabilities = {
    supportsBeaconEnrichment: false,
    supportsGVariants: false,
    supportsFilterEntries: false,
  } as const;

  private readonly store = getLocalDiscoveryStore();
  private readonly aiModelStore = getLocalAiModelStore();

  private mapDatasetLanguages(
    languages?: Array<{ value: string; label: string }>
  ): DiscoveryValueLabel[] {
    return languages?.map(({ value, label }) => ({ value, label })) ?? [];
  }

  private mapAgent(
    agent: LocalDiscoveryDataset["publishers"][number]
  ): DiscoveryAgent {
    return {
      name: agent.name,
      email: agent.email,
      url: agent.url,
      uri: agent.uri,
      homepage: agent.homepage,
      type: agent.type,
      identifier: agent.identifier,
      contactPoints: agent.contactPoints,
    };
  }

  private mapLocalDataset(
    dataset: LocalDiscoveryDataset
  ): DiscoveryDatasetBase {
    // HealthDCAT-AP can expose multiple spatial resolution values, but the
    // current UI and DDS-facing contract only support a single number.
    const spatialResolutionInMeters = dataset.spatialResolutionInMeters?.[0];
    // HealthDCAT-AP can expose multiple version notes, but the current UI and
    // DDS-facing contract only support a single string, so join them with a
    // newline (rendered one-per-line) instead of dropping all but the first.
    const versionNotes = dataset.versionNotes?.join("\n");

    return {
      id: dataset.id,
      identifier: dataset.identifier ?? "",
      title: dataset.title,
      description: dataset.description ?? "",
      catalogue: dataset.catalogue ?? "",
      languages: this.mapDatasetLanguages(dataset.languages),
      createdAt: dataset.createdAt,
      modifiedAt: dataset.modifiedAt,
      version: dataset.version,
      hasVersions: dataset.hasVersions,
      versionNotes,
      numberOfUniqueIndividuals: dataset.numberOfUniqueIndividuals,
      maxTypicalAge: dataset.maxTypicalAge,
      minTypicalAge: dataset.minTypicalAge,
      hasStructuredData: dataset.hasStructuredData,
      themes: dataset.themes ?? [],
      keywords: dataset.keywords ?? [],
      conformsTo: dataset.conformsTo ?? [],
      publishers: dataset.publishers.map((a) => this.mapAgent(a)),
      hdab: dataset.hdab.map((a) => this.mapAgent(a)),
      creators: dataset.creators.map((a) => this.mapAgent(a)),
      publisherType: dataset.publisherType,
      populationCoverage: dataset.populationCoverage,
      spatialResolutionInMeters,
      spatialCoverage: dataset.spatialCoverage?.map((sc) => ({
        uri: sc.uri ? { value: sc.uri, label: sc.uri } : undefined,
        text: sc.text,
        geom: sc.geom,
        bbox: sc.bbox,
        centroid: sc.centroid,
      })),
      temporalCoverage: dataset.temporalCoverage,
      retentionPeriod: dataset.retentionPeriod,
      temporalResolution: dataset.temporalResolution,
      frequency: dataset.frequency,
      accessRights: dataset.accessRights,
    };
  }

  private mapDistributions(
    dataset: LocalDiscoveryDataset,
    role: LocalDistributionRole
  ) {
    const distributions = dataset.distributions?.filter((distribution) =>
      getDistributionRoles(distribution).includes(role)
    );
    return distributions?.map((distribution) => ({
      id: distribution.id,
      title: distribution.title,
      description: distribution.description ?? "",
      format: distribution.format,
      mediaType: distribution.mediaType,
      license: distribution.license,
      rights: distribution.rights,
      status: distribution.status,
      availability: distribution.availability?.label,
      conformsTo: distribution.conformsTo,
      applicableLegislation: distribution.applicableLegislation,
      byteSize: distribution.byteSize,
      accessUrl: distribution.accessUrl,
      downloadUrl: distribution.downloadUrl,
      createdAt: distribution.createdAt,
    }));
  }

  async retrieveFilters(
    _headers: Record<string, string>
  ): Promise<DiscoveryFilter[]> {
    const localFilters = listLocalFilters();
    const resolvedFilters = await Promise.all(
      localFilters.map(async (filter) => {
        if (filter.type !== "DROPDOWN") {
          return (await this.store.hasFilterValues(filter.key))
            ? { ...filter, source: this.key }
            : null;
        }

        const values = await this.store.retrieveFilterValues(filter.key);
        if (!values.length) {
          return null;
        }

        return {
          ...filter,
          source: this.key,
          values,
        };
      })
    );

    return resolvedFilters.filter(
      (filter): filter is DiscoveryFilter => filter !== null
    );
  }

  async retrieveFilterValues(
    key: string,
    _headers: Record<string, string>
  ): Promise<DiscoveryValueLabel[]> {
    return this.store.retrieveFilterValues(key);
  }

  async searchDatasets(
    options: DiscoveryDatasetSearchQuery,
    headers: Record<string, string>
  ): Promise<DiscoveryDatasetsSearchResponse> {
    await this.store.ensureInitialized();
    const [response, facets] = await Promise.all([
      this.store.searchDatasets({
        query: options.query,
        facets: options.facets?.map(({ source: _source, ...facet }) => facet),
        sort: options.sort,
        start: options.start,
        rows: options.rows,
        operator: options.operator,
      }),
      this.retrieveFilters(headers),
    ]);

    return {
      count: response.count,
      results: response.results.map((dataset) => ({
        ...this.mapLocalDataset(dataset),
        distributionsCount: dataset.distributionsCount,
      })),
      facets,
    };
  }

  async retrieveDataset(id: string): Promise<DiscoveryRetrievedDataset> {
    await this.store.ensureInitialized();
    const dataset = await this.store.retrieveDataset(id);
    if (!dataset) {
      throw new Error(`Dataset not found in local index: ${id}`);
    }
    const dcatType = dataset.dcatType?.[0];
    const analytics = this.mapDistributions(dataset, "analytics");

    return {
      ...this.mapLocalDataset(dataset),
      contacts: dataset.contacts,
      datasetRelationships: dataset.datasetRelationships,
      dataDictionary: dataset.dataDictionary,
      healthTheme: dataset.healthTheme ?? [],
      healthCategory: dataset.healthCategory ?? [],
      dcatType,
      dcatTypes: dataset.dcatType ?? [],
      distributions: this.mapDistributions(dataset, "distribution"),
      analytics: analytics?.length ? analytics : undefined,
      custodians: dataset.custodians?.map((a) => this.mapAgent(a)),
      numberOfRecords: dataset.numberOfRecords,
      provenance: dataset.provenance,
      legalBasis: dataset.legalBasis,
      applicableLegislation: dataset.applicableLegislation,
      personalData: dataset.personalData,
      purpose: dataset.purpose,
      codeValues: dataset.codeValues,
      codingSystem: dataset.codingSystem,
      isReferencedBy: dataset.isReferencedBy,
      documentation: dataset.documentation,
      provenanceActivity: dataset.wasGeneratedBy?.map((a) => {
        const raw = a.activityType ?? "";
        const label = (raw.split("/").pop() ?? raw)
          .replace(/_/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());
        return { dct_type: a.activityType, label };
      }),
    };
  }

  async retrieveDatasetInFormat(
    id: string,
    format: "rdf" | "ttl" | "jsonld",
    _headers: Record<string, string>
  ): Promise<Blob> {
    await this.store.ensureInitialized();
    const dataset = await this.store.retrieveDataset(id);
    if (!dataset) {
      throw new Error(`Dataset not found in local index: ${id}`);
    }

    return new Blob([await serializeLocalDiscoveryDataset(dataset, format)], {
      type: getLocalDiscoveryDatasetExportMimeType(format),
    });
  }

  private mapLocalAiModel(
    aiModel: LocalDiscoveryAiModel
  ): DiscoverySearchedAiModel {
    return {
      id: aiModel.id,
      identifier: aiModel.identifier,
      title: aiModel.title,
      description: aiModel.description,
      createdAt: aiModel.createdAt,
      modifiedAt: aiModel.modifiedAt,
      version: aiModel.version,
      hasVersions: aiModel.hasVersions,
      versionNotes: aiModel.versionNotes,
      accessRights: aiModel.accessRights,
      keywords: aiModel.keywords ?? [],
      documentation: aiModel.documentation,
      publishers: aiModel.publishers.map((a) => this.mapAgent(a)),
      creators: aiModel.creators.map((a) => this.mapAgent(a)),
      libraries: aiModel.libraries,
    };
  }

  async searchAiModels(
    options: DiscoveryAiModelSearchQuery
  ): Promise<DiscoveryAiModelsSearchResponse> {
    const response = await this.aiModelStore.searchAiModels({
      query: options.query,
      sort: options.sort,
      start: options.start,
      rows: options.rows,
    });

    return {
      count: response.count,
      results: response.results.map((aiModel) => this.mapLocalAiModel(aiModel)),
    };
  }

  async retrieveAiModel(id: string): Promise<DiscoveryRetrievedAiModel> {
    const aiModel = await this.aiModelStore.retrieveAiModel(id);
    if (!aiModel) {
      throw new Error(`AI Model not found in local index: ${id}`);
    }

    return {
      ...this.mapLocalAiModel(aiModel),
      contacts: aiModel.contacts,
      modelTasks: aiModel.modelTasks,
    };
  }
}
