---
name: release-readiness
description: Prepare and verify a BDNSI release candidate, merge, deployment, rollback, or live acceptance without deploying unverified code. Use when the user mentions release, production, deploy, go live, merge to main, staging, or final acceptance.
---

# Release Readiness

A release is an evidence chain tied to one exact commit SHA.

## Candidate gate

1. Identify the exact candidate SHA and deployment delta from the currently deployed baseline.
2. Confirm no unreviewed secrets, backups, generated logs or environment files are included.
3. Review migrations for production safety and rollback implications.
4. Run the CI-equivalent gates required by the current workflow: relevant PHP regression, MySQL migration/seed verification in a disposable test DB, frontend build, and required Playwright critical journeys.
5. Confirm security/RBAC/tenant and financial tests relevant to the delta.
6. Record known residual risk; do not convert `UNVERIFIED` into `PASS` by wording.

## Production boundary

Production deployment, production data mutation, destructive schema operations, credential changes and irreversible infrastructure changes require explicit owner approval for the reviewed candidate. Routine branch development and CI do not.

Deploy the exact approved SHA only. Do not develop directly on the server or mix uncommitted local changes into a release.

## Post-deploy acceptance

- Verify health/auth first.
- Use clearly labeled disposable `DEMO-UAT` records for any live mutation.
- Test only the journeys affected plus the agreed critical acceptance matrix.
- Never perform real-money transactions merely for acceptance.
- Capture concise evidence: deployed SHA, checks performed, results, defect IDs if any.

## Rollback

Before production deployment, know the previous deployable SHA and whether migrations are backward-compatible. If acceptance finds a stop-ship regression, stop new changes on production and choose a tested rollback/forward-fix based on data safety.

Never declare `PRODUCTION READY` until the exact deployed candidate passes the required live acceptance.