// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
"use client";

import { useState } from "react";
import PageContainer from "@/components/PageContainer";
import PageHeading from "@/components/PageHeading";
import CenteredListContainer from "@/components/CenteredListContainer";
import DatasetList from "@/components/datasetList";
import Alert, { AlertState } from "@/components/Alert";
import Button from "@/components/button";
import { faPaperPlane, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { useDatasetBasket } from "@/providers/DatasetBasketProvider";
import { createApplication } from "@/services/daam/index.client";
import { useSession, signIn } from "next-auth/react";

export default function Page() {
  const { basket, isLoading, emptyBasket } = useDatasetBasket();
  const [alert, setAlert] = useState<AlertState | null>(null);
  const { data: session, status } = useSession();

  let heading = "Your Basket";
  if (basket.length > 0) {
    heading = `Your Basket (${basket.length})`;
  }

  if (isLoading || status === "loading") {
    return (
      <div className="w-full" style={{ height: "calc(100vh - 100px)" }}>
        <div className="flex h-full items-center justify-center">
          <div className="text-lg font-semibold text-primary">
            Loading your basket...
          </div>
        </div>
      </div>
    );
  }

  const requestNow = async () => {
    try {
      await createApplication(basket.map((dataset) => dataset.id));
      setAlert({
        message: "Application created successfully",
        type: "success",
      });
      emptyBasket();
    } catch (error) {
      setAlert({
        message: "Somethng went wrong. Please try again.",
        type: "error",
      });
    }
  };

  const onCloseAlert = () => {
    setAlert(null);
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
    <PageContainer>
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={onCloseAlert}
        />
      )}
      <PageHeading>{heading}</PageHeading>
      <CenteredListContainer>
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
      </CenteredListContainer>
    </PageContainer>
  );
}
