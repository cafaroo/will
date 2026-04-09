import { NextResponse } from "next/server";
import { getSessionTokenFromRequest, getUserBySessionToken } from "@/lib/auth";

export async function GET(request: Request) {
  const token = getSessionTokenFromRequest(request);
  const user = getUserBySessionToken(token);
  if (!user) {
    return NextResponse.json({ authenticated: false });
  }
  return NextResponse.json({
    authenticated: true,
    user: {
      email: user.email,
      provider: user.provider,
    },
  });
}
