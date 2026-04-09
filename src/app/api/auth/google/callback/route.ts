import { NextResponse } from "next/server";
import {
  buildSessionCookie,
  createSession,
  getOrCreateGoogleUser,
  sanitizeNextPath,
} from "@/lib/auth";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const fallbackUrl = new URL("/sign-in?error=google_auth_failed", requestUrl.origin);

  if (!code) {
    return NextResponse.redirect(fallbackUrl);
  }

  const nextPath = sanitizeNextPath(requestUrl.searchParams.get("state"));
  const email = requestUrl.searchParams.get("email") ?? "google.user@willdo.work";
  const user = getOrCreateGoogleUser(email);
  const session = createSession(user.id);

  const targetUrl = new URL(nextPath, requestUrl.origin);
  const response = NextResponse.redirect(targetUrl);
  response.headers.set("Set-Cookie", buildSessionCookie(session.token));
  return response;
}
