// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { ListedApplication } from "@/app/api/access-management/open-api/schemas";

export type ListedApplicationCatalogStatus = {
  status?: string;
  latest?: number;
  date_received?: string;
};

export type ListedApplicationCatalog = {
  statuses?: ListedApplicationCatalogStatus[];
};

export type ListedApplicationListItem = ListedApplication & {
  catalogs?: ListedApplicationCatalog[];
  translation?: {
    status?: string;
  };
};

export type ApplicationStatusFilter =
  | "ALL"
  | "DRAFT"
  | "EXPIRED"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "WITHDRAWN";

function normalizeStatusValue(value: string | undefined): string {
  return (
    String(value ?? "")
      .split("/")
      .pop()
      ?.replace(/[_-]+/g, " ")
      .trim()
      .toLowerCase() ?? ""
  );
}

function toTitleCase(value: string): string {
  return value.replace(/\b\w/g, (character) => character.toUpperCase());
}

function isEditReadyTranslationStatus(value: string | undefined): boolean {
  return normalizeStatusValue(value) === "files completed";
}

function canMoveTranslationBackToEdit(value: string | undefined): boolean {
  const normalized = normalizeStatusValue(value);
  return normalized === "form pending" || normalized === "completed";
}

export function isApplicationEditableDraft(
  application: ListedApplicationListItem
): boolean {
  return (
    normalizeStatusValue(application.currentState) === "draft" ||
    (normalizeStatusValue(application.currentState) === "on going" &&
      isEditReadyTranslationStatus(application.translation?.status))
  );
}

export function getApplicationStatusLabel(value: string | undefined): string {
  const normalized = normalizeStatusValue(value);

  if (!normalized) return "Unknown";
  if (normalized === "draft") return "Draft";
  if (normalized === "approved") return "Approved";
  if (normalized === "rejected") return "Rejected";
  if (normalized === "withdrawn") return "Withdrawn";
  if (normalized === "under review") return "Under Review";
  if (normalized === "additional information") return "Additional Information";
  if (normalized === "on going") return "on-going";
  if (normalized === "submitted") return "Submitted";

  return toTitleCase(normalized);
}

export function getLatestApplicationCatalogStatuses(
  application: ListedApplicationListItem
): string[] {
  return (application.catalogs ?? [])
    .map((catalog) => {
      const statuses = catalog.statuses ?? [];
      const latestStatus =
        statuses.find((status) => Number(status.latest) === 1) ??
        statuses[statuses.length - 1];

      return String(latestStatus?.status ?? "").trim();
    })
    .filter(Boolean);
}

export function getLatestApplicationCatalogDate(
  application: ListedApplicationListItem
): string | undefined {
  const dates = (application.catalogs ?? [])
    .map((catalog) => {
      const statuses = catalog.statuses ?? [];
      const latestStatus =
        statuses.find((status) => Number(status.latest) === 1) ??
        statuses[statuses.length - 1];

      return latestStatus?.date_received;
    })
    .filter((date): date is string => Boolean(date));

  return dates.sort((a, b) => a.localeCompare(b)).pop();
}

export function getApplicationDisplayStatusLabel(
  application: ListedApplicationListItem
): string {
  if (isApplicationEditableDraft(application)) return "Draft";

  const normalizedCatalogStatuses = getLatestApplicationCatalogStatuses(
    application
  ).map((status) => normalizeStatusValue(status));

  if (normalizedCatalogStatuses.includes("withdrawn")) return "Withdrawn";
  if (normalizedCatalogStatuses.includes("rejected")) return "Rejected";
  if (normalizedCatalogStatuses.includes("decision issued")) return "Approved";
  if (normalizedCatalogStatuses.includes("additional information")) {
    return "Action needed: additional information";
  }

  return getApplicationStatusLabel(application.currentState);
}

export function isApplicationAwaitingAdditionalInformation(
  application: ListedApplicationListItem
): boolean {
  return getLatestApplicationCatalogStatuses(application)
    .map((status) => normalizeStatusValue(status))
    .includes("additional information");
}

export function getChangeRequestDate(
  application: ListedApplicationListItem
): string | undefined {
  const dates = (application.catalogs ?? [])
    .map((catalog) => {
      const statuses = catalog.statuses ?? [];
      const latestStatus =
        statuses.find((status) => Number(status.latest) === 1) ??
        statuses[statuses.length - 1];
      if (
        normalizeStatusValue(latestStatus?.status) !== "additional information"
      ) {
        return undefined;
      }
      return latestStatus?.date_received;
    })
    .filter((date): date is string => Boolean(date));

  return dates.sort().pop();
}

