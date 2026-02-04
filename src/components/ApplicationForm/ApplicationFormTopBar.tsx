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
}

const ApplicationFormTopBar: React.FC<ApplicationFormTopBarProps> = ({
  language,
  setLanguage,
  onSave,
  isSaving = false,
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
          <a href="/data-requests" className="text-primary hover:underline">
            Data Request applications
          </a>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900">Application Form</span>
        </div>

        {/* Right Section - Buttons */}
        <div className="flex items-center gap-3">
          <button className="rounded bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
            Input
          </button>

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

          <button className="rounded bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-secondary">
            Options
          </button>

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
