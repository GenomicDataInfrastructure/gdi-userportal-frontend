// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import Button from "@/components/Button";
import Chips from "@/components/Chips";
import { useWindowSize } from "@/hooks";
import { useDatasetBasket } from "@/providers/DatasetBasketProvider";
import { SearchedDataset } from "@/services/discovery/types/dataset.types";
import { formatDate } from "@/utils/formatDate";
import { truncateDescription } from "@/utils/textProcessing";
import {
  faMinusCircle,
  faPlusCircle,
  faCalendarAlt,
  faUser,
  faBookBookmark,
  faThLarge,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

type DatasetCardProps = {
  dataset: SearchedDataset;
};

function DatasetCard({ dataset }: Readonly<DatasetCardProps>) {
  const screenSize = useWindowSize();
  const truncatedDesc = dataset.description
    ? truncateDescription(dataset.description, screenSize)
    : null;

  const { basket, addDatasetToBasket, removeDatasetFromBasket, isLoading } =
    useDatasetBasket();

  const isInBasket = basket.some((ds) => ds.id === dataset.id);

  const toggleDatasetInBasket = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isInBasket) {
      removeDatasetFromBasket(dataset);
    } else {
      addDatasetToBasket(dataset);
    }
  };

  const hasIdentifier = !!dataset.identifier;
  const buttonDisabled = isLoading || !hasIdentifier;

  return (
    <Link
      href={`/datasets/${dataset.id}`}
      className="flex flex-col w-full mb-1.5 shadow-bb rounded-lg pl-4 pr-4.5 group"
    >
      <div className="flex flex-col lg:flex-row gap-x-2 gap-y-4">
        <div className="flex flex-col gap-y-2 shrink w-full lg:w-[90%] lg:pr-4">
          {dataset.themes && dataset.themes.length > 0 && (
            <div className="flex gap-2 font-normal text-sm sm:text-[12px] leading-[12px] uppercase pb-2">
              <FontAwesomeIcon icon={faThLarge} className="text-primary" />
              {dataset.themes?.map((theme, index) => (
                <span
                  key={index}
                  className={`${index ? "sm:border-l-[2px] sm:pl-2 sm:border-l-info" : ""}`}
                >
                  {theme.label}
                </span>
              ))}
            </div>
          )}

          <div className="font-bold text-[20px] group-hover:text-info group-hover:underline">
            {dataset.title}
          </div>

          <p className="line-clamp-2 font-normal text-base">{truncatedDesc}</p>

          <div className="flex flex-col sm:flex-row sm:flex-wrap text-xs sm:text-[15px] gap-x-2 gap-y-2">
            <div className="flex gap-x-2.5 pr-2 sm:pr-2 sm:border-r-[2px] sm:border-r-info">
              <div className="my-auto">
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className="text-primary"
                />
              </div>
              <span>{formatDate(dataset.createdAt)}</span>
            </div>
            <div className="flex gap-x-2.5">
              <div className="my-auto">
                <FontAwesomeIcon icon={faUser} className="text-primary" />
              </div>
              <span>Published by {dataset.organization.title}</span>
            </div>
            {dataset.recordsCount && dataset.recordsCount > 0 && (
              <div className="flex gap-x-2.5 pl-2 sm:pl-2 sm:border-l-[2px] sm:border-l-info">
                <div className="my-auto">
                  <FontAwesomeIcon
                    icon={faBookBookmark}
                    className="text-primary"
                  />
                </div>
                <span>
                  {dataset.recordsCount > 1
                    ? `${dataset.recordsCount} Records`
                    : `${dataset.recordsCount} Record`}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-between items-center pr-2">
        <Chips chips={dataset.themes?.map((x) => x.label) || []} />
        <Button
          text={isInBasket ? "Remove from basket" : "Add to basket"}
          icon={isInBasket ? faMinusCircle : faPlusCircle}
          onClick={toggleDatasetInBasket}
          type={isInBasket ? "warning" : "primary"}
          disabled={buttonDisabled}
        />
      </div>
    </Link>
  );
}

export default DatasetCard;
