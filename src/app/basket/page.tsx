// SPDX-FileCopyrightText: 2024 PNED G.I.E.
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
import { createApplicationApi } from "../api/access-management";
import { useRouter } from "next/navigation";
import { UrlSearchParams } from "@/app/params";
import { use } from "react";

type BasketPageProps = {
  searchParams: Promise<UrlSearchParams>;
};

export default function Page({ searchParams }: BasketPageProps) {
  const _searchParams = use(searchParams);
  const { basket, isLoading, emptyBasket } = useDatasetBasket();
  const { setAlert } = useAlert();
  const { data: session, status } = useSession();
  const router = useRouter();

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
        <Button
          icon={faPaperPlane}
          text="Request now"
          type="primary"
          onClick={requestNow}
        />
      );
    }
  }

  return (
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
  );
}
