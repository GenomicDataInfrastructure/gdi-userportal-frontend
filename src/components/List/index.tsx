// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import React from "react";

interface ListProps {
  children: React.ReactNode;
}

function List({ children }: ListProps) {
  return <ul className="flex w-full flex-col gap-y-4">{children}</ul>;
}

export default List;
