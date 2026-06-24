// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import messageCatalog from "./messages.json";
import { routing, type AppLocale } from "./routing";

type FlatMessageCatalog = Record<string, Record<AppLocale, string>>;
type FlatMessages = Record<string, string>;
type NestedMessages = Record<string, unknown>;

const typedCatalog = messageCatalog as FlatMessageCatalog;

function toLocaleMessages(locale: AppLocale): FlatMessages {
  return Object.fromEntries(
    Object.entries(typedCatalog).map(([key, translations]) => [
      key,
      translations[locale],
    ])
  );
}

function toNestedMessages(messages: FlatMessages): NestedMessages {
  const nestedMessages: NestedMessages = {};

  for (const [key, value] of Object.entries(messages)) {
    const keyParts = key.split(".");
    let currentLevel = nestedMessages;

    keyParts.forEach((keyPart, index) => {
      if (index === keyParts.length - 1) {
        currentLevel[keyPart] = value;
        return;
      }

      if (
        typeof currentLevel[keyPart] !== "object" ||
        currentLevel[keyPart] === null
      ) {
        currentLevel[keyPart] = {};
      }

      currentLevel = currentLevel[keyPart] as NestedMessages;
    });
  }

  return nestedMessages;
}

const flatMessages = Object.fromEntries(
  routing.locales.map((locale) => [locale, toLocaleMessages(locale)])
) as Record<AppLocale, FlatMessages>;

const nestedMessages = Object.fromEntries(
  routing.locales.map((locale) => [
    locale,
    toNestedMessages(flatMessages[locale]),
  ])
) as Record<AppLocale, NestedMessages>;

export function getMessages(locale: AppLocale): NestedMessages {
  return nestedMessages[locale];
}

export function getFlatMessages(locale: AppLocale): FlatMessages {
  return flatMessages[locale];
}
