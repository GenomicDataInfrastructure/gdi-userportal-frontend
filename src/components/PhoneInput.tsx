// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { CheckIcon, ChevronsUpDown } from "lucide-react";
import React, { forwardRef, useCallback } from "react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./shadcn/command";
import { Button } from "./shadcn/button";
import { Input, InputProps } from "./shadcn/input";
import { Popover, PopoverContent, PopoverTrigger } from "./shadcn/popover";
import { cn } from "@/utils/tailwindMerge";
import { ScrollArea } from "./shadcn/scroll-area";

type PhoneInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> & {
  value?: string;
  onChange?: (value: string) => void;
};

const PhoneInput = forwardRef<React.ElementRef<typeof RPNInput.default>, PhoneInputProps>(
  ({ className, onChange, ...props }, ref) => (
    <RPNInput.default
      ref={ref}
      className={cn("flex w-full")}
      flagComponent={FlagComponent}
      countrySelectComponent={(props) => (
        <CountrySelect {...props} onChange={onChange} ref={ref} />
      )}
      inputComponent={InputComponent}
      onChange={(value) => onChange?.(value ?? "")}
      {...props}
    />
  )
);
PhoneInput.displayName = "PhoneInput";

const InputComponent = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <Input
      className={cn(
        "rounded-md h-12 w-full border-2 border-primary px-4 py-[9px] shadow-sm transition-all duration-200 ease-in-out hover:shadow-md focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary",
        className,
        "ml-2" // Add margin-left for space between flag and input
      )}
      ref={ref}
      {...props}
    />
  )
);
InputComponent.displayName = "InputComponent";

type CountrySelectOption = { label: string; value: RPNInput.Country };

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  onChange: (value: string) => void;
  options: CountrySelectOption[];
};

const CountrySelect = forwardRef<HTMLDivElement, CountrySelectProps>(
  ({ disabled, value, onChange, options }, ref) => {
    const handleSelect = useCallback(
      (country: RPNInput.Country) => {
        const callingCode = RPNInput.getCountryCallingCode(country);
        onChange(`+${callingCode}`);
        setTimeout(() => {
          if (ref && typeof ref === "object" && "current" in ref && ref.current) {
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
              "flex items-center gap-1 rounded-l-md h-12 border-2 border-primary px-3"
            )}
            disabled={disabled}
          >
            <FlagComponent country={value} countryName={value} />
            <ChevronsUpDown
              className={cn(
                "-mr-2 h-4 w-4 opacity-50",
                !disabled && "opacity-100"
              )}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandList>
              <ScrollArea className="h-72">
                <CommandInput placeholder="Search country..." />
                <CommandEmpty>No country found.</CommandEmpty>
                <CommandGroup>
                  {options.filter((x) => x.value).map((option) => (
                    <CommandItem
                      className="gap-2"
                      key={option.value}
                      onSelect={() => handleSelect(option.value)}
                    >
                      <FlagComponent country={option.value} countryName={option.label} />
                      <span className="flex-1 text-sm">{option.label}</span>
                      <span className="text-foreground/50 text-sm">
                        {`+${RPNInput.getCountryCallingCode(option.value)}`}
                      </span>
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          option.value === value ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </ScrollArea>
            </CommandList>
          </Command>
        </PopoverContent>
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
