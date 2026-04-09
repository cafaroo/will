import { NextResponse } from "next/server";
import { buildSessionClearCookie, getSessionTokenFromRequest, invalidateSession } from "@/lib/auth";

export async function POST(request: Request) {
  const token = getSessionTokenFromRequest(request);
  invalidateSession(token);

  const requestUrl = new URL(request.url);
  const response = NextResponse.redirect(new URL("/sign-in", requestUrl.origin));
  response.headers.set("Set-Cookie", buildSessionClearCookie());
  return response;
}
