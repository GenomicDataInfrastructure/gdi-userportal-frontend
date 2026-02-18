// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use server";

import { accessManagementClientHDEu as accessManagementClient } from "@/app/api/shared/client";
import { createHeaders } from "@/app/api/shared/headers";
import { isAxiosError } from "axios";
import {
  BasketSubmission,
  DatasetSubmission,
} from "@/app/api/access-management-v1/additional-types";
import { ListedApplication } from "@/app/api/access-management/open-api/schemas";

// Comprehensive Application Interfaces
type LocalizedText = Record<string, string>;

interface Variable {
  name: string;
  titles: LocalizedText;
  datatype: string;
  description: LocalizedText;
  propertyUrl: string;
  datasetId?: string;
}

interface DistributionSample {
  dataset_id: string;
  variables?: Variable[];
}

interface Distribution {
  distribution_id: string;
  title: LocalizedText;
}

interface Publisher {
  type: string;
  name: string;
  email: string;
  homepage: string;
}

interface Country {
  label: string;
  resource: string;
  country_id: string;
}

interface Dataset {
  dataset_id: string;
  catalog_id: string;
  distributions: Distribution[];
  date_added: string;
  publisher: Publisher;
  title: LocalizedText;
  country: Country;
  hdab: Publisher;
  provenance: LocalizedText;
  distributions_sample: DistributionSample[];
}

interface ApplicationStatus {
  status: string;
  date: string;
  userId: string;
}

export interface CountryOption {
  key: string;
  value: string;
}

interface PurposeOption {
  key: string;
  value: string;
}

interface PhoneNumber {
  countryCode: string;
  number: string;
  isoCode: string;
}

interface IndicateTheSizeOfTheStudyCohortEstimationOrExact {
  key: string;
  value: string;
}

interface TabulationPlanArray {
  tabulationRegisteredToBeUsed: string;
  tabulationPossibleStudyCohort: string;
  tabulationInformationOfRequiredVariables: string;
  tabulationFormationVariables: string;
  tabulationDesiredDirection: string;
  tabulationOrderInWhichTable: string;
  tabulationAnyOtherRelevant: string;
  tabulationPlan: TabulationPlan; // Fixed: was "tabularPln"
}

interface TabulationPlan {
  name: string;
  size: number;
  id: string;
}

interface VariableAttachment {
  size: number;
  name: string;
  id: string;
}

interface ExtractionMethod {
  key: string;
  value: string;
}

interface HowOftenDataExtracted {
  key: string;
  value: string;
}

interface DataExtractionFrequency {
  key: string;
  value: string;
}

interface OptOutMechanism {
  key: string;
  value: string;
}

interface AdditionalAttachment {
  size: number;
  name: string;
  id: string;
}

interface LegalPersonOption {
  key: string;
  value: string;
}

interface YesNoOption {
  key: string;
  value: string;
}

interface FormSection1 {
  sectionNumber: number;
  removedDistributions: any[];
  removedDatasets: any[];
  datasetVariables: Variable[];
}

interface FormSection2 {
  sectionNumber: number;
  projectName?: string;
  projectLeader?: string;
  countryOfProjectLeader?: CountryOption;
  purposeForWhichDataWillBeUsed?: PurposeOption[];
  summaryOfTheProject?: string;
  theNatureOfTheProjectDoesNotLetYouProvideASummary?: boolean;
  theNatureOfTheProjectDoesNotLetYouProvideASummaryReason?: string;
}

interface FormSection3 {
  sectionNumber: number;
  legalOrNaturalPerson?: LegalPersonOption;
  applyingForDataOnBehalfOfPublicSector?: YesNoOption;
  applyingForDataForCarryingOutTasks?: YesNoOption;
  contactPersonName?: string;
  contactPersonEmail?: string;
  contactPersonPhone?: PhoneNumber;
  contactPersonOrganisationName?: string;
  contactPersonBusinessID?: string;
  contactPersonRelationship?: string;
  naturalPersonName?: string;
  naturalPersonAddress?: string;
  naturalPersonZipCode?: string;
  naturalPersonCity?: string;
  naturalPersonCountry?: CountryOption;
  naturalPersonEmail?: string;
  naturalPersonPhone?: PhoneNumber;
  naturalPersonJobTitle?: string;
  naturalPersonAffiliation?: string;
  legalPersonName?: string;
  legalPersonAddress?: string;
  legalPersonZipCode?: string;
  legalPersonCity?: string;
  legalPersonCountry?: CountryOption;
}

