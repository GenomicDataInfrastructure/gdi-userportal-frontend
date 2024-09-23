import { NextApiRequest, NextApiResponse } from "next";
import { createMocks } from "node-mocks-http";
import fs from "fs";
import path from "path";
import robotsHandler from "../robots";

jest.mock("fs");
jest.mock("path");

describe("/api/robots", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("returns robots.txt content", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
    });

    const mockRobotsContent = `User-agent: *\nAllow: /\nSitemap: /sitemap.xml`;

    (fs.readFileSync as jest.Mock).mockReturnValue(mockRobotsContent);
    (path.join as jest.Mock).mockReturnValue("/mocked/path/robots.txt");

    await robotsHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getHeaders()["content-type"]).toBe("text/plain");
    expect(res._getData()).toBe(mockRobotsContent);
  });

  it("handles file read errors", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
    });

    (fs.readFileSync as jest.Mock).mockImplementation(() => {
      throw new Error("File not found");
    });

    await robotsHandler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      error: "Unable to serve robots.txt",
    });
  });
});
