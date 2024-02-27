// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import { cn } from "@/utils/tailwindMerge";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface ButtonProps {
  text: string;
  type: "primary" | "secondary" | "info" | "warning";
  icon?: IconDefinition;
  href?: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  text,
  type = "primary",
  icon,
  href,
  onClick,
}) => {
  const common =
    "rounded-lg px-4 py-2 font-bold border-2 transition-colors duration-200 tracking-wide sm:w-auto hover:bg-secondary cursor-pointer";

  const classes = {
    primary: "bg-primary text-white",
    secondary: "bg-secondary text-white hover",
    info: "bg-info text-white",
    warning: "bg-warning text-black",
  };

  return (
    <a href={href} className={cn(classes[type], common)} onClick={onClick}>
      {icon && <FontAwesomeIcon icon={icon} />}
      {text}
    </a>
  );
};

export default Button;
