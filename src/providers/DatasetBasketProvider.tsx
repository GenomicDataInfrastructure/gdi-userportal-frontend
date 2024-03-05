// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { Dataset } from "@/types/dataset.types";

interface DatasetBasketContextType {
  basket: Dataset[];
  addDatasetToBasket: (dataset: Dataset) => void;
  removeDatasetFromBasket: (dataset: Dataset) => void;
}

const DatasetBasketContext = createContext<
  DatasetBasketContextType | undefined
>(undefined);

export const DatasetBasketProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [basket, setBasket] = useState<Dataset[]>([]);

  const addDatasetToBasket = (dataset: Dataset) => {
    setBasket((prevBasket) => [...prevBasket, dataset]);
  };

  const removeDatasetFromBasket = (dataset: Dataset) => {
    setBasket((prevBasket) => prevBasket.filter((d) => d.id !== dataset.id));
  };

  return (
    <DatasetBasketContext.Provider
      value={{ basket, addDatasetToBasket, removeDatasetFromBasket }}
    >
      {children}
    </DatasetBasketContext.Provider>
  );
};

export const useDatasetBasket = () => {
  const context = useContext(DatasetBasketContext);
  if (context === undefined) {
    throw new Error(
      "useDatasetBasket must be used within a DatasetBasketProvider",
    );
  }
  return context;
};
