// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import messageCatalog from "./messages.json";

const messageLocales = ["en", "fr"] as const;

type MessageLocale = (typeof messageLocales)[number];
type FlatMessageCatalog = Record<string, Record<MessageLocale, string>>;
type FlatMessages = Record<string, string>;
type NestedMessages = Record<string, unknown>;

const typedCatalog = messageCatalog as FlatMessageCatalog;

function toLocaleMessages(locale: MessageLocale): FlatMessages {
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
  messageLocales.map((locale) => [locale, toLocaleMessages(locale)])
) as Record<MessageLocale, FlatMessages>;

const nestedMessages = Object.fromEntries(
  messageLocales.map((locale) => [
    locale,
    toNestedMessages(flatMessages[locale]),
  ])
) as Record<MessageLocale, NestedMessages>;

export function getMessages(locale: MessageLocale): NestedMessages {
  return nestedMessages[locale];
}

export function getFlatMessages(locale: MessageLocale): FlatMessages {
  return flatMessages[locale];
}
