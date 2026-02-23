// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

interface ApplicationFormTopBarProps {
  language: string;
  setLanguage: (language: string) => void;
  onSave?: () => Promise<void>;
  isSaving?: boolean;
  onExportToWord?: () => Promise<void>;
  isExporting?: boolean;
}

const ApplicationFormTopBar: React.FC<ApplicationFormTopBarProps> = ({
  language,
  setLanguage,
  onSave,
  isSaving = false,
  onExportToWord,
  isExporting = false,
}) => {
  const languages = ["English", "French", "German", "Spanish"];

  return (
    <div className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section - Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <a href="/" className="text-primary hover:underline">
            Home
          </a>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900">Application Form</span>
        </div>

        {/* Right Section - Buttons */}
        <div className="flex items-center gap-3">
          {/* Language Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-secondary">
              {language}
              <FontAwesomeIcon icon={faChevronDown} size="sm" />
            </button>
            <div className="absolute right-0 hidden pt-2 group-hover:block">
              <div className="rounded border border-gray-200 bg-white shadow-lg">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`block w-full px-4 py-2 text-left text-sm hover:bg-surface ${
                      lang === language ? "bg-surface font-medium" : ""
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="relative group">
            <button className="flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-secondary">
              Options
              <FontAwesomeIcon icon={faChevronDown} size="sm" />
            </button>
            <div className="absolute right-0 hidden pt-2 group-hover:block">
              <div className="min-w-[180px] rounded border border-gray-200 bg-white shadow-lg">
                <button
                  onClick={onExportToWord}
                  disabled={isExporting}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isExporting ? "Exporting..." : "Export to Word"}
                </button>
                <button className="block w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-surface">
                  Withdraw
                </button>
                <button className="block w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-surface">
                  Discard changes
                </button>
                <button className="block w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-surface">
                  Discard application
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={onSave}
            disabled={isSaving}
            className="rounded bg-warning px-4 py-2 text-sm font-medium text-black hover:bg-secondary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>

          <button className="rounded bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-secondary">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationFormTopBar;
