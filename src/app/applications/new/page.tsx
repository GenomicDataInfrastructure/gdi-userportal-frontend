// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import LoadingContainer from "@/components/LoadingContainer";
import { UrlSearchParams } from "@/app/params";
import { use } from "react";
import ApplicationFormSidebar from "@/components/ApplicationForm/ApplicationFormSidebar";
import ApplicationFormTopBar from "@/components/ApplicationForm/ApplicationFormTopBar";
import ApplicationFormContent from "@/components/ApplicationForm/ApplicationFormContent";

type ApplicationPageProps = {
  searchParams: Promise<UrlSearchParams>;
};

interface FormSection {
  id: number;
  title: string;
  label: string;
  completed: number;
  total: number;
  isActive: boolean;
}

export default function Page({ searchParams }: ApplicationPageProps) {
  console.log("Rendering ApplicationForm Page");
  const _searchParams = use(searchParams);
  const { data: session, status } = useSession();
  const [currentSection, setCurrentSection] = useState<number>(1);
  const [language, setLanguage] = useState<string>("English");

  const [sections, setSections] = useState<FormSection[]>([
    {
      id: 1,
      title: "Section 1",
      label: "Selecting data sources for ...",
      completed: 6,
      total: 6,
      isActive: true,
    },
    {
      id: 2,
      title: "Section 2",
      label: "Public information of the pr...",
      completed: 5,
      total: 6,
      isActive: false,
    },
    {
      id: 3,
      title: "Section 3",
      label: "Applicant and contact pers...",
      completed: 14,
      total: 14,
      isActive: false,
    },
    {
      id: 4,
      title: "Section 4",
      label: "Payment details",
      completed: 15,
      total: 15,
      isActive: false,
    },
    {
      id: 5,
      title: "Section 5",
      label: "Purpose of data use",
      completed: 8,
      total: 9,
      isActive: false,
    },
    {
      id: 6,
      title: "Section 6",
      label: "Description of the data nee...",
      completed: 24,
      total: 24,
      isActive: false,
    },
    {
      id: 7,
      title: "Section 7",
      label: "Additional information",
      completed: 2,
      total: 2,
      isActive: false,
    },
    {
      id: 8,
      title: "Section 8",
      label: "Confirmation of information",
      completed: 4,
      total: 4,
      isActive: false,
    },
  ]);

  if (status === "loading") {
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
      <ApplicationFormTopBar language={language} setLanguage={setLanguage} />

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
          />
        </div>
      </div>
    </>
  );
}
