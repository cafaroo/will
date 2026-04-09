# Auth minimum coverage

## Rule

- Every auth-related change MUST include automated tests in the same PR.
- Minimum auth coverage MUST include:
  - one successful login path,
  - one failed login path,
  - one guarded-route access check.
- Bug fixes in auth MUST include a regression test for the fixed case.

## How to verify

- Run auth-related tests and confirm all pass.
- In PR description, list which test files cover success, failure, and guarded-route behavior.

## Why

Auth failures are high impact; these minimum tests reduce breakage during rapid iteration.
