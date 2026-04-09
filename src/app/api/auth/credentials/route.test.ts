import { beforeEach, describe, expect, it } from "vitest";
import { POST } from "./route";
import { __resetAuthStoreForTests } from "@/lib/auth";

describe("POST /api/auth/credentials", () => {
  beforeEach(() => {
    __resetAuthStoreForTests();
  });

  it("returns session cookie on successful sign in", async () => {
    const request = new Request("http://localhost/api/auth/credentials", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "demo@willdo.work",
        password: "password123",
        mode: "sign-in",
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(response.headers.get("set-cookie")).toContain("willdo_session=");
  });

  it("returns friendly error for invalid credentials", async () => {
    const request = new Request("http://localhost/api/auth/credentials", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "demo@willdo.work",
        password: "invalid",
        mode: "sign-in",
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.error).toBe("Incorrect email or password.");
  });
});
