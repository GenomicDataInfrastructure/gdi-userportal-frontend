// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import styles from "../../assets/sprite.module.css";

export interface Country {
  key: string;
  value: string;
  iso2?: string;
  dialCode?: string;
}

interface CountryDropdownProps {
  countries: Country[];
  selectedCountry: Country | null;
  onSelect: (country: Country) => void;
  placeholder?: string;
  disabled?: boolean;
  showFlags?: boolean;
  showDialCode?: boolean;
}

const CountryDropdown: React.FC<CountryDropdownProps> = ({
  countries,
  selectedCountry,
  onSelect,
  placeholder = "Select country",
  disabled = false,
  showFlags = true,
  showDialCode = false,
}) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filteredCountries = countries.filter((country) =>
    country.value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (country: Country) => {
    onSelect(country);
    setOpen(false);
    setSearchQuery("");
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setOpen(!open);
      setSearchQuery("");
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && selectedIndex !== null && listRef.current) {
      const selectedElement = listRef.current.children[
        selectedIndex
      ] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex, open]);

  const getCountryCode = (country: Country | null): string => {
    if (!country) return "";
    return country.iso2 || country.key.toLowerCase();
  };

  return (
    <div
      ref={dropdownRef}
      className={`relative inline-block w-full ${disabled ? "opacity-50" : ""}`}
    >
      <div
        onClick={toggleDropdown}
        className={`flex items-center gap-2 border border-gray-300 rounded px-3 py-2 cursor-pointer ${
          open ? "ring-2 ring-primary border-primary" : ""
        } ${disabled ? "cursor-not-allowed bg-gray-100" : "bg-white"}`}
      >
        {selectedCountry && showFlags && (
          <span
            className={`${styles.vtiFlag} ${styles[getCountryCode(selectedCountry).toLowerCase()]}`}
          />
        )}
        <div className="flex-1 text-sm">
          {selectedCountry ? (
            <div className="flex items-center gap-2">
              <span className="font-medium">{selectedCountry.value}</span>
              {showDialCode && selectedCountry.dialCode && (
                <span className="text-gray-500">
                  +{selectedCountry.dialCode}
                </span>
              )}
            </div>
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </div>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`text-gray-400 text-xs transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </div>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-10">
          <input
            type="text"
            placeholder="Search country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border-b border-gray-200 text-sm focus:outline-none"
            onClick={(e) => e.stopPropagation()}
          />
          <ul ref={listRef} className="max-h-60 overflow-y-auto" role="listbox">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country, index) => (
                <li
                  key={`${country.key}-${index}`}
                  onClick={() => handleSelect(country)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center gap-3 px-3 py-2 cursor-pointer text-sm ${
                    selectedCountry?.key === country.key
                      ? "bg-primary bg-opacity-10 text-primary font-medium"
                      : "hover:bg-gray-100"
                  }`}
                  role="option"
                  aria-selected={selectedCountry?.key === country.key}
                >
                  {showFlags && (
                    <span
                      className={`${styles.vtiFlag} ${styles[getCountryCode(country).toLowerCase()]} `}
                    />
                  )}
                  <span className="flex-1 text-black">{country.value}</span>
                  {showDialCode && country.dialCode && (
                    <span className="text-black text-xs">
                      +{country.dialCode}
                    </span>
                  )}
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-sm text-gray-500 text-center">
                No countries found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CountryDropdown;
