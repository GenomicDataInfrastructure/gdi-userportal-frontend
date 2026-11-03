// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { faKey } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tooltip from "@/components/Tooltip";

type MetadataKeywordsProps = {
  keywords: string[];
  label: string;
  tooltip: string;
};

export default function MetadataKeywords({
  keywords,
  label,
  tooltip,
}: Readonly<MetadataKeywordsProps>) {
  if (keywords.length === 0) return null;

  return (
    <div className="mt-4">
      <div className="flex gap-2 items-center relative group">
        <FontAwesomeIcon icon={faKey} className="align-middle text-primary" />
        <span className="align-middle">{label}:</span>
        <div className="flex flex-wrap gap-1">
          {keywords.map((keyword) => (
            <span
              className="bg-warning bg-opacity-50 px-4 py-1 rounded-full text-gray font-medium text-[14px] inline-block"
              key={keyword}
            >
              {keyword}
            </span>
          ))}
        </div>
        <Tooltip message={tooltip} />
      </div>
    </div>
  );
}
