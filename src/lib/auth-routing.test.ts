import { beforeEach, describe, expect, it } from "vitest";
import { __resetAuthStoreForTests, createSession, verifyCredentials } from "@/lib/auth";
import { resolveAuthPageAccess, resolveProtectedRouteAccess } from "@/lib/auth-routing";

describe("auth route guards", () => {
  beforeEach(() => {
    __resetAuthStoreForTests();
  });

  it("redirects unauthenticated users from protected routes", () => {
    const result = resolveProtectedRouteAccess(null, "/dashboard");
    expect(result.allowed).toBe(false);
    expect(result.redirectTo).toBe("/sign-in?next=%2Fdashboard");
  });

  it("allows authenticated users on protected routes", () => {
    const user = verifyCredentials("demo@willdo.work", "password123");
    expect(user).not.toBeNull();
    const session = createSession(user!.id);

    const result = resolveProtectedRouteAccess(session.token, "/dashboard");
    expect(result.allowed).toBe(true);
    expect(result.redirectTo).toBeNull();
  });

  it("redirects authenticated users away from auth pages", () => {
    const user = verifyCredentials("demo@willdo.work", "password123");
    expect(user).not.toBeNull();
    const session = createSession(user!.id);

    const result = resolveAuthPageAccess(session.token, "/dashboard");
    expect(result.allowed).toBe(false);
    expect(result.redirectTo).toBe("/dashboard");
  });
});
