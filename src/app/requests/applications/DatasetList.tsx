// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";
import { Dataset } from "@/types/application.types";
import { getLabelName } from "@/utils/getLabelName";
import { cn } from "@/utils/tailwindMerge";
import { faDatabase } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface DatasetListProps {
  datasets: Dataset[];
  className?: string;
}

const DatasetList: React.FC<DatasetListProps> = ({ datasets, className }) =>
  datasets.map((dataset, index) => (
    <span
      className={cn("mb-3 flex items-center gap-x-2.5", className)}
      key={`${dataset.id}-${index}`}
    >
      <FontAwesomeIcon icon={faDatabase} className="text-primary" />
      <p className="break-words">{getLabelName(dataset.title)}</p>
    </span>
  ));

export default DatasetList;
