// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import {
  faCheck,
  faChevronUp,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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

type PhoneInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value"
> & {
  value?: string;
  onChange?: (value: string) => void;
};

const PhoneInput = forwardRef<
  React.ElementRef<typeof RPNInput.default>,
  PhoneInputProps
>(({ onChange, ...props }, ref) => (
  <RPNInput.default
    ref={ref}
    className={cn("flex w-full")}
    flagComponent={FlagComponent}
    countrySelectComponent={CountrySelect}
    inputComponent={InputComponent}
    onChange={(value) => onChange?.(value ?? "")}
    {...props}
  />
));
PhoneInput.displayName = "PhoneInput";

const InputComponent = forwardRef<
  HTMLInputElement,
  InputProps & { disabled?: boolean }
>(({ className, disabled, ...props }, ref) => (
  <Input
    className={cn(
      "h-12 w-full rounded-md border-2 px-4 py-[9px] text-md",
      disabled
        ? "border-slate-200 bg-background text-muted-foreground cursor-not-allowed opacity-50"
        : "border-primary bg-white focus:ring-primary",
      className,
      "ml-2"
    )}
    ref={ref}
    {...props}
    disabled={disabled}
  />
));
InputComponent.displayName = "InputComponent";

type CountrySelectOption = { label: string; value: RPNInput.Country };

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  onChange: (value: RPNInput.Country) => void;
  options: CountrySelectOption[];
};

const CountrySelect = forwardRef<HTMLDivElement, CountrySelectProps>(
  ({ disabled, value, onChange, options }) => {
    const handleSelect = useCallback(
      (country: RPNInput.Country) => {
        onChange(country);
      },
      [onChange]
    );

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "flex h-12 items-center gap-2 rounded-l-md border-2 px-4 transition-colors duration-200",
              disabled
                ? "border-slate-200 bg-slate-100 opacity-50"
                : "border-primary"
            )}
            disabled={disabled}
          >
            <FlagComponent country={value} countryName={value} />
            <span className="flex flex-col items-center justify-center">
              <FontAwesomeIcon icon={faChevronUp} className="h-3 w-3 " />
              <FontAwesomeIcon icon={faChevronDown} className="h-3 w-3" />
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
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
                        <span className="flex-1 text-sm">{option.label}</span>
                        <span className="text-foreground/50 text-sm">
                          {`+${RPNInput.getCountryCallingCode(option.value)}`}
                        </span>
                        <FontAwesomeIcon
                          icon={faCheck}
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
