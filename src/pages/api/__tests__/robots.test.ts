import { NextApiRequest, NextApiResponse } from "next";
import { createMocks } from "node-mocks-http";
import Robots from "../robots";

describe("Robots API Route", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_BASE_URL = "https://example.com";
  });

  afterEach(() => {
    delete process.env.NEXT_PUBLIC_BASE_URL;
  });

  it("returns a valid robots.txt content", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>();

    await Robots(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getHeaders()["content-type"]).toBe("text/plain");

    const content = res._getData();
    expect(content).toContain("User-agent: *");
    expect(content).toContain("Allow: /");
    expect(content).toContain("Sitemap: https://example.com/sitemap.xml");
  });

  it("uses default baseUrl when NEXT_PUBLIC_BASE_URL is not set", async () => {
    delete process.env.NEXT_PUBLIC_BASE_URL;
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>();

    await Robots(req, res);

    const content = res._getData();
    expect(content).toContain("Sitemap: http://localhost:3000/sitemap.xml");
  });

  it("handles malformed baseUrl correctly", async () => {
    process.env.NEXT_PUBLIC_BASE_URL = "not-a-valid-url";
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>();

    await Robots(req, res);

    const content = res._getData();
    expect(res._getStatusCode()).toBe(200);
    expect(content).toContain("Sitemap: not-a-valid-url/sitemap.xml");
  });

  it("handles empty baseUrl correctly", async () => {
    process.env.NEXT_PUBLIC_BASE_URL = "";
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>();

    await Robots(req, res);

    const content = res._getData();
    expect(res._getStatusCode()).toBe(200);
    expect(content).toContain("Sitemap: http://localhost:3000/sitemap.xml");
  });
});
