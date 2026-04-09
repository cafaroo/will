# Next.js auth routing

## Rule

- Protected App Router pages MUST validate auth server-side before rendering private content.
- Unauthenticated access to protected routes MUST redirect to login with a safe `next` target.
- Auth pages (login/signup) SHOULD redirect authenticated users away from auth forms.

## How to verify

- Test unauthenticated request to one protected route and confirm redirect to login.
- Test authenticated request to the same route and confirm successful render.
- Test authenticated request to login/signup and confirm redirect to app home (or configured default).

## Why

Server-first route protection prevents content leaks and keeps auth behavior consistent across SSR and client navigation.
