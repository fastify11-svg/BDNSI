# BDNSI 84H NONSTOP AUTONOMOUS EXECUTION MASTER
**Project:** fastify11-svg/BDNSI  
**Canonical live/test target:** `nenobet.live`  
**Deployment path:** Antigravity Direct SSH only  
**GitHub Actions role:** Source control + CI only  
**Execution objective:** Finish remaining verification, hardening, bug fixing, deployment, and final acceptance work inside an 84-hour unattended execution window, with persistent recovery and no routine owner prompting.

---

## 0. Why this file exists

The previous 48H execution approach allowed the agent to enter terminal states such as `COMPLETED`, `MASTER_PLAN_COMPLETE`, `gracefully stopping`, `AWAITING_CYCLE_X`, or `awaiting explicit approval to deploy`. That behavior is incompatible with the owner's requirement for unattended development.

This file replaces that stop behavior.

During the active 84-hour window, **task completion is not runner completion**. A completed task must immediately produce the next action:

`VERIFY → COMMIT/PUSH → CI → DEPLOY/SMOKE WHEN APPROPRIATE → RE-AUDIT → NEXT TASK`

The autonomous system must not stop merely because one cycle, backlog, test group, or roadmap section is complete.

---

# 1. Owner Standing Authorization

This uploaded file and the startup instruction that references it constitute the owner's explicit standing authorization for the following **safe, reversible, ordinary project-development actions** during the 84-hour execution window:

- inspect repository/workspace state
- edit application code
- edit tests
- add missing tests
- fix bugs
- security hardening that preserves intended policy
- tenant-isolation hardening
- performance optimization supported by evidence
- UI/UX fixes
- documentation/state-file reconciliation
- safe package patch/minor maintenance
- run local test/build/lint commands
- create evidence/reports
- create normal atomic Git commits
- push verified commits to the normal `main` workflow
- inspect and verify GitHub CI
- rework failed CI
- use the existing Antigravity direct-SSH deployment path to `nenobet.live`
- run safe non-destructive remote deployment commands
- run safe/read-only live smoke checks
- run normal forward-only migrations that have been reviewed, tested, and are non-destructive
- clear/rebuild Laravel application caches as part of deployment
- recover stale local autonomous state, stale locks, heartbeat files, and the existing scheduler/sidecar runner

**Do not ask the owner again for routine approval for the actions above.**

Owner approval is still required for:
- destructive production database operations
- deleting/overwriting real business data
- `migrate:fresh`, `db:wipe`, DROP/TRUNCATE destructive live operations
- unavailable credentials/secrets
- changing core financial/business policy
- changing certificate/result release policy when the existing requirement is ambiguous
- irreversible infrastructure changes
- major framework/platform migrations
- force-push/history rewrite
- any change whose production impact cannot be safely reversed

If old local governance files say every routine commit/push/deployment needs separate approval, reconcile them with this current owner authorization while preserving the destructive/credential/business-policy gates above.

---

# 2. Current Baseline To Re-Verify At Startup

Do not trust stale reports blindly. Re-check the real local workspace and GitHub first.

At the time this master was prepared:
- the latest known GitHub CI had returned green after final-acceptance reconciliation
- previous CI failures demonstrated that local SQLite success was not sufficient evidence for GitHub/MySQL success
- `CONTINUOUS_STATE.json` had previously been set to terminal `COMPLETED`

Treat those only as a starting hint. The real startup state must come from:
1. `git status`
2. `git log`
3. `git fetch` / `origin/main`
4. latest GitHub Actions result
5. `.ai/AUTONOMY_STATE.json`
6. `.ai/CONTINUOUS_STATE.json`
7. `.ai/CONTINUOUS_BACKLOG.md`
8. `.ai/TASK_QUEUE.md`
9. runtime heartbeat/lock files
10. scheduler/sidecar status
11. existing evidence/reports
12. safe public/live checks on `nenobet.live`

---

# 3. The 84-Hour Execution Window

Create or maintain:

`.ai/84H_EXECUTION_STATE.json`

Required shape:

```json
{
  "mode": "BDNSI_84H_UNATTENDED_EXECUTION",
  "status": "RUNNING",
  "window_started_at": "...",
  "window_deadline_at": "...",
  "cycle_number": 1,
  "current_lane": "...",
  "current_task": "...",
  "gate_status": "WORKING",
  "last_heartbeat_at": "...",
  "latest_verified_commit": "...",
  "latest_ci_run": "...",
  "latest_ci_conclusion": "...",
  "deployment_target": "nenobet.live",
  "deployment_method": "ANTIGRAVITY_DIRECT_SSH",
  "persistent_runner_status": "HEALTHY",
  "blocked_tasks": [],
  "owner_decision_required": false
}
```

