# BDNSI — CURSOR 48H FINAL COMPLETION MASTER PROMPT

You are taking over an EXISTING mature BDNSI Laravel project from Google Antigravity. Finish it quickly and safely in Cursor. Do not treat it as a new project and do not restart completed roadmap phases without evidence.

## Repository / branch
- Repository: `fastify11-svg/BDNSI`
- Working branch: `cursor-development`
- Keep `main` unchanged until release gates pass.
- Safety copy: `fastify11-svg/BDNSI-Cursor` — leave untouched as a handoff backup.
- Live/test target recorded by the project: `https://nenobet.live`

## Standing owner authorization
Proceed autonomously on routine, safe, reversible engineering. Do not repeatedly ask for ordinary technical choices, file edits, tests, commits, or safe fixes.

You MAY autonomously:
- inspect all code/docs/history/config;
- edit code/tests/docs on `cursor-development`;
- run disposable-db migrations/seeds;
- run PHP tests, frontend builds, Playwright/E2E, lint/static/security checks;
- create focused commits and push to `cursor-development`;
- inspect CI and repair failures;
- update audit/status/evidence reports;
- continue with other safe work if one independent task is blocked.

STOP for owner approval only before:
- destructive/irreversible operations on real production/business data;
- production `migrate:fresh`, `db:wipe`, DROP or destructive reset/seed;
- exposing/rotating/replacing unavailable credentials or secrets;
- changing unresolved business policy (pricing/accounting/credit/result/certificate authority);
- destructive history rewriting;
- major framework/platform migration;
- irreversible infrastructure changes.

## Handoff baseline — VERIFY, DO NOT BLINDLY TRUST
At handoff, `.ai/PROJECT_STATE.md` reports:
- `ROADMAP_COMPLETE | CI_VERIFIED | DEPLOYED_BASELINE | FINAL_LIVE_ACCEPTANCE_PENDING`;
- canonical DB: MySQL 8.0;
- latest verified application/CI head: `1c4fd22547c5327236e8e4c2dbd4395fa2a8640e`;
- GitHub Actions Run #147 SUCCESS;
- PHP regression PASS;
- frontend build PASS;
- Playwright smoke/E2E PASS;
- phases A-U complete;
- recorded deployed baseline: `2e24c1ddbdaa0d23af9291b272a53539d2466d84`;
- newer hotfixes are CI-green but not recorded as deployed;
- final independent live browser re-acceptance remains pending.

The pre-Cursor handoff metadata head is `696ddab326ea7720f02a6dee88c81b309a99ac54`.
Historical files may contain older/conflicting snapshots. Resolve conflicts from real code, current CI, and current live evidence.

## Phase 0 — forensic handoff audit
Before broad feature development, inspect:
- git branch/status/log;
- `.ai/PROJECT_STATE.md` and current state/evidence files;
- `composer.json`, lockfile, `package.json`, lockfile;
- `.github/workflows/autonomous.yml`;
- PHPUnit/Playwright config and suites;
- routes, middleware, policies/guards;
- migrations/models/services/controllers;
- admin/staff/center/student flows;
- payment/order/ledger/credit modules;
- result/certificate/document authorization;
- CRM lead/center/sales/commission modules;
- `deploy_to_production.mjs`, backup and rollback mechanics;
- committed secrets or dangerous debug/destructive routes.

Update `CURSOR_HANDOFF_AUDIT.md` with:
1. Verified current facts
2. Documentation conflicts/stale claims
3. Current environment/toolchain
4. CI/test baseline
5. Security/RBAC/tenant findings
6. Finance/payment/credit findings
7. Business-flow findings
8. Deployment/rollback findings
9. Verified defects only
10. Unverified items
11. Prioritized queue P0/P1/P2/P3
12. Evidence/commands/SHAs

Do not redesign completed modules during audit.

## Phase 1 — reproduce CI environment
Target:
- PHP 8.2 with required Laravel extensions
- Composer from lockfile
- MySQL 8.0
- Node 22
- npm `--legacy-peer-deps`
- Playwright Chromium

For disposable test DB only, mirror `.github/workflows/autonomous.yml`. Never point destructive test commands at live DB.

Run gates:
1. Composer install/package discovery
2. MySQL driver assertion
3. disposable `php artisan migrate:fresh --seed --force`
4. full `php artisan test`
5. `npm install --legacy-peer-deps`
6. `npm run build`
7. Playwright Chromium release-critical suites
8. route/security sanity checks

Record exact outcomes in `CURSOR_EXECUTION_STATUS.md`.

## Phase 2 — release-critical functional audit
Verify code + tests for:

### Identity/RBAC/Tenant
- Admin login/logout/reset
- Staff login/reset/permissions
- Center login and center-scoped authorization
- Student access
- sub-admin restrictions
- IDOR resistance
- cross-center isolation for students/orders/financial records/leads/documents

