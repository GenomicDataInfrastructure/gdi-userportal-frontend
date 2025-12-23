// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import Chips from "./Chips";
import contentConfig from "@/config/contentConfig";

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
  externalUrl?: string;
  isExternal?: boolean;
  externalLabel?: string;
};

export default function Card({
  url,
  title,
  subTitles = [],
  description = "No description available",
  cardItems,
  keywords = [],
  button,
  externalUrl,
  isExternal: isExternalProp,
  externalLabel,
}: CardProps) {
  const isExternal = isExternalProp ?? !!externalUrl;
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
                  key={subTitle}
                  className={index ? "sm:border-l-[2px] sm:pl-2 sm:border-l-info" : undefined}
                >
                  {subTitle}
                </span>
              ))}
            </div>
          )}

          <div className="font-bold text-[20px] group-hover:text-info group-hover:underline">
            {title}
          </div>

          {isExternal && (
            <div className="inline-block w-fit">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-orange-100 text-orange-700 border border-orange-300">
                {externalLabel || "EXTERNAL"}
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
      {(keywords.length > 0 || button) && (
        <div className="mt-6 flex justify-between items-start pr-2">
          {keywords.length > 0 && <Chips chips={keywords} />}
          {contentConfig.showBasketAndLogin && button}
        </div>
      )}
    </Link>
  );
}
