import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST as postLogout } from "@/app/api/auth/logout/route";
import {
  __resetAuthStoreForTests,
  createSession,
  SESSION_COOKIE_NAME,
  verifyCredentials,
} from "@/lib/auth";

const { cookiesMock, redirectMock } = vi.hoisted(() => ({
  cookiesMock: vi.fn(),
  redirectMock: vi.fn((destination: string) => {
    throw new Error(`NEXT_REDIRECT:${destination}`);
  }),
}));

vi.mock("next/headers", () => ({
  cookies: cookiesMock,
}));

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
}));

import DashboardPage from "./page";

function setSessionCookie(token: string | null): void {
  cookiesMock.mockResolvedValue({
    get(name: string) {
      if (name !== SESSION_COOKIE_NAME || !token) {
        return undefined;
      }
      return { name, value: token };
    },
  });
}

describe("/dashboard protection", () => {
  beforeEach(() => {
    __resetAuthStoreForTests();
    cookiesMock.mockReset();
    redirectMock.mockClear();
    redirectMock.mockImplementation((destination: string) => {
      throw new Error(`NEXT_REDIRECT:${destination}`);
    });
  });

  it("redirects guests to sign-in with safe next target", async () => {
    setSessionCookie(null);
    await expect(DashboardPage()).rejects.toThrow("NEXT_REDIRECT:/sign-in?next=%2Fdashboard");
  });

  it("renders dashboard content for authenticated users", async () => {
    const user = verifyCredentials("demo@willdo.work", "password123");
    expect(user).not.toBeNull();
    const session = createSession(user!.id);
    setSessionCookie(session.token);

    const page = await DashboardPage();
    expect(page).toBeTruthy();
    expect(redirectMock).not.toHaveBeenCalled();
  });

  it("blocks protected route access after logout", async () => {
    const user = verifyCredentials("demo@willdo.work", "password123");
    expect(user).not.toBeNull();
    const session = createSession(user!.id);
    const cookieHeader = `${SESSION_COOKIE_NAME}=${encodeURIComponent(session.token)}`;

    await postLogout(
      new Request("http://localhost/api/auth/logout", {
        method: "POST",
        headers: {
          cookie: cookieHeader,
        },
      }),
    );

    setSessionCookie(session.token);
    await expect(DashboardPage()).rejects.toThrow("NEXT_REDIRECT:/sign-in?next=%2Fdashboard");
  });
});
