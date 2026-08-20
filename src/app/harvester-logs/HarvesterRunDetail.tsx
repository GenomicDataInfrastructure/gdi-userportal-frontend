// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useMemo } from "react";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcn/dialog";
import { useHarvesterLogs } from "@/providers/harvester-logs/HarvesterLogsProvider";
import HarvesterRunStatusBadge from "./HarvesterRunStatusBadge";
import HarvesterErrorGroupItem, {
  ErrorGroup,
} from "./HarvesterErrorGroupItem";
import HarvesterPill from "./HarvesterPill";
import HarvesterRunDetailField from "./HarvesterRunDetailField";

function groupErrorsByMessage(
  errors: { subjectId?: string; message: string; stack?: string }[]
): ErrorGroup[] {
  const groups = new Map<string, ErrorGroup>();

  for (const error of errors) {
    const existing = groups.get(error.message);
    if (existing) {
      existing.count += 1;
      if (error.subjectId) existing.subjectIds.push(error.subjectId);
    } else {
      groups.set(error.message, {
        message: error.message,
        count: 1,
        stack: error.stack,
        subjectIds: error.subjectId ? [error.subjectId] : [],
      });
    }
  }

  return Array.from(groups.values()).sort((a, b) => b.count - a.count);
}

export default function HarvesterRunDetail() {
  const t = useTranslations();
  const { selectedRun, isLoadingSelectedRun, clearSelectedRun } =
    useHarvesterLogs();

  const isOpen = isLoadingSelectedRun || selectedRun !== undefined;
  const errorGroups = useMemo(
    () => groupErrorsByMessage(selectedRun?.errors ?? []),
    [selectedRun]
  );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) clearSelectedRun();
      }}
    >
      <DialogContent className="sm:max-w-3xl bg-white max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("harvesterLogs.detail.title")}</DialogTitle>
        </DialogHeader>

        {isLoadingSelectedRun && (
          <div className="animate-pulse h-40 bg-gray-100 rounded-lg" />
        )}

        {!isLoadingSelectedRun && selectedRun === null && (
          <p className="text-gray-600">{t("harvesterLogs.detail.notFound")}</p>
        )}

        {!isLoadingSelectedRun && selectedRun && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <HarvesterRunDetailField
                label={t("harvesterLogs.fields.runId")}
                className="font-mono text-sm break-all"
              >
                {selectedRun.runId}
              </HarvesterRunDetailField>
              <HarvesterRunDetailField label={t("harvesterLogs.fields.status")}>
                <HarvesterRunStatusBadge status={selectedRun.status} />
              </HarvesterRunDetailField>
              <HarvesterRunDetailField
                label={t("harvesterLogs.fields.succeeded")}
                className="font-semibold"
              >
                {selectedRun.succeeded}
              </HarvesterRunDetailField>
              <HarvesterRunDetailField
                label={t("harvesterLogs.fields.failed")}
                className="font-semibold"
              >
                {selectedRun.failed}
              </HarvesterRunDetailField>
              <HarvesterRunDetailField
                label={t("harvesterLogs.fields.source")}
                className="text-sm break-all"
              >
                {selectedRun.source.url ?? selectedRun.source.path}
              </HarvesterRunDetailField>
              <HarvesterRunDetailField
                label={t("harvesterLogs.fields.mode")}
                className="text-sm"
              >
                {selectedRun.mode}
              </HarvesterRunDetailField>
            </div>

            {selectedRun.errors.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">
                  {t("harvesterLogs.detail.errorBreakdown")}
                </h3>
                <ul className="space-y-3">
                  {errorGroups.map((group) => (
                    <HarvesterErrorGroupItem key={group.message} group={group} />
                  ))}
                </ul>
              </div>
            )}

            {selectedRun.warnings.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">
                  {t("harvesterLogs.detail.fieldWarnings")}
                </h3>
                <ul className="space-y-2">
                  {selectedRun.warnings.map((warning) => (
                    <li
                      key={`${warning.subjectId}-${warning.type}`}
                      className="border border-yellow-300 bg-yellow-50 rounded-md p-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium break-all">
                          {warning.datasetTitle ?? warning.subjectId}
                        </p>
                        <HarvesterPill className="bg-white text-gray-700 border-gray-200">
                          {t(`harvesterLogs.warningType.${warning.type}`)}
                        </HarvesterPill>
                      </div>
                      <ul className="mt-1 space-y-0.5">
                        {warning.details.map((detail) => (
                          <li
                            key={detail}
                            className="text-xs text-gray-700 break-all"
                          >
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedRun.succeededDatasets.length > 0 && (
              <Disclosure>
                {({ open }) => (
                  <div>
                    <DisclosureButton className="font-semibold text-sm text-info hover:underline">
                      {open
                        ? t("harvesterLogs.detail.hideSucceededDatasets")
                        : t("harvesterLogs.detail.showSucceededDatasets", {
                            count: selectedRun.succeededDatasets.length,
                          })}
                    </DisclosureButton>
                    <DisclosurePanel>
                      <ul className="mt-2 space-y-1 max-h-48 overflow-y-auto">
                        {selectedRun.succeededDatasets.map((dataset) => (
                          <li
                            key={dataset.subjectId}
                            className="text-sm text-gray-700 border-b border-gray-100 py-1"
                          >
                            {dataset.datasetTitle ??
                              t("harvesterLogs.detail.untitledDataset")}
                            <span className="text-xs text-gray-400 ml-2 break-all">
                              {dataset.subjectId}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </DisclosurePanel>
                  </div>
                )}
              </Disclosure>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
