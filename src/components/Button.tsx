// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
"use client";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface ButtonProps {
  icon: IconDefinition;
  text: string;
  onClick?: () => void;
  href?: string;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  icon,
  text,
  onClick,
  href,
  className,
}) => {
  const classes = `rounded-lg px-4 py-2 text-sm font-bold w-1/2 bg-primary text-white hover:bg-secondary transition-colors duration-200 tracking-wide sm:w-auto ${className}`;

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        onClick={onClick} // Optionally include onClick for <a>
      >
        <FontAwesomeIcon icon={icon} /> {text}
      </a>
    );
  } else {
    return (
      <button className={classes} onClick={onClick}>
        <FontAwesomeIcon icon={icon} /> {text}
      </button>
    );
  }
};

export default Button;
