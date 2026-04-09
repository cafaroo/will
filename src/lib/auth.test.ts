import { beforeEach, describe, expect, it } from "vitest";
import {
  __resetAuthStoreForTests,
  buildLoginRedirect,
  createCredentialsUser,
  createSession,
  getSessionByToken,
  getUserBySessionToken,
  invalidateSession,
  sanitizeNextPath,
  verifyCredentials,
} from "@/lib/auth";

describe("auth helpers", () => {
  beforeEach(() => {
    __resetAuthStoreForTests();
  });

  it("authenticates valid credentials", () => {
    const user = verifyCredentials("demo@willdo.work", "password123");
    expect(user).not.toBeNull();
    expect(user?.email).toBe("demo@willdo.work");
  });

  it("rejects invalid credentials", () => {
    const user = verifyCredentials("demo@willdo.work", "wrong-password");
    expect(user).toBeNull();
  });

  it("creates and invalidates sessions", () => {
    const user = createCredentialsUser("new@willdo.work", "secret123");
    expect(user).not.toBeNull();
    const session = createSession(user!.id);

    const activeSession = getSessionByToken(session.token);
    expect(activeSession).not.toBeNull();
    expect(getUserBySessionToken(session.token)?.email).toBe("new@willdo.work");

    invalidateSession(session.token);
    expect(getSessionByToken(session.token)).toBeNull();
  });

  it("sanitizes unsafe next paths", () => {
    expect(sanitizeNextPath("https://evil.example")).toBe("/dashboard");
    expect(sanitizeNextPath("//evil.example")).toBe("/dashboard");
    expect(sanitizeNextPath("/sign-in")).toBe("/dashboard");
    expect(sanitizeNextPath("/sign-up")).toBe("/dashboard");
    expect(sanitizeNextPath("/dashboard")).toBe("/dashboard");
  });

  it("builds safe login redirect", () => {
    expect(buildLoginRedirect("/dashboard")).toBe("/sign-in?next=%2Fdashboard");
  });
});