During the 84-hour window, allowed overall states are:

- `RUNNING`
- `REWORK`
- `WAITING_FOR_CI`
- `BLOCKED_PARTIAL`
- `IDLE_HEALTHY`
- `OWNER_DECISION_REQUIRED`

**Do not use terminal `COMPLETED` while the 84-hour window is still active.**

If a final acceptance gate passes early, use:

`FINAL_ACCEPTED_MONITORING`

and continue audit/regression/health monitoring until the end of the execution window.

Only after the 84-hour window has ended and final acceptance is still green may the runner enter:

`FINAL_COMPLETED`

---

# 4. Persistent Runner / Watchdog Requirement

A Markdown file alone cannot guarantee unattended execution. The persistent runner must actually be capable of waking/re-invoking the development loop.

At startup:

1. Inspect the existing sidecar/persistent runner.
2. Inspect the existing Windows Task Scheduler entry.
3. Confirm it is enabled.
4. Confirm it has a valid invocation path.
5. Confirm it can wake after the IDE task/cycle ends.
6. Confirm it does not create duplicate competing runners.
7. Confirm heartbeat updates.
8. Confirm stale-lock recovery.
9. Confirm restart-safe state.
10. Confirm a failed task does not terminate future wakes.

Preferred cadence:
- scheduler wake: every 10–15 minutes
- heartbeat while active: at least every 5 minutes
- stale active-run threshold: 20–30 minutes without heartbeat unless a known long-running command is active

If the scheduler exists but cannot actually re-invoke Antigravity/agent execution, **do not pretend it is autonomous**. Record that exact limitation immediately in `.ai/84H_EXECUTION_STATE.json` and use the strongest supported persistent invocation mechanism available in the existing Antigravity environment.

Do not build a fake loop that only edits timestamps.

---

# 5. Non-Stop State Machine

Every wake/run must execute this state machine:

```text
BOOT
→ RECOVER
→ RECONCILE
→ CHECK CI
→ CHECK ACTIVE TASK
→ IF FAILED: REWORK
→ IF PASSED: CLOSE TASK
→ SELECT NEXT TASK
→ IMPLEMENT
→ TARGETED TEST
→ REVIEW
→ FULL RELEVANT REGRESSION
→ COMMIT
→ PUSH
→ WAIT/POLL CI
→ IF CI FAIL: REWORK
→ IF CI PASS: DEPLOY WHEN APPROPRIATE
→ LIVE SMOKE
→ RECORD EVIDENCE
→ ROTATE LANE
→ SELECT NEXT TASK
```

There is no automatic stop after:
- one task
- one lane
- one cycle
- empty backlog
- successful CI
- successful deployment
- successful E2E
- successful final acceptance

Instead, re-audit and continue until the 84-hour window ends.

---

# 6. Eight Rotating Engineering Lanes

## Lane 1 — Security / Auth / RBAC / Tenant Isolation
Audit and improve:
- Admin/Staff/Center/Student guards
- brute-force/rate limiting
- password reset
- session hardening
- IDOR
- CenterScope
- route-model binding
- unauthorized document access
- role/permission boundaries
- upload security
- sensitive error output
- audit logging
- CSRF/security headers where applicable

## Lane 2 — Business / Financial Integrity
Audit and improve:
- center registration
- student registration
- optional payment-at-registration behavior
- order creation
- pricing
- center-specific pricing
- due/credit
- credit limit
- ledgers
- partial payments
- payment idempotency
- SSLCommerz callbacks/IPN
- commission lifecycle
- result access
- certificate access
- document access
- duplicate financial mutations
- transaction rollback behavior

Never change business policy merely to satisfy tests.

## Lane 3 — Testing / Regression / E2E
Audit and improve:
- PHPUnit feature/unit coverage
- MySQL CI compatibility
- SQLite/local compatibility where intentionally supported
- Playwright E2E
- Admin workflows
- Staff workflows
- Center workflows
- Student workflows
- payment failure/retry
- queue/job failure
- concurrency/idempotency
- tenant isolation
- certificate verification
- document access
- public verification/privacy

