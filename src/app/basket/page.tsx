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
import { createApplicationApi } from "../api/access-management";
import { useRouter } from "@/i18n/navigation";
import { UrlSearchParams } from "@/app/params";
import { use, useRef, useState } from "react";
import { useTranslations } from "next-intl";

type BasketPageProps = {
  searchParams: Promise<UrlSearchParams>;
};

export default function Page({ searchParams }: BasketPageProps) {
  const t = useTranslations();
  const _searchParams = use(searchParams);
  const { basket, isLoading, emptyBasket, hasDatasetAccess, isAccessLoading } =
    useDatasetBasket();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const { setAlert } = useAlert();
  const { status } = useSession();
  const router = useRouter();

  const requestableDatasets = basket.filter(
    (dataset) => !!dataset.identifier && !hasDatasetAccess(dataset)
  );
  const hasGrantedDatasets = basket.some(hasDatasetAccess);
  const loginToRequest = () =>
    signIn("keycloak", { callbackUrl: window.location.href });

  let heading = t("basket.title");
  if (basket.length > 0) {
    heading = t("basket.titleWithCount", { count: basket.length });
  }

  if (isLoading || status === "loading") {
    return <LoadingContainer text={t("basket.loading")} />;
  }

  const requestNow = async () => {
    if (status !== "authenticated") {
      await loginToRequest();
      return;
    }
    if (
      isAccessLoading ||
      submittingRef.current ||
      requestableDatasets.length === 0
    )
      return;
    submittingRef.current = true;
    setIsSubmitting(true);
    const identifiers = requestableDatasets
      .map((dataset) => dataset.identifier)
      .filter((identifier): identifier is string => identifier !== undefined);

    try {
      const result = await createApplicationApi({
        datasetIds: identifiers,
      });
      if (!result.ok) {
        if (result.response.status === 401) {
          await loginToRequest();
          return;
        }
        setAlert({
          type: "error",
          message: result.response.data.title || t("basket.requestFailed"),
          details: result.response.data.detail,
        });
        return;
      }
      emptyBasket();
      router.push(`/applications/${result.applicationId}`);
    } catch {
      setAlert({ type: "error", message: t("basket.requestFailed") });
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  let actionBtn = null;

  if (basket.length > 0) {
    if (status !== "authenticated") {
      actionBtn = (
        <Button
          icon={faPaperPlane}
          text={t("basket.loginToRequest")}
          className="hover:text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          onClick={loginToRequest}
          type="primary"
        />
      );
    } else {
      actionBtn = (
        <Button
          icon={faPaperPlane}
          text={t("basket.requestNow")}
          type="primary"
          className="hover:text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          onClick={requestNow}
          disabled={
            isAccessLoading || isSubmitting || requestableDatasets.length === 0
          }
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
              text={t("basket.continueAdding")}
              href="/datasets"
              type="info"
            />
          )}
          {actionBtn}
        </div>
        {status === "authenticated" &&
          !isAccessLoading &&
          hasGrantedDatasets && (
            <p role="status">{t("basket.alreadyGrantedExcluded")}</p>
          )}
        {basket.length > 0 ? (
          <DatasetList datasets={basket} />
        ) : (
          <div className="flex w-full flex-col items-center justify-center gap-4">
            <p className="text-center text-lg text-primary">
              {t("basket.empty")}
            </p>
            <Button
              icon={faPlusCircle}
              text={t("basket.addDatasets")}
              href="/datasets"
              type="primary"
            />
          </div>
        )}
      </ListContainer>
    </PageContainer>
  );
}
