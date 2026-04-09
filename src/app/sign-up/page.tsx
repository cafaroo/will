import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/AuthForm";
import { SESSION_COOKIE_NAME } from "@/lib/auth";
import { resolveAuthPageAccess } from "@/lib/auth-routing";

interface SignUpPageProps {
  searchParams?: Promise<{ next?: string }>;
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const access = resolveAuthPageAccess(token, resolvedSearchParams?.next);

  if (!access.allowed && access.redirectTo) {
    redirect(access.redirectTo);
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <AuthForm mode="sign-up" />
    </main>
  );
}