## Lane 4 — Performance / Database
Audit and improve:
- N+1
- repeated count/aggregate queries
- missing indexes
- oversized result sets
- pagination
- eager loading
- expensive reports
- dashboard queries
- cache usage
- memory leaks
- PDF generation
- queue workload
- large React bundles
- duplicate network calls

Require measurable/evidence-backed benefit.

## Lane 5 — Frontend / UX / Mobile / Accessibility
Audit and improve:
- Admin
- Staff
- Center
- Student
- public pages
- responsive behavior
- loading/empty/error states
- form errors
- broken links
- Inertia navigation
- mobile layout
- accessibility basics
- Bengali/English consistency
- browser console errors

No cosmetic redesign without evidence.

## Lane 6 — Operations / Reliability
Audit and improve:
- scheduler
- queue worker
- failed jobs
- health checks
- DB integrity checks
- backup
- restore documentation/verification
- logs
- monitoring
- cache/config behavior
- disk/storage risks
- rollback readiness
- deploy script safety
- cron/scheduler reliability

## Lane 7 — Dependencies / Toolchain
Audit and improve:
- Composer advisories
- npm advisories
- abandoned packages
- safe patch/minor upgrades
- unused packages
- lockfile consistency
- CI runner compatibility
- PHP/Node tooling warnings

Do not perform major framework migration automatically.

## Lane 8 — Code Quality / Maintainability
Audit and improve:
- dead/debug code
- duplicated business logic
- oversized controllers
- repeated authorization checks
- inconsistent services
- unused files
- stale generated artifacts
- error handling
- documentation drift
- test helper/factory consistency
- state-file consistency

---

# 7. Dynamic Backlog

Maintain:

`.ai/84H_BACKLOG.md`

Each task must contain:
- Task ID
- Lane
- Priority: P0/P1/P2/P3
- Evidence
- Root cause or hypothesis
- Affected files
- Risk level
- Targeted tests
- Full regression requirement
- Status
- Commit SHA
- CI result
- Deployment result if relevant
- Live-smoke result if relevant

Statuses:
- `DISCOVERED`
- `READY`
- `IN_PROGRESS`
- `WAITING_FOR_CI`
- `REWORK`
- `BLOCKED`
- `PASS`
- `COMPLETED`

Priority:
- **P0:** security/data/financial/live regression
- **P1:** core correctness, tenant isolation, payment/certificate access, CI broken
- **P2:** meaningful testing/performance/UX/reliability improvement
- **P3:** safe maintenance/polish

When backlog is empty:
1. increment cycle number
2. rotate lane
3. run fresh evidence audit
4. create next backlog
5. begin next useful task

Do not stop.

---

# 8. CI Is An Authoritative Gate

Local test success is not sufficient.

For every release-worthy batch:

1. targeted tests
2. local full PHP regression when appropriate
3. `npm run build`
4. Playwright when relevant
5. commit
6. push
7. inspect GitHub CI
8. if CI fails, automatically enter `REWORK`
9. fetch exact failed job/logs
10. fix root cause
11. repeat until green

Never write `ci_verified: true` unless the actual latest relevant GitHub CI is green.

Never mark:
- `FINAL_ACCEPTANCE = PASS`
- `MASTER_PLAN_COMPLETE`
- `100% COMPLETE`
- `fully cleared`

while the latest mandatory CI is red or skipped.

---

# 9. Cross-Environment Test Parity

Recent failures showed that a local SQLite suite can pass while GitHub's MySQL suite fails.

Therefore:

- keep SQLite fast tests only if useful
- final acceptance must include GitHub/MySQL CI
- do not remove required DB columns from factories/fixtures solely to satisfy SQLite
- factories/seeders must satisfy the authoritative schema
- test helpers must represent real valid domain records
- if MySQL and SQLite behave differently, document and resolve the mismatch explicitly

Never weaken test data constraints by making production schema nullable unless that matches the actual business requirement.

---

# 10. Test Fixing Rules

When tests fail:

1. cluster failures by root cause
2. fix shared root cause first
3. distinguish application bug / stale test / bad fixture-factory / environment mismatch / race condition / flaky locator-timing issue
4. preserve security/business requirements
5. never delete a meaningful implemented-feature test just to obtain green
6. never disable an implemented workflow test to obtain green
7. a test may be removed only when evidence proves it tests a feature explicitly not part of the product requirement; record the evidence

