// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";
import React from "react";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface AlertState {
  type: "success" | "error";
  message: string;
  details?: string;
}

interface AlertProps {
  type: "success" | "error";
  message: string;
  details?: string;
  onClose: () => void;
  className?: string;
}

const Alert = ({ type, message, details, onClose, className }: AlertProps) => {
  const alertStyle =
    type === "success" ? "bg-primary text-white" : "bg-warning text-black";

  const closeBtnStyle =
    type === "success"
      ? "text-white hover:text-secondary"
      : "text-primary hover:text-secondary";
  const leftBorderStyle =
    type === "success" ? "border-warning" : "border-primary";

  return (
    <div
      className={`flex w-full items-center justify-between border-l-8 ${leftBorderStyle} p-4 ${alertStyle} z-50 mb-4 ${className}`}
      role="alert"
      style={{ whiteSpace: "pre-line" }}
    >
      <div className="flex flex-col items-start">
        <p className="text-sm font-bold lg:text-base">{message}</p>
        {details && <p className="mt-2 text-xs lg:text-sm">{details}</p>}
      </div>
      <FontAwesomeIcon
        icon={faXmark}
        className={`h-5 w-5 cursor-pointer ${closeBtnStyle}`}
        onClick={onClose}
      />
    </div>
  );
};

export default Alert;
