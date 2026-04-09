import { beforeEach, describe, expect, it } from "vitest";
import { GET } from "./route";
import { __resetAuthStoreForTests } from "@/lib/auth";

describe("GET /api/auth/google/callback", () => {
  beforeEach(() => {
    __resetAuthStoreForTests();
  });

  it("redirects to sign-in when code is missing", async () => {
    const response = await GET(new Request("http://localhost/api/auth/google/callback"));
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/sign-in?error=google_auth_failed");
  });

  it("creates session and redirects to safe next path", async () => {
    const response = await GET(
      new Request("http://localhost/api/auth/google/callback?code=ok&state=/dashboard"),
    );
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost/dashboard");
    expect(response.headers.get("set-cookie")).toContain("willdo_session=");
  });
});
