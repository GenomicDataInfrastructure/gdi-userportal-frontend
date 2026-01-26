// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";

interface ApplicationFormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const ApplicationFormSection: React.FC<ApplicationFormSectionProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      {description && (
        <p className="mt-2 text-sm text-gray-600">{description}</p>
      )}
      <div className="mt-4">{children}</div>
    </div>
  );
};

export default ApplicationFormSection;
