import { NextResponse } from "next/server";
import { sanitizeNextPath } from "@/lib/auth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const nextPath = sanitizeNextPath(url.searchParams.get("next"));
  const fakeEmail = "google.user@willdo.work";

  const callbackUrl = new URL("/api/auth/google/callback", url.origin);
  callbackUrl.searchParams.set("code", "local-dev-code");
  callbackUrl.searchParams.set("email", fakeEmail);
  callbackUrl.searchParams.set("state", nextPath);

  return NextResponse.redirect(callbackUrl);
}