export function getApplicationStatusFilterValue(
  value: string | undefined,
  latestCatalogStatuses: string[] = [],
  translationStatus?: string
): Exclude<ApplicationStatusFilter, "ALL"> {
  if (
    normalizeStatusValue(value) === "draft" ||
    (normalizeStatusValue(value) === "on going" &&
      isEditReadyTranslationStatus(translationStatus))
  ) {
    return "DRAFT";
  }

  const normalizedCatalogStatuses = latestCatalogStatuses.map((status) =>
    normalizeStatusValue(status)
  );

  if (normalizedCatalogStatuses.includes("withdrawn")) return "WITHDRAWN";
  if (normalizedCatalogStatuses.includes("rejected")) return "REJECTED";
  if (
    normalizedCatalogStatuses.includes("positive decision accepted") ||
    normalizedCatalogStatuses.includes("negative decision accepted")
  ) {
    return "APPROVED";
  }
  if (
    normalizedCatalogStatuses.includes("positive decision rejected") ||
    normalizedCatalogStatuses.includes("negative decision issued")
  ) {
    return "REJECTED";
  }
  if (normalizedCatalogStatuses.includes("negative decision appealed")) {
    return "UNDER_REVIEW";
  }
  if (
    normalizedCatalogStatuses.includes("decision issued") ||
    normalizedCatalogStatuses.includes("positive decision issued")
  ) {
    return "APPROVED";
  }
  if (normalizedCatalogStatuses.includes("additional information")) {
    return "UNDER_REVIEW";
  }

  const normalized = normalizeStatusValue(value);

  if (normalized === "draft") return "DRAFT";
  if (normalized === "approved") return "APPROVED";
  if (normalized === "rejected") return "REJECTED";
  if (normalized === "withdrawn") return "WITHDRAWN";
  if (
    normalized === "under review" ||
    normalized === "on going" ||
    normalized === "additional information"
  ) {
    return "UNDER_REVIEW";
  }

  return "SUBMITTED";
}

const DECISION_STATUSES = new Set([
  "POSITIVE_DECISION_ISSUED",
  "NEGATIVE_DECISION_ISSUED",
  "POSITIVE_DECISION_ACCEPTED",
  "POSITIVE_DECISION_REJECTED",
  "NEGATIVE_DECISION_ACCEPTED",
  "NEGATIVE_DECISION_APPEALED",
  "DECISION_ISSUED",
]);

const POSITIVE_DECISION_STATUSES = new Set([
  "POSITIVE_DECISION_ISSUED",
  "POSITIVE_DECISION_ACCEPTED",
  "POSITIVE_DECISION_REJECTED",
]);

const NEGATIVE_DECISION_STATUSES = new Set([
  "NEGATIVE_DECISION_ISSUED",
  "NEGATIVE_DECISION_ACCEPTED",
  "NEGATIVE_DECISION_APPEALED",
]);

export function hasDecisionCatalogStatus(
  application: ListedApplicationListItem
): boolean {
  return getLatestApplicationCatalogStatuses(application).some((status) =>
    DECISION_STATUSES.has(status.toUpperCase())
  );
}

export function hasPositiveDecisionCatalogStatus(
  application: ListedApplicationListItem
): boolean {
  return getLatestApplicationCatalogStatuses(application).some((status) =>
    POSITIVE_DECISION_STATUSES.has(status.toUpperCase())
  );
}

export function getApplicationDecisionType(
  application: ListedApplicationListItem
): "POSITIVE" | "NEGATIVE" | null {
  const latestStatuses = getLatestApplicationCatalogStatuses(application).map(
    (s) => s.toUpperCase()
  );
  const hasPositive = latestStatuses.some((s) =>
    POSITIVE_DECISION_STATUSES.has(s)
  );
  const hasNegative = latestStatuses.some((s) =>
    NEGATIVE_DECISION_STATUSES.has(s)
  );
  if (hasPositive && !hasNegative) return "POSITIVE";
  if (hasNegative && !hasPositive) return "NEGATIVE";
  if (hasPositive) return "POSITIVE";
  return null;
}

export function canDeleteApplication(value: string | undefined): boolean {
  return normalizeStatusValue(value) === "draft";
}

export function canWithdrawApplication(
  value: string | undefined,
  translationStatus?: string
): boolean {
  return (
    normalizeStatusValue(value) === "on going" &&
    canMoveTranslationBackToEdit(translationStatus)
  );
}

export function canReissueApplication(
  value: string | undefined,
  latestCatalogStatuses: string[] = []
): boolean {
  const normalizedCatalogStatuses = latestCatalogStatuses.map((status) =>
    normalizeStatusValue(status)
  );
  if (normalizedCatalogStatuses.length > 0) {
    return normalizedCatalogStatuses.some((status) =>
      ["additional information", "rejected", "withdrawn", "removed"].includes(
        status
      )
    );
  }

  return [
    "additional information",
    "rejected",
    "withdrawn",
    "removed",
  ].includes(normalizeStatusValue(value));
}

export function shouldCloneApplicationForReissue(
  value: string | undefined,
  latestCatalogStatuses: string[] = []
): boolean {
  const normalizedCatalogStatuses = latestCatalogStatuses.map((status) =>
    normalizeStatusValue(status)
  );
  if (normalizedCatalogStatuses.length > 0) {
    return normalizedCatalogStatuses.some((status) =>
      ["rejected", "withdrawn", "removed"].includes(status)
    );
  }

  return ["rejected", "withdrawn", "removed"].includes(
    normalizeStatusValue(value)
  );
}

export function getApplicationReviewRestartLabel(): "Re-issue" {
  return "Re-issue";
}

const STATUS_I18N_KEYS: Record<string, string> = {
  Unknown: "appStatus.unknown",
  Draft: "appStatus.draft",
  Approved: "appStatus.approved",
  Rejected: "appStatus.rejected",
  Withdrawn: "appStatus.withdrawn",
  "Under Review": "appStatus.underReview",
  "Additional Information": "appStatus.additionalInformation",
  "on-going": "appStatus.onGoing",
  Submitted: "appStatus.submitted",
  "Action needed: additional information": "appStatus.actionNeeded",
};

export function translateApplicationStatusLabel(
  englishLabel: string,
  t: (key: string) => string
): string {
  const key = STATUS_I18N_KEYS[englishLabel];
  return key ? t(key) : englishLabel;
}
