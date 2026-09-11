# BDNSI — CURSOR 48H FINAL COMPLETION MASTER PROMPT

Take over the EXISTING mature BDNSI Laravel project and finish only what is genuinely remaining. Do not rebuild completed phases, redesign working modules, or spend usage on speculative modernization.

## Repository / branch
- Repository: `fastify11-svg/BDNSI`
- Work only on: `cursor-development`
- Keep `main` unchanged until release gates pass.
- Safety copy: `fastify11-svg/BDNSI-Cursor` — leave untouched.
- Recorded live/test target: `https://nenobet.live`

## Read first
1. `AGENTS.md`
2. `.cursor/rules/bdnsi-core.mdc`
3. `.cursor/skills/README.md`
4. `.ai/PROJECT_STATE.md`
5. `CURSOR_HANDOFF_AUDIT.md`
6. `CURSOR_EXECUTION_STATUS.md`
7. `.github/workflows/autonomous.yml`
8. `composer.json`, `package.json`, PHPUnit/Playwright config

Historical Antigravity reports are evidence only. Current source + current tests + current CI + current live evidence outrank old reports.

## Standing owner authorization
Proceed autonomously with safe, reversible engineering: inspect/edit code and tests, run targeted/full tests when justified, commit/push to `cursor-development`, inspect/repair CI, and update canonical status evidence.

Ask the owner only before:
- destructive/irreversible production-data operations;
- production `migrate:fresh`, `db:wipe`, DROP or destructive reset/seed;
- exposing/rotating/replacing unavailable credentials/secrets;
- changing unresolved pricing/accounting/credit/result/certificate policy;
- destructive Git history rewriting;
- major framework/platform migration;
- irreversible infrastructure change.

Do not ask for routine technical choices when the repository provides a safe answer.

## Usage / credit budget — mandatory
Optimize for the fewest useful model calls, file reads, test runs and CI reruns while preserving correctness.

1. Run `roadmap-gatekeeper` before broad implementation. Classify work as `VERIFIED_COMPLETE`, `REGRESSION`, `VERIFIED_GAP`, `UNVERIFIED`, or `NEW_REQUIREMENT`.
2. Search exact routes/classes/methods/tests/error text before browsing folders.
3. Use `cost-aware-codebase-navigation` for unfamiliar cross-cutting work; use Cursor's built-in Explore subagent only when context isolation is genuinely useful.
4. Load only the domain skill needed for the current task.
5. Use the main agent for simple work. Custom `debugger` and `verifier` subagents are for concrete failures or independent completion verification; do not spawn parallel agents casually because each has separate usage cost.
6. Run the smallest relevant test first. Full PHP + frontend build + Playwright belongs at high-risk/release gates, not after every edit.
7. Reuse valid CI evidence for the exact unchanged commit. Never rerun an identical expensive pipeline just to reconfirm it.
8. If CI fails, inspect the first root failure; make a material fix before rerunning.
9. Do not repeatedly reread unchanged files/logs. Keep a compact working set.
10. Update existing canonical audit/status files instead of creating duplicate reports.
11. Avoid dependency/framework upgrade churn unless a verified blocker/security issue requires it.
12. Stop when the requested behavior is proven and the next remaining action is clear. Do not hunt hypothetical P3 work while release blockers exist.

## Handoff baseline — verify, do not blindly trust
`.ai/PROJECT_STATE.md` records:
- phases A-U complete;
- MySQL 8.0 canonical;
- historical CI-green application head `1c4fd22547c5327236e8e4c2dbd4395fa2a8640e` / Run #147;
- recorded deployed baseline `2e24c1ddbdaa0d23af9291b272a53539d2466d84`;
- final independent live acceptance pending.

The Cursor control layer and skills have since advanced on `cursor-development`. Use current branch/CI evidence, not the historical SHA, for new conclusions.

## Execution loop

### 0. Delta-first audit
Do not rescan the whole repository by default.

First determine:
- current branch/head and diff vs `main`;
- current CI status for the exact head;
- what `CURSOR_HANDOFF_AUDIT.md` already proves;
- what `CURSOR_EXECUTION_STATUS.md` still marks unverified;
- whether the requested/remaining item already exists in source/tests.

Only inspect the domain slices necessary to resolve uncertainty. Update `CURSOR_HANDOFF_AUDIT.md` with verified facts, stale/conflicting claims, verified gaps and evidence. Keep assumptions separate.

### 1. Verification ladder
Use this ladder; stop at the lowest level that gives sufficient evidence for ordinary work:

1. syntax/static/local focused check;
2. targeted PHPUnit test(s) or Playwright spec(s);
3. affected-domain regression;
4. full `php artisan test`;
5. `npm run build`;
6. release-critical Playwright Chromium suite;
7. CI for the exact commit;
8. live acceptance only after deployment.

