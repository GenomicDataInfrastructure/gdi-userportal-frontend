// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import debounce from "./../debounce";
import { jest } from "@jest/globals";

describe("debounce", () => {
  jest.useFakeTimers();

  it("executes the function after the specified delay", () => {
    const func = jest.fn();
    const debouncedFunc = debounce(func, 1000);

    debouncedFunc();
    expect(func).not.toHaveBeenCalled();

    jest.advanceTimersByTime(500);
    expect(func).not.toHaveBeenCalled();

    jest.advanceTimersByTime(500);
    expect(func).toHaveBeenCalled();
  });

  it("does not execute immediately", () => {
    const func = jest.fn();
    const debouncedFunc = debounce(func, 1000);

    debouncedFunc();
    expect(func).not.toHaveBeenCalled();
  });

  it("is only executed once within the delay period", () => {
    const func = jest.fn();
    const debouncedFunc = debounce(func, 1000);

    debouncedFunc();
    debouncedFunc();
    debouncedFunc();

    jest.advanceTimersByTime(1000);
    expect(func).toHaveBeenCalledTimes(1);
  });

  it("receives the last provided arguments", () => {
    const func = jest.fn();
    const debouncedFunc = debounce(func, 1000);

    debouncedFunc("first call");
    debouncedFunc("second call");
    debouncedFunc("last call");

    jest.advanceTimersByTime(1000);
    expect(func).toHaveBeenCalledWith("last call");
  });
});
