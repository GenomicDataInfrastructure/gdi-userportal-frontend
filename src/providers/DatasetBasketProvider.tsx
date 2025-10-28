// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { SearchedDataset } from "@/app/api/discovery/open-api/schemas";

interface DatasetBasketContextType {
  basket: SearchedDataset[];
  addDatasetToBasket: (dataset: SearchedDataset) => void;
  removeDatasetFromBasket: (dataset: SearchedDataset) => void;
  emptyBasket: () => void;
  isLoading: boolean;
}

const DatasetBasketContext = createContext<
  DatasetBasketContextType | undefined
>(undefined);

export const DatasetBasketProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [basket, setBasket] = useState<SearchedDataset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const basketInLocalStorage = localStorage.getItem("basket");
      setBasket(basketInLocalStorage ? JSON.parse(basketInLocalStorage) : []);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("basket", JSON.stringify(basket));
    }
  }, [basket, isLoading]);

  const addDatasetToBasket = (dataset: SearchedDataset) => {
    setBasket((prevBasket) => [...prevBasket, dataset]);
  };

  const removeDatasetFromBasket = (dataset: SearchedDataset) => {
    setBasket((prevBasket) => prevBasket.filter((d) => d.id !== dataset.id));
  };

  const emptyBasket = () => {
    setBasket([]);
  };

  return (
    <DatasetBasketContext.Provider
      value={{
        basket,
        addDatasetToBasket,
        removeDatasetFromBasket,
        isLoading,
        emptyBasket,
      }}
    >
      {children}
    </DatasetBasketContext.Provider>
  );
};

export const useDatasetBasket = () => {
  const context = useContext(DatasetBasketContext);
  if (context === undefined) {
    throw new Error(
      "useDatasetBasket must be used within a DatasetBasketProvider"
    );
  }
  return context;
};
