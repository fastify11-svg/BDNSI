# BDNSI — Cursor Start Here

## Use this repository/branch
- Repository: `https://github.com/fastify11-svg/BDNSI.git`
- Working branch: `cursor-development`
- Do not develop directly on `main`.
- Safety copy: `https://github.com/fastify11-svg/BDNSI-Cursor` (leave untouched as handoff backup).

## Known handoff baseline — verify it, do not blindly trust it
`.ai/PROJECT_STATE.md` records:
- `ROADMAP_COMPLETE | CI_VERIFIED | DEPLOYED_BASELINE | FINAL_LIVE_ACCEPTANCE_PENDING`
- MySQL 8.0 canonical CI
- verified application/CI head `1c4fd22547c5327236e8e4c2dbd4395fa2a8640e`
- GitHub Actions Run #147 SUCCESS
- PHP regression, frontend build and Playwright smoke/E2E PASS
- recorded deployed baseline `2e24c1ddbdaa0d23af9291b272a53539d2466d84`
- newer CI-green hotfixes not recorded as deployed
- final independent live browser acceptance pending

The handoff metadata head before Cursor control files was `696ddab326ea7720f02a6dee88c81b309a99ac54`.

## Fastest Cursor flow
1. Clone/open this repo in Cursor.
2. Checkout `cursor-development`.
3. Let Cursor read `AGENTS.md` and `.cursor/rules/bdnsi-core.mdc`.
4. Configure PHP 8.2 + Node 22 + MySQL 8.0 + Playwright Chromium.
5. Add secrets only through Cursor/environment secrets, never Git.
6. Paste `CURSOR_BDNSI_48H_MASTER_PROMPT.md` once into Cursor Agent.
7. Let it audit first, then fix only verified gaps.
8. Keep all development commits on `cursor-development`.
9. Merge to `main` only when CI/release gates pass; then deploy the exact merged SHA and perform independent live acceptance.

## Final completion gate
Do not call the project finished until current tests/build/E2E are green, verified P0/P1 gaps are fixed, the exact release SHA is deployed, final live acceptance passes, and the final report records evidence + rollback state.