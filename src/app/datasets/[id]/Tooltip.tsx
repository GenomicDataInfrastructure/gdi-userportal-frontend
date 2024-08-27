// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

interface TooltipProps {
  message: string;
}

const Tooltip: React.FC<TooltipProps> = ({ message }) => {
  return (
    <div className="absolute left-0 top-full mt-1 hidden group-hover:flex items-center bg-info text-white text-xs rounded-2xl py-1 px-2 z-10 whitespace-nowrap">
      <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
      {message}
    </div>
  );
};

export default Tooltip;
