// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
"use client";

import { useAlert } from "@/providers/AlertProvider";
import Button from "@/components/Button";
import ListContainer from "@/components/ListContainer";
import LoadingContainer from "@/components/LoadingContainer";
import PageContainer from "@/components/PageContainer";
import PageHeading from "@/components/PageHeading";
import { useDatasetBasket } from "@/providers/DatasetBasketProvider";
import { faPaperPlane, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { signIn, useSession } from "next-auth/react";
import DatasetList from "../datasets/DatasetList";
import { AxiosError } from "axios";
import { createApplicationApi } from "../api/access-management-v1";
import { useRouter } from "next/navigation";
import { UrlSearchParams } from "@/app/params";
import { use, useState } from "react";
import ApplicationCreationModal from "@/components/ApplicationForm/ApplicationCreationModal";

type BasketPageProps = {
  searchParams: Promise<UrlSearchParams>;
};

export default function Page({ searchParams }: BasketPageProps) {
  const _searchParams = use(searchParams);
  const { basket, isLoading, emptyBasket } = useDatasetBasket();
  const { setAlert } = useAlert();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  let heading = "Your Basket";
  if (basket.length > 0) {
    heading = `Your Basket (${basket.length})`;
  }

  if (isLoading || status === "loading") {
    return <LoadingContainer text="Loading your basket..." />;
  }

  const requestNow = async () => {
    const identifiers = basket
      .map((dataset) => dataset.identifier)
      .filter((identifier): identifier is string => identifier !== undefined);

    try {
      const applicationId = await createApplicationApi({
        datasetIds: identifiers,
      });
      emptyBasket();
      router.push(`/applications/${applicationId}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        setAlert({
          type: "error",
          message:
            error.response?.data?.title ||
            `Failed to create application, status code: ${error.response?.status}`,
          details: error.response?.data?.detail,
        });
      }
    }
  };

  const openApplication = () => {
    setIsModalOpen(true);
  };

  const handleCreateApplication = async (data: {
    applicationType: string;
    language: string;
    name: string;
  }) => {
    const identifiers = basket
      .map((dataset) => dataset.identifier)
      .filter((identifier): identifier is string => identifier !== undefined);
    try {
      const applicationId = await createApplicationApi({
        title: "Test 21",
        datasets: [
          {
            dataset_id: "9d38aa98-2b82-481b-8591-feffc496b182",
            catalog_id: "e844e83e-a88f-47dd-a362-bf102d001096",
            distributions: [
              { distribution_id: "d6866ab6-3597-4ef6-bd58-013de955cf61" },
            ],
            distributions_sample: [
              {
                datasetId: "9d38aa98-2b82-481b-8591-feffc496b182",
                variables: [
                  {
                    name: "EncounterID",
                    titles: { en: "Encounter ID" },
                    datatype: "integer",
                    description: { en: "Unique encounter identifier." },
                    propertyUrl: "",
                  },
                  {
                    name: "CountryOfResidence",
                    titles: { en: "Country of Residence" },
                    datatype: "string",
                    description: {
                      en: "The patient's country of residence, using the EU country authority list.",
                    },
                    propertyUrl:
                      "http://publications.europa.eu/resource/authority/country",
                  },
                  {
                    name: "CauseOfDeathIndicator",
                    titles: { en: "Cause of Death Indicator" },
                    datatype: "boolean",
                    description: {
                      en: "Indicates whether this encounter is related to a cause of death.",
                    },
                    propertyUrl:
                      "https://terminology.health.com/glossary/CauseOfDeathIndicator",
                  },
                  {
                    name: "Diabetes",
                    titles: { en: "Diabetes Diagnosis" },
                    datatype: "boolean",
                    description: {
                      en: "True if patient has a diabetes diagnosis.",
                    },
                    propertyUrl: "",
                  },
                  {
                    name: "DiagnosisCode",
                    titles: { en: "Diagnosis Code" },
                    datatype: "string",
                    description: { en: "Primary diagnosis (ICD-10 code)." },
                    propertyUrl: "http://purl.bioontology.org/ontology/ICD10",
                  },
                  {
                    name: "PatientID",
                    titles: { en: "Patient ID" },
                    datatype: "string",
                    description: { en: "Pseudonymized patient identifier." },
                    propertyUrl: "",
                  },
                  {
                    name: "VisitDate",
                    titles: { en: "Visit Date" },
                    datatype: "dateTime",
                    description: { en: "Date and time of the clinical visit." },
                    propertyUrl: "",
                  },
                  {
                    name: "Temperature",
                    titles: { en: "Temperature (°C)" },
                    datatype: "decimal",
                    description: { en: "Body temperature in °C." },
                    propertyUrl: "",
                  },
                ],
              },
            ],
          },
        ],
        inputLanguage: "en",
      });
      emptyBasket();
      setIsModalOpen(false);
      router.push("/applications/new");
    } catch (error) {
      if (error instanceof AxiosError) {
        setAlert({
          type: "error",
          message:
            error.response?.data?.title ||
            `Failed to create application, status code: ${error.response?.status}`,
          details: error.response?.data?.detail,
        });
      }
    }
  };

  let actionBtn = null;

  if (basket.length > 0) {
    if (!session) {
      actionBtn = (
        <Button
          icon={faPaperPlane}
          text="Login to request"
          onClick={() => signIn("keycloak")}
          type="primary"
        />
      );
    } else {
      actionBtn = (
        <>
          <Button
            icon={faPaperPlane}
            text="Request now"
            type="primary"
            onClick={requestNow}
          />
          <Button
            icon={faPaperPlane}
            text="Submit Application"
            type="primary"
            onClick={openApplication}
          />
        </>
      );
    }
  }

  return (
    <>
      <ApplicationCreationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateApplication}
      />
      <PageContainer searchParams={_searchParams}>
        <PageHeading>{heading}</PageHeading>
        <ListContainer>
          <div className="flex w-full justify-between">
            {basket.length > 0 && (
              <Button
                icon={faPlusCircle}
                text="Continue adding"
                href="/datasets"
                type="info"
              />
            )}
            {actionBtn}
          </div>
          {basket.length > 0 ? (
            <DatasetList datasets={basket} />
          ) : (
            <div className="flex w-full flex-col items-center justify-center gap-4">
              <p className="text-center text-lg text-primary">
                Your basket is empty.
              </p>
              <Button
                icon={faPlusCircle}
                text="Add datasets"
                href="/datasets"
                type="primary"
              />
            </div>
          )}
        </ListContainer>
      </PageContainer>
    </>
  );
}