interface FormSection4 {
  sectionNumber: number;
  sameAsContactPerson?: boolean;
  fullName?: string;
  email?: string;
  address?: string;
  phone?: PhoneNumber;
  operatorIdentifier?: string;
  nameOfTheOrganisation?: string;
  businessIdentifierOrganization?: string;
  invoiceType?: YesNoOption;
  vatNumber?: string;
  isTheProjectFinanciallyCovered?: YesNoOption;
  invoiceReferenceNumber?: string;
  invoiceAddress?: string;
  peppolCode?: string;
  rangeOfAmountOfFinancing?: LegalPersonOption;
}

interface FormSection5 {
  sectionNumber?: number;
  personResponsibleSameAsContactPerson?: boolean;
  personResponsibleName?: string;
  personResearchSameAsContactPerson?: boolean;
  personResearchName?: string;
  whyAreTheDataRequested?: string;
  whatIsTheAimAndTopicOfTheProject?: string;
  whichAreTheExpectedBenefits?: string;
  describeApplicantsQualification?: string;
  legalBasis?: string;
  linkToTheSupportingLegalBasis?: string;
}

interface FormSection6 {}

interface FormSection7 {
  sectionNumber?: number;
  additionalAttachment?: AdditionalAttachment[];
  additionalInformation?: string;
}

interface FormSection8 {
  sectionNumber?: number;
  acceptHealthDataBody?: boolean;
  awareProcessingFee?: boolean;
  awareChargeFee?: boolean;
  awareInformationCorrect?: boolean;
}

interface ApplicationForm {
  section1?: FormSection1;
  section2?: FormSection2;
  section3?: FormSection3;
  section4?: FormSection4;
  section5?: FormSection5;
  section6?: FormSection6;
  section7?: FormSection7;
  section8?: FormSection8;
  [key: string]: any;
}

export interface UpdateApplicationSection1Request {
  sectionNumber: number;
  removedDistributions: string[];
  removedDatasets: string[];
  datasetVariables: Variable[];
}

export interface UpdateApplicationSection2Request {
  sectionNumber: number;
  projectName: string;
  projectLeader: string;
  countryOfProjectLeader: CountryOption;
  purposeForWhichDataWillBeUsed: PurposeOption[];
  summaryOfTheProject?: string;
  theNatureOfTheProjectDoesNotLetYouProvideASummary: boolean;
  theNatureOfTheProjectDoesNotLetYouProvideASummaryReason?: string;
}

export interface UpdateApplicationSection3Request {
  sectionNumber: number;
  legalOrNaturalPerson: LegalPersonOption;
  applyingForDataOnBehalfOfPublicSector: YesNoOption;
  applyingForDataForCarryingOutTasks: YesNoOption | null;
  contactPersonName: string;
  contactPersonEmail: string;
  contactPersonPhone: PhoneNumber;
  contactPersonOrganisationName?: string;
  contactPersonBusinessID?: string;
  contactPersonRelationship?: string;
  naturalPersonName?: string;
  naturalPersonAddress?: string;
  naturalPersonZipCode?: string;
  naturalPersonCity?: string;
  naturalPersonCountry?: CountryOption;
  naturalPersonEmail?: string;
  naturalPersonPhone?: PhoneNumber;
  naturalPersonJobTitle?: string;
  naturalPersonAffiliation?: string;
  legalPersonName?: string;
  legalPersonAddress?: string;
  legalPersonZipCode?: string;
  legalPersonCity?: string;
  legalPersonCountry?: CountryOption;
}

export interface UpdateApplicationSection4Request {
  sectionNumber: number;
  sameAsContactPerson: boolean;
  fullName: string;
  email: string;
  address: string;
  phone: PhoneNumber;
  operatorIdentifier?: string;
  nameOfTheOrganisation?: string;
  businessIdentifierOrganization?: string;
  invoiceType: YesNoOption;
  vatNumber?: string;
  isTheProjectFinanciallyCovered: YesNoOption;
  invoiceReferenceNumber: string;
  invoiceAddress?: string;
  peppolCode?: string;
  rangeOfAmountOfFinancing?: LegalPersonOption;
}

