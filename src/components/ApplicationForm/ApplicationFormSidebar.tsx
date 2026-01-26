// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

interface FormSection {
  id: number;
  title: string;
  label: string;
  completed: number;
  total: number;
  isActive: boolean;
}

interface ApplicationFormSidebarProps {
  sections: FormSection[];
  currentSection: number;
  onSectionChange: (sectionId: number) => void;
}

const ApplicationFormSidebar: React.FC<ApplicationFormSidebarProps> = ({
  sections,
  currentSection,
  onSectionChange,
}) => {
  const isFullyCompleted = (section: FormSection) =>
    section.completed === section.total;

  return (
    <div className="w-48 flex-shrink-0 border-r border-gray-200 bg-white">
      <div className="flex h-full flex-col overflow-y-auto">
        {/* Sections List */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={`w-full rounded-lg px-3 py-3 text-left transition-colors ${
                section.id === currentSection
                  ? "bg-primary/10 text-primary"
                  : "text-gray-700 hover:bg-surface"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{section.title}</span>
                    {isFullyCompleted(section) && (
                      <FontAwesomeIcon
                        icon={faCheck}
                        size="sm"
                        className="text-green-600"
                      />
                    )}
                  </div>
                  <p className="truncate text-xs text-gray-500">
                    {section.label}
                  </p>
                  <div className="mt-1 text-xs font-medium text-gray-600">
                    {section.completed}/{section.total}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </nav>

        {/* Bottom Section - European Union */}
        <div className="border-t border-gray-200 p-3">
          <button className="w-full rounded-lg bg-primary px-3 py-3 text-left text-white transition-colors hover:bg-secondary">
            <div className="flex items-center justify-between">
              <span className="font-medium">European Union</span>
              <FontAwesomeIcon
                icon={faCheck}
                size="sm"
                className="text-white"
              />
            </div>
            <div className="mt-1 text-xs text-white/80">24/24</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationFormSidebar;