Flaky E2E fixes must improve deterministic synchronization, not add arbitrary long sleeps unless no better signal exists.

---

# 11. Git Discipline

For each verified task:
- keep commits atomic
- meaningful commit message
- no force push
- no credential files
- no unrelated bulk formatting
- no hidden debug artifacts
- no accidental `.env`
- no private deployment key
- no destructive history rewrite

If a PowerShell command such as `cmd1 && cmd2` fails due shell syntax, automatically retry using syntax valid for the active shell, e.g. separate commands or `;`, without stopping the workflow.

---

# 12. Deployment — Standing Owner Approval

The owner has already authorized safe repeated deployment to the designated BDNSI live/test target under the constraints in this file.

Therefore, after all relevant gates are green, **do not pause with “Awaiting explicit approval to deploy”** for routine safe deployment to:

`nenobet.live`

Deployment must remain:

`ANTIGRAVITY_DIRECT_SSH`

GitHub Actions must remain:
`CI_ONLY`

Never reintroduce GitHub SSH deployment.

Before deployment:
- verify Git status
- verify expected commit
- verify CI green
- verify migration safety
- preserve `.env`
- preserve `APP_KEY`
- preserve uploads/storage
- preserve real database/data
- preserve secrets

Deployment:
- use existing reviewed direct-SSH mechanism
- only forward-safe migrations
- clear/rebuild required caches
- deploy compiled assets when required

After deployment:
- public landing smoke
- admin login page smoke
- health endpoint if available
- selected read-only route smoke
- confirm 200/expected redirects
- inspect obvious application errors
- record deployment commit/evidence

Do not mutate real business data for smoke testing.

If a deployment would require destructive data change, stop that task and request owner approval.

---

# 13. Live Regression Handling

If `nenobet.live` shows a clear regression after a deployment:

1. stop further deployments
2. capture evidence
3. determine whether rollback is safe
4. prefer code rollback to a known-good commit if it is clearly reversible
5. do not roll back database migrations destructively without explicit owner approval
6. restore service safely
7. fix forward
8. rerun gates
9. redeploy
10. verify live again

---

# 14. Multi-Agent Gate

Use the existing multi-agent roles when available:

`ORCHESTRATOR`
→ `ARCHITECTURE AUDITOR`
→ `IMPLEMENTER`
→ `SELF TEST`
→ `INDEPENDENT REVIEW`
→ `SECURITY/TENANT REVIEW`
→ `FINANCIAL REVIEW` when applicable
→ `QA`
→ `E2E REVIEW`
→ `GATEKEEPER`

The implementer must not self-approve meaningful security/financial/tenant changes.

Gatekeeper outcomes:
- `PASS`
- `REWORK`
- `BLOCKED`
- `OWNER_DECISION_REQUIRED`

A blocked single task does not stop the full runner.

---

# 15. Time Budget Strategy

The 84-hour target is a deadline goal, not permission to fake completion.

### Hours 0–12
- state/scheduler repair
- CI parity
- P0/P1 regressions
- security/tenant/payment integrity

### Hours 12–30
- core workflow verification
- Admin/Staff/Center/Student journeys
- financial/credit/commission/certificate rules
- missing high-value tests

### Hours 30–48
- E2E stabilization
- performance
- database indexes/N+1
- queue/scheduler/backup reliability

### Hours 48–66
- UX/mobile/accessibility
- dependency/toolchain
- code quality
- regression prevention
- documentation reconciliation

### Hours 66–78
- full-system regression
- MySQL CI
- full Playwright
- deployment rehearsal/safe deploy
- live smoke

### Hours 78–84
- final acceptance
- repeat critical security/business smoke
- ensure latest CI green
- ensure live commit matches expected deployment
- final evidence/report
- continue monitoring until deadline

If P0/P1 work remains, deprioritize P3 polish.

---

# 16. Anti-Stall Rules

The runner must automatically recover from:

- **Cycle completion:** immediately start next cycle.
- **Empty backlog:** fresh 8-lane audit.
- **CI failure:** fetch logs → REWORK.
- **CI waiting:** poll/recheck later; do not abandon task.
- **One blocked task:** mark blocked → choose next independent task.
- **Stale state:** reconcile with git/CI evidence.
- **Stale lock:** recover only after confirming no real active process.
- **IDE/agent task ended:** persistent scheduler/sidecar must wake the system again.
- **Network/transient command failure:** retry with bounded backoff.
- **Shell syntax mismatch:** adapt command to active shell.
- **Local test/CI disagreement:** trust reproducible CI environment evidence and fix parity.

