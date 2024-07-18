// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { CheckIcon, ChevronsUpDown } from "lucide-react";
import React, { forwardRef, useCallback, useState } from "react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/shadcn/command";
import { Button } from "@/components/shadcn/button";
import { Input, InputProps } from "@/components/shadcn/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { cn } from "@/utils/tailwindMerge";
import { ScrollArea } from "./shadcn/scroll-area";

type PhoneInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value"
> & {
  value?: string;
  onChange?: (value: string) => void;
  isEditable: boolean;
};

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ onChange, value, isEditable, ...props }, ref) => {
    const initialCountry = value
      ? RPNInput.getCountries().find(
        (country) =>
          `+${RPNInput.getCountryCallingCode(country)}` ===
          value.match(/^\+\d+/)?.[0]
      )
      : undefined;
    const initialNumber = value ? value.replace(/^\+\d+/, "") : "";

    const [selectedCountry, setSelectedCountry] = useState<
      RPNInput.Country | undefined
    >(initialCountry);
    const [localNumber, setLocalNumber] = useState(initialNumber);

    const handleCountryChange = (countryCode: string) => {
      const country = RPNInput.getCountries().find(
        (country) =>
          `+${RPNInput.getCountryCallingCode(country)}` === countryCode
      );
      setSelectedCountry(country);
      onChange?.(countryCode + localNumber);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newLocalNumber = event.target.value;
      setLocalNumber(newLocalNumber);
      if (selectedCountry) {
        onChange?.(
          `+${RPNInput.getCountryCallingCode(selectedCountry)}${newLocalNumber}`
        );
      } else {
        onChange?.(newLocalNumber);
      }
    };

    return (
      <div className="flex items-center w-full">
        <CountrySelect
          value={selectedCountry}
          onChange={handleCountryChange}
          options={RPNInput.getCountries().map((country) => ({
            label: country,
            value: country,
          }))}
          isEditable={isEditable}
        />
        <InputComponent
          {...props}
          value={localNumber}
          onChange={handleInputChange}
          isEditable={isEditable}
          ref={ref}
        />
      </div>
    );
  }
);
PhoneInput.displayName = "PhoneInput";

const InputComponent = forwardRef<
  HTMLInputElement,
  InputProps & { isEditable?: boolean }
>(({ className, isEditable, ...props }, ref) => (
  <Input
    className={cn(
      "h-12 w-full ml-2 rounded-lg border-2 border-primary px-4 py-[9px] shadow-sm transition-all duration-200 ease-in-out hover:shadow-md focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary",
      className,
      isEditable
        ? ""
        : "pointer-events-none bg-surface border-none text-gray-500"
    )}
    ref={ref}
    {...props}
  />
));
InputComponent.displayName = "InputComponent";

type CountrySelectOption = { label: string; value: RPNInput.Country };

type CountrySelectProps = {
  value: RPNInput.Country | undefined;
  onChange: (value: string) => void;
  options: CountrySelectOption[];
  isEditable?: boolean;
};

const CountrySelect = forwardRef<HTMLButtonElement, CountrySelectProps>(
  ({ value, onChange, options, isEditable }, ref) => {
    const handleSelect = useCallback(
      (country: RPNInput.Country) => {
        const callingCode = RPNInput.getCountryCallingCode(country);
        onChange(`+${callingCode}`);
        setTimeout(() => {
          if (
            ref &&
            typeof ref === "object" &&
            "current" in ref &&
            ref.current
          ) {
            (ref.current as HTMLElement).focus();
          }
        }, 100);
      },
      [onChange, ref]
    );

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "flex h-12 items-center gap-1 rounded-l-md px-3",
              isEditable
                ? "border-2 border-primary"
                : "pointer-events-none bg-surface text-gray-500"
            )}
            ref={ref}
          >
            {value && (
              <>
                <FlagComponent country={value} countryName={value} />
                <span className="ml-2">{`+${RPNInput.getCountryCallingCode(value)}`}</span>
              </>
            )}
            <ChevronsUpDown className={cn("-mr-2 h-4 w-4 opacity-50")} />
          </Button>
        </PopoverTrigger>
        {isEditable && (
          <PopoverContent className="w-[350px] p-0">
            <Command>
              <CommandList>
                <ScrollArea className="h-72">
                  <CommandInput placeholder="Search country..." />
                  <CommandEmpty>No country found.</CommandEmpty>
                  <CommandGroup>
                    {options
                      .filter((x) => x.value)
                      .map((option) => (
                        <CommandItem
                          className="gap-2"
                          key={option.value}
                          onSelect={() => handleSelect(option.value)}
                        >
                          <FlagComponent
                            country={option.value}
                            countryName={option.label}
                          />
                          <span className="flex-1 text-sm ml-2">
                            {option.label}
                          </span>
                          <span className="text-foreground/50 text-sm ml-1">
                            {`+${RPNInput.getCountryCallingCode(option.value)}`}
                          </span>
                          <CheckIcon
                            className={cn(
                              "ml-auto h-4 w-4",
                              option.value === value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </ScrollArea>
              </CommandList>
            </Command>
          </PopoverContent>
        )}
      </Popover>
    );
  }
);
CountrySelect.displayName = "CountrySelect";

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country];
  return (
    <span className="bg-foreground/20 flex h-4 w-6 overflow-hidden rounded-sm">
      {Flag && <Flag title={countryName} />}
    </span>
  );
};
FlagComponent.displayName = "FlagComponent";

export default PhoneInput;