### Center/student lifecycle
- Center provisioning
- student registration
- optional pay-during-registration behavior
- ID/Registration/Admit Card access
- approval/SMS dispatch
- download authorization

### Finance
- default + center pricing
- order/item totals
- SSLCommerz/IPN validation/idempotency
- payment confirmation
- ledger debit/credit
- current due
- credit limit
- partial/paid/pending states
- no client-supplied money/center trust

### Academic access
- result release
- certificate release
- payment/credit gating
- public verification privacy

### CRM/commission
- lead access
- lead -> Center conversion
- pricing linkage
- sale/order linkage
- commission calculation/authorization
- collection/commission semantics

## Phase 3 — fix verified gaps only
For each defect:
1. stable ID + P0/P1/P2/P3;
2. reproduction/evidence;
3. smallest safe fix;
4. focused test;
5. focused test run;
6. affected regression;
7. tenant/security/finance side-effect review;
8. atomic commit to `cursor-development`;
9. update status.

Never disable security or delete meaningful tests just to turn CI green.

## Phase 4 — release regression
After P0/P1 cleared, run:
- full PHP suite;
- production frontend build;
- relevant lint/static checks;
- release-critical Playwright suite;
- MySQL parity check;
- security/route/debug exposure review;
- financial invariant review;
- upload/private-document review;
- queue/scheduler health review;
- dependency advisory review focused on exploitable high/critical issues.

Target: zero known P0/P1 blockers.

## Phase 5 — merge/release preparation
Do NOT develop directly on main.
When `cursor-development` is green:
1. compare `cursor-development` with `main`;
2. make sure only intended changes exist;
3. ensure CI passes on the branch/PR;
4. merge only after all release gates pass;
5. record exact merged `main` SHA;
6. preserve rollback SHA and DB/upload backup readiness.

Historical deployment scripts already pull the original `BDNSI` repository. Keep that architecture unless audit proves a safer necessary change. Never commit `.env`, SSH keys, or secrets. Do not reintroduce GitHub Actions production SSH unless explicitly authorized.

## Phase 6 — controlled deployment
Only after merged `main` is verified:
- record current deployed SHA;
- verify rollback/backup readiness;
- review forward migrations;
- no live `migrate:fresh`/wipe/drop;
- deploy exact verified merged SHA;
- verify remote `git rev-parse HEAD` equals intended SHA.

If secure credentials are unavailable, mark `BLOCKED_CREDENTIAL` with exact required secret names and continue all other safe tasks. Ask the owner only at that genuine credential gate.

## Phase 7 — independent live acceptance
Against `https://nenobet.live`, use only clearly labeled disposable DEMO/UAT records for mutations; do not alter legitimate business records.

Verify at minimum:
- public/home routes
- Admin auth
- Center A and Center B independently
- center isolation
- Staff auth/permissions
- student registration
- registration/admit/ID docs
- paid center flow
- credit/due flow
- order/payment/ledger state
- result/certificate gating
- public result/certificate verification
- lead -> center -> sale -> commission
- logout/session boundaries
- responsive/basic browser sanity

Use final acceptance IDs `FA-01`, `FA-02`, ... Do not recycle unrelated historical defect IDs.
For each check record action, expected, actual, PASS/FAIL/BLOCKED, and evidence.

If a live defect appears: reproduce -> fix on `cursor-development` -> test -> CI -> merge -> deploy exact SHA -> retest -> regression smoke.

## Final completion gate
Do NOT declare PRODUCTION READY until all are true:
- audit reconciled;
- full PHP tests pass;
- frontend build passes;
- release-critical Playwright passes;
- MySQL 8 is canonical;
- no known P0/P1 security/tenant/finance/certificate/data-integrity blocker remains;
- exact verified `main` SHA is deployed;
- rollback state is documented;
- independent live acceptance passes.

Create `CURSOR_FINAL_ACCEPTANCE_REPORT.md` containing final repo/branch/SHA, deployed SHA, CI/test/build/E2E evidence, FA results, fixed defects, unresolved non-blockers, security/tenant/finance summary, deployment/rollback summary, and final verdict `PRODUCTION READY` or `NOT PRODUCTION READY` with exact blockers.

## Continuous execution behavior
Do not return only a plan. Execute.
Do not wait for repeated `continue` prompts.
Do not stop because one safe independent task is blocked.
Do not spend time polishing P3 while P0/P1 exists.
Do not recreate old phases unless evidence proves a regression/gap.
Do not claim success from historical reports.

Execution loop:
AUDIT -> ENVIRONMENT -> BASELINE TEST -> PRIORITIZE -> FIX -> TARGETED TEST -> REGRESSION -> SECURITY/TENANT/FINANCE REVIEW -> COMMIT -> CI -> MERGE GATE -> CONTROLLED DEPLOY -> LIVE ACCEPTANCE -> FINAL REPORT.

Start now with Phase 0, update `CURSOR_HANDOFF_AUDIT.md`, then continue automatically unless a genuine owner-only gate is reached.