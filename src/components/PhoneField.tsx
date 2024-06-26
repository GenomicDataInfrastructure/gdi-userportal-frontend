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

const PhoneField: React.FC<PhoneFieldProps> = ({ value, onChange, className }) => {
    return (
        <div className={className}>
            <label htmlFor="phone" className="block font-bold text-secondary mb-2">
                Phone
            </label>
            <div className="flex items-center">
                <select className="mr-2 h-12 p-2 border-2 border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base">
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
                    className="block w-full h-12 p-2 border-2 border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                    placeholder="Enter your phone number"
                />
            </div>
        </div>
    );
};

export default PhoneField;

