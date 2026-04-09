type AuthProvider = "credentials" | "google";

export interface AuthUser {
  id: string;
  email: string;
  provider: AuthProvider;
}

interface UserRecord extends AuthUser {
  password: string | null;
}

interface SessionRecord {
  token: string;
  userId: string;
  expiresAt: number;
}

export const SESSION_COOKIE_NAME = "willdo_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

const usersByEmail = new Map<string, UserRecord>();
const sessionsByToken = new Map<string, SessionRecord>();

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function buildUser(email: string, provider: AuthProvider, password: string | null): UserRecord {
  return {
    id: crypto.randomUUID(),
    email: normalizeEmail(email),
    provider,
    password,
  };
}

function seedDefaultUser() {
  const seedEmail = "demo@willdo.work";
  if (!usersByEmail.has(seedEmail)) {
    usersByEmail.set(seedEmail, buildUser(seedEmail, "credentials", "password123"));
  }
}

seedDefaultUser();

function isValidSession(session: SessionRecord): boolean {
  if (session.expiresAt <= Date.now()) {
    sessionsByToken.delete(session.token);
    return false;
  }
  return true;
}

export function sanitizeNextPath(nextValue: string | null | undefined): string {
  if (!nextValue) {
    return "/dashboard";
  }
  if (!nextValue.startsWith("/")) {
    return "/dashboard";
  }
  if (nextValue.startsWith("//")) {
    return "/dashboard";
  }
  if (nextValue === "/sign-in" || nextValue === "/sign-up") {
    return "/dashboard";
  }
  return nextValue;
}

export function buildLoginRedirect(nextPath: string): string {
  return `/sign-in?next=${encodeURIComponent(sanitizeNextPath(nextPath))}`;
}

export function createCredentialsUser(email: string, password: string): AuthUser | null {
  const normalizedEmail = normalizeEmail(email);
  if (usersByEmail.has(normalizedEmail)) {
    return null;
  }
  const record = buildUser(normalizedEmail, "credentials", password);
  usersByEmail.set(normalizedEmail, record);
  return { id: record.id, email: record.email, provider: record.provider };
}

export function verifyCredentials(email: string, password: string): AuthUser | null {
  const record = usersByEmail.get(normalizeEmail(email));
  if (!record || record.provider !== "credentials" || !record.password) {
    return null;
  }
  if (record.password !== password) {
    return null;
  }
  return { id: record.id, email: record.email, provider: record.provider };
}

export function getOrCreateGoogleUser(email: string): AuthUser {
  const normalizedEmail = normalizeEmail(email);
  const existing = usersByEmail.get(normalizedEmail);
  if (existing) {
    return { id: existing.id, email: existing.email, provider: existing.provider };
  }

  const created = buildUser(normalizedEmail, "google", null);
  usersByEmail.set(normalizedEmail, created);
  return { id: created.id, email: created.email, provider: created.provider };
}

export function getSessionByToken(token: string | null | undefined): SessionRecord | null {
  if (!token) {
    return null;
  }
  const session = sessionsByToken.get(token);
  if (!session) {
    return null;
  }
  return isValidSession(session) ? session : null;
}

export function getUserBySessionToken(token: string | null | undefined): AuthUser | null {
  const session = getSessionByToken(token);
  if (!session) {
    return null;
  }
  const user = Array.from(usersByEmail.values()).find((candidate) => candidate.id === session.userId);
  if (!user) {
    sessionsByToken.delete(session.token);
    return null;
  }
  return { id: user.id, email: user.email, provider: user.provider };
}

export function createSession(userId: string): SessionRecord {
  const session: SessionRecord = {
    token: crypto.randomUUID(),
    userId,
    expiresAt: Date.now() + SESSION_TTL_SECONDS * 1000,
  };
  sessionsByToken.set(session.token, session);
  return session;
}

export function invalidateSession(token: string | null | undefined): void {
  if (!token) {
    return;
  }
  sessionsByToken.delete(token);
}

export function parseSessionTokenFromCookieHeader(cookieHeader: string | null): string | null {
  if (!cookieHeader) {
    return null;
  }
  const cookies = cookieHeader.split(";").map((segment) => segment.trim());
  for (const cookie of cookies) {
    if (!cookie.startsWith(`${SESSION_COOKIE_NAME}=`)) {
      continue;
    }
    const [, rawValue = ""] = cookie.split("=");
    return decodeURIComponent(rawValue);
  }
  return null;
}

export function getSessionTokenFromRequest(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie");
  return parseSessionTokenFromCookieHeader(cookieHeader);
}

export function buildSessionCookie(token: string): string {
  const secureAttribute = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_TTL_SECONDS}${secureAttribute}`;
}

export function buildSessionClearCookie(): string {
  const secureAttribute = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secureAttribute}`;
}

export function __resetAuthStoreForTests(): void {
  usersByEmail.clear();
  sessionsByToken.clear();
  seedDefaultUser();
}
