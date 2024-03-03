// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import { datasetCount } from "@/services/ckan/index.server";

export async function DatasetCounter() {
  const count = await datasetCount();
  return (
    <div className="mb-4 mt-10 flex items-baseline">
      <p className="mr-3 text-4xl font-bold">{count.toLocaleString("en-GB")}</p>
      <p className="self-end text-xl font-bold">Datasets</p>
    </div>
  );
}
