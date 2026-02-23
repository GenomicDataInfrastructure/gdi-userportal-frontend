// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import LoadingContainer from "@/components/LoadingContainer";
import ApplicationFormSidebar from "@/components/ApplicationForm/ApplicationFormSidebar";
import ApplicationFormTopBar from "@/components/ApplicationForm/ApplicationFormTopBar";
import ApplicationFormContent from "@/components/ApplicationForm/ApplicationFormContent";
import { Section7Methods } from "@/components/ApplicationForm/Sections/Section7";
import {
  getApplicationApi,
  RetrievedApplicationData,
  updateApplicationSection1Api,
  updateApplicationSection2Api,
  updateApplicationSection3Api,
  updateApplicationSection4Api,
  updateApplicationSection5Api,
  updateApplicationSection6Api,
  updateApplicationSection7Api,
  updateApplicationSection8Api,
  exportApplicationToWordApi,
} from "@/app/api/access-management-v1";

interface FormSection {
  id: number;
  title: string;
  label: string;
  completed: number;
  total: number;
  isActive: boolean;
}

const MIN_SECTION = 1;
const MAX_SECTION = 8;

// Utility function to check if a value is "filled"
const isFieldFilled = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "boolean") return true; // booleans are always considered filled
  if (typeof value === "number") return true;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") {
    // For objects like { key, value }, check if the value property exists
    if ("value" in value) return isFieldFilled(value.value);
    if ("key" in value) return isFieldFilled(value.key);
    return Object.keys(value).length > 0;
  }
  return false;
};

// Calculate filled/total fields for each section
const calculateSectionProgress = (
  data: RetrievedApplicationData | null
): { [sectionId: number]: { filled: number; total: number } } => {
  if (!data?.form) {
    return {};
  }

  const form = data.form;
  const result: { [sectionId: number]: { filled: number; total: number } } = {};

  // Section 1: datasetVariables (count selected variables)
  const section1Fields = ["datasetVariables"];
  const section1 = form.section1;
  result[1] = {
    filled:
      section1?.datasetVariables && section1.datasetVariables.length > 0
        ? 1
        : 0,
    total: 1,
  };

  // Section 2: Public information of the project
  const section2Fields = [
    "projectName",
    "projectLeader",
    "countryOfProjectLeader",
    "purposeForWhichDataWillBeUsed",
    "summaryOfTheProject",
    "theNatureOfTheProjectDoesNotLetYouProvideASummary",
  ];
  const section2 = form.section2;
  result[2] = {
    filled: section2
      ? section2Fields.filter((f) => isFieldFilled((section2 as any)[f])).length
      : 0,
    total: section2Fields.length,
  };

  // Section 3: Applicant and contact person - conditional fields based on legal/natural person
  const section3BaseFields = [
    "legalOrNaturalPerson",
    "applyingForDataOnBehalfOfPublicSector",
    "applyingForDataForCarryingOutTasks",
    "contactPersonName",
    "contactPersonEmail",
    "contactPersonPhone",
  ];
  const section3NaturalFields = [
    "naturalPersonName",
    "naturalPersonAddress",
    "naturalPersonZipCode",
    "naturalPersonCity",
    "naturalPersonCountry",
    "naturalPersonEmail",
    "naturalPersonPhone",
  ];
  const section3LegalFields = [
    "legalPersonName",
    "legalPersonAddress",
    "legalPersonZipCode",
    "legalPersonCity",
    "legalPersonCountry",
  ];
  const section3 = form.section3;
  const isNaturalPerson =
    section3?.legalOrNaturalPerson?.key === "natural-person";
  const section3Fields = [
    ...section3BaseFields,
    ...(isNaturalPerson ? section3NaturalFields : section3LegalFields),
  ];
  result[3] = {
    filled: section3
      ? section3Fields.filter((f) => isFieldFilled((section3 as any)[f])).length
      : 0,
    total: section3Fields.length,
  };

  // Section 4: Payment details
  const section4Fields = [
    "sameAsContactPerson",
    "fullName",
    "email",
    "address",
    "phone",
    "invoiceType",
    "vatNumber",
    "isTheProjectFinanciallyCovered",
    "invoiceReferenceNumber",
    "invoiceAddress",
  ];
  const section4 = form.section4;
  result[4] = {
    filled: section4
      ? section4Fields.filter((f) => isFieldFilled((section4 as any)[f])).length
      : 0,
    total: section4Fields.length,
  };

  // Section 5: Purpose of data use
  const section5Fields = [
    "personResponsibleSameAsContactPerson",
    "personResponsibleName",
    "personResearchSameAsContactPerson",
    "personResearchName",
    "whyAreTheDataRequested",
    "whatIsTheAimAndTopicOfTheProject",
    "whichAreTheExpectedBenefits",
    "describeApplicantsQualification",
    "legalBasis",
  ];
  const section5 = form.section5;
  result[5] = {
    filled: section5
      ? section5Fields.filter((f) => isFieldFilled((section5 as any)[f])).length
      : 0,
    total: section5Fields.length,
  };

  // Section 6: Data extraction details - based on country entries
  const section6 = form.section6;
  const section6Entries = Array.isArray(section6) ? section6 : [];
  const section6FieldsPerEntry = [
    "howWillTheDataFromDifferentSourcesBeLinked",
    "indicateTheSizeOfTheStudyCohort",
    "indicateTheSizeOfTheStudyCohortEstimationOrExact",
    "whyNeedStudyCohortOfThisSize",
    "timePeriodOfDataExtraction",
    "extractionMethod",
    "inclusionCriteria",
    "howOftenDoesTheDataNeedToBeExtractedOnceOrMultiple",
    "needForDataExtractionEveryDescription",
    "optOutOfTheMechanismProvidedInTheNationalLaw",
  ];
  if (section6Entries.length > 0) {
    const totalFields = section6Entries.length * section6FieldsPerEntry.length;
    let filledFields = 0;
    section6Entries.forEach((entry: any) => {
      filledFields += section6FieldsPerEntry.filter((f) =>
        isFieldFilled(entry[f])
      ).length;
    });
    result[6] = { filled: filledFields, total: totalFields };
  } else {
    result[6] = { filled: 0, total: section6FieldsPerEntry.length };
  }

  // Section 7: Additional information
  const section7Fields = ["additionalAttachment", "additionalInformation"];
  const section7 = form.section7;
  result[7] = {
    filled: section7
      ? section7Fields.filter((f) => isFieldFilled((section7 as any)[f])).length
      : 0,
    total: section7Fields.length,
  };

  // Section 8: Confirmation
  const section8Fields = [
    "acceptHealthDataBody",
    "awareProcessingFee",
    "awareChargeFee",
    "awareInformationCorrect",
  ];
  const section8 = form.section8;
  result[8] = {
    filled: section8
      ? section8Fields.filter((f) => isFieldFilled((section8 as any)[f])).length
      : 0,
    total: section8Fields.length,
  };

  return result;
};

