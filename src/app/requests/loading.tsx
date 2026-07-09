// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import LoadingContainer from "@/components/LoadingContainer";
import { getTranslations } from "next-intl/server";

async function Loading() {
  const t = await getTranslations("common");
  return <LoadingContainer text={t("loading")} />;
}

export default Loading;
