// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect, useImperativeHandle } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import {
  UpdateApplicationSection7Request,
  uploadApplicationDataApi,
} from "@/app/api/access-management-v1";
import { SectionProps } from "../ApplicationFormContent";
import FileUpload from "../FileUpload";

export interface Section7Methods {
  uploadFiles: () => Promise<void>;
}

const Section7: React.FC<SectionProps> = ({
  applicationData,
  sectionDataRef,
  uploadRef,
}) => {
  const [additionalInformation, setAdditionalInformation] =
    useState<string>("");
  const [additionalAttachment, setAdditionalAttachment] = useState<any[]>([]);
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Handle file selection (deferred upload)
  const handleFileSelect = (files: File[]) => {
    setAttachmentFiles(files);
    setPendingFiles(files);
  };

  // Upload files when Save is triggered
  const uploadFiles = async () => {
    if (!applicationData?._id || pendingFiles.length === 0) {
      console.log("⚠️ No files to upload");
      return;
    }

    setIsUploading(true);
    try {
      const uploadPromises = pendingFiles.map((file) =>
        uploadApplicationDataApi(applicationData._id, file)
      );

      const uploadResults = await Promise.all(uploadPromises);

      // Extract file metadata from upload responses
      const newAttachments = uploadResults.map((result, index) => ({
        id: result.result?.id,
        name: pendingFiles[index].name,
        size: pendingFiles[index].size,
      }));

      console.log("📎 New attachments:", JSON.stringify(newAttachments));

      // Merge with existing attachments to avoid losing already uploaded files
      const updatedAttachments = [...additionalAttachment, ...newAttachments];
      setAdditionalAttachment(updatedAttachments);
      setPendingFiles([]); // Clear pending files after upload

      // Immediately update the ref with the new attachments
      if (sectionDataRef) {
        sectionDataRef.current = {
          sectionNumber: 7,
          additionalAttachment: updatedAttachments,
          additionalInformation: additionalInformation,
        };
      }
    } catch (error) {
      console.error("❌ File upload failed:", error);
      throw error; // Re-throw to be handled by the save handler
    } finally {
      setIsUploading(false);
    }
  };

  // Expose uploadFiles method via ref
  useImperativeHandle(uploadRef, () => ({
    uploadFiles,
  }));

  // Initialize from applicationData
  useEffect(() => {
    if (applicationData?.form?.section7) {
      console.log(
        "📋 Section7 Data from applicationData:",
        applicationData.form.section7
      );

      setAdditionalInformation(
        applicationData.form.section7.additionalInformation ?? ""
      );

      // If there are uploaded files, set them to the uploader
      const uploadedFiles =
        applicationData.form.section7.additionalAttachment ?? [];
      if (uploadedFiles.length > 0) {
        console.log("✅ Found uploaded files in section7:", uploadedFiles);
        setAdditionalAttachment(uploadedFiles);
      } else {
        console.log("⚠️ No uploaded files found in section7");
      }
    } else {
      console.log("⚠️ No section7 data found in applicationData");
    }
  }, [applicationData?.form?.section7]);

  // Update sectionDataRef whenever data changes
  useEffect(() => {
    if (sectionDataRef) {
      const section7Data: UpdateApplicationSection7Request = {
        sectionNumber: 7,
        additionalAttachment: additionalAttachment,
        additionalInformation: additionalInformation,
      };
      sectionDataRef.current = section7Data;
    }
  }, [sectionDataRef, additionalInformation, additionalAttachment]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle file deletion
  const handleDeleteFile = (fileId: string) => {
    console.log("🗑️ Deleting file:", fileId);
    setAdditionalAttachment((prevFiles) =>
      prevFiles.filter((file) => file.id !== fileId)
    );
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <>
      {/* Further information or any additional notes */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Further information or any additional notes
        </label>
        <div className="flex items-center gap-2 mb-3">
          <FontAwesomeIcon
            icon={faInfoCircle}
            className="text-gray-500 text-xs"
          />
          <span className="text-xs italic text-gray-600">
            Here you can provide further information on any of the sections in
            your application. Indicate the number of section and the question to
            which your comment refers.
          </span>
        </div>
        <textarea
          rows={6}
          value={additionalInformation}
          onChange={(e) => setAdditionalInformation(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>

      {/* An additional attachment */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          An additional attachment. Do not attach health or personal data to
          this application.
        </label>
        <div className="flex items-center gap-2 mb-3">
          <FontAwesomeIcon
            icon={faInfoCircle}
            className="text-gray-500 text-xs"
          />
          <span className="text-xs italic text-gray-600">
            If you have any other attachment that you deem important regarding
            the processing of your application and necessary for the Health Data
            Access Body to use, attach it here. Describe its relevance in the
            text field above.
          </span>
        </div>
        <p className="text-xs text-gray-600 mb-3">
          Only pdf, doc, docx, xls, xlsx, odt files. Maximum size is 5 MB.
        </p>
        <textarea
          rows={4}
          placeholder="Describe the relevance of your attachment"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary mb-3"
        />

        {/* Uploaded Files List */}
        {additionalAttachment.length > 0 && (
          <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              📄 Uploaded Files ({additionalAttachment.length})
            </h3>
            <div className="space-y-2">
              {additionalAttachment.map((file, index) => (
                <div
                  key={file.id || index}
                  className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-gray-400 text-lg">📎</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteFile(file.id)}
                    className="ml-2 px-3 py-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded hover:bg-red-100 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {isUploading && (
          <div className="mb-3 text-sm text-blue-600">
            Uploading files, please wait...
          </div>
        )}
        {pendingFiles.length > 0 && !isUploading && (
          <div className="mb-3 text-sm text-amber-600">
            {pendingFiles.length} file(s) ready to upload. Click Save to upload.
          </div>
        )}
        <FileUpload
          name="additionalAttachment"
          onChange={handleFileSelect}
          initialFiles={attachmentFiles}
        />
      </div>

      {/* Go To Top Button */}
      <div className="flex justify-end pb-8">
        <button
          onClick={scrollToTop}
          className="rounded bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-secondary"
        >
          Go To Top
        </button>
      </div>
    </>
  );
};

export default Section7;
