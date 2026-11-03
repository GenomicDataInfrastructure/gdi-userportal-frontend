// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

export const MetadataSection = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: IconDefinition;
  children: React.ReactNode;
}) => (
  <div className="mt-4 p-4 bg-surface rounded-lg">
    <h2 className="text-[18px] font-semibold pb-2.5 flex items-center gap-2">
      <FontAwesomeIcon icon={icon} className="text-primary" />
      {title}
    </h2>
    {children}
  </div>
);

export default MetadataSection;
