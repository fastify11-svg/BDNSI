# BDNSI — 48-Hour Autonomous Completion & Continuous Execution Master Plan

**Purpose:** One-file source of truth for Google Antigravity IDE to finish the remaining BDNSI engineering work with minimal owner interaction, while continuously auditing, developing, testing, fixing, reviewing, integrating, and validating the system.

**Repository:** `fastify11-svg/BDNSI`  
**Canonical live/test domain:** `nenobet.live`  
**Deployment method:** `ANTIGRAVITY_DIRECT_SSH`  
**GitHub role:** source control + CI only  
**Target execution window:** 48 hours from the moment this file is accepted by the Antigravity Orchestrator.

---

# 0. EXECUTION COMMAND — READ THIS FIRST

This file is the owner's current master execution instruction for the remaining BDNSI work.

Do not return only a plan. Do not wait for repeated `continue` prompts. Do not stop because a single task is blocked. Do not declare completion because a previous roadmap was closed.

Start from the **real current repository/workspace state**, reconcile all stale state, then execute the work in this file continuously until the Final Completion Gate is satisfied or a genuine owner-only blocker is reached.

The execution loop is:

**RECOVER → AUDIT → PRIORITIZE → PLAN → IMPLEMENT → TARGETED TEST → REGRESSION → INDEPENDENT REVIEW → SECURITY/TENANT/FINANCE REVIEW → E2E → GATEKEEPER → COMMIT → PUSH → CI VERIFY → SAFE DEPLOY WHEN APPROPRIATE → LIVE SMOKE → UPDATE EVIDENCE → NEXT TASK**

When one task cannot continue safely, mark it `BLOCKED`, record the exact reason, and immediately continue the next independent safe task.

Never create busywork merely to look active.

---

# 1. OWNER AUTHORIZATION BOUNDARY

This file and the owner's instruction to execute it constitute **standing authorization** for routine, safe, reversible engineering work required by this plan.

The Antigravity system may perform without asking the owner again:

- inspect source code, routes, models, migrations, tests, frontend components and configuration;
- modify code and tests;
- add/refine test fixtures, factories and deterministic seed data for disposable test environments;
- update `.ai/*` state, backlog, evidence and reports;
- run safe local commands;
- run targeted and full automated tests;
- run frontend builds;
- run static/security/dependency checks;
- create atomic git commits;
- push verified commits to the normal project branch;
- inspect GitHub CI and automatically rework failures;
- deploy **verified code** to the designated `nenobet.live` live/test target through the already-established Antigravity direct SSH path when deployment is appropriate and non-destructive;
- perform read-only/non-destructive smoke checks on the live/test server;
- recover stale runner locks, heartbeats and state files when evidence proves no active task is running.

Separate owner approval is still required for:

1. deleting, overwriting or materially changing real production/business data;
2. production `migrate:fresh`, `db:wipe`, `DROP`, destructive seed/reset, destructive schema rewrite or unrecoverable migration;
3. using, revealing, rotating or changing unavailable credentials/secrets;
4. changing core business policy, pricing authority, financial accounting rules, result/certificate approval rules, or credit policy when the correct behavior is not already defined;
5. destructive git history rewriting or deleting valuable work;
6. major framework/platform migration with material compatibility risk;
7. infrastructure changes that materially increase production risk;
8. any irreversible action whose impact cannot be confidently recovered.

If existing `PROJECT_MEMORY.md`, `AGENT_OPERATING_SYSTEM.md`, or another internal instruction requires approval before every routine commit/push/deploy, reconcile it with this **newer explicit owner instruction**: routine safe/reversible actions above are pre-authorized; destructive/credential/policy/data-impacting actions remain gated.

Do not weaken safety controls beyond this boundary.

---

# 2. NON-NEGOTIABLE PROJECT RULES

1. Do not rebuild BDNSI from scratch.
2. Preserve valid existing architecture and data.
3. Never trust frontend-supplied payment/financial values.
4. Never trust client-supplied Center IDs.
5. Never permit Center-to-Center data leakage.
6. Financial state transitions must be deterministic, transactional and auditable.
7. AI may recommend/detect/assist; AI must not autonomously approve academic credentials or silently alter financial truth.
8. Never weaken a valid security control to satisfy a test.
9. Never remove/skip meaningful tests simply to make CI green.
10. Never modify real live business data merely to test a feature.
11. Use disposable/local/CI test data for mutating tests.
12. GitHub Actions remains **CI-only**; never reintroduce GitHub SSH deployment.
13. Deployment remains **Antigravity direct SSH** to `nenobet.live`.
14. Preserve live `.env`, `APP_KEY`, secrets, database, storage/uploads and user-generated files.
15. Do not claim PASS without evidence.
16. Do not claim “zero bugs”; instead prove all defined acceptance gates and no known P0/P1 release blocker.
17. The 48-hour deadline must not be used to bypass security, tests or data safety.

