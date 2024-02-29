// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { cn } from "@/utils/tailwindMerge";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface ButtonProps {
  text: string;
  type?: "primary" | "secondary" | "info" | "warning";
  icon?: IconDefinition;
  href?: string;
  onClick?: () => void;
  className?: string;
  props?: React.ComponentPropsWithoutRef<"a">;
}

const Button: React.FC<ButtonProps> = ({
  text,
  type,
  icon,
  href,
  onClick,
  className,
  props,
}) => {
  const common =
    "rounded-lg px-4 py-2 font-bold border-2 transition-colors duration-200 tracking-wide sm:w-auto cursor-pointer";

  const classes = {
    primary: "bg-primary text-white hover:bg-secondary",
    secondary: "bg-secondary text-white hover:opacity-80",
    info: "bg-info text-white hover:opacity-80",
    warning: "bg-warning text-black hover:opacity-80",
  };

  return (
    <a
      href={href}
      className={cn(classes[type!] || "", common, className)}
      onClick={onClick}
      {...props}
    >
      {icon && <FontAwesomeIcon icon={icon} />}
      {text}
    </a>
  );
};

export default Button;