export interface UpdateApplicationSection5Request {
  sectionNumber: number;
  personResponsibleSameAsContactPerson: boolean;
  personResponsibleName: string;
  personResearchSameAsContactPerson: boolean;
  personResearchName: string;
  whyAreTheDataRequested: string;
  whatIsTheAimAndTopicOfTheProject: string;
  whichAreTheExpectedBenefits: string;
  describeApplicantsQualification: string;
  legalBasis: string;
  linkToTheSupportingLegalBasis: string;
}

export interface UpdateApplicationSection6Item {
  country_id: string; // REQUIRED
  catalog_ids: string[]; // REQUIRED (must not be empty)
  hdabContacts?: string; // Optional
  howWillTheDataFromDifferentSourcesBeLinked: string; // REQUIRED
  indicateTheSizeOfTheStudyCohort: string; // REQUIRED
  indicateTheSizeOfTheStudyCohortEstimationOrExact: IndicateTheSizeOfTheStudyCohortEstimationOrExact; // REQUIRED
  whyNeedStudyCohortOfThisSize: string; // REQUIRED
  variablesToBeUsedInDataExtractionAttachment?: VariableAttachment[]; // Optional
  timePeriodOfDataExtraction: string; // REQUIRED
  extractionMethod: ExtractionMethod; // REQUIRED
  samplingMethod?: string; // Optional (REQUIRED if extractionMethod = "other sample")
  sampleSize?: string; // Optional (REQUIRED if extractionMethod = "random-sample" or "other sample")
  inclusionCriteria: string; // REQUIRED
  potentialExclusionCriteria?: string; // Optional
  howOftenDoesTheDataNeedToBeExtractedOnceOrMultiple: HowOftenDataExtracted; // REQUIRED
  needForDataExtractionEvery?: DataExtractionFrequency; // Optional (REQUIRED if extraction = "multiple")
  needForDataExtractionEveryOther?: string; // Optional
  needForDataExtractionEveryDescription: string; // REQUIRED (ALWAYS!)
  optOutOfTheMechanismProvidedInTheNationalLaw: OptOutMechanism; // REQUIRED
  providedJustificationException?: string; // Optional (REQUIRED if optOut = "yes")
  whatIsTheFrequencyOfUpdates?: string; // Optional
  tabulationPlanArray?: TabulationPlanArray[]; // Optional
}

export type UpdateApplicationSection6Request = UpdateApplicationSection6Item[];

export interface UpdateApplicationSection7Request {
  sectionNumber: number;
  additionalAttachment: AdditionalAttachment[];
  additionalInformation: string;
}

export interface UpdateApplicationSection8Request {
  sectionNumber: number;
  acceptHealthDataBody: boolean;
  awareProcessingFee: boolean;
  awareChargeFee: boolean;
  awareInformationCorrect: boolean;
}

export interface RetrievedApplicationData {
  _id: string;
  title: string;
  datasets: Dataset[];
  inputLanguage: string;
  date_created: string;
  date_modified: string;
  userId: string;
  status: ApplicationStatus;
  version: number;
  form: ApplicationForm;
}

export const createApplicationApi = async (
  datasetSubmissionApplication: DatasetSubmission
) => {
  const headers = await createHeaders();
  try {
    const client = accessManagementClient;
    const requestPath = "data-request/application"; // avoid leading slash so baseURL path is preserved
    const fullUrl = `${client.defaults.baseURL?.replace(/\/$/, "")}/${requestPath}`;

    const response = await client.post(
      requestPath,
      datasetSubmissionApplication,
      {
        headers,
      }
    );

    console.debug("✅ AMS request succeeded", { status: response.status });
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("❌ AMS request failed", {
        status: error.response?.status,
        message: error.message,
        responseData: error.response?.data,
      });
      throw error;
    } else {
      console.error("❌ Non-Axios error", error);
      throw error;
    }
  }
};

export const createAddDatasetToBasketApi = async (
  basketSubmissionApplication: BasketSubmission
) => {
  const headers = await createHeaders();
  try {
    const client = accessManagementClient;
    const requestPath = "basket";
    const fullUrl = `${client.defaults.baseURL?.replace(/\/$/, "")}/${requestPath}`;

    const response = await client.put(
      requestPath,
      basketSubmissionApplication,
      {
        headers,
      }
    );

    console.debug("✅ AMS request succeeded", { status: response.status });
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("❌ AMS request failed", {
        status: error,
        message: error.message,
        responseData: error.response?.data,
      });
      throw error;
    } else {
      console.error("❌ Non-Axios error", error);
      throw error;
    }
  }
};

