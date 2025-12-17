// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import Chips from "./Chips";
import contentConfig from "@/config/contentConfig";
import ExternalDatasetCardLink from "./ExternalDatasetCardLink";

export type CardItem = {
  text: string;
  icon: IconDefinition;
};

type CardProps = {
  url: string;
  title: string;
  subTitles?: string[];
  description?: string;
  cardItems: CardItem[];
  keywords?: string[];
  button?: React.ReactNode;
  conformsTo?: string;
  externalUrl?: string;
};

export default function Card({
  url,
  title,
  subTitles = [],
  description = "No description available",
  cardItems,
  keywords = [],
  button,
  conformsTo,
  externalUrl,
}: CardProps) {
  const isExternal = !!externalUrl;
  return (
    <Link
      href={url}
      className="flex flex-col w-full shadow-bb rounded-lg pl-4 pr-4.5 group relative"
    >
      <div className="flex flex-col lg:flex-row gap-x-2 gap-y-4">
        <div className="flex flex-col gap-y-2 shrink w-full lg:w-[90%] lg:pr-4">
          {subTitles.length > 0 && (
            <div className="flex flex-wrap gap-2 font-normal text-xs sm:text-sm leading-[12px] uppercase pb-2">
              {subTitles.map((subTitle, index) => (
                <span
                  key={index}
                  className={`${index ? "sm:border-l-[2px] sm:pl-2 sm:border-l-info" : ""}`}
                >
                  {subTitle}
                </span>
              ))}
            </div>
          )}

          <div className="font-bold text-[20px] group-hover:text-info group-hover:underline">
            {title}
          </div>

          {conformsTo && (
            <div className="mt-2 inline-block">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-info/10 text-info border border-info/20">
                {conformsTo}
              </span>
            </div>
          )}

          {description && (
            <p className="mt-3 line-clamp-2 font-normal text-base">
              {description}
            </p>
          )}

          <div className="mt-3 flex flex-col sm:flex-row sm:flex-wrap text-xs sm:text-[15px] gap-x-6 gap-y-3">
            {cardItems.map(
              (cardItem, index) =>
                cardItem.text && (
                  <div key={index} className="flex gap-x-2.5">
                    <div className="my-auto">
                      <FontAwesomeIcon
                        icon={cardItem.icon}
                        className="text-primary"
                      />
                    </div>
                    <span>{cardItem.text}</span>
                  </div>
                )
            )}
          </div>
        </div>
      </div>
      {isExternal ? (
        <div className="mt-6 pr-2">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-800">
                  External Dataset
                </p>
                <p className="text-xs text-gray-600 mt-0.5">
                  Not available for request through this portal
                </p>
              </div>
              {externalUrl ? (
                <ExternalDatasetCardLink url={externalUrl} />
              ) : (
                <span className="text-xs px-3 py-1.5 font-semibold bg-gray-200 text-gray-500 rounded-md shrink-0 whitespace-nowrap">
                  No Link Available
                </span>
              )}
            </div>
            {keywords.length > 0 && (
              <div>
                <Chips chips={keywords} />
              </div>
            )}
          </div>
        </div>
      ) : (
        (keywords.length > 0 || button) && (
          <div className="mt-6 flex justify-between items-start pr-2">
            <Chips chips={keywords} />
            {contentConfig.showBasketAndLogin && button}
          </div>
        )
      )}
    </Link>
  );
}