---

# 3. CURRENT BASELINE SNAPSHOT — VERIFY, DO NOT BLINDLY TRUST

At creation time of this master file, repository evidence indicated:

- original roadmap A–U and post-roadmap closure work had previously been marked complete;
- continuous autonomous development is active;
- `.ai/CONTINUOUS_STATE.json` reported approximately:
  - mode: `CONTINUOUS_AUTONOMOUS_DEVELOPMENT`
  - cycle: `5`
  - current lane: testing
  - current task: `REFACTOR_LEGACY_TESTS`
  - status: `RUNNING`;
- the current backlog reported a **P1 testing stabilization task**: a large number of feature tests (reported as 118) need isolation/state refactoring after an SQLite in-memory test-environment change;
- recent continuous work included password-reset abuse protection, analytics query optimization, strict file-upload validation, Staff/Center Playwright coverage, payment integrity, health checks and other hardening;
- latest GitHub CI evidence at file creation showed the newest run failing early in **Composer install / Laravel package discovery** (`php artisan package:discover` returning exit code 255), which prevents the rest of CI from executing.

**Important:** this snapshot is not authoritative after launch. Antigravity must inspect the actual current `main`, current local workspace, current CI, current state/backlog and current live evidence. If the real state differs, update the execution queue from evidence.

---

# 4. 48-HOUR COMPLETION DEFINITION

The project is considered ready for the end of this 48-hour completion sprint only when all of the following are true:

## Code/CI
- latest `main` commit has green CI;
- Composer install/package discovery passes deterministically;
- backend regression suite passes;
- frontend production build passes;
- Playwright/E2E critical journeys pass;
- no known P0/P1 security, tenant isolation, payment, finance, certificate or data-integrity defect remains;
- no test environment is masking production behavior in critical flows.

## Critical business journeys
- Paid Center lifecycle works end-to-end;
- Credit/Due Center lifecycle works end-to-end;
- Student login/documents/result/certificate flow works;
- Public certificate/result verification exposes only intended data;
- Lead → Center → Sale → Commission flow works;
- Order → Payment → Ledger → Due/Credit → Collection → Commission invariants hold;
- result/certificate access rules are enforced server-side;
- Center tenant isolation is verified on all critical entities.

## Security
- RBAC/guards are tested for Admin, Staff, Center and Student where relevant;
- password-reset controls are valid;
- upload validation/private file access are hardened;
- sensitive/debug routes/artifacts are absent from production exposure;
- no plaintext secret is committed/exposed;
- dependency advisories are reviewed and critical/high exploitable issues are resolved or explicitly documented with safe mitigation.

## Operations
- database backup mechanism exists and is verified;
- user-upload/document backup strategy exists;
- restore procedure is documented and tested safely using non-production data;
- queue/scheduler health is verified;
- health endpoint/monitoring is functional;
- deployment/rollback procedure is documented and evidence-backed;
- live/test deployment to `nenobet.live` is smoke-verified without altering real business data.

## State/evidence
- autonomous state, backlog, task queue and reports agree with reality;
- no stale `IN_PROGRESS` task remains without heartbeat/evidence;
- no “complete” task remains unchecked in backlog;
- final evidence index points to tests/CI/commits/reports;
- final report distinguishes verified facts from unavailable checks.

---

# 5. PRIORITY MODEL

Use the following priority order:

- **P0 — Release blocker:** CI cannot run; security/data/financial corruption; cross-tenant leakage; destructive behavior; authentication bypass; broken core lifecycle.
- **P1 — High:** critical tests failing; payment/ledger/certificate/result correctness; important RBAC gaps; production reliability failures; live/test deployment failure.
- **P2 — Medium:** meaningful E2E coverage gaps; performance bottlenecks; UX defects blocking normal use; monitoring/backup gaps; maintainability risks affecting delivery.
- **P3 — Low:** polish, non-blocking refactors, minor accessibility/consistency work.

During the 48-hour sprint:

**P0 → P1 → P2 → P3 only when higher-priority work is clear.**

Do not spend hours polishing a P3 item while P0/P1 remains unresolved.

---

# 6. FIRST 60 MINUTES — RECOVERY & BASELINE GATE

The first execution block must do all of the following before broad feature work:

## 6.1 Inspect workspace/repository

Run/inspect safely:

- `git status`
- current branch
- recent commit history
- staged/unstaged diffs
- untracked files
- current CI run and failure step/logs
- `.ai/AUTONOMY_STATE.json`
- `.ai/TASK_QUEUE.md`
- `.ai/CONTINUOUS_STATE.json`
- `.ai/CONTINUOUS_BACKLOG.md`
- `.ai/CONTINUOUS_ACTIVITY.md` if present
- `.ai/AGENT_ACTIVITY.md`
- `.ai/EVIDENCE_INDEX.md`
- `.ai/runtime/ACTIVE_RUN.json`
- scheduler/heartbeat logs
- current reports

