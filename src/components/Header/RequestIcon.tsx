// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";

interface RequestIconProps {
  isActive: boolean;
}

const RequestIcon: React.FC<RequestIconProps> = ({ isActive }) => (
  <Link
    href="/requests"
    className={`relative flex items-center text-info hover:text-secondary transition-opacity duration-300 ${
      isActive ? "text-primary" : ""
    }`}
  >
    <FontAwesomeIcon icon={faFolderOpen} className="text-2xl lg:text-3xl" />
  </Link>
);

export default RequestIcon;
