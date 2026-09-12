# BDNSI Cursor Agent Instructions

BDNSI is an existing mature institute/certificate platform. The default behavior is **verify, preserve, and surgically finish** — never redevelop a completed system from scratch.

## Canonical working context

- Repository: `fastify11-svg/BDNSI`
- Cursor working branch: `cursor-development`; do not develop directly on `main`.
- Safety copy: `fastify11-svg/BDNSI-Cursor` should remain untouched unless explicitly needed for recovery.
- Backend: PHP 8.2 + Laravel 8 (verify `composer.json` before using framework APIs).
- Frontend: React/Inertia/Vite/Tailwind; exact installed versions and lockfiles are authoritative.
- Database: **MySQL 8.0 is canonical**. Do not replace authoritative verification with SQLite.
- Business roadmap: `MASTER_IMPLEMENTATION_ROADMAP.md`.
- Historical handoff snapshot: `.ai/PROJECT_STATE.md`; verify stale branch/deployment/tooling statements before repeating them.
- `.agents/` is legacy Antigravity history, not active Cursor operating instructions.

## Truth hierarchy

When documents disagree, prefer:

1. current source/schema + reproducible behavior;
2. current targeted tests;
3. CI evidence tied to the exact commit;
4. current Cursor audit/status files;
5. `.ai/PROJECT_STATE.md` historical handoff;
6. master roadmap for scope/business intent;
7. older reports/plans only as historical evidence.

Never mark `PASS`, `COMPLETE`, `DEPLOYED`, or `PRODUCTION READY` without evidence for the exact relevant state.

## Default task loop

1. **Classify first** with `roadmap-gatekeeper`: complete, regression, verified gap, unverified, or new requirement.
2. **Search before reading**. Find the route/symbol/test/error first, then open only the dependency slice needed.
3. **Name the root cause/gap** before editing.
4. **Make the smallest correct patch** using existing architecture/services/policies.
5. **Verify cheaply first** with `test-budget-optimizer`; escalate only as change risk grows.
6. **Update documentation only if verified state changed**.
7. **Stop when the requested outcome is proven**. Do not continue speculative refactors or audits.

## Credit / context / time budget

Treat owner usage limits as a constrained engineering resource.

- Do not scan the whole repository for a narrow task.
- Do not repeatedly read unchanged files or successful logs.
- Search errors/symbols and read only relevant ranges of large files.
- Prefer Cursor Explore subagent for broad unfamiliar discovery when available; ask it for a concise file/symbol map, not file dumps.
- Do not launch parallel agents unless investigations are independent and parallelism reduces total work.
- Do not run full PHPUnit + build + Playwright after every edit. Use targeted tests first; reserve broad gates for cross-cutting changes, milestones, CI parity and release.
- Never rerun an expensive unchanged gate without a material code/config/environment change.
- Do not create duplicate implementation plans, phase reports, roadmaps, screenshots or audit artifacts when an existing canonical file can be updated.
- Do not upgrade dependencies or refactor adjacent code without evidence that doing so is necessary for the current task.
- If current implementation already satisfies the request, prove it and stop rather than rewriting it.

## Active Cursor skills

Use `.cursor/skills/` progressively. Important workflows include:

- `roadmap-gatekeeper`
- `cost-aware-codebase-navigation`
- `laravel-surgical-fix`
- `mysql-migration-safety`
- `financial-integrity`
- `rbac-tenant-security`
- `academic-document-flow`
- `inertia-react-frontend`
- `test-budget-optimizer`
- `ci-root-cause-triage`
- `dependency-change-control`
- `security-regression-review`
- `release-readiness`
- `documentation-drift-control`
- `legacy-artifact-cleanup`

Do not preload all skill bodies. Let Cursor select by description/path or invoke the relevant skill explicitly.

## Architecture and safety invariants

- Reuse valid service/policy boundaries; do not create duplicate business engines.
- Server-side authorization is mandatory; frontend filtering is never authorization.
- Never trust client-supplied money, payment status, discount, Center ID, role, certificate/result eligibility, or document ownership.
- Preserve Center tenant isolation (`CenterScope`/policies/RBAC) on reads, writes, downloads, exports, jobs and bulk actions.
- Financial writes must remain deterministic, transactional, idempotent where retryable, and auditable.
- Preserve historical order pricing and financial history.
- AI may assist analysis but must not autonomously approve/issue academic credentials or silently change financial/business policy.
- Never commit `.env`, secrets, private keys, database dumps or production backups.

## Standing authorization

Routine safe/reversible engineering is pre-authorized: inspect/search, edit application/tests/docs, run local tests/builds, repair verified defects, create commits and push to `cursor-development`, and inspect CI.

Owner approval is required before:

- destructive/irreversible production-data actions;
- production `migrate:fresh`, `db:wipe`, DROP or destructive backfills;
- exposing/rotating unavailable credentials or secrets;
- changing unresolved financial, certificate/result, or other business policy;
- destructive Git history rewriting;
- major framework/platform migration;
- production deployment or irreversible infrastructure change.

Never weaken authorization, tenant isolation, financial validation, or document access controls merely to make tests pass.

## Test contract

Mirror the repository's current CI rather than old assumptions. Typical release/parity gates are PHP 8.2 + MySQL 8, Composer install, disposable-db migration/seed, PHP regression, npm install using the repository's compatible mode, frontend build, and required Playwright Chromium journeys. Check `.github/workflows/autonomous.yml` for the exact current contract.

Use the test ladder from `test-budget-optimizer`: targeted test -> affected module -> build/E2E if relevant -> full regression at the proper gate. Never delete meaningful tests merely to get green output.

## Deployment

Development stays on `cursor-development`. Merge to `main` only after the reviewed release candidate passes required gates. Production deployment requires explicit owner approval and must deploy one exact approved SHA. Use clearly labeled disposable `DEMO-UAT` records for permitted live acceptance; never mutate legitimate production records or perform real-money transactions for testing.

## Read order for a new Cursor session

1. `CURSOR_START_HERE.md`
2. this `AGENTS.md`
3. `.cursor/rules/bdnsi-core.mdc`
4. relevant `.cursor/skills/*/SKILL.md` only as needed
5. `MASTER_IMPLEMENTATION_ROADMAP.md` for business scope
6. `.ai/PROJECT_STATE.md` only for historical handoff facts that still need verification
7. relevant source/tests/workflow for the actual task

Maintain `CURSOR_HANDOFF_AUDIT.md` and `CURSOR_EXECUTION_STATUS.md` only when meaningful verified state changes. Keep evidence concise and separate verified facts from assumptions.