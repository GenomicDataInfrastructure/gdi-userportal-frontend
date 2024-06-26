// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import { Input } from "./shadcn/input";

interface EmailFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const EmailField: React.FC<EmailFieldProps> = ({
  value,
  onChange,
  className,
}) => {
  return (
    <div className={className}>
      <label htmlFor="email" className="mb-2 block font-bold text-secondary">
        Email
      </label>
      <div className="flex items-center">
        <Input
          type="email"
          id="email"
          name="email"
          value={value}
          onChange={onChange}
          className="block h-12 w-full rounded-md border-2 border-primary p-2 text-base focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Enter your email address"
        />
      </div>
    </div>
  );
};

export default EmailField;
