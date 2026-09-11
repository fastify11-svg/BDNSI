# BDNSI — Cursor Start Here

## Repository / branch

- Repository: `https://github.com/fastify11-svg/BDNSI.git`
- Working branch: `cursor-development`
- Do not develop directly on `main`.
- Safety copy: `https://github.com/fastify11-svg/BDNSI-Cursor` — leave untouched as a recovery/handoff copy unless explicitly needed.

## Important handoff fact

This is a mature existing system, not a new build. Historical `.ai/PROJECT_STATE.md` records a previously CI-green/deployed baseline and final-live-acceptance work, but it also contains Antigravity-era branch/deployment wording. Treat it as **historical evidence**, not an instruction to restore Antigravity. Current source, tests, CI and this Cursor control layer determine present execution.

`MASTER_IMPLEMENTATION_ROADMAP.md` remains the single business/implementation roadmap. Do not create a competing roadmap.

## Fastest low-credit Cursor workflow

1. Checkout `cursor-development` and let Cursor read root `AGENTS.md` + `.cursor/rules/bdnsi-core.mdc`.
2. For every task, first determine whether it is actually incomplete. Cursor should use `roadmap-gatekeeper` rather than reopening old phases.
3. For broad/unfamiliar work, use `cost-aware-codebase-navigation`: search first, open only relevant files, and use Explore subagent when it reduces main-context load.
4. Let Cursor auto-select the relevant domain skill from `.cursor/skills/` (Laravel, MySQL, finance, RBAC, academic documents, frontend, security, CI, dependencies, etc.). Do **not** load all skill bodies into the prompt.
5. Make the smallest evidence-backed patch.
6. Use `test-budget-optimizer`: targeted test first, then affected module/build/E2E, and full regression only at cross-cutting/milestone/release gates.
7. Update status/docs only when verified state changed. Never generate duplicate phase reports after routine edits.
8. Use `release-readiness` only when preparing merge/deploy/live acceptance.

## Environment contract

Verify current manifests/workflow before assuming versions. Current project baseline is PHP 8.2 + Laravel 8, React/Inertia/Vite/Tailwind, MySQL 8, PHPUnit and Playwright. MySQL 8 is canonical; do not substitute SQLite as authoritative verification.

Secrets belong in local/Cursor/environment secret storage, never Git. Do not spend development time normalizing the entire local toolchain if the task's required commands already work.

## Resource protection rules

- No full repository scan for a narrow defect.
- No rereading unchanged large files/logs without a concrete question.
- No full PHPUnit + build + Playwright loop after every edit.
- No repeated CI rerun before a material fix.
- No broad refactor/dependency upgrade during a targeted bug fix.
- No speculative feature work just because an old roadmap mentions it.
- No duplicate agent systems: active workflows live under `.cursor/`; `.agents/` is legacy history.

## Active skill system

See `.cursor/skills/README.md`. The normal chain is:

`roadmap-gatekeeper -> relevant domain skill -> test-budget-optimizer -> docs only if state changed`

This structure is intentionally progressive so detailed instructions load only when relevant, reducing context/usage overhead.

## Release boundary

Routine safe development and branch commits may proceed without repeated approval. Explicit owner approval is required before production deployment, destructive production-data/schema actions, unavailable credential changes, unresolved business-policy changes, destructive history rewrite, major platform migration, or irreversible infrastructure changes.

Do not call the project finished until the exact release candidate has passed required tests/CI, the exact approved SHA is deployed, and independent live acceptance passes with safe `DEMO-UAT` data.