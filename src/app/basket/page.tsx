// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
"use client";

import PageHeading from "@/components/PageHeading";
import DatasetList from "@/components/datasetList";
import Button from "@/components/button";
import { faPaperPlane, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { useDatasetBasket } from "@/providers/DatasetBasketProvider";

export default function Page() {
  const { basket, isLoading } = useDatasetBasket();

  let heading = "Your Basket";
  if (basket.length > 0) {
    heading = `Your Basket (${basket.length})`;
  }

  if (isLoading) {
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

  return (
    <div className="w-full p-10">
      <PageHeading>{heading}</PageHeading>
      <div className="m-auto flex w-full flex-col items-center gap-4 p-5 lg:w-2/3">
        <div className="flex w-full justify-between">
          {basket.length > 0 && (
            <Button
              icon={faPlusCircle}
              text="Continue adding"
              href="/datasets"
              type="info"
            />
          )}
          {basket.length > 0 && (
            <Button icon={faPaperPlane} text="Request now" type="primary" />
          )}
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
      </div>
    </div>
  );
}