const getValidSection = (sectionParam: string | null): number => {
  const parsedSection = Number(sectionParam);

  if (!Number.isInteger(parsedSection)) {
    return MIN_SECTION;
  }

  return Math.min(MAX_SECTION, Math.max(MIN_SECTION, parsedSection));
};

export default function Page() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const applicationId = searchParams.get("id");
  const { data: session, status } = useSession();
  const [currentSection, setCurrentSection] = useState<number>(
    getValidSection(searchParams.get("section"))
  );
  const [language, setLanguage] = useState<string>("English");
  const [applicationData, setApplicationData] =
    useState<RetrievedApplicationData | null>(null);
  const [isLoadingApplication, setIsLoadingApplication] =
    useState<boolean>(true);
  const sectionDataRef = useRef<any>(null);
  const section7UploadRef = useRef<Section7Methods>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const fetchApplication = async () => {
    try {
      if (!applicationId) {
        return;
      }

      setIsLoadingApplication(true);
      const data = await getApplicationApi(String(applicationId));
      console.log("Fetched Application Data:", data);
      setApplicationData(data);

      // Update section progress based on fetched data
      const progress = calculateSectionProgress(data);
      setSections((prevSections) =>
        prevSections.map((section) => ({
          ...section,
          completed: progress[section.id]?.filled ?? section.completed,
          total: progress[section.id]?.total ?? section.total,
        }))
      );
    } catch (error) {
      console.error("Failed to fetch application:", error);
    } finally {
      setIsLoadingApplication(false);
    }
  };

  const updateSectionInUrl = (sectionId: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("section", String(sectionId));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleSaveSection = async () => {
    let wasSaved = false;

    try {
      setIsSaving(true);

      if (!applicationId || !sectionDataRef.current) {
        console.error("Missing application ID or section data");
        return;
      }

      const sectionData = sectionDataRef.current;
      const sectionNumber = currentSection;

      switch (sectionNumber) {
        case 1:
          await updateApplicationSection1Api(
            String(applicationId),
            sectionData
          );
          break;
        case 2:
          await updateApplicationSection2Api(
            String(applicationId),
            sectionData
          );
          break;
        case 3:
          await updateApplicationSection3Api(
            String(applicationId),
            sectionData
          );
          break;
        case 4:
          await updateApplicationSection4Api(
            String(applicationId),
            sectionData
          );
          break;
        case 5:
          await updateApplicationSection5Api(
            String(applicationId),
            sectionData
          );
          break;
        case 6:
          console.log("Saving Section 6 data:", sectionData);
          await updateApplicationSection6Api(
            String(applicationId),
            sectionData
          );
          console.log("✅ Section 6 saved successfully");
          break;
        case 7:
          console.log("Saving Section 7 - Initial data:", sectionData);
          // First upload files if any
          if (section7UploadRef.current) {
            await section7UploadRef.current.uploadFiles();
            // Get the updated section data after upload
            const updatedSectionData = sectionDataRef.current;
            // Save with the updated data that includes uploaded files
            await updateApplicationSection7Api(
              String(applicationId),
              updatedSectionData
            );
          } else {
            // No files to upload, just save the section data
            await updateApplicationSection7Api(
              String(applicationId),
              sectionData
            );
          }
          break;
        case 8:
          await updateApplicationSection8Api(
            String(applicationId),
            sectionData
          );
          break;
        default:
          console.warn(`No save handler for section ${sectionNumber}`);
      }

      wasSaved = true;

      if (wasSaved) {
        await fetchApplication();
      }
    } catch (error) {
      console.error("Failed to save section:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportToWord = async () => {
    try {
      if (!applicationId) {
        console.error("Missing application ID");
        return;
      }

      setIsExporting(true);

      // First save the current section
      await handleSaveSection();

      // Then export to Word
      let blobData = await exportApplicationToWordApi(
        String(applicationId),
        "en",
        "en",
        applicationData?.version || 1
      );

      // Ensure we have a Blob (convert if needed)
      if (!(blobData instanceof Blob)) {
        blobData = new Blob([blobData], {
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });
      }

      // Create download link
      const url = URL.createObjectURL(blobData);
      const filename = `application_form_${applicationId}.docx`;
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Revoke the blob URL after use
      URL.revokeObjectURL(url);

      console.log("✅ Export to Word completed");
    } catch (error) {
      console.error("Failed to export to Word:", error);
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    if (applicationId) {
      fetchApplication();
    }
  }, [applicationId]);

  useEffect(() => {
    const sectionFromUrl = getValidSection(searchParams.get("section"));
    if (sectionFromUrl !== currentSection) {
      setCurrentSection(sectionFromUrl);
      setSections((prevSections) =>
        prevSections.map((section) => ({
          ...section,
          isActive: section.id === sectionFromUrl,
        }))
      );
    }
  }, [searchParams]);

  const [sections, setSections] = useState<FormSection[]>([
    {
      id: 1,
      title: "Section 1",
      label: "Selecting data sources for ...",
      completed: 0,
      total: 1,
      isActive: true,
    },
    {
      id: 2,
      title: "Section 2",
      label: "Public information of the pr...",
      completed: 0,
      total: 6,
      isActive: false,
    },
    {
      id: 3,
      title: "Section 3",
      label: "Applicant and contact pers...",
      completed: 0,
      total: 13,
      isActive: false,
    },
    {
      id: 4,
      title: "Section 4",
      label: "Payment details",
      completed: 0,
      total: 10,
      isActive: false,
    },
    {
      id: 5,
      title: "Section 5",
      label: "Purpose of data use",
      completed: 0,
      total: 9,
      isActive: false,
    },
    {
      id: 6,
      title: "Section 6",
      label: "Description of the data nee...",
      completed: 0,
      total: 10,
      isActive: false,
    },
    {
      id: 7,
      title: "Section 7",
      label: "Additional information",
      completed: 0,
      total: 2,
      isActive: false,
    },
    {
      id: 8,
      title: "Section 8",
      label: "Confirmation of information",
      completed: 0,
      total: 4,
      isActive: false,
    },
  ]);

  if (status === "loading" || isLoadingApplication) {
    return <LoadingContainer text="Loading application..." />;
  }

  const handleSectionChange = (sectionId: number) => {
    const normalizedSectionId = getValidSection(String(sectionId));

    setSections((prevSections) =>
      prevSections.map((section) => ({
        ...section,
        isActive: section.id === normalizedSectionId,
      }))
    );
    setCurrentSection(normalizedSectionId);
    updateSectionInUrl(normalizedSectionId);
  };

  const currentSectionData = sections.find((s) => s.id === currentSection);

  // Calculate overall progress across ALL sections
  const totalCompleted = sections.reduce((sum, s) => sum + s.completed, 0);
  const totalFields = sections.reduce((sum, s) => sum + s.total, 0);
  const progressPercentage =
    totalFields > 0 ? (totalCompleted / totalFields) * 100 : 0;

  return (
    <>
      {/* Fixed Top Bar */}
      <ApplicationFormTopBar
        language={language}
        setLanguage={setLanguage}
        onSave={handleSaveSection}
        isSaving={isSaving}
        onExportToWord={handleExportToWord}
        isExporting={isExporting}
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
            uploadRef={section7UploadRef}
            onPreviousSection={() => handleSectionChange(currentSection - 1)}
            onNextSection={() => handleSectionChange(currentSection + 1)}
            canGoPrevious={currentSection > MIN_SECTION}
            canGoNext={currentSection < sections.length}
          />
        </div>
      </div>
    </>
  );
}
