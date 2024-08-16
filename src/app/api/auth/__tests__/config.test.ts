import { decrypt } from "@/utils/encryption";
import { jwtDecode } from "jwt-decode";
import { Account, getServerSession } from "next-auth";
import {
  getToken,
  completeTokenWithAccountInfo,
  refreshAccessToken,
} from "../auth"; // replace with the correct path
import { ExtendedSession } from "../auth.types";

// Mock the imported modules
jest.mock("@/utils/encryption");
jest.mock("jwt-decode");
jest.mock("next-auth");

describe("getToken", () => {
  it("should return decrypted token when session exists", async () => {
    const mockDecryptedToken = "decrypted_token";
    const mockSession = {
      access_token: "encrypted_access_token",
      id_token: "encrypted_id_token",
    } as ExtendedSession;

    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (decrypt as jest.Mock).mockReturnValue(mockDecryptedToken);

    const token = await getToken("access_token");
    expect(decrypt).toHaveBeenCalledWith("encrypted_access_token");
    expect(token).toBe(mockDecryptedToken);
  });

  it("should return null when session does not exist", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const token = await getToken("access_token");
    expect(token).toBeNull();
  });
});

describe("completeTokenWithAccountInfo", () => {
  it("should return a complete token with account information", () => {
    const mockToken = {};
    const mockAccount = {
      access_token: "mock_access_token",
      id_token: "mock_id_token",
      refresh_token: "mock_refresh_token",
      expires_at: 1234567890,
    } as Account;

    (jwtDecode as jest.Mock).mockReturnValue("decoded_token");

    const result = completeTokenWithAccountInfo(mockToken, mockAccount);
    expect(jwtDecode).toHaveBeenCalledWith("mock_access_token");
    expect(result).toEqual({
      decoded: "decoded_token",
      access_token: "mock_access_token",
      id_token: "mock_id_token",
      refresh_token: "mock_refresh_token",
      expires_at: 1234567890,
    });
  });
});

describe("refreshAccessToken", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return a refreshed token when the request is successful", async () => {
    const mockToken = {
      refresh_token: "mock_refresh_token",
    };

    const mockResponse = {
      access_token: "new_access_token",
      id_token: "new_id_token",
      expires_in: 3600,
      refresh_token: "new_refresh_token",
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockResponse),
      } as Response)
    ) as jest.Mock;

    const result = await refreshAccessToken(mockToken);
    expect(fetch).toHaveBeenCalledWith(`${process.env.REFRESH_TOKEN_URL}`, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: `${process.env.KEYCLOAK_CLIENT_ID}`,
        client_secret: `${process.env.KEYCLOAK_CLIENT_SECRET}`,
        grant_type: "refresh_token",
        refresh_token: "mock_refresh_token",
      }),
      method: "POST",
      cache: "no-cache",
    });

    expect(jwtDecode).toHaveBeenCalledWith("new_access_token");
    expect(result).toEqual({
      access_token: "new_access_token",
      id_token: "new_id_token",
      decoded: "decoded_token",
      expires_at: expect.any(Number),
      refresh_token: "new_refresh_token",
    });
  });

  it("should handle failed token refresh", async () => {
    const mockToken = {
      refresh_token: "mock_refresh_token",
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({}),
      } as Response)
    ) as jest.Mock;

    const result = await refreshAccessToken(mockToken);
    expect(result).toEqual({
      ...mockToken,
      access_token: undefined,
      id_token: undefined,
      decoded: "decoded_token",
      expires_at: expect.any(Number),
      refresh_token: undefined,
    });
  });
});
