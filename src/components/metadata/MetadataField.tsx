// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import Tooltip from "@/components/Tooltip";

export const MetadataField = ({
  label,
  children,
  icon,
  tooltip,
}: {
  label: string;
  children: React.ReactNode;
  icon?: IconDefinition;
  tooltip?: string;
}) => (
  <div className="flex items-center gap-2 flex-wrap relative group">
    {icon && <FontAwesomeIcon icon={icon} className="text-primary text-xs" />}
    <span className="font-medium shrink-0 max-w-full">{label}:</span>
    <span>{children}</span>
    {tooltip && <Tooltip message={tooltip} />}
  </div>
);

export default MetadataField;
