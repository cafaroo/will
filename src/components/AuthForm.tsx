"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { sanitizeNextPath } from "@/lib/auth";

interface AuthFormProps {
  mode: "sign-in" | "sign-up";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextPath = sanitizeNextPath(searchParams.get("next"));

  const isSignUp = mode === "sign-up";
  const title = isSignUp ? "Create your account" : "Welcome back";
  const subtitle = isSignUp
    ? "Start automating your work in minutes"
    : "Sign in to your willdo.work account";
  const buttonText = isSignUp ? "Create account" : "Sign in";
  const altText = isSignUp ? "Already have an account?" : "Don't have an account?";
  const altLink = isSignUp ? "/sign-in" : "/sign-up";
  const altLinkText = isSignUp ? "Sign in" : "Sign up";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/auth/credentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          mode,
        }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        setErrorMessage(result.error ?? "Unable to sign in. Please try again.");
        return;
      }
      router.push(nextPath);
      router.refresh();
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleGoogleContinue() {
    window.location.assign(`/api/auth/google?next=${encodeURIComponent(nextPath)}`);
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="text-center">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          willdo<span className="text-primary">.work</span>
        </Link>
        <h1 className="mt-6 text-2xl font-bold">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
      </div>

      <div className="mt-8 space-y-4">
        <button
          type="button"
          onClick={handleGoogleContinue}
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-background px-4 text-muted-foreground">or continue with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
          >
            {isSubmitting ? "Working..." : buttonText}
          </button>
          {errorMessage ? (
            <p role="alert" className="text-sm text-red-600" aria-live="polite">
              {errorMessage}
            </p>
          ) : null}
        </form>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {altText}{" "}
        <Link href={altLink} className="font-medium text-primary hover:underline">
          {altLinkText}
        </Link>
      </p>
    </div>
  );
}