## 6.2 Reconcile stale state

If local state and GitHub disagree:

- preserve valuable local work;
- never hard-reset blindly;
- determine the newer evidence-backed state;
- update continuous state/backlog only after verification;
- ensure only one active runner exists.

If a task is `IN_PROGRESS` but no process/heartbeat/work exists beyond the stale threshold, recover it safely.

Recommended stale threshold: **30 minutes** unless the task is an explicitly long-running test/build.

## 6.3 Fix the current CI blocker first

At file creation, latest CI was failing during `composer install` / `php artisan package:discover` with exit 255.

Treat a still-present version of this as **P0-001** because no later regression/E2E gate can run reliably while CI stops at dependency boot.

Required approach:

1. reproduce with verbose output locally/CI-equivalent;
2. capture the actual Laravel exception instead of only exit 255;
3. determine whether the failure is caused by package discovery, environment boot, database configuration, service-provider side effects, incompatible dependency, missing extension/config, or a recent test-environment change;
4. fix the root cause with the smallest compatible change;
5. verify `composer install` and `php artisan package:discover` independently;
6. run the full CI-equivalent path;
7. commit/push;
8. wait for GitHub CI green before declaring P0-001 complete.

Do not hide the error using `--no-scripts` unless there is a proven architectural reason and runtime package discovery remains correctly handled.

---

# 7. MASTER WORKSTREAMS — A TO Z

These workstreams are the permanent execution map. The Orchestrator must dynamically create tasks from them based on real evidence.

## WS-A — CI, Test Environment & Regression Stabilization

Goal: make tests trustworthy, deterministic, isolated and production-representative.

Audit/fix:

- current Composer/package discovery failure;
- PHPUnit bootstrap/environment consistency;
- MySQL vs SQLite test-engine mismatch;
- `RefreshDatabase`/transactions/test isolation;
- factories/fixtures/reference data;
- tests depending on execution order/global seed state;
- tests leaking users/roles/centers across cases;
- timezone/date assumptions;
- queue/mail/SMS fakes;
- filesystem/storage fakes;
- failed migrations under SQLite or MySQL;
- E2E fixture determinism;
- CI/local parity.

### Important rule for the current “118 failing tests” task

Do **not** mechanically edit 118 tests one by one until the failure taxonomy is known.

First cluster failures by root cause, for example:

- database isolation;
- missing role/team/reference seed;
- factories;
- middleware/auth;
- schema incompatibility;
- SQLite-specific behavior;
- production code regression;
- stale expectation.

Fix shared root causes first. Re-run subsets. Only then refactor individual tests.

Do not change correct production business behavior merely to satisfy SQLite. If a critical query/constraint behaves differently between SQLite and MySQL, maintain a MySQL parity suite for that domain.

Exit:
- deterministic green backend suite;
- CI environment documented;
- no known order-dependent test;
- critical finance/tenant tests executed on production-compatible DB behavior.

## WS-B — Authentication, RBAC & Tenant Isolation

Audit all guards and critical routes:

- Admin
- Staff
- Center
- Student
- sub-admin/role restrictions
- password reset
- session behavior
- forgot-password rate limiting
- route-model binding
- policy/gate/middleware consistency
- IDOR
- ownership checks
- CenterScope/global scope behavior
- privileged export/report/document routes
- authorization on AJAX/legacy routes
- inactive/blocked user states.

Create explicit negative tests for cross-tenant access.

Exit:
- unauthorized requests fail predictably;
- tenant boundary tests pass;
- no client-controlled Center identifier grants access.

## WS-C — Uploads, Documents & Private File Security

Audit:

- Student photos/documents
- Center uploads
- Staff/Admin uploads
- slider/config uploads
- generated PDFs
- ID/registration/admit cards
- certificate assets
- storage paths
- MIME/extension/size validation
- filename/path traversal
- public vs private disks
- signed/authorized download routes
- replacement/deletion behavior
- orphan cleanup.

Verify recent strict image validation does not break legitimate expected formats/workflows.

Exit:
- upload endpoints have explicit validation;
- private files cannot be fetched across tenants;
- document downloads are server-authorized.

## WS-D — Registration, Orders, Pricing & Payment

Audit complete lifecycle:

- center-specific negotiated price;
- default fallback price;
- historical order price immutability;
- registration payment-required/optional policy;
- pay-during-registration behavior;
- unpaid/partial/paid/due states;
- order totals;
- discounts;
- SSLCommerz callback/IPN validation;
- transaction matching;
- idempotency;
- duplicate callback/race conditions;
- amount tampering;
- failure/cancel path;
- payment confirmation job/notification.