Escalate faster for schema, finance, auth/RBAC, tenant isolation, document access, result/certificate policy or release changes.

Canonical environment when full parity is required:
- PHP 8.2
- MySQL 8.0 disposable test DB
- Node 22
- npm `--legacy-peer-deps`
- Playwright Chromium

Never make SQLite authoritative and never point destructive test commands at production/shared valuable data.

### 2. Release-critical domains
Verify/fix only evidence-backed gaps in these priority areas:

**Identity / RBAC / tenant** — admin/staff/center/student auth, sub-admin permissions, CenterScope, IDOR and cross-center isolation.

**Registration / documents** — center-driven student registration, optional payment behavior, ID/Registration/Admit Card access, approval/SMS, protected downloads.

**Finance** — default/center pricing, orders/items, SSLCommerz/IPN verification + idempotency, transactions, ledger, due, credit, partial payment, no client-trusted money/Center IDs.

**Academic** — result lifecycle, certificate gating, payment/credit access rules, secure certificate/document access, public verification privacy.

**CRM / commission** — leads, lead→Center conversion, pricing linkage, sale/order linkage, commissions, authorization and collection semantics.

Use the relevant `.cursor/skills/*/SKILL.md`; do not reopen an entire phase when one slice is enough.

### 3. Fix verified gaps only
For each real defect:
1. identify severity P0/P1/P2/P3;
2. capture minimal reproduction/evidence;
3. make the smallest safe change;
4. add/retain a meaningful focused test;
5. run the targeted test first;
6. expand regression only according to risk;
7. review tenant/security/finance side effects where applicable;
8. commit atomically to `cursor-development`;
9. update `CURSOR_EXECUTION_STATUS.md` only with evidence-backed status.

Never delete meaningful tests, bypass authorization, weaken financial validation, or change business policy merely to obtain green tests.

### 4. Release gate
When no known P0/P1 blocker remains, run the release-level gates once for the candidate SHA:
- full PHP suite;
- production frontend build;
- release-critical Playwright;
- MySQL parity/migration safety;
- route/debug/security exposure review;
- tenant/RBAC review;
- financial invariant review;
- private document/upload access review;
- relevant dependency advisory review.

Use the independent `verifier` subagent at this gate to challenge the evidence without rewriting working code.

### 5. Merge / deploy gate
Do not develop on `main`.

Before merge:
- compare `cursor-development` vs `main`;
- verify only intended changes;
- require green CI for the exact candidate head;
- keep the existing PR draft until release evidence is sufficient.

Do not merge or deploy merely because old reports said the roadmap was complete.

Before production deployment, owner approval is required at the genuine release gate. Preserve rollback SHA and database/upload backup readiness. Deploy the exact verified merged SHA; never use live `migrate:fresh`/wipe/drop. If required credentials are unavailable, record `BLOCKED_CREDENTIAL` with only the required secret names and continue other safe work.

### 6. Independent live acceptance
After exact-SHA deployment to `https://nenobet.live`, use only clearly labeled disposable DEMO/UAT records for mutations. Do not alter legitimate business records.

Record `FA-01`, `FA-02`, ... for the minimum critical journeys:
- public routes;
- Admin auth;
- two independent Centers + isolation;
- Staff auth/permissions;
- student registration + registration/admit/ID documents;
- paid flow;
- credit/due flow;
- order/payment/ledger;
- result/certificate gating;
- public verification;
- lead→Center→sale→commission;
- logout/session boundaries;
- basic responsive/browser sanity.

For a live defect: reproduce → minimal fix on `cursor-development` → targeted test → required regression/CI → merge gate → deploy exact SHA → retest.

## Final completion gate
Do not declare `PRODUCTION READY` until all are proven for the final exact SHA:
- no known P0/P1 blocker;
- full PHP suite PASS;
- frontend build PASS;
- release-critical Playwright PASS;
- MySQL 8 canonical/parity PASS;
- tenant/RBAC/finance/document/certificate critical controls PASS;
- exact verified `main` SHA deployed;
- rollback state recorded;
- independent live acceptance PASS.

Update/create only the canonical final report `CURSOR_FINAL_ACCEPTANCE_REPORT.md` with exact repo/branch/SHA, CI/test/build/E2E evidence, FA results, fixed defects, unresolved non-blockers, security/tenant/finance summary, deployment/rollback evidence, and final verdict.

## Continuous behavior
Do not return only a plan. Execute safe work continuously until a genuine owner-only gate is reached.

Default path:
`CLASSIFY -> NARROW SEARCH -> VERIFY GAP -> MINIMAL FIX -> TARGETED TEST -> RISK-BASED REGRESSION -> COMMIT -> CI WHEN JUSTIFIED -> RELEASE GATE -> OWNER DEPLOY APPROVAL -> LIVE ACCEPTANCE -> FINAL REPORT`

Start from current `cursor-development` state, not from old phase documents.