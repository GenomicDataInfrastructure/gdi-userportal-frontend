// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

const { parseArgs } = require("../run-harvester");

describe("run-harvester", () => {
  test("parseArgs defaults to empty url, file, and mode", () => {
    expect(parseArgs([])).toEqual({ url: "", file: "", mode: "" });
  });

  test("parseArgs reads --url", () => {
    expect(parseArgs(["--url", "https://example.org/catalogue.rdf"])).toEqual({
      url: "https://example.org/catalogue.rdf",
      file: "",
      mode: "",
    });
  });

  test("parseArgs reads --file", () => {
    expect(parseArgs(["--file", "no-data-dict.rdf"])).toEqual({
      url: "",
      file: "no-data-dict.rdf",
      mode: "",
    });
  });

  test("parseArgs reads --secret and --mode", () => {
    expect(
      parseArgs(["--secret", "top-secret", "--mode", "append"])
    ).toMatchObject({ secret: "top-secret", mode: "append" });
  });

  test("parseArgs treats --append as a shortcut for --mode append", () => {
    expect(parseArgs(["--append"]).mode).toBe("append");
  });

  test("parseArgs recognises --help and -h", () => {
    expect(parseArgs(["--help"]).help).toBe(true);
    expect(parseArgs(["-h"]).help).toBe(true);
    expect(parseArgs([]).help).toBeUndefined();
  });
});
