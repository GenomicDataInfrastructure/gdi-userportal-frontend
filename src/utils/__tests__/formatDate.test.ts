// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import { formatDate, formatDateTime } from "./../formatDate";
import { jest } from "@jest/globals";

describe("formatDate and formatDateTime", () => {
  describe("Client-side behavior", () => {
    beforeEach(() => {
      Object.defineProperty(global, "window", {
        value: global,
        writable: true,
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
      Object.defineProperty(global, "window", {
        value: undefined,
        writable: true,
      });
    });

    it("formats the date correctly from ISO string for formatDate", () => {
      const input = "2024-02-09T10:27:47.585Z";
      const expected = "9 February 2024";
      expect(formatDate(input)).toEqual(expected);
    });

    it("formats the date correctly from ISO string for formatDateTime", () => {
      const DateTimeFormat = Intl.DateTimeFormat;
      jest.spyOn(global.Intl, "DateTimeFormat").mockImplementation(
        (locale, options) =>
          new DateTimeFormat(locale, {
            ...options,
            timeZone: "Europe/Luxembourg",
          })
      );

      const input = "2024-02-09T10:27:47.585Z";
      const expected = "9 February 2024, 11.27 (CET)";
      expect(formatDateTime(input)).toEqual(expected);
    });

    it("returns the same string if the date is incorrect", () => {
      const input = "blah";
      const expected = "blah";
      expect(formatDate(input)).toEqual(expected);
      expect(formatDateTime(input)).toEqual(expected);
    });
  });

  describe("Server-side behavior", () => {
    it("throws an error if formatDate is called server-side", () => {
      const input = "2024-02-09T10:27:47.585Z";
      expect(() => formatDate(input)).toThrow(
        "getUserTimezone must be called on the client side"
      );
    });

    it("throws an error if formatDateTime is called server-side", () => {
      const input = "2024-02-09T10:27:47.585Z";
      expect(() => formatDateTime(input)).toThrow(
        "getUserTimezone must be called on the client side"
      );
    });
  });
});
