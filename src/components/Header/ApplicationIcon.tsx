// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";

interface ApplicationIconProps {
  isActive: boolean;
}

const ApplicationIcon: React.FC<ApplicationIconProps> = ({ isActive }) => (
  <Link
    href="/applications"
    className={`flex items-center text-info hover:text-hover-color ${isActive ? "text-primary" : ""}`}
  >
    <FontAwesomeIcon icon={faFolderOpen} className="text-xl lg:text-2xl" />
  </Link>
);

export default ApplicationIcon;
