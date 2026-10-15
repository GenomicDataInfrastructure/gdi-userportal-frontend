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
import {
  faExclamationTriangle,
  faPaperPlane,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signIn, useSession } from "next-auth/react";
import DatasetList from "../datasets/DatasetList";
import { createApplicationApi } from "../api/access-management";
import { useRouter } from "@/i18n/navigation";
import { UrlSearchParams } from "@/app/params";
import { use, useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  getBeaconAuthReason,
  isBeaconAuthorized,
  useBeaconAuthorization,
  BeaconAuthorizationProvider,
} from "@/providers/beacon/BeaconAuthorizationProvider";

type BasketPageProps = {
  searchParams: Promise<UrlSearchParams>;
};

function BasketPage({ searchParams }: BasketPageProps) {
  const t = useTranslations();
  const _searchParams = use(searchParams);
  const { basket, isLoading, emptyBasket, hasDatasetAccess, isAccessLoading } =
    useDatasetBasket();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const { setAlert } = useAlert();
  const { status } = useSession();
  const authorizationState = useBeaconAuthorization();
  const router = useRouter();
  const applicationWarningTitleId = useId();
  const applicationWarningMessageId = useId();

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

  const isAuthorizationLoading =
    status === "authenticated" && authorizationState.status === "loading";
  const authorization =
    authorizationState.status === "ready" ? authorizationState.auth : undefined;
  const canApply = isBeaconAuthorized(authorization);
  const hasAuthorizationError = authorizationState.status === "error";
  let applicationWarning: string | undefined;

  if (
    status === "authenticated" &&
    authorizationState.status === "ready" &&
    !canApply
  ) {
    const { hasResearcherStatus, hasAcceptedTC } =
      getBeaconAuthReason(authorization);
    if (!hasResearcherStatus && !hasAcceptedTC) {
      applicationWarning = t("basket.applicationRequirementsMissing");
    } else if (!hasResearcherStatus) {
      applicationWarning = t("basket.researcherRequired");
    } else {
      applicationWarning = t("basket.termsRequired");
    }
  }

  if (isLoading || status === "loading" || isAuthorizationLoading) {
    return <LoadingContainer text={t("basket.loading")} />;
  }

  const requestNow = async () => {
    if (status !== "authenticated") {
      await loginToRequest();
      return;
    }
    if (!canApply || hasAuthorizationError) return;
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
            !canApply ||
            hasAuthorizationError ||
            isAccessLoading ||
            isSubmitting ||
            requestableDatasets.length === 0
          }
          buttonProps={
            applicationWarning
              ? { "aria-describedby": applicationWarningMessageId }
              : undefined
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
        {applicationWarning && (
          <div
            className="mb-6 flex w-full items-start gap-3 rounded-lg border-l-4 border-l-warning bg-warning/10 p-4 text-left shadow-lg"
            role="alert"
            aria-labelledby={applicationWarningTitleId}
            aria-describedby={applicationWarningMessageId}
          >
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className="mt-0.5 h-5 w-5 shrink-0 text-warning"
              aria-hidden="true"
            />
            <div>
              <h3
                id={applicationWarningTitleId}
                className="mb-1 text-lg font-semibold"
              >
                {t("basket.applicationRequirementsTitle")}
              </h3>
              <p
                id={applicationWarningMessageId}
                className="text-sm leading-6 text-black md:text-base"
              >
                {applicationWarning}
              </p>
            </div>
          </div>
        )}
        {hasAuthorizationError && (
          <div
            className="mb-6 flex w-full items-start gap-3 rounded-lg border-l-4 border-l-warning bg-warning/10 p-4 text-left shadow-lg"
            role="alert"
          >
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className="mt-0.5 h-5 w-5 shrink-0 text-warning"
              aria-hidden="true"
            />
            <p className="text-sm leading-6 text-black md:text-base">
              {t("basket.authorizationUnavailable")}
            </p>
          </div>
        )}
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

export default function Page(props: BasketPageProps) {
  const { status } = useSession();

  return (
    <BeaconAuthorizationProvider
      isAuthenticated={status === "authenticated"}
      enabled
    >
      <BasketPage {...props} />
    </BeaconAuthorizationProvider>
  );
}
