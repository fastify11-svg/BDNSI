---
name: security-regression-review
description: Perform a focused security review of a BDNSI change without turning every task into a full security audit. Use for authentication, routes, file access, uploads, validation, external callbacks, secrets, admin actions, public endpoints, or other security-sensitive changes.
paths:
  - "app/**/*.php"
  - "routes/**/*.php"
  - "config/**/*.php"
  - "resources/js/**/*.js"
  - "resources/js/**/*.jsx"
  - "tests/**/*.php"
---

# Security Regression Review

Review the changed trust boundary, not the entire internet threat model on every edit.

## Focused checklist

1. **Authentication/authorization** — correct guard, middleware, policy/RBAC, tenant scope and object ownership.
2. **Input** — server-side validation, type/length constraints, safe identifiers and no mass-assignment surprise.
3. **Output** — no unintended PII, secrets, stack traces or private document paths.
4. **Files** — validate upload type/size/storage, prevent path traversal, authorize downloads.
5. **Database** — use query builder/Eloquent binding; avoid string-built SQL and unsafe dynamic identifiers.
6. **Web** — preserve CSRF/session protections; escape untrusted output; do not trust hidden fields.
7. **External callbacks** — authenticate/verify source where supported, validate payload, make processing idempotent.
8. **Secrets** — `.env`/secret stores only; never hardcode keys, passwords, SSH material or production tokens.
9. **Debug/admin surfaces** — no unauthenticated destructive/debug/deploy routes.

## Cost-aware method

Start with the diff and its direct callers/callees. Expand only when a trust boundary crosses into another subsystem. Prefer a few targeted negative tests over a repository-wide scanner for routine changes. Use broader dependency/security scanning at release gates or when dependencies changed.

## Severity rule

A verified auth bypass, tenant leak, arbitrary file exposure, financial-validation bypass, secret exposure or unauthenticated destructive endpoint is a stop-ship issue. Do not weaken a control to preserve legacy behavior; repair the control and add regression evidence.