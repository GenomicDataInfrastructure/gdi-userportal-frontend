// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faFile } from "@fortawesome/free-solid-svg-icons";

interface FileUploadProps {
  name: string;
  label?: string;
  acceptedFileTypes?: string[];
  maxSizeMB?: number;
  multiple?: boolean;
  onChange?: (files: File[]) => void;
  initialFiles?: File[];
}

const FileUpload: React.FC<FileUploadProps> = ({
  name,
  label,
  acceptedFileTypes = ["pdf", "doc", "docx", "xls", "xlsx", "odt"],
  maxSizeMB = 5,
  multiple = true,
  onChange,
  initialFiles = [],
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>(initialFiles);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptString = acceptedFileTypes.map((type) => `.${type}`).join(",");

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setError("");
    const newFiles: File[] = [];
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Check file size
      if (file.size > maxSizeBytes) {
        setError(`File "${file.name}" exceeds ${maxSizeMB}MB limit`);
        continue;
      }

      // Check file type
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      if (fileExtension && !acceptedFileTypes.includes(fileExtension)) {
        setError(
          `File "${file.name}" has invalid type. Accepted: ${acceptedFileTypes.join(", ")}`
        );
        continue;
      }

      newFiles.push(file);
    }

    if (newFiles.length > 0) {
      const updatedFiles = multiple
        ? [...uploadedFiles, ...newFiles]
        : newFiles;
      setUploadedFiles(updatedFiles);

      // Call onChange callback with uploaded files
      if (onChange) {
        onChange(updatedFiles);
      }

      // TODO: Implement actual upload logic here
      // For now, we're just storing files in state
      console.log(`Uploading files for ${name}:`, newFiles);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(updatedFiles);

    if (onChange) {
      onChange(updatedFiles);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="file-upload-component">
      {label && (
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          {label}
        </label>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptString}
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
        aria-label={name}
      />

      <button
        type="button"
        onClick={handleButtonClick}
        className="rounded bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-secondary"
      >
        Select Files
      </button>

      {error && <div className="mt-2 text-sm text-red-600">{error}</div>}

      {uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          {uploadedFiles.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded px-3 py-2"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <FontAwesomeIcon
                  icon={faFile}
                  className="text-gray-400 flex-shrink-0"
                />
                <span className="text-sm text-gray-700 truncate">
                  {file.name}
                </span>
                <span className="text-xs text-gray-500 flex-shrink-0">
                  ({formatFileSize(file.size)})
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveFile(index)}
                className="ml-2 text-red-600 hover:text-red-800 flex-shrink-0"
                aria-label={`Remove ${file.name}`}
              >
                <FontAwesomeIcon icon={faTrash} className="text-sm" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
