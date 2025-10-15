// SPDX-FileCopyrightText: 2025 PNED G.I.E.
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
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  disabled?: boolean;
  className?: string;
  props?: React.ComponentPropsWithoutRef<"a">;
  children?: React.ReactNode;
  flex?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  text,
  type,
  icon,
  href,
  onClick,
  disabled,
  className,
  props,
  children,
  flex = false,
}) => {
  const common =
    "rounded-md px-4 py-2 font-bold transition-colors duration-200 tracking-wide cursor-pointer";

  const classes = {
    primary: "bg-primary text-white hover:bg-secondary",
    secondary:
      "bg-transparent text-primary border-2 border-primary hover:bg-secondary hover:text-white hover:border-transparent",
    info: "bg-info text-white hover:bg-secondary",
    warning: "bg-warning text-black hover:bg-secondary hover:text-white",
  };

  const disabledClasses = disabled
    ? "opacity-60 cursor-not-allowed hover:bg-disabled"
    : "";
  const flexClasses = flex ? "shrink-0" : "sm:w-auto";

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (disabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <a
      href={href}
      className={cn(
        classes[type!] || "",
        common,
        flexClasses,
        className,
        disabledClasses
      )}
      onClick={handleClick}
      aria-disabled={disabled}
      {...props}
    >
      {icon && <FontAwesomeIcon icon={icon} className="mr-2" />}
      <span>{text}</span>
      {children}
    </a>
  );
};

export default Button;
