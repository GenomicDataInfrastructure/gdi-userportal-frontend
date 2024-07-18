// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import React, { createContext, useContext } from "react";

const EditableContext = createContext(false);

export const useEditable = () => useContext(EditableContext);

export const EditableProvider = ({
  isEditable,
  children,
}: {
  isEditable: boolean;
  children: React.ReactNode;
}) => (
  <EditableContext.Provider value={isEditable}>
    {children}
  </EditableContext.Provider>
);