---

# 17. Anti-False-Completion Rules

Never claim completion based only on:
- local tests
- a screenshot
- one green targeted test
- one successful deploy command
- one successful Playwright run
- state-file text
- a previous CI run

Final acceptance requires contemporaneous evidence.

If a report says completed but the latest CI is red:
- report is stale/incorrect
- state becomes `REWORK`
- completion is revoked until green

---

# 18. Final Acceptance Gate

Final acceptance requires all applicable checks:

- repository clean or only known local ephemera
- expected code committed
- `origin/main` reconciled
- PHP regression green
- GitHub CI green
- frontend build green
- Playwright green
- security/RBAC/tenant checks green
- financial/payment/credit/commission checks green
- certificate/result/document-access checks green
- scheduler/queue/operations checks acceptable
- no known active P0
- no known active P1
- deployment method still `ANTIGRAVITY_DIRECT_SSH`
- GitHub remains CI-only
- `nenobet.live` safe smoke green
- state/backlog/reports match reality

When this passes during the 84-hour window:

```json
{
  "status": "FINAL_ACCEPTED_MONITORING",
  "gate_status": "PASS"
}
```

Do **not** halt. Continue health/audit monitoring until the deadline.

At the end of the window, if still green:

```json
{
  "status": "FINAL_COMPLETED",
  "gate_status": "PASS"
}
```

Generate:

`.ai/reports/84H_FINAL_ACCEPTANCE_REPORT.md`

---

# 19. Embedded Self-Prompt For Every Runner Wake

The persistent runner should use this instruction on every wake:

```text
BDNSI 84H AUTONOMOUS WAKE

Read BDNSI_84H_NONSTOP_AUTONOMOUS_EXECUTION_MASTER.md and .ai/84H_EXECUTION_STATE.json.

Do not return only a status report.

Recover the real local state, reconcile Git/CI/runtime evidence, and execute the next highest-value safe action.

If the previous task passed, close it and immediately select the next task.
If CI failed, enter REWORK and fix the root cause.
If backlog is empty, start a fresh rotating audit cycle.
If one task is blocked, record it and continue an independent task.
If final acceptance already passed but the 84-hour window is still active, remain in FINAL_ACCEPTED_MONITORING and continue verification/audit work.

Do not stop for routine commit, push, CI, or safe non-destructive deployment to nenobet.live; standing owner authorization is already granted by the master file.

Only pause for:
- destructive/irreversible production operation
- real production-data mutation
- unavailable credential/secret
- unresolved business-policy decision
- materially risky major platform migration

GitHub Actions = CI only.
Deployment = Antigravity Direct SSH.
Target = nenobet.live.

Execute now.
```

Store this as the persistent runner prompt if the existing runner architecture supports it.

---

# 20. Immediate Startup Actions

Upon receiving this master:

1. Do not create a second parallel project.
2. Do not discard existing verified work.
3. Inspect current local workspace.
4. Fetch/reconcile `origin/main`.
5. Inspect latest GitHub CI.
6. Inspect the final-acceptance state.
7. If current CI is green, record it.
8. If current CI is red, immediately enter REWORK.
9. Repair/re-enable the persistent scheduler/sidecar if needed.
10. Reconcile old `COMPLETED` continuous state into active 84H state.
11. Create `.ai/84H_EXECUTION_STATE.json`.
12. Create/update `.ai/84H_BACKLOG.md`.
13. Perform fresh 8-lane audit.
14. Select highest-value evidence-backed task.
15. Start implementation immediately.
16. Continue through commit/push/CI/deployment/next-task loops without owner prompting.

---

# 21. Owner Communication

Do not wait for the owner to answer routine status messages.

Reports should be written to files while execution continues.

Only interrupt execution and request owner input when an actual `OWNER_DECISION_REQUIRED` condition exists.

A normal progress message is informational, not a stop condition.

---

# 22. Definition of Success

Success is not “the agent wrote COMPLETED.”

Success means:
- core BDNSI requirements remain correct
- security and tenant boundaries hold
- financial logic remains deterministic/auditable
- tests represent real requirements
- CI is actually green
- deployment is safe
- live smoke is green
- no known P0/P1 remains
- the autonomous runner survived cycle boundaries without manual `continue`
- the final state is evidence-backed and internally consistent

**END OF MASTER**