Exit:
- server is authoritative for amount/status;
- duplicate/replayed callbacks cannot double-credit;
- core payment tests green.

## WS-E — Ledger, Due, Credit & Commission Integrity

Audit invariants:

- debit/credit ledger correctness;
- `current_due` synchronization;
- available credit calculation;
- credit limit enforcement;
- partial collection;
- adjustment/refund handling;
- order paid/due state;
- commission earned/payable/paid lifecycle;
- commission isolation from Center due/company revenue;
- concurrent updates/locking;
- rounding/decimal precision;
- audit trail.

Create integrity assertions/commands where useful.

Exit:
- no double counting;
- ledger balances reproduce aggregate state;
- credit cannot exceed policy silently;
- financial regression suite green.

## WS-F — Result, Certificate & Public Verification

Audit lifecycle:

- Draft → Review → Approved → Published → Locked result;
- certificate eligibility;
- payment/credit gating;
- authorized overrides;
- unique verification identity;
- QR/verification code;
- duplicate issuance prevention;
- certificate status changes;
- public verification data minimization;
- invalid/revoked/not-found behavior;
- print/PDF correctness;
- auditability.

Exit:
- credential cannot be issued/accessed outside deterministic rules;
- public verification exposes only intended fields;
- E2E verification flow passes.

## WS-G — Sales CRM, Center Onboarding & Commission

Audit:

- Lead → Contact → Negotiation → Price Agreement → Onboarding → First Sale → Active Center;
- sales-agent ownership;
- lead conversion authorization;
- negotiated pricing mapping;
- duplicate Center prevention;
- follow-up state;
- conversion metrics;
- commission lifecycle and reports;
- agent isolation/permissions.

Exit:
- lead conversion is safe/deterministic;
- negotiated price reaches authoritative pricing correctly;
- commission reports match order facts.

## WS-H — Admin / Staff / Center / Student UX

Audit real workflows, not just pages:

- mobile responsiveness;
- navigation;
- loading/empty/error states;
- form validation feedback;
- paginated global metrics correctness;
- modal/legacy AJAX paths;
- Bengali/i18n consistency;
- accessibility basics;
- broken buttons/links;
- stale pages/routes;
- download behavior;
- permissions reflected in UI without relying on UI for security.

Prioritize workflow blockers over cosmetic redesign.

Exit:
- critical journeys can be completed without console errors or dead ends.

## WS-I — Performance & Scalability

Audit with evidence:

- N+1 queries;
- repeated aggregate queries;
- large collections loaded into memory;
- unbounded list endpoints;
- missing indexes;
- slow dashboards/reports;
- cache key fragmentation;
- expensive PDF/SMS work in request path;
- unnecessary repeated location/reference queries;
- queue candidates;
- pagination correctness;
- query-plan/index usage where relevant.

Recent analytics/performance changes must be regression-tested for correct totals and tenant boundaries.

Exit:
- no obvious high-impact N+1 in critical list/report flows;
- expensive work appropriately paginated/cached/queued;
- optimization does not alter business results.

## WS-J — Queues, Scheduler, Notifications & Automation

Audit:

- queue worker configuration;
- `SendStudentSmsJob`;
- `SendPaymentConfirmationSmsJob`;
- retry/backoff/failure handling;
- duplicate notification risk;
- scheduler health;
- health/integrity jobs;
- due reminders;
- event-driven automation;
- queue monitoring/failure visibility.

Exit:
- critical jobs are idempotent/recoverable where necessary;
- scheduler executes intended jobs;
- failures are visible.

## WS-K — Backup, Restore, Monitoring & Rollback

Audit/verify:

- database backup command/schedule;
- file/upload/document backups;
- retention;
- backup failure reporting;
- restore runbook;
- safe restore test into disposable environment;
- `/health` behavior;
- DB integrity health checks;
- application error logs;
- queue failures;
- disk/storage warnings;
- rollback reference and procedure;
- current deployed commit evidence.

Exit:
- backup without restore evidence is not considered fully verified;
- rollback instructions are actionable.

## WS-L — Dependencies & Technical Debt

Audit:

- `composer audit` / advisories;
- npm audit/advisories;
- Composer package compatibility;
- unused packages;
- abandoned packages;
- Node/GitHub Actions compatibility warnings;
- safe patch/minor updates;
- duplicate JS/PHP libraries;
- old debug/test artifacts.

Do not perform major Laravel/React/platform migrations during the 48-hour sprint unless a P0 issue makes it unavoidable and owner approval is obtained.

Exit:
- critical/high exploitable advisories resolved or documented with mitigation;
- dependency install is deterministic.

