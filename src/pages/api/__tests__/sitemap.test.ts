import { NextApiRequest, NextApiResponse } from "next";
import { createMocks } from "node-mocks-http";
import Sitemap from "../sitemap";

describe("Sitemap API Route", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_BASE_URL = "https://example.com";
  });

  afterEach(() => {
    delete process.env.NEXT_PUBLIC_BASE_URL;
  });

  it("returns a valid sitemap.xml content", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>();

    await Sitemap(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getHeaders()["content-type"]).toBe("application/xml");

    const content = res._getData();
    expect(content).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(content).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(content).toContain("<loc>https://example.com/</loc>");
    expect(content).toContain("<loc>https://example.com/datasets</loc>");
    expect(content).toContain("<loc>https://example.com/themes</loc>");
    expect(content).toContain("<loc>https://example.com/publishers</loc>");
    expect(content).toContain("<loc>https://example.com/about</loc>");
  });

  it("uses default baseUrl when NEXT_PUBLIC_BASE_URL is not set", async () => {
    delete process.env.NEXT_PUBLIC_BASE_URL;
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>();

    await Sitemap(req, res);

    const content = res._getData();
    expect(content).toContain("<loc>http://localhost:3000/</loc>");
  });
});
