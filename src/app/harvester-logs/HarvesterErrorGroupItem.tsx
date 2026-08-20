// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { useTranslations } from "next-intl";
import {
  classifyHarvesterError,
  HarvesterErrorCategory,
} from "./errorClassification";
import HarvesterPill from "./HarvesterPill";

export type ErrorGroup = {
  message: string;
  count: number;
  stack?: string;
  subjectIds: string[];
};

const CATEGORY_STYLES: Record<HarvesterErrorCategory, string> = {
  sourceUnreachable: "border-orange-300 bg-orange-50",
  sourceNotFound: "border-orange-300 bg-orange-50",
  invalidXml: "border-red-300 bg-red-50",
  authorizationFailed: "border-red-300 bg-red-50",
  indexUnavailable: "border-red-300 bg-red-50",
  datasetMappingFailed: "border-yellow-300 bg-yellow-50",
  unknown: "border-gray-300 bg-gray-50",
};

type HarvesterErrorGroupItemProps = {
  group: ErrorGroup;
};

export default function HarvesterErrorGroupItem({
  group,
}: Readonly<HarvesterErrorGroupItemProps>) {
  const t = useTranslations();
  const category = classifyHarvesterError(group.message, group.subjectIds[0]);

  return (
    <li className={`border rounded-md p-3 ${CATEGORY_STYLES[category]}`}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium">
          {t(`harvesterLogs.errorCategory.${category}`)}
        </p>
        <HarvesterPill className="bg-white text-gray-700 border-gray-200">
          {t("harvesterLogs.detail.occurrences", { count: group.count })}
        </HarvesterPill>
      </div>

      {group.subjectIds.length > 0 && (
        <p className="text-xs text-gray-600 mt-1 break-all">
          {t("harvesterLogs.detail.affectedDataset")}:{" "}
          {group.subjectIds.join(", ")}
        </p>
      )}

      <Disclosure>
        {({ open }) => (
          <>
            <DisclosureButton className="text-xs text-info hover:underline mt-2">
              {open
                ? t("harvesterLogs.detail.hideTechnicalDetails")
                : t("harvesterLogs.detail.showTechnicalDetails")}
            </DisclosureButton>
            <DisclosurePanel className="mt-2">
              <p className="text-xs text-gray-700 break-all">{group.message}</p>
              {group.stack && (
                <pre className="mt-1 text-xs text-gray-600 whitespace-pre-wrap overflow-x-auto">
                  {group.stack}
                </pre>
              )}
            </DisclosurePanel>
          </>
        )}
      </Disclosure>
    </li>
  );
}
