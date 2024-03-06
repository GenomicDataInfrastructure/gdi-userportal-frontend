// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
"use client";
import React, { useEffect, useState } from "react";
import { datasetCount } from "@/services/ckan/index.server";

export function DatasetCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const count = await datasetCount();
      setCount(count);
    };

    fetchData();
  }, []);

  if (count === null) {
    return <div className="text-xl font-bold text-primary">Loading...</div>;
  }

  return (
    <div className="mb-4 mt-10 flex items-baseline text-primary">
      <p className="mr-3 text-4xl font-bold">{count.toLocaleString("en-GB")}</p>
      <p className="self-end text-xl font-bold">Datasets</p>
    </div>
  );
}
