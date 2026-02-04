// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import Section1 from "@/components/ApplicationForm/Sections/Section1";
import Section2 from "@/components/ApplicationForm/Sections/Section2";
import Section3 from "@/components/ApplicationForm/Sections/Section3";
import Section4 from "@/components/ApplicationForm/Sections/Section4";
import Section5 from "@/components/ApplicationForm/Sections/Section5";
import Section6 from "@/components/ApplicationForm/Sections/Section6";
import Section7 from "@/components/ApplicationForm/Sections/Section7";
import Section8 from "@/components/ApplicationForm/Sections/Section8";
import { RetrievedApplicationData } from "@/app/api/access-management-v1";

interface FormSection {
  id: number;
  title: string;
  label: string;
  completed: number;
  total: number;
  isActive: boolean;
}

export interface SectionProps {
  applicationData?: RetrievedApplicationData | null;
  sectionDataRef?: React.MutableRefObject<any>;
}

interface ApplicationFormContentProps {
  section?: FormSection;
  progressPercentage: number;
  applicationData?: RetrievedApplicationData | null;
  sectionDataRef?: React.MutableRefObject<any>;
  onSave?: () => Promise<void>;
  isSaving?: boolean;
}

const sectionComponents: { [key: number]: React.FC<SectionProps> } = {
  1: Section1,
  2: Section2,
  3: Section3,
  4: Section4,
  5: Section5,
  6: Section6,
  7: Section7,
  8: Section8,
};

const ApplicationFormContent: React.FC<ApplicationFormContentProps> = ({
  section,
  progressPercentage,
  applicationData,
  sectionDataRef,
}) => {
  if (!section) {
    return (
      <div className="flex items-center justify-center p-8">
        No section selected
      </div>
    );
  }

  const SectionComponent = sectionComponents[section.id];

  return (
    <div className="bg-white">
      {/* Progress Bar */}
      <div className="border-b border-gray-200 bg-surface px-8 py-4">
        <div className="h-2 w-full rounded-full bg-gray-300">
          <div
            className="h-2 rounded-full bg-primary transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="mt-2 text-right text-sm font-medium text-gray-600">
          {Math.round(progressPercentage)}%
        </div>
      </div>

      {/* Section Title */}
      <div className="border-b border-gray-200 px-8 py-6">
        <h1 className="text-2xl font-bold text-gray-900">{section.label}</h1>
      </div>

      {/* Dynamic Section Content */}
      <div className="px-8 py-6">
        {SectionComponent ? (
          <SectionComponent
            applicationData={applicationData}
            sectionDataRef={sectionDataRef}
          />
        ) : (
          <div>Section not found</div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex gap-4 pb-8">
          <button className="rounded bg-gray-300 px-6 py-2 font-medium text-gray-700 hover:bg-gray-400">
            Previous Section
          </button>
          <button className="rounded bg-primary px-6 py-2 font-medium text-white hover:bg-secondary">
            Next Section
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationFormContent;
