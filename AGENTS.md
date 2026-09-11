# BDNSI Cursor Agent Instructions

This is an existing mature BDNSI Laravel application, not a greenfield project.

## Canonical handoff
- Cursor working branch: `cursor-development` in `fastify11-svg/BDNSI`.
- Safety copy: `fastify11-svg/BDNSI-Cursor` (keep untouched unless explicitly needed).
- Stack: Laravel 8, PHP 8.2, MySQL 8.0, Inertia/React, Vite, Playwright.
- State source of truth: current code + tests + CI + `.ai/PROJECT_STATE.md`.
- Historical Antigravity plans/reports are evidence, not automatically current instructions.

## Operating mode
1. Audit first; do not rebuild completed modules.
2. Reconcile docs with implementation, tests, CI, and deployed evidence.
3. Fix only evidence-backed defects or missing acceptance coverage.
4. Prioritize auth/RBAC, tenant isolation, payment/ledger/credit, certificate/result access, registration/documents, CI/E2E, and deployment/live acceptance.
5. Keep changes small, reversible, and tested.
6. Never declare PASS/COMPLETE/PRODUCTION READY without evidence.
7. Do not ask the owner to choose routine technical details when a safe repository-determined answer exists.

## Safety boundary
Routine safe/reversible engineering is pre-authorized: inspect/edit code/tests/docs, run local/CI tests, create commits, push to `cursor-development`, and repair verified defects.

Owner approval is required only for destructive production-data operations, production `migrate:fresh`/`db:wipe`/DROP, exposing/rotating unavailable credentials, unresolved business-policy changes, destructive history rewrites, major framework migration, or irreversible infrastructure changes.

Never weaken authorization, tenant isolation, financial validation, or document access controls merely to make tests pass.

## Database / finance
- MySQL 8.0 is canonical; SQLite must not become authoritative.
- Never trust client-supplied money values or Center IDs.
- Financial writes must remain transactional, deterministic, and auditable.
- Preserve order/payment/ledger/due/credit invariants.
- Live mutations must use clearly labeled disposable DEMO/UAT records only when explicitly permitted.

## Test contract
Mirror `.github/workflows/autonomous.yml`: PHP 8.2, MySQL 8.0, Node 22, Composer install, disposable-db migrate/seed, `php artisan test`, `npm install --legacy-peer-deps`, `npm run build`, and Playwright Chromium critical suites.
Do not delete meaningful tests merely to obtain green CI.

## Deployment
Keep production deployment from the original `BDNSI` repository. Develop on `cursor-development`, then merge verified changes to `main` only after CI/release gates pass. Never commit `.env`, SSH keys, or secrets. Do not reintroduce GitHub Actions production SSH unless explicitly authorized.

Read first:
1. `CURSOR_START_HERE.md`
2. `.ai/PROJECT_STATE.md`
3. `CURSOR_BDNSI_48H_MASTER_PROMPT.md`
4. `.github/workflows/autonomous.yml`
5. `composer.json`, `package.json`, PHPUnit and Playwright config
6. relevant `.ai/` evidence only as needed

Maintain `CURSOR_HANDOFF_AUDIT.md` and `CURSOR_EXECUTION_STATUS.md`. Keep verified facts separate from assumptions.