export const removeDatasetFromBasketApi = async (datasetId: string) => {
  const headers = await createHeaders();
  try {
    const client = accessManagementClient;
    const requestPath = "basket/" + encodeURIComponent(datasetId);
    const fullUrl = `${client.defaults.baseURL?.replace(/\/$/, "")}/${requestPath}`;

    const response = await client.delete(requestPath, {
      headers,
    });

    console.debug("✅ AMS request succeeded", { status: response.status });
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("❌ AMS request failed", {
        status: error.response?.status,
        message: error.message,
        responseData: error.response?.data,
      });
      throw error;
    } else {
      console.error("❌ Non-Axios error", error);
      throw error;
    }
  }
};

function mapApplicationResponseToListed(data: any): ListedApplication {
  // Map raw application response to ListedApplication format
  const mongoId = String(data?._id ?? "");
  // Convert MongoDB ObjectId to number-like representation
  const id = mongoId;

  return {
    id,
    title: String(data?.title ?? ""),
    description: "", // No direct mapping in response
    currentState: String(data?.status?.status ?? ""),
    stateChangedAt: String(data?.status?.date ?? ""),
    createdAt: String(data?.date_created ?? ""),
    datasets: Array.isArray(data?.datasets) ? data.datasets : [],
  };
}
function mapToRetrievedApplicationData(data: any): RetrievedApplicationData {
  return {
    _id: String(data._id ?? ""),
    title: String(data.title ?? ""),
    datasets: Array.isArray(data.datasets) ? data.datasets : [],
    inputLanguage: String(data.inputLanguage ?? "en"),
    date_created: String(data.date_created ?? ""),
    date_modified: String(data.date_modified ?? ""),
    userId: String(data.userId ?? ""),
    status: {
      status: String(data.status?.status ?? ""),
      date: String(data.status?.date ?? ""),
      userId: String(data.status?.userId ?? ""),
    },
    version: Number(data.version ?? 1),
    form: data.form ?? {},
  };
}
export const listApplicationsApi = async () => {
  const headers = await createHeaders();
  const requestPath = "data-request/applications?page=1&limit=5";
  try {
    const client = accessManagementClient;
    const fullUrl = `${client.defaults.baseURL?.replace(/\/$/, "")}/${requestPath}`;
    console.log("AMS Request URL:", fullUrl);
    const response = await client.post(requestPath, {
      headers,
    });

    // Map response array to ListedApplication format
    const mappedApplications: ListedApplication[] = Array.isArray(
      response.data.data
    )
      ? response.data.data.map(mapApplicationResponseToListed)
      : [];

    return mappedApplications;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("❌ AMS request failed", {
        requestPath,
        baseUrl: accessManagementClient.defaults.baseURL,
        status: error.response?.status,
        message: error.message,
        responseData: error.response?.data,
      });
      throw error;
    } else {
      console.error("❌ Non-Axios error", error);
      throw error;
    }
  }
};

export const getApplicationApi = async (id: string) => {
  const headers = await createHeaders();
  try {
    const client = accessManagementClient;
    const requestPath = `data-request/application/${encodeURIComponent(id)}`;
    const fullUrl = `${client.defaults.baseURL?.replace(/\/$/, "")}/${requestPath}`;
    console.log("AMS Request URL:", fullUrl);
    const response = await client.get(requestPath, {
      headers,
    });

    console.debug("✅ AMS request succeeded", { status: response.status });

    // Map response to comprehensive RetrievedApplicationData format
    const mappedApplication = mapToRetrievedApplicationData(response.data);

    return mappedApplication;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("❌ AMS request failed", {
        status: error.response?.status,
        message: error.message,
        responseData: error.response?.data,
      });
      throw error;
    } else {
      console.error("❌ Non-Axios error", error);
      throw error;
    }
  }
};

export const updateApplicationSection1Api = async (
  applicationId: string,
  section1Data: UpdateApplicationSection1Request
) => {
  const headers = await createHeaders();
  try {
    const client = accessManagementClient;
    const requestPath = `data-request/application/${encodeURIComponent(applicationId)}/section/1`;
    const fullUrl = `${client.defaults.baseURL?.replace(/\/$/, "")}/${requestPath}`;
    console.log("AMS Section 1 Update URL:", fullUrl);

    const response = await client.put(requestPath, section1Data, {
      headers,
    });

    console.debug("✅ AMS Section 1 update succeeded", {
      status: response.status,
    });
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("❌ AMS Section 1 update failed", {
        status: error.response?.status,
        message: error.message,
        responseData: error.response?.data,
      });
      throw error;
    } else {
      console.error("❌ Non-Axios error", error);
      throw error;
    }
  }
};

