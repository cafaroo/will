import { NextResponse } from "next/server";
import {
  buildSessionCookie,
  createCredentialsUser,
  createSession,
  verifyCredentials,
} from "@/lib/auth";

interface CredentialsPayload {
  email?: unknown;
  password?: unknown;
  mode?: unknown;
}

function parsePayload(payload: CredentialsPayload): {
  email: string;
  password: string;
  mode: "sign-in" | "sign-up";
} | null {
  if (typeof payload.email !== "string" || typeof payload.password !== "string") {
    return null;
  }
  const normalizedMode = payload.mode === "sign-up" ? "sign-up" : "sign-in";
  const email = payload.email.trim().toLowerCase();
  const password = payload.password;
  if (!email || !password) {
    return null;
  }
  return { email, password, mode: normalizedMode };
}

export async function POST(request: Request) {
  let body: CredentialsPayload;
  try {
    body = (await request.json()) as CredentialsPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }

  const parsed = parsePayload(body);
  if (!parsed) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const user =
    parsed.mode === "sign-up"
      ? createCredentialsUser(parsed.email, parsed.password)
      : verifyCredentials(parsed.email, parsed.password);

  if (!user) {
    const message =
      parsed.mode === "sign-up"
        ? "An account with this email already exists."
        : "Incorrect email or password.";
    return NextResponse.json({ error: message }, { status: 401 });
  }

  const session = createSession(user.id);
  const response = NextResponse.json({
    ok: true,
    user: {
      email: user.email,
      provider: user.provider,
    },
  });
  response.headers.set("Set-Cookie", buildSessionCookie(session.token));
  return response;
}
