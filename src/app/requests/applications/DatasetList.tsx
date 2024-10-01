// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";
import { Dataset } from "@/types/application.types";
import { getLabelName } from "@/utils/getLabelName";
import { faDatabase } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface DatasetListProps {
  datasets: Dataset[];
}

const DatasetList: React.FC<DatasetListProps> = ({ datasets }) =>
  datasets.map((dataset, index) => (
    <span
      className="mb-4 flex items-center gap-x-6"
      key={`${dataset.id}-${index}`}
    >
      <FontAwesomeIcon icon={faDatabase} className="text-primary" />
      <p className="break-words">{getLabelName(dataset.title)}</p>
    </span>
  ));

export default DatasetList;