export const updateApplicationSection2Api = async (
  applicationId: string,
  section2Data: UpdateApplicationSection2Request
) => {
  const headers = await createHeaders();
  try {
    const client = accessManagementClient;
    const requestPath = `data-request/application/${encodeURIComponent(applicationId)}/section/2`;
    const fullUrl = `${client.defaults.baseURL?.replace(/\/$/, "")}/${requestPath}`;
    console.log("AMS Section 2 Update URL:", fullUrl);

    const response = await client.put(requestPath, section2Data, {
      headers,
    });

    console.debug("✅ AMS Section 2 update succeeded", {
      status: response.status,
    });
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("❌ AMS Section 2 update failed", {
        status: error.response?.status,
        message: error.message,
        responseData: error.response?.data,
      });
      throw error;
    } else {
      console.error("❌ Non-Axios error", error);
      throw error;
    }
  }
};

export const updateApplicationSection3Api = async (
  applicationId: string,
  section3Data: UpdateApplicationSection3Request
) => {
  const headers = await createHeaders();
  try {
    const client = accessManagementClient;
    const requestPath = `data-request/application/${encodeURIComponent(applicationId)}/section/3`;
    const fullUrl = `${client.defaults.baseURL?.replace(/\/$/, "")}/${requestPath}`;
    console.log("AMS Section 3 Update URL:", fullUrl);

    const response = await client.put(requestPath, section3Data, {
      headers,
    });

    console.debug("✅ AMS Section 3 update succeeded", {
      status: response.status,
    });
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(
        "❌ AMS Section 3 update failed",
        JSON.stringify({
          status: error.response?.status,
          message: error.message,
          responseData: error.response?.data,
        })
      );
      throw error;
    } else {
      console.error("❌ Non-Axios error", error);
      throw error;
    }
  }
};

export const updateApplicationSection4Api = async (
  applicationId: string,
  section4Data: UpdateApplicationSection4Request
) => {
  const headers = await createHeaders();
  try {
    const client = accessManagementClient;
    const requestPath = `data-request/application/${encodeURIComponent(applicationId)}/section/4`;
    const fullUrl = `${client.defaults.baseURL?.replace(/\/$/, "")}/${requestPath}`;
    console.log("AMS Section 4 Update URL:", fullUrl);

    const response = await client.put(requestPath, section4Data, {
      headers,
    });

    console.debug("✅ AMS Section 4 update succeeded", {
      status: response.status,
    });
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("❌ AMS Section 4 update failed", {
        status: error.response?.status,
        message: error.message,
        responseData: error.response?.data,
      });
      throw error;
    } else {
      console.error("❌ Non-Axios error", error);
      throw error;
    }
  }
};

export const updateApplicationSection5Api = async (
  applicationId: string,
  section5Data: UpdateApplicationSection5Request
) => {
  const headers = await createHeaders();
  try {
    const client = accessManagementClient;
    const requestPath = `data-request/application/${encodeURIComponent(applicationId)}/section/5`;
    const fullUrl = `${client.defaults.baseURL?.replace(/\/$/, "")}/${requestPath}`;
    console.log("AMS Section 5 Update URL:", fullUrl);

    const response = await client.put(requestPath, section5Data, {
      headers,
    });

    console.debug("✅ AMS Section 5 update succeeded", {
      status: response.status,
    });
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("❌ AMS Section 5 update failed", {
        status: error.response?.status,
        message: error.message,
        responseData: error.response?.data,
      });
      throw error;
    } else {
      console.error("❌ Non-Axios error", error);
      throw error;
    }
  }
};

export const updateApplicationSection6Api = async (
  applicationId: string,
  section6Data: UpdateApplicationSection6Request
) => {
  const headers = await createHeaders();
  try {
    const client = accessManagementClient;
    const requestPath = `data-request/application/${encodeURIComponent(applicationId)}/section/6`;
    const fullUrl = `${client.defaults.baseURL?.replace(/\/$/, "")}/${requestPath}`;
    console.log("AMS Section 6 Update URL:", fullUrl);

    // Backend expects { countries: [...] } not just [...]
    const payload = { countries: section6Data };
    console.log(
      "AMS Section 6 Data being sent:",
      JSON.stringify(payload, null, 2)
    );

    const response = await client.put(requestPath, payload, {
      headers,
    });

    console.debug("✅ AMS Section 6 update succeeded", {
      status: response.status,
    });
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("❌ AMS Section 6 update failed", {
        status: error.response?.status,
        message: error.message,
        responseData: error.response?.data,
      });
      throw error;
    } else {
      console.error("❌ Non-Axios error", error);
      throw error;
    }
  }
};

