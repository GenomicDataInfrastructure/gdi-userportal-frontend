// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useTranslations } from "next-intl";

type ResultCountProps = {
  namespace: string;
  count?: number;
  isLoading: boolean;
  errorCode?: number;
};

export default function ResultCount({
  namespace,
  count,
  isLoading,
  errorCode,
}: Readonly<ResultCountProps>) {
  const t = useTranslations(namespace);
  let text;
  if (isLoading || count === undefined) {
    text = "";
  } else if (errorCode) {
    text = t("results", { count: 0 });
  } else {
    text = t("results", { count });
  }
  return (
    <p className="col-start-0 col-span-12 mt-5 xl:mb-12 mb-4 text-center text-sm text-info h-9">
      {text}
    </p>
  );
}
