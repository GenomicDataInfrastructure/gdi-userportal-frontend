// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import Button from "@/components/Button";
import { ActiveFilter, Operator } from "@/services/discovery/types/filter.type";
import { faCheck, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure } from "@headlessui/react";
import { useEffect, useState } from "react";
import { FilterItemProps } from "./FilterItem";
import { useFilters } from "@/providers/FilterProvider";

type FreeTextFilterContentProps = FilterItemProps;

type FreeTextFormItem = {
  value: string;
  operator?: Operator;
};

const initialFreeTextFormItem = {
  value: "",
};

export default function FreeTextFilterContent({
  filter,
}: FreeTextFilterContentProps) {
  const { activeFilters, addActiveFilter } = useFilters();
  const [openedDropdown, setOpenedDropdown] = useState<number | null>(null);
  const [items, setItems] = useState<FreeTextFormItem[]>([
    initialFreeTextFormItem,
  ]);
  const [showError, setShowError] = useState<boolean>(false);

  const correspondingActiveFilter = activeFilters.find(
    (activeFilter) =>
      activeFilter.key === filter.key && activeFilter.source === filter.source
  );

  useEffect(() => {
    if (!correspondingActiveFilter) {
      setItems([initialFreeTextFormItem]);
    } else {
      const existingItems = correspondingActiveFilter.values!.map((value) => ({
        value: value.value,
        operator: value.operator,
      }));
      setItems(existingItems);
    }
  }, [activeFilters]);

  const toggleDropdown = (index: number) => {
    setOpenedDropdown(openedDropdown === index ? null : index);
  };

  const handleSelectOperator = (
    event: React.MouseEvent<HTMLDivElement>,
    index: number
  ) => {
    const operator = event.currentTarget.textContent as Operator;

    setItems((items) =>
      items.map((item, i) => (i === index ? { ...item, operator } : item))
    );
    setOpenedDropdown(null);
  };

  function handleAddNewFilter() {
    setItems([...items, { value: "" }]);
  }

  const handleSubmitValue = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const values = items.reduce(
      (acc: FreeTextFormItem[], item: FreeTextFormItem) => {
        const isItemComplete = item.value && item.operator;
        const isItemUnique = acc.every(
          (accItem) =>
            accItem.value !== item.value || accItem.operator !== item.operator
        );
        return isItemComplete && isItemUnique ? [...acc, item] : acc;
      },
      []
    );

    if (!values.length) {
      setShowError(true);
      return;
    }

    setShowError(false);

    const newActiveFilter = {
      source: filter.source,
      type: filter.type,
      key: filter.key,
      label: filter.label,
      values,
    } as ActiveFilter;

    addActiveFilter(newActiveFilter);
  };

  return (
    <Disclosure.Panel className="px-4 pb-2 pt-4 font-bryant font-normal text-base border-t-2 border-t-primary h-fit">
      <form onSubmit={handleSubmitValue} className="flex flex-col gap-y-8 mt-4">
        {items.map((item, index) => (
          <div
            key={filter.source + filter.key + index}
            className="flex flex-col gap-y-3"
          >
            <div className="flex gap-x-8 justify-between items-center w-full">
              <label className="w-24">Value</label>
              <input
                id={`${filter.key}-${index}-value`}
                name={`${filter.key}-${index}-value`}
                className="border rounded-md p-2 w-full"
                placeholder="Enter a value"
                value={item.value}
                onChange={(event) => {
                  setItems((items) =>
                    items.map((item, i) =>
                      i === index
                        ? { ...item, value: event.target.value }
                        : item
                    )
                  );
                }}
              />
            </div>
            <div className="flex items-center w-full gap-x-8 justify-between">
              <label className="w-24">Operator</label>
              <div className="relative w-full">
                <div
                  onClick={() => toggleDropdown(index)}
                  onBlur={() => setOpenedDropdown(null)}
                  tabIndex={0}
                  className="flex items-center justify-between p-2 bg-white border rounded-md cursor-pointer"
                >
                  <span
                    id={`${filter.key}-${index}-operator-display`}
                    className={item.operator ? "" : "text-[#a0a0a0]"}
                  >
                    {item.operator || "Select an operator"}
                  </span>
                </div>
                {index === openedDropdown && (
                  <div
                    className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg"
                    onMouseDown={(event) => event.preventDefault()}
                  >
                    {filter.operators &&
                      filter.operators.map((operator) => (
                        <div
                          key={operator + index}
                          className="p-2 hover:bg-warning cursor-pointer"
                          onClick={(event) =>
                            handleSelectOperator(event, index)
                          }
                        >
                          {operator}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {showError && (
          <span className="text-red-500">
            Value and operator must not be empty
          </span>
        )}
        <div className="flex w-full justify-between">
          <Button
            text="Add filter"
            icon={faPlusCircle}
            type="primary"
            flex={true}
            className="text-[14px]"
            onClick={handleAddNewFilter}
          />

          <button
            type="submit"
            className="bg-primary text-white hover:bg-secondary rounded-md px-4 py-2 font-bold transition-colors duration-200 tracking-wide cursor-pointer flex items-center justify-between text-[14px]"
          >
            <FontAwesomeIcon icon={faCheck} className="mr-2" />
            <span>Apply</span>
          </button>
        </div>
      </form>
    </Disclosure.Panel>
  );
}
