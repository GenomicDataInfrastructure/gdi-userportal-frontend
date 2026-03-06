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
import { retrieveDatasetRawApi } from "../api/discovery-v1";
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

  type ApplicationDatasetPayload = {
    dataset_id: string;
    catalog_id: string;
    distributions: Array<{
      distribution_id: string;
      title?: Record<string, string>;
    }>;
    distributions_sample: Array<{
      datasetId: string;
      variables: Array<{
        name: string;
        titles: Record<string, string>;
        datatype: string;
        description: Record<string, string>;
        propertyUrl: string;
      }>;
    }>;
    country?: {
      label?: string;
      resource?: string;
      country_id?: string;
    };
    hdab?: {
      type?: string;
      name?: string;
      email?: string;
      homepage?: string;
    };
    publisher?: {
      type?: string;
      name?: string;
      email?: string;
      homepage?: string;
    };
    title?: Record<string, string>;
    provenance?: Record<string, string>;
  };

  const buildValidDatasetsForSubmission = async (): Promise<
    ApplicationDatasetPayload[]
  > => {
    const datasetIds = basket
      .map((dataset) => dataset.id)
      .filter((datasetId): datasetId is string => Boolean(datasetId));

    const fetchedDatasets = await Promise.all(
      datasetIds.map(async (datasetId) => {
        try {
          const dataset = await retrieveDatasetRawApi(datasetId);

          const toLocalizedObject = (
            value: unknown,
            fallbackValue = ""
          ): Record<string, string> => {
            if (value && typeof value === "object" && !Array.isArray(value)) {
              return value as Record<string, string>;
            }

            const textValue = String(value ?? fallbackValue).trim();
            return textValue ? { en: textValue } : {};
          };

          const distributions = (dataset?.distributions ?? [])
            .map((distribution: any) => ({
              distribution_id: String(distribution?.id ?? "").trim(),
              title: toLocalizedObject(distribution?.title, distribution?.id),
            }))
            .filter(
              (distribution: any) => distribution.distribution_id.length > 0
            );

          if (distributions.length === 0) {
            return null;
          }

          const distributionsSample = (dataset?.distributions_sample ?? [])
            .map((distributionSample: any) => ({
              datasetId: String(distributionSample?.datasetId ?? datasetId),
              variables: Array.isArray(distributionSample?.variables)
                ? distributionSample.variables.map((variable: any) => ({
                    name: String(variable?.name ?? ""),
                    titles: toLocalizedObject(variable?.titles, variable?.name),
                    datatype: String(variable?.datatype ?? ""),
                    description: toLocalizedObject(
                      variable?.description,
                      variable?.name
                    ),
                    propertyUrl: String(variable?.propertyUrl ?? ""),
                  }))
                : [],
            }))
            .filter((distributionSample: any) =>
              Boolean(distributionSample.datasetId)
            );

          const country = dataset?.country
            ? {
                label: String(dataset.country?.label ?? ""),
                resource: String(dataset.country?.resource ?? ""),
                country_id: String(
                  dataset.country?.id ?? dataset.country?.country_id ?? ""
                ),
              }
            : undefined;

          const mapAgent = (agent: any) =>
            agent
              ? {
                  name: String(agent?.name ?? ""),
                  email: String(agent?.email ?? "").replace(/^mailto:/, ""),
                  homepage: String(agent?.homepage ?? ""),
                }
              : undefined;

          return {
            dataset_id: datasetId,
            catalog_id: String(
              dataset?.catalog?.id ?? dataset?.catalogue ?? ""
            ).trim(),
            distributions,
            distributions_sample: distributionsSample,
            country,
            hdab: mapAgent(dataset?.hdab),
            publisher: mapAgent(dataset?.publisher),
            title: toLocalizedObject(dataset?.title, datasetId),
            provenance: toLocalizedObject(dataset?.provenance),
          };
        } catch (error) {
          console.error(
            `Failed retrieving dataset details from hub-search for dataset ${datasetId}`,
            error
          );
          return null;
        }
      })
    );

    return fetchedDatasets.reduce<ApplicationDatasetPayload[]>(
      (accumulator, dataset) => {
        if (dataset && dataset.dataset_id && dataset.distributions.length > 0) {
          accumulator.push(dataset);
        }

        return accumulator;
      },
      []
    );
  };

  const requestNow = async () => {
    try {
      const datasets = await buildValidDatasetsForSubmission();

      if (datasets.length === 0) {
        setAlert({
          type: "error",
          message:
            "Your basket does not contain valid dataset/distribution pairs. Please remove and re-add the datasets.",
        });
        return;
      }

      const application = await createApplicationApi(
        {
          title: "New application",
          inputLanguage: "en",
          datasets,
        },
        "ACCESS"
      );
      emptyBasket();
      router.push(`/applications/${application.id}`);
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
    try {
      const datasets = await buildValidDatasetsForSubmission();

      if (datasets.length === 0) {
        setAlert({
          type: "error",
          message:
            "Your basket does not contain valid dataset/distribution pairs. Please remove and re-add the datasets.",
        });
        return;
      }
      const application = await createApplicationApi(
        {
          title: data.name,
          datasets,
          inputLanguage: "en",
        },
        data.applicationType === "ACCESS" ? "ACCESS" : "REQUEST"
      );
      emptyBasket();
      setIsModalOpen(false);
      console.log("Redirecting to application ID:", application.id);
      router.push("/applications/new?id=" + application.id);
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
