import { buildLoginRedirect, getUserBySessionToken, sanitizeNextPath } from "@/lib/auth";

export interface RouteAccessResult {
  allowed: boolean;
  redirectTo: string | null;
}

export function resolveProtectedRouteAccess(
  sessionToken: string | null | undefined,
  routePath: string,
): RouteAccessResult {
  const user = getUserBySessionToken(sessionToken);
  if (!user) {
    return {
      allowed: false,
      redirectTo: buildLoginRedirect(routePath),
    };
  }
  return {
    allowed: true,
    redirectTo: null,
  };
}

export function resolveAuthPageAccess(
  sessionToken: string | null | undefined,
  requestedNextPath: string | null | undefined,
): RouteAccessResult {
  const user = getUserBySessionToken(sessionToken);
  if (!user) {
    return {
      allowed: true,
      redirectTo: null,
    };
  }
  return {
    allowed: false,
    redirectTo: sanitizeNextPath(requestedNextPath),
  };
}
