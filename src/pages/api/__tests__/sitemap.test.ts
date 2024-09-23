import { NextApiRequest, NextApiResponse } from "next";
import { createMocks } from "node-mocks-http";
import fs from "fs";
import path from "path";
import sitemapHandler from "../sitemap";

jest.mock("fs");
jest.mock("path");

describe("/api/sitemap", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("returns a valid sitemap", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
      headers: { host: "example.com" },
    });

    const mockSitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url><loc>{{ BASE_URL }}/</loc></url>
    </urlset>`;

    (fs.readFileSync as jest.Mock).mockReturnValue(mockSitemapContent);
    (path.join as jest.Mock).mockReturnValue("/mocked/path/sitemap.xml");

    await sitemapHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getHeaders()["content-type"]).toBe("text/xml");
    expect(res._getData()).toContain("<loc>https://example.com/</loc>");
  });

  it("handles file read errors", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
    });

    (fs.readFileSync as jest.Mock).mockImplementation(() => {
      throw new Error("File not found");
    });

    await sitemapHandler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      error: "Unable to generate sitemap",
    });
  });

  it("replaces all BASE_URL placeholders", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
      headers: { host: "example.com" },
    });

    const mockSitemapContent = `
    <url><loc>{{ BASE_URL }}/page1</loc></url>
    <url><loc>{{ BASE_URL }}/page2</loc></url>
    `;

    (fs.readFileSync as jest.Mock).mockReturnValue(mockSitemapContent);

    await sitemapHandler(req, res);

    const responseData = res._getData();
    expect(responseData).toContain("<loc>https://example.com/page1</loc>");
    expect(responseData).toContain("<loc>https://example.com/page2</loc>");
    expect(responseData).not.toContain("{{ BASE_URL }}");
  });
});
