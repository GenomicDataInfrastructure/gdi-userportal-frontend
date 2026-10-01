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
import { useSession } from "next-auth/react";
import { retrieveEntitlements } from "@/app/api/ga4gh/entitlements";
import { SearchedDataset } from "@/app/api/discovery/open-api/schemas";

interface DatasetBasketContextType {
  basket: SearchedDataset[];
  addDatasetToBasket: (dataset: SearchedDataset) => void;
  removeDatasetFromBasket: (dataset: SearchedDataset) => void;
  emptyBasket: () => void;
  isLoading: boolean;
  hasDatasetAccess: (dataset: SearchedDataset) => boolean;
  isAccessLoading: boolean;
}

const DatasetBasketContext = createContext<
  DatasetBasketContextType | undefined
>(undefined);

export const DatasetBasketProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { data: session, status } = useSession();
  const [access, setAccess] = useState<{
    session: typeof session;
    entitlements: Awaited<
      ReturnType<typeof retrieveEntitlements>
    >["entitlements"];
  }>();

  useEffect(() => {
    if (status !== "authenticated") return;
    let cancelled = false;
    let pending = false;
    const refresh = async () => {
      if (pending) return;
      pending = true;
      try {
        const result = await retrieveEntitlements();
        if (!cancelled)
          setAccess({ session, entitlements: result.entitlements });
      } catch (error) {
        console.error("Failed to retrieve dataset access", error);
        if (!cancelled) setAccess({ session, entitlements: [] });
      } finally {
        pending = false;
      }
    };
    void refresh();
    window.addEventListener("focus", refresh);
    const interval = window.setInterval(refresh, 60_000);
    return () => {
      cancelled = true;
      window.removeEventListener("focus", refresh);
      window.clearInterval(interval);
    };
  }, [session, status]);

  const isAccessLoading =
    status === "loading" ||
    (status === "authenticated" && access?.session !== session);
  const getDatasetGrants = (dataset: SearchedDataset) =>
    status === "authenticated" && access?.session === session
      ? access.entitlements.filter(
          (grant) =>
            (grant.datasetId === dataset.identifier ||
              grant.datasetId === dataset.id) &&
            (!grant.end || Date.parse(grant.end) > Date.now())
        )
      : [];
  const hasDatasetAccess = (dataset: SearchedDataset) =>
    getDatasetGrants(dataset).length > 0;

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
    if (isAccessLoading || hasDatasetAccess(dataset)) return;
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
        hasDatasetAccess,
        isAccessLoading,
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
