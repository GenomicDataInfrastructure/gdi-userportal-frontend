// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import Link from "next/link";
import { faFileText } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ApplicationIconProps {
  isActive: boolean;
}

const ApplicationIcon: React.FC<ApplicationIconProps> = ({ isActive }) => (
  <Link
    href="/applications"
    className={`flex items-center text-info hover:text-hover-color ${isActive ? "text-primary" : ""}`}
  >
    <FontAwesomeIcon icon={faFileText} size="xl" />
  </Link>
);

export default ApplicationIcon;
