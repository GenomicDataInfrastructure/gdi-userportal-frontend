// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { CardItem } from "@/components/Card";
import { formatDate } from "@/utils/formatDate";
import {
  faCalendarAlt,
  faSyncAlt,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

type CardItemMetadata = {
  createdAt?: string;
  modifiedAt?: string;
  publishers?: { name?: string }[];
};

export function createDateCardItems({
  createdAt,
  modifiedAt,
}: CardItemMetadata): CardItem[] {
  return [
    {
      text: (createdAt && `Created on ${formatDate(createdAt)}`) || "",
      icon: faCalendarAlt,
    },
    {
      text: (modifiedAt && `Modified on ${formatDate(modifiedAt)}`) || "",
      icon: faSyncAlt,
    },
  ];
}

export function createPublisherCardItem({
  publishers,
}: CardItemMetadata): CardItem {
  const publisherNames = publishers
    ?.map((publisher) => publisher.name)
    .filter((name): name is string => Boolean(name));

  return {
    text:
      ((publisherNames?.length ?? 0) > 0 &&
        `Published by ${(publisherNames ?? []).join(", ")}`) ||
      "",
    icon: faUser,
  };
}
