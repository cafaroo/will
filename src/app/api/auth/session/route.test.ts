import { beforeEach, describe, expect, it } from "vitest";
import { POST as postCredentials } from "@/app/api/auth/credentials/route";
import { POST as postLogout } from "@/app/api/auth/logout/route";
import { GET } from "./route";
import { __resetAuthStoreForTests } from "@/lib/auth";

function extractSessionCookie(setCookieHeader: string | null): string {
  return (setCookieHeader ?? "").split(";")[0] ?? "";
}

describe("session lifecycle", () => {
  beforeEach(() => {
    __resetAuthStoreForTests();
  });

  it("returns authenticated=true after login", async () => {
    const loginRequest = new Request("http://localhost/api/auth/credentials", {
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

    const loginResponse = await postCredentials(loginRequest);
    const sessionCookie = extractSessionCookie(loginResponse.headers.get("set-cookie"));
    expect(sessionCookie).toContain("willdo_session=");

    const sessionRequest = new Request("http://localhost/api/auth/session", {
      headers: {
        cookie: sessionCookie,
      },
    });
    const sessionResponse = await GET(sessionRequest);
    const body = await sessionResponse.json();
    expect(body.authenticated).toBe(true);
  });

  it("invalidates session on logout", async () => {
    const loginRequest = new Request("http://localhost/api/auth/credentials", {
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
    const loginResponse = await postCredentials(loginRequest);
    const sessionCookie = extractSessionCookie(loginResponse.headers.get("set-cookie"));

    const logoutRequest = new Request("http://localhost/api/auth/logout", {
      method: "POST",
      headers: {
        cookie: sessionCookie,
      },
    });
    const logoutResponse = await postLogout(logoutRequest);
    expect(logoutResponse.headers.get("set-cookie")).toContain("Max-Age=0");

    const afterLogoutSessionRequest = new Request("http://localhost/api/auth/session", {
      headers: {
        cookie: sessionCookie,
      },
    });
    const afterLogoutSessionResponse = await GET(afterLogoutSessionRequest);
    const body = await afterLogoutSessionResponse.json();
    expect(body.authenticated).toBe(false);
  });
});
