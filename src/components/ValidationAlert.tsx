// SPDX-FileCopyrightText: 2025 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

interface ValidationAlertProps {
  isOpen: boolean;
  onClose: () => void;
  missingFields: string[];
  title?: string;
}

const ValidationAlert: React.FC<ValidationAlertProps> = ({
  isOpen,
  onClose,
  missingFields,
  title = "Required Fields Missing",
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100">
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  className="text-yellow-600 text-xl"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <FontAwesomeIcon icon={faTimes} className="text-xl" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            <p className="text-sm text-gray-600 mb-4">
              Please fill in the following required fields before saving:
            </p>
            <ul className="space-y-2">
              {missingFields.map((field, index) => (
                <li
                  key={index}
                  className="flex items-start text-sm text-gray-700"
                >
                  <span className="text-primary mr-2 mt-0.5">•</span>
                  <span>{field}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-colors font-medium text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ValidationAlert;
