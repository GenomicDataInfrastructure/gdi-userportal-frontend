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

const EmailField: React.FC<EmailFieldProps> = ({ value, onChange, className }) => {
    return (
        <div className={className}>
            <label htmlFor="email" className="block font-bold text-secondary mb-2">
                Email
            </label>
            <div className="flex items-center">
                <Input
                    type="email"
                    id="email"
                    name="email"
                    value={value}
                    onChange={onChange}
                    className="block w-full h-12 p-2 border-2 border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                    placeholder="Enter your email address"
                />
            </div>
        </div>
    );
};

export default EmailField;

