// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import { Input } from "./shadcn/input";

interface PhoneFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const PhoneField: React.FC<PhoneFieldProps> = ({
  value,
  onChange,
  className,
}) => {
  return (
    <div className={className}>
      <label htmlFor="phone" className="mb-2 block font-bold text-secondary">
        Phone
      </label>
      <div className="flex items-center">
        <select className="mr-2 h-12 rounded-md border-2 border-primary p-2 text-base focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary">
          <option value="+352">+352</option>
          <option value="+1">+1</option>
          <option value="+44">+44</option>
          <option value="+91">+91</option>
        </select>
        <Input
          type="tel"
          id="phone"
          name="phone"
          value={value}
          onChange={onChange}
          className="block h-12 w-full rounded-md border-2 border-primary p-2 text-base focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Enter your phone number"
        />
      </div>
    </div>
  );
};

export default PhoneField;