export const updateApplicationSection7Api = async (
  applicationId: string,
  section7Data: UpdateApplicationSection7Request
) => {
  const headers = await createHeaders();
  try {
    const client = accessManagementClient;
    const requestPath = `data-request/application/${encodeURIComponent(applicationId)}/section/7`;
    const fullUrl = `${client.defaults.baseURL?.replace(/\/$/, "")}/${requestPath}`;
    console.log("AMS Section 7 Update URL:", fullUrl);

    console.log("JSON Field - ", JSON.stringify(section7Data));

    const response = await client.put(requestPath, section7Data, {
      headers,
    });

    console.debug("✅ AMS Section 7 update succeeded", {
      status: response.status,
    });
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("❌ AMS Section 7 update failed", {
        status: error.response?.status,
        message: error.message,
        responseData: error.response?.data,
      });
      throw error;
    } else {
      console.error("❌ Non-Axios error", error);
      throw error;
    }
  }
};

export const updateApplicationSection8Api = async (
  applicationId: string,
  section8Data: UpdateApplicationSection8Request
) => {
  const headers = await createHeaders();
  try {
    const client = accessManagementClient;
    const requestPath = `data-request/application/${encodeURIComponent(applicationId)}/section/8`;
    const fullUrl = `${client.defaults.baseURL?.replace(/\/$/, "")}/${requestPath}`;
    console.log("AMS Section 8 Update URL:", fullUrl);

    const response = await client.put(requestPath, section8Data, {
      headers,
    });

    console.debug("✅ AMS Section 8 update succeeded", {
      status: response.status,
    });
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("❌ AMS Section 8 update failed", {
        status: error.response?.status,
        message: error.message,
        responseData: error.response?.data,
      });
      throw error;
    } else {
      console.error("❌ Non-Axios error", error);
      throw error;
    }
  }
};

export const listCountriesApi = async (): Promise<CountryOption[]> => {
  const client = accessManagementClient;

  const requestPath = `countries/en/all`;
  const fullUrl = `${client.defaults.baseURL?.replace(/\/$/, "")}/${requestPath}`;
  console.log("AMS Countries List URL:", fullUrl);
  const response = await fetch(
    `${client.defaults.baseURL?.replace(/\/$/, "")}/${requestPath}`,
    {
      headers: {
        accept: "application/json",
      },
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to load countries (${response.status})`);
  }

  const data = await response.json();

  const rawCountries = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.countries)
        ? data.countries
        : [];

  return rawCountries
    .map((country: any) => ({
      key: String(country?.isoCode ?? ""),
      value: String(country?.name ?? ""),
    }))
    .filter((country: CountryOption) => Boolean(country.key && country.value));
};

export const uploadApplicationDataApi = async (
  applicationId: string,
  file: File
) => {
  const headers = await createHeaders();

  try {
    const client = accessManagementClient;
    const requestPath = `data-request/application/${encodeURIComponent(applicationId)}/data`;
    const fullUrl = `${client.defaults.baseURL?.replace(/\/$/, "")}/${requestPath}`;
    console.log("AMS Upload Application Data URL:", fullUrl);

    const formData = new FormData();
    formData.append("data", file);

    // 🔴 CRITICAL FIX: Override Content-Type header for FormData uploads
    // axios client has default "application/json" headers that must be overridden
    // Setting to undefined lets the browser set the correct multipart/form-data boundary
    const uploadHeaders = {
      ...headers,
      "Content-Type": undefined as any, // Override axios instance default
    };

    const response = await client.post(requestPath, formData, {
      headers: uploadHeaders,
    });

    console.debug("✅ AMS upload data succeeded", {
      status: response.status,
    });
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("❌ AMS upload data failed", {
        status: error.response?.status,
        message: error.message,
        responseData: error.response?.data,
      });
      throw error;
    } else {
      console.error("❌ Non-Axios error", error);
      throw error;
    }
  }
};
