# TypeScript strict

## Rule
- `tsconfig.json` MUST keep `strict: true`.
- New code MUST pass type checking with zero TypeScript errors.
- Avoid `any` unless a short inline justification is present.

## How to verify
- Run `npm run lint` and confirm there are no TypeScript-related errors.
- If a separate typecheck script exists, run it and confirm zero errors.

## Why
Strict typing catches auth and state bugs earlier and reduces regressions in App Router flows.
