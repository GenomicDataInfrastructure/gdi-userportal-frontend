// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import LoadingContainer from "@/components/LoadingContainer";
import ApplicationFormSidebar from "@/components/ApplicationForm/ApplicationFormSidebar";
import ApplicationFormTopBar from "@/components/ApplicationForm/ApplicationFormTopBar";
import ApplicationFormContent from "@/components/ApplicationForm/ApplicationFormContent";
import {
  getApplicationApi,
  RetrievedApplicationData,
  updateApplicationSection1Api,
  updateApplicationSection2Api,
  updateApplicationSection3Api,
  updateApplicationSection4Api,
} from "@/app/api/access-management-v1";

interface FormSection {
  id: number;
  title: string;
  label: string;
  completed: number;
  total: number;
  isActive: boolean;
}

export default function Page() {
  const searchParams = useSearchParams();
  const applicationId = searchParams.get("id");
  const { data: session, status } = useSession();
  const [currentSection, setCurrentSection] = useState<number>(1);
  const [language, setLanguage] = useState<string>("English");
  const [applicationData, setApplicationData] =
    useState<RetrievedApplicationData | null>(null);
  const [isLoadingApplication, setIsLoadingApplication] =
    useState<boolean>(true);
  const sectionDataRef = useRef<any>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleSaveSection = async () => {
    try {
      setIsSaving(true);

      if (!applicationId || !sectionDataRef.current) {
        console.error("Missing application ID or section data");
        return;
      }

      const sectionData = sectionDataRef.current;
      const sectionNumber = sectionData.sectionNumber;

      switch (sectionNumber) {
        case 1:
          console.log("Saving Section 1 data:", sectionData);
          await updateApplicationSection1Api(
            String(applicationId),
            sectionData
          );
          console.log("✅ Section 1 saved successfully");
          break;
        case 2:
          console.log("Saving Section 2 data:", sectionData);
          await updateApplicationSection2Api(
            String(applicationId),
            sectionData
          );
          console.log("✅ Section 2 saved successfully");
          break;
        case 3:
          console.log("Saving Section 3 data:", sectionData);
          await updateApplicationSection3Api(
            String(applicationId),
            sectionData
          );
          console.log("✅ Section 3 saved successfully");
          break;
        case 4:
          console.log("Saving Section 4 data:", sectionData);
          await updateApplicationSection4Api(
            String(applicationId),
            sectionData
          );
          console.log("✅ Section 4 saved successfully");
          break;
        // Add more cases for other sections as needed
        default:
          console.warn(`No save handler for section ${sectionNumber}`);
      }
    } catch (error) {
      console.error("Failed to save section:", error);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setIsLoadingApplication(true);
        const data = await getApplicationApi(String(applicationId));
        console.log("Fetched Application Data:", data);
        setApplicationData(data);
      } catch (error) {
        console.error("Failed to fetch application:", error);
      } finally {
        setIsLoadingApplication(false);
      }
    };

    if (applicationId) {
      fetchApplication();
    }
  }, [applicationId]);

  const [sections, setSections] = useState<FormSection[]>([
    {
      id: 1,
      title: "Section 1",
      label: "Selecting data sources for ...",
      completed: 1,
      total: 6,
      isActive: true,
    },
    {
      id: 2,
      title: "Section 2",
      label: "Public information of the pr...",
      completed: 1,
      total: 6,
      isActive: false,
    },
    {
      id: 3,
      title: "Section 3",
      label: "Applicant and contact pers...",
      completed: 1,
      total: 14,
      isActive: false,
    },
    {
      id: 4,
      title: "Section 4",
      label: "Payment details",
      completed: 1,
      total: 15,
      isActive: false,
    },
    {
      id: 5,
      title: "Section 5",
      label: "Purpose of data use",
      completed: 1,
      total: 9,
      isActive: false,
    },
    {
      id: 6,
      title: "Section 6",
      label: "Description of the data nee...",
      completed: 1,
      total: 24,
      isActive: false,
    },
    {
      id: 7,
      title: "Section 7",
      label: "Additional information",
      completed: 1,
      total: 2,
      isActive: false,
    },
    {
      id: 8,
      title: "Section 8",
      label: "Confirmation of information",
      completed: 1,
      total: 4,
      isActive: false,
    },
  ]);

  if (status === "loading" || isLoadingApplication) {
    return <LoadingContainer text="Loading application..." />;
  }

  const handleSectionChange = (sectionId: number) => {
    setSections(
      sections.map((section) => ({
        ...section,
        isActive: section.id === sectionId,
      }))
    );
    setCurrentSection(sectionId);
  };

  const currentSectionData = sections.find((s) => s.id === currentSection);
  const progressPercentage = currentSectionData
    ? (currentSectionData.completed / currentSectionData.total) * 100
    : 0;

  return (
    <>
      {/* Fixed Top Bar */}
      <ApplicationFormTopBar
        language={language}
        setLanguage={setLanguage}
        onSave={handleSaveSection}
        isSaving={isSaving}
      />
      {/* Main Content - Fixed Sidebar + Scrollable Content */}
      <div className="flex">
        {/* Fixed Sidebar */}
        <ApplicationFormSidebar
          sections={sections}
          currentSection={currentSection}
          onSectionChange={handleSectionChange}
        />

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          <ApplicationFormContent
            section={currentSectionData}
            progressPercentage={progressPercentage}
            applicationData={applicationData}
            sectionDataRef={sectionDataRef}
          />
        </div>
      </div>
    </>
  );
}
