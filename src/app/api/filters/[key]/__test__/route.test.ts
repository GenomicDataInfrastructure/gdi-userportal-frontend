// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { GET } from "../route";
import { NextResponse } from "next/server";
import { filterValuesList } from "@/services/discovery";
import { handleErrorResponse } from "@/app/api/errorHandling";

// Mock the dependencies
jest.mock("@/services/discovery");
jest.mock("@/app/api/errorHandling");

describe("Filters API Route", () => {
  const mockRequest = new Request("http://localhost:3000/api/filters/theme");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return filter values successfully", async () => {
    const mockData = ["value1", "value2"];
    (filterValuesList as jest.Mock).mockResolvedValue({ data: mockData });

    const response = await GET(mockRequest, { params: { key: "theme" } });
    const responseData = await response.json();

    expect(filterValuesList).toHaveBeenCalledWith("theme");
    expect(response).toBeInstanceOf(NextResponse);
    expect(responseData).toEqual(mockData);
  });

  it("should handle errors properly", async () => {
    // Mock the error case
    const mockError = new Error("Test error");
    (filterValuesList as jest.Mock).mockRejectedValue(mockError);
    (handleErrorResponse as jest.Mock).mockReturnValue(
      new NextResponse("Error", { status: 500 })
    );

    const response = await GET(mockRequest, { params: { key: "theme" } });

    expect(filterValuesList).toHaveBeenCalledWith("theme");
    expect(handleErrorResponse).toHaveBeenCalledWith(mockError);
    expect(response.status).toBe(500);
  });
});
