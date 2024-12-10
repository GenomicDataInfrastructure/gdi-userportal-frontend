// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { AlertState } from "@/components/Alert";

interface AlertContextType {
  alert: AlertState | null;
  setAlert: (alert: AlertState | null) => void;
  onCloseAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alert, setAlert] = useState<AlertState | null>(null);

  const onCloseAlert = () => {
    setAlert(null);
  };

  return (
    <AlertContext.Provider
      value={{
        alert,
        setAlert,
        onCloseAlert,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error("useAlert must be used within a AlertProvider");
  }
  return context;
};
