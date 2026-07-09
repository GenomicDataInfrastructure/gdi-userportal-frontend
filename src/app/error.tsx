// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import Button from "@/components/Button";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { useTranslations } from "next-intl";

interface ErrorBoundaryProps {
  errorTitle?: string;
  errorDetail?: string;
  stack?: string;
  statusCode?: number;
}

export default function ErrorBoundary({
  errorTitle,
  errorDetail,
  stack,
  statusCode,
}: Readonly<ErrorBoundaryProps>) {
  const t = useTranslations("error");
  let heading = t("genericHeading");
  let message = t("genericMessage");

  if (errorTitle && errorDetail) {
    heading = errorTitle;
    message = errorDetail;
  }

  switch (statusCode) {
    case 404:
      heading = t("notFoundHeading");
      message = t("notFoundMessage");
      break;
    case 401:
      heading = t("unauthorizedHeading");
      message = t("unauthorizedMessage");
      break;
  }

  return (
    <section>
      <div className="container mx-auto w-full max-w-3xl p-4 md:p-8">
        <div>
          {process.env.NODE_ENV === "development" && stack && (
            <div className="bg-primary p-4 text-warning">
              <pre className="overflow-x-auto">{stack}</pre>
            </div>
          )}
          <h1 className="mt-3 text-2xl font-semibold text-primary md:text-3xl">
            {heading}
          </h1>
          <p className="mt-4 text-primary">{message}</p>
          <div className="mt-6">
            <Button
              href="/"
              text={t("takeMeHome")}
              icon={faHouse}
              type="primary"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
