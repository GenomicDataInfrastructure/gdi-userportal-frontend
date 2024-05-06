// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";
import React from "react";
import { Dataset } from "@/types/application.types";
import { getLabelName } from "@/utils/getLabelName";
import { faDatabase } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface DatasetListProps {
  datasets: Dataset[];
}

const DatasetList: React.FC<DatasetListProps> = ({ datasets }) =>
  datasets.map((dataset, index) => (
    <span
      className="mb-2 flex items-center gap-2"
      key={`${dataset.id}-${index}`}
    >
      <FontAwesomeIcon icon={faDatabase} className="text-md text-info" />
      <h3 className="sm:text-md break-all text-base font-bold text-info lg:text-lg">
        {getLabelName(dataset.title)}
      </h3>
    </span>
  ));

export default DatasetList;
