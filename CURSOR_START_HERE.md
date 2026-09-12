# BDNSI — Cursor Start Here

## Repository / branch

- Repository: `https://github.com/fastify11-svg/BDNSI.git`
- Working branch: `cursor-development`
- Do not develop directly on `main`.
- Safety copy: `https://github.com/fastify11-svg/BDNSI-Cursor` — leave untouched as a recovery/handoff copy unless explicitly needed.

## Important handoff fact

This is a mature existing system, not a new build. Historical `.ai/PROJECT_STATE.md` records a previously CI-green/deployed baseline and final-live-acceptance work. Treat old implementation/runtime reports as historical evidence, while preserving the owner's current deployment contract: GitHub Actions is CI-only and deployment remains `ANTIGRAVITY_DIRECT_SSH -> nenobet.live`. Current source, tests, CI and this Cursor control layer determine development execution; Cursor must not replace the approved deployment path with GitHub-based SSH or another deployment mechanism.

`MASTER_IMPLEMENTATION_ROADMAP.md` remains the single business/implementation roadmap. Do not create a competing roadmap.

## Fastest low-credit Cursor workflow

1. Checkout `cursor-development` and let Cursor read root `AGENTS.md` + `.cursor/rules/bdnsi-core.mdc`.
2. Paste/use `CURSOR_BDNSI_48H_MASTER_PROMPT.md` once; do not repeat it on every task.
3. For every task, first determine whether it is actually incomplete. Use `roadmap-gatekeeper` rather than reopening old phases.
4. For broad/unfamiliar work, use `cost-aware-codebase-navigation`: search first, open only relevant files, and use Cursor's built-in Explore subagent only when it meaningfully isolates context.
5. Let Cursor auto-select the relevant domain skill from `.cursor/skills/`; do not load every skill body into every prompt.
6. Make the smallest evidence-backed patch.
7. Use `test-budget-optimizer`: targeted test first, then affected module/build/E2E, and full regression only at cross-cutting/milestone/release gates.
8. Use the custom `debugger` subagent only for a concrete failure and `verifier` only when independent completion evidence is worth the extra context cost.
9. Update canonical status/docs only when verified state changed. Never generate duplicate phase reports after routine edits.
10. Use `release-readiness` only when preparing merge/deploy/live acceptance.

## Environment contract

Verify current manifests/workflow before assuming versions. Current full-parity baseline is PHP 8.2 + Laravel 8, React/Inertia/Vite/Tailwind, MySQL 8, **Node 24 from `.nvmrc`**, PHPUnit and Playwright. MySQL 8 is canonical; do not substitute SQLite as authoritative verification. Use `npm ci --legacy-peer-deps` for deterministic lockfile installs at CI/release gates.

For release-level local verification on the Windows/XAMPP workspace, `scripts/cursor_verify_windows.ps1` provides a guarded path. It refuses destructive `migrate:fresh` unless `APP_ENV=testing`, `DB_CONNECTION=mysql`, and the database name looks disposable/test-only. For Cursor Cloud/Linux, use `scripts/cursor_verify.sh`. Do not run either full baseline verifier after every small edit.

Secrets belong in local/Cursor/environment secret storage, never Git. Do not spend development time normalizing the entire local toolchain if the task's required commands already work.

## Resource protection rules

- No full repository scan for a narrow defect.
- No rereading unchanged large files/logs without a concrete question.
- No full PHPUnit + build + Playwright loop after every edit.
- No repeated CI rerun before a material fix.
- No broad refactor/dependency upgrade during a targeted bug fix.
- No speculative feature work just because an old roadmap mentions it.
- No duplicate agent systems: active workflows live under `.cursor/`; legacy Antigravity skills are retired.
- `.cursorignore` excludes dependencies, compiled assets, runtime noise and stale `.ai` history from normal indexing while keeping `.ai/PROJECT_STATE.md` available.

## Active skill system

See `.cursor/skills/README.md`. The normal chain is:

`roadmap-gatekeeper -> relevant domain skill -> test-budget-optimizer -> verifier only when justified -> docs only if state changed`

For a concrete failure:

`debugger -> targeted failing check -> minimal fix -> targeted rerun`

This structure is intentionally progressive so detailed instructions load only when relevant, reducing context/usage overhead.

## Release boundary

Routine safe development and branch commits may proceed without repeated approval. Explicit owner approval is required before production deployment, destructive production-data/schema actions, unavailable credential changes, unresolved business-policy changes, destructive history rewrite, major platform migration, or irreversible infrastructure changes.

Deployment contract: GitHub Actions remains CI-only. Never add or restore GitHub-based SSH deployment. Release deployment must be handed off to Antigravity and performed only as `ANTIGRAVITY_DIRECT_SSH -> nenobet.live` unless the owner explicitly changes this policy. The deployment script itself enforces explicit approval, backup-readiness, strict SSH host verification, exact-SHA deployment and post-deploy health verification.

Keep the existing Cursor PR as draft until release gates pass. Do not call the project finished until the exact release candidate has passed required tests/CI, the exact approved SHA is deployed, and independent live acceptance passes with safe `DEMO-UAT` data.
