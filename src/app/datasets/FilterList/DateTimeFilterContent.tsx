// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import Button from "@/components/Button";
import { faCheck, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DisclosurePanel } from "@headlessui/react";
import { useEffect, useState } from "react";
import { FilterItemProps } from "./FilterItem";
import { useFilters } from "@/providers/filters/FilterProvider";
import { useTranslations } from "next-intl";
import { Operator } from "@/app/api/discovery/open-api/schemas";
import { ActiveFilter } from "@/providers/filters/FilterProvider.types";

type DateTimeFilterContentProps = FilterItemProps;

type DateTimeFormItem = {
  value: string;
  operator?: Operator;
};

const initialDateTimeFormItem = {
  value: "",
};

export default function DateTimeFilterContent({
  filter,
}: DateTimeFilterContentProps) {
  const t = useTranslations("datasets.filters");
  const { activeFilters, addActiveFilter } = useFilters();
  const [items, setItems] = useState<DateTimeFormItem[]>([
    initialDateTimeFormItem,
  ]);
  const [showError, setShowError] = useState<boolean>(false);

  const correspondingActiveFilter = activeFilters.find(
    (activeFilter) =>
      activeFilter.key === filter.key && activeFilter.source === filter.source
  );

  useEffect(() => {
    if (!correspondingActiveFilter) {
      setItems([initialDateTimeFormItem]);
    } else {
      const existingItems = correspondingActiveFilter.values!.map((value) => ({
        value: value.value,
        operator: value.operator,
      }));
      setItems(existingItems);
    }
  }, [activeFilters, correspondingActiveFilter]);

  const handleSelectOperator = (operator: Operator, index: number) => {
    setItems((items) =>
      items.map((item, i) => (i === index ? { ...item, operator } : item))
    );
  };

  function handleAddNewFilter() {
    setItems([...items, { value: "" }]);
  }

  const handleSubmitValue = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const values = items.reduce(
      (acc: DateTimeFormItem[], item: DateTimeFormItem) => {
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
    <DisclosurePanel
      as="div"
      className="px-4 pb-2 pt-4 font-bryant font-normal text-base border-t-2 border-t-primary h-fit"
    >
      <form onSubmit={handleSubmitValue} className="flex flex-col gap-y-8 mt-4">
        {items.map((item, index) => (
          <div
            key={filter.source + filter.key + index}
            className="flex flex-col gap-y-3"
          >
            <div className="flex gap-x-8 justify-between items-center w-full">
              <label htmlFor={`${filter.key}-${index}-value`} className="w-24">
                {t("dateLabel")}
              </label>
              <input
                type="date"
                id={`${filter.key}-${index}-value`}
                name={`${filter.key}-${index}-value`}
                className="border rounded-md p-2 w-full"
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
              <label
                htmlFor={`${filter.key}-${index}-operator`}
                className="w-24"
              >
                {t("operatorLabel")}
              </label>
              <select
                id={`${filter.key}-${index}-operator`}
                name={`${filter.key}-${index}-operator`}
                className={`p-2 bg-white border rounded-md cursor-pointer w-full ${
                  item.operator ? "" : "text-gray-500"
                }`}
                value={item.operator ?? ""}
                onChange={(event) =>
                  handleSelectOperator(event.target.value as Operator, index)
                }
              >
                <option value="" disabled>
                  {t("operatorPlaceholder")}
                </option>
                {filter.operators?.map((operator) => (
                  <option key={operator} value={operator}>
                    {operator}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
        {showError && (
          <span className="text-red-500">{t("dateAndOperatorError")}</span>
        )}
        <div className="flex w-full justify-between">
          <Button
            text={t("addFilter")}
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
            <span>{t("apply")}</span>
          </button>
        </div>
      </form>
    </DisclosurePanel>
  );
}