## WS-M — AI Features Safety & Correctness

Audit AI Document/Sales/Pricing/Finance/Risk features:

- authorization before data access;
- no cross-center leakage;
- deterministic fallbacks;
- source-data correctness;
- explicit “recommendation” vs “authority” separation;
- no automatic credential issuance;
- no silent price/financial mutation;
- safe error behavior when AI service unavailable;
- audit logging where appropriate.

Exit:
- AI failure cannot break deterministic business operations;
- AI does not bypass policy/finance/credential authority.

## WS-N — Documentation, State & Release Evidence

Maintain synchronized:

- `.ai/CONTINUOUS_STATE.json`
- `.ai/CONTINUOUS_BACKLOG.md`
- `.ai/48H_MASTER_STATE.json`
- `.ai/48H_EXECUTION_QUEUE.md`
- `.ai/48H_BLOCKERS.md`
- `.ai/48H_ACTIVITY.md`
- `.ai/48H_EVIDENCE_INDEX.md`
- relevant final reports.

Exit:
- state matches git/CI/live evidence;
- no false or stale completion claims.

---

# 8. INITIAL EXECUTION QUEUE

Create/reconcile the actual queue from real evidence, but start with these priorities if still applicable:

### P0-001 — Repair CI bootstrap/package discovery
- Reproduce latest Composer/package-discover failure with verbose logs.
- Fix root cause.
- Require green GitHub CI.

### P1-001 — Stabilize backend test environment and failing feature tests
- Cluster the reported failing tests by root cause.
- Fix shared isolation/seeding/environment causes first.
- Use `RefreshDatabase`/factories/reference seeds appropriately.
- Preserve MySQL parity for finance/tenant-critical behaviors.
- Drive failure count down in measurable batches.

### P1-002 — Re-run security regression after recent upload validation changes
- Ensure legitimate image/upload workflows still pass.
- Add missing negative/positive upload tests.

### P1-003 — Re-run authorization/tenant suite
- Admin/Staff/Center/Student critical ownership and IDOR paths.

### P1-004 — Financial integrity regression
- Payment/IPN, ledger, due, credit, commission, concurrency/idempotency.

### P1-005 — Critical E2E journeys
- Paid Center
- Credit Center
- Student
- Public Verification
- Sales/Commission
- Finance

### P2-001 — Performance verification
- Validate recent Admin Center/Student analytics optimizations.
- Audit remaining critical list/report queries.

### P2-002 — Operations readiness
- queue/scheduler/backup/restore/health/rollback evidence.

### P2-003 — Frontend/mobile workflow sweep
- high-value usability/broken-state fixes only.

### P2-004 — Dependency/security cleanup
- Composer/npm advisories and deterministic installs.

### P2-005 — AI safety regression
- authorization, deterministic fallback, no autonomous authority.

The Orchestrator may reorder only when evidence justifies a higher priority.

---

# 9. MULTI-AGENT EXECUTION MODEL

Use a controlled agent pool rather than dozens of uncontrolled simultaneous editors.

## Core agents

1. **Orchestrator / Scheduler** — owns queue, dependencies, priorities, heartbeat and recovery.
2. **State & Recovery Agent** — reconciles git/state/locks/CI.
3. **Backend/Test Stabilization Agent** — PHPUnit, factories, DB isolation, service/controller fixes.
4. **Security & Tenant Reviewer** — RBAC, CenterScope, IDOR, file access.
5. **Finance & Business Rules Reviewer** — payment, pricing, ledger, due, credit, commission, result/certificate gates.
6. **Frontend/E2E Agent** — React/Inertia, browser workflows, responsive UX, Playwright.
7. **Performance/Database Agent** — query profiling, indexes, caching, queues.
8. **Operations/Deployment Agent** — CI, scheduler, backup, restore, health, Antigravity SSH deployment.
9. **Documentation/Evidence Agent** — state/report/evidence synchronization.
10. **Independent Gatekeeper** — final PASS/REWORK/BLOCKED decision; may not be the implementer.

## Concurrency rule

Maximum recommended simultaneous implementers: **3**, and only on clearly disjoint file/domain scopes.

Before parallel work, assign a task lease containing:

- task ID;
- files/domains expected to change;
- branch/worktree if used;
- dependencies;
- integration owner.

Never let two agents blindly edit the same controller/migration/state file at the same time.

All parallel work must return through one integration gate.

---

# 10. TASK CONTRACT

Every task in `.ai/48H_EXECUTION_QUEUE.md` must include:

- ID
- Workstream
- Priority
- Evidence/problem statement
- Affected area
- Risk (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`)
- Dependencies
- Assigned agent
- Status
- Acceptance criteria
- Targeted tests
- Regression tests
- Security/tenant/finance review requirements
- Commit SHA
- CI result
- Live/test verification if applicable

Statuses:

`DISCOVERED → READY → IN_PROGRESS → SELF_TEST → REVIEW → REWORK | BLOCKED | PASS → COMMITTED → CI_VERIFY → COMPLETED`

Owner-only statuses:

`OWNER_DECISION_REQUIRED`  
`CREDENTIAL_REQUIRED`  
`PRODUCTION_DATA_RISK`

---

# 11. SELF-RECOVERY / ANTI-STALL SYSTEM

This section is mandatory because previous development repeatedly stopped after a task/cycle.

## 11.1 Heartbeat

While work is active, update a heartbeat at least every 10–15 minutes.

## 11.2 Stale task recovery

If:

- status is `IN_PROGRESS`;
- no agent/process is actually running;
- no file/evidence/heartbeat progress exists for 30+ minutes;

then:

1. inspect local changes;
2. preserve useful work;
3. record recovery event;
4. reset task to `READY` or `REWORK`;
5. resume automatically.

## 11.3 Blocked task bypass

If a task fails twice for the same external/non-local reason or needs owner-only input:

- mark it `BLOCKED` with exact blocker;
- continue the next independent task;
- never freeze the global runner.

## 11.4 Empty backlog behavior

If queue becomes empty before Final Completion Gate:

- immediately re-audit all workstreams;
- generate new evidence-backed tasks;
- do not enter terminal `COMPLETED` merely because one backlog file is empty.

## 11.5 CI failure behavior

If CI fails:

- classify failure as product regression, test issue, environment issue, dependency issue or flaky infrastructure;
- do not continue stacking risky changes on a red branch;
- enter rework and restore green CI as a priority;
- unrelated read-only audits may continue in parallel, but integration waits for green.

---

# 12. TEST STRATEGY

## Tier 1 — Targeted

Run the smallest test(s) that prove the change.

## Tier 2 — Domain regression

Examples:

- security/tenant tests after auth/policy/scope changes;
- financial tests after payment/ledger/order changes;
- document tests after storage/upload changes;
- E2E affected role after UI/controller changes.

## Tier 3 — Full backend

Run full PHPUnit/Laravel suite after medium/high-risk changes and before release acceptance.

## Tier 4 — Frontend build

Run production build after frontend/dependency/config changes.

## Tier 5 — Playwright

Run critical E2E journeys once environment is stable, plus targeted specs during feature work.

## Tier 6 — Live/test smoke

Only after local/CI gates are green and code is deployed safely to `nenobet.live`.

Do not use real business mutation for smoke tests unless explicitly approved. Prefer read-only/public/isolated test data paths.

---

# 13. DATABASE SAFETY

Local/CI disposable test DB may be reset when clearly isolated from live data.

For `nenobet.live` or any environment containing real/business data:

Never run:

- `php artisan migrate:fresh`
- `php artisan db:wipe`
- destructive seeders
- `DROP DATABASE/TABLE`
- bulk deletion for testing

For normal compatible schema changes, use reviewed forward migrations and `php artisan migrate --force` only when appropriate and after backup/compatibility review.

Before a high-risk migration:

- backup;
- inspect SQL/schema impact;
- verify rollback/forward-recovery strategy;
- require owner approval if material production-data risk exists.

---

# 14. GIT / CI POLICY

For every verified unit:

1. ensure git diff contains only intended changes;
2. exclude secrets/debug artifacts;
3. create a clear atomic commit;
4. push to the normal branch under standing authorization;
5. inspect CI;
6. if CI fails, automatically rework;
7. mark task complete only after required CI evidence.

Do not commit private keys, credentials, raw production dumps or sensitive logs.

Do not rewrite public history merely to tidy commits.

---

# 15. DEPLOYMENT POLICY — NENOBET.LIVE

Architecture:

**Antigravity workspace → tests/review → commit/push → GitHub CI green → Antigravity direct SSH → nenobet.live → safe smoke evidence**

GitHub Actions must remain CI-only.

Routine safe deployment to this designated live/test target is pre-authorized by this execution request provided:

- CI is green;
- deployment preserves `.env`, APP_KEY, database and uploads;
- no destructive migration/reset is required;
- rollback reference is known;
- deployment does not require exposing credentials.

If an actual production-data-impacting operation becomes necessary, stop that operation and request owner approval while continuing unrelated safe work.

---

# 16. 48-HOUR TIMEBOX

Use actual priority/evidence rather than blindly following clock slots, but the Orchestrator should aim for this sequence:

## Hour 0–2
- recover state/runner;
- P0 CI/bootstrap repair;
- baseline reports/queue.

## Hour 2–12
- stabilize test environment;
- cluster and reduce failing tests;
- security/tenant regression;
- keep CI green after each meaningful batch.

## Hour 12–20
- business/financial/payment/credit/ledger/commission integrity;
- result/certificate/verification gates.

## Hour 20–28
- Admin/Staff/Center/Student/Public critical E2E;
- frontend/UX workflow blockers;
- document/download/upload behavior.

## Hour 28–34
- performance/database/report/dashboard audit;
- queue/scheduler reliability.

## Hour 34–40
- backup/restore/health/monitoring/rollback;
- dependency/security cleanup;
- AI safety regression.

## Hour 40–44
- full regression/build/E2E;
- fix final failures;
- CI must be green.

## Hour 44–47
- safe direct SSH deploy to `nenobet.live` if code changes need deployment;
- non-destructive live/test smoke;
- deployed commit evidence.

## Hour 47–48
- final acceptance matrix;
- unresolved blocker classification;
- documentation/state reconciliation;
- final owner report.

If the deadline approaches with open work, prioritize P0/P1 and truthful final readiness. Never fake completion.

---

# 17. FINAL E2E MATRIX

The final acceptance run must explicitly cover:

## Paid Center
Center login → student creation/registration → authoritative pricing/order → payment verification → ledger/paid state → result eligibility → certificate → verification.

## Credit Center
Center login → registration without immediate payment when policy permits → due/credit update → result/certificate access according to policy → due remains visible/auditable → later collection.

## Student
Login → own registration → ID/registration/admit documents → result → certificate; cannot access another student's private resources.

## Admin
Login → center management → pricing/credit configuration → reporting/ledger/order views → restricted high-risk actions protected.

## Staff
Login/reset → permitted workflows → denied admin-only/financial routes.

## Public
Verification by intended identifier/QR path → only safe public fields → correct invalid/not-found behavior.

## Sales
Lead → negotiation → price agreement → Center conversion → first order → agent attribution → commission earned/payable/paid state.

## Finance
Order → payment/partial payment → ledger → due → credit → collection → commission; replay/concurrency does not duplicate financial effects.

---

# 18. SECURITY ACCEPTANCE MATRIX

Gatekeeper must classify each `PASS / REWORK / BLOCKED / N/A` with evidence:

- route protection;
- guard separation;
- password reset/rate limit;
- tenant isolation;
- IDOR;
- private document access;
- upload validation;
- filename/path safety;
- payment callback validation;
- financial amount authority;
- idempotency;
- CSRF/session behavior;
- public verification privacy;
- sub-admin restrictions;
- audit logging for sensitive changes;
- secret exposure scan;
- unsafe debug routes/files;
- dependency advisories.

---

# 19. FINAL REPORT FILES

Create/update at minimum:

- `.ai/48H_MASTER_STATE.json`
- `.ai/48H_EXECUTION_QUEUE.md`
- `.ai/48H_BLOCKERS.md`
- `.ai/48H_ACTIVITY.md`
- `.ai/48H_EVIDENCE_INDEX.md`
- `.ai/reports/48H_TEST_STABILIZATION_REPORT.md`
- `.ai/reports/48H_SECURITY_TENANT_REPORT.md`
- `.ai/reports/48H_FINANCIAL_INTEGRITY_REPORT.md`
- `.ai/reports/48H_E2E_ACCEPTANCE_REPORT.md`
- `.ai/reports/48H_OPERATIONS_READINESS_REPORT.md`
- `.ai/reports/48H_FINAL_ACCEPTANCE_REPORT.md`

Avoid duplicate/conflicting roadmap files. This file is an execution plan, not a replacement for the historical `MASTER_IMPLEMENTATION_ROADMAP.md`.

---

# 20. 48H MASTER STATE SCHEMA

Use a structure similar to:

```json
{
  "mode": "BDNSI_48H_AUTONOMOUS_COMPLETION",
  "started_at": "<timestamp>",
  "deadline_at": "<started_at + 48h>",
  "status": "RUNNING",
  "current_task": "P0-001",
  "current_workstream": "WS-A",
  "heartbeat_at": "<timestamp>",
  "ci_status": "RED|GREEN|RUNNING",
  "latest_verified_commit": "<sha>",
  "deployment_target": "nenobet.live",
  "deployment_method": "ANTIGRAVITY_DIRECT_SSH",
  "open_p0": 0,
  "open_p1": 0,
  "open_p2": 0,
  "blocked": [],
  "completed": [],
  "final_gate": "NOT_READY"
}
```

Do not mark `FINAL_GATE=PASS` until all defined acceptance conditions are evidence-backed.

---

# 21. WHAT TO DO WHEN SOMETHING BREAKS

## Test failure
- capture exact failure;
- classify shared vs individual root cause;
- fix root cause;
- rerun targeted subset;
- rerun relevant regression;
- update evidence.

## CI failure
- inspect failed step/log;
- reproduce locally if possible;
- stop risky integration stacking;
- repair and push;
- verify green.

## Agent crash/stall
- inspect heartbeat/process/local diff;
- preserve work;
- release stale lease/lock;
- resume/reassign task.

## External service unavailable
- mark task `BLOCKED_EXTERNAL`;
- implement safe deterministic fallback/test doubles if appropriate;
- continue independent tasks.

## Credential required
- do not extract from source/logs;
- mark `CREDENTIAL_REQUIRED`;
- continue other work;
- ask owner only when that dependency becomes critical.

## Business rule ambiguous
- do not invent money/credential policy;
- mark `OWNER_DECISION_REQUIRED`;
- continue other work.

## Live smoke unavailable
- distinguish `UNAVAILABLE` from `FAIL`;
- do not guess;
- retain local/CI evidence and retry later.

---

# 22. ANTI-BUSYWORK / ANTI-LOOP RULES

Never repeatedly:

- update timestamps only;
- cycle status without code/evidence;
- re-audit the same file without a changed trigger;
- re-run full suites after every trivial doc edit;
- refactor working code solely for style;
- rename files/components for cosmetic reasons;
- create a new roadmap every cycle;
- mark a task complete and leave it pending elsewhere;
- reopen completed work without new evidence.

Every task must answer: **What measurable risk, defect, reliability gap, performance issue, test gap, UX blocker, or operational weakness does this solve?**

If there is no evidence-backed answer, do not do the task.

---

# 23. OWNER INTERRUPTION POLICY

The owner should not need to manually prompt between routine tasks.

Only interrupt the owner when one of these is true:

- `OWNER_DECISION_REQUIRED`
- `CREDENTIAL_REQUIRED`
- `PRODUCTION_DATA_RISK`
- destructive/irreversible action required
- no safe independent work remains and a blocker prevents final acceptance.

When interruption is required, send exactly:

1. blocker;
2. why it cannot be safely solved autonomously;
3. one requested owner action/decision;
4. what independent work has continued meanwhile.

Do not ask the owner to choose ordinary implementation details that a senior engineer can safely decide.

---

# 24. FINAL COMPLETION GATE

The Orchestrator may finish the 48-hour completion run only when:

- latest CI is green;
- test environment is stable and trustworthy;
- all P0 tasks are closed;
- all P1 tasks are closed or owner-blocked with documented mitigation and no release-critical risk;
- critical P2 readiness tasks are closed;
- critical business E2E matrix passes;
- security/tenant matrix passes;
- finance/payment/ledger invariants pass;
- backup/restore/health/rollback evidence exists;
- live/test deployment state for `nenobet.live` is evidence-backed where reachable;
- state/backlog/reports are synchronized;
- no known P0/P1 release blocker remains.

Then set:

- `status = COMPLETE`
- `final_gate = PASS`

If these are not true at the deadline, set:

- `status = DEADLINE_REACHED_WITH_BLOCKERS`
- `final_gate = NOT_READY`

and produce the exact remaining blocker list. Never fake PASS.

After a true PASS, the normal periodic health/continuous-improvement runner may remain in `IDLE_HEALTHY` and re-audit later; it should not keep changing code without evidence just to appear busy.

---

# 25. LAUNCH SEQUENCE — EXECUTE IMMEDIATELY

Upon receiving this file, the Antigravity Orchestrator must:

1. acknowledge this as the current owner master execution instruction;
2. calculate `deadline_at = now + 48 hours`;
3. inspect actual git/local/CI/state/live evidence;
4. reconcile old approval rules with Section 1;
5. create/reconcile the 48H state/queue/evidence files;
6. diagnose and fix the current highest-priority blocker, including the latest CI Composer/package-discovery failure if still present;
7. continue into test stabilization, especially the current failing-feature-test backlog if still present;
8. automatically progress through all workstreams by priority;
9. use multi-agent parallelism only for disjoint safe scopes;
10. never stop after one task/cycle;
11. automatically recover stale tasks/locks;
12. commit/push verified work and repair CI until green;
13. deploy safely through Antigravity direct SSH when deployment gates are met;
14. run final acceptance;
15. finish only under Section 24.

**Do not respond with only a proposal. Begin execution now.**

---

# 26. SHORT OWNER LAUNCH PROMPT

After uploading this file to Antigravity, the owner can send only this message:

> Read and adopt `BDNSI_48H_AUTONOMOUS_MASTER_EXECUTION.md` as the current owner-authorized master execution plan. Start immediately from the real workspace/GitHub/CI state, create the 48-hour execution state and queue, and execute continuously until the Final Completion Gate in the file is satisfied. Do not wait for routine prompts or approvals. If one task blocks, record it and continue independent safe work. Do not return only a plan—begin execution now.

---

**END OF MASTER EXECUTION FILE**
