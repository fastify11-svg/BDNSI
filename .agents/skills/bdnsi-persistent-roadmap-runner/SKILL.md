---
name: bdnsi-persistent-roadmap-runner
description: >
  Persistent autonomous runner for the BDNSI Master Implementation Roadmap.
  Wakes on schedule, acquires an execution lock, resumes from the last
  verified checkpoint, delegates to specialised agents, gates every output,
  commits verified work, and advances to the next task — all without requiring
  owner prompts for ordinary implementation decisions.
triggers:
  - scheduled
  - manual_resume
  - post_rework
---

# BDNSI Persistent Roadmap Runner — Autonomous Execution Skill

## Mission

Execute the `MASTER_IMPLEMENTATION_ROADMAP.md` continuously and safely from the
current independently verified checkpoint until the entire roadmap is complete,
following the evidence-driven multi-agent control plane defined in `.agents/` and `.ai/`.

## WAKE SEQUENCE (execute every time this skill is invoked)

### Step 1 — Acquire Lock

Read `.ai/runtime/ACTIVE_RUN.json`.

```
IF status == "RUNNING"
  AND last_heartbeat_at is within 30 minutes of NOW:
    → EXIT with NOOP_ACTIVE_RUN (another agent is live)
IF status == "RUNNING"
  AND last_heartbeat_at is OLDER than 30 minutes:
    → STALE LOCK: proceed to State Recovery (Step 2)
IF status == "FREE":
    → Write own conversation_id, timestamp, phase=current, status="RUNNING"
    → Proceed to Step 3
```

### Step 2 — State Recovery (Stale Lock)

Read in order:
1. `MASTER_IMPLEMENTATION_ROADMAP.md`
2. `.ai/AUTONOMY_STATE.json`
3. `.ai/PROJECT_STATE.md`
4. `.ai/TASK_QUEUE.md`
5. `.ai/EVIDENCE_INDEX.md`
6. `.ai/BLOCKERS.md`
7. `git log --oneline -10`
8. `git status`

Determine:
- Last independently verified phase and commit
- Current in-progress task (if any)
- Whether the interrupted run left partial code changes
- Whether tests were passing before interruption

Apply corrective action before resuming:
- Revert uncommitted partial changes only if they are confirmed broken
- Otherwise preserve partial progress and continue from that task
- Update `.ai/runtime/ACTIVE_RUN.json` with recovered state

### Step 3 — Determine Next Task

```
1. Read MASTER_IMPLEMENTATION_ROADMAP.md
2. Read AUTONOMY_STATE.json → current_phase, last_verified_phase
3. Check EVIDENCE_INDEX.md for each phase's gate status
4. If current_phase has unfinished REWORK → resume REWORK first
5. Else → select the lowest-dependency unfinished task in current_phase
6. If current_phase is complete → advance to next phase
7. If ALL phases complete → set AUTONOMY_STATE = COMPLETE (see Completion section)
```

### Step 4 — Architecture Audit

Before implementing any task, invoke the Architecture Audit:
- Read existing models, controllers, routes related to the task scope
- Identify conflicts with existing patterns
- Identify authorisation / tenant isolation implications
- Identify financial integrity implications
- Produce a brief architecture note (max 200 words) recorded in `.ai/reports/`

### Step 5 — Implementation

Delegate to the appropriate engineer agent role:
- **Backend**: Laravel controller, model, migration, policy, service, event, listener
- **Frontend**: React (Inertia.js) page component, Tailwind CSS styling
- **Database**: Migration files only — additive, never destructive

Implementation rules:
- Use full PHP path: `C:\xampp\php\php.exe artisan`
- Use full Composer path: `C:\xampp\php\composer.bat`
- NEVER run `migrate:fresh` or `db:wipe` on local/shared data
- Write targeted unit/feature tests alongside each implementation
- Refresh heartbeat every 5 minutes: update `last_heartbeat_at` in `ACTIVE_RUN.json`

### Step 6 — Independent Code Review

A **different logical reviewer** (not the implementing agent) must verify:
- Code correctness and Laravel conventions
- No hardcoded credentials
- No cross-center data leakage
- No financial calculation errors
- RBAC / policy coverage

Produce: `.ai/reports/CODE_REVIEW_<PHASE>_<TASK>.md`

### Step 7 — Security & Tenant Review

Invoke `bdnsi-security-gate` and `bdnsi-tenant-isolation` skills.

Check:
- IDOR exposure on any new endpoint
- Center-scoped queries use `CenterScope` or explicit `center_id` filtering
- No staff/agent can read another agent's commissions
- No unauthenticated routes expose data

Produce: `.ai/reports/SECURITY_REVIEW_<PHASE>_<TASK>.md`

### Step 8 — Financial Integrity Review (if applicable)

If the task touches: commissions, payments, revenue, dues, pricing:

Invoke `bdnsi-financial-integrity` skill.

Verify:
- Commission = policy.value when type=fixed
- Commission = order.total_amount * policy.value/100 when type=percentage
- No double-counting across payment events
- Commission status transitions: Earned → Approved → Paid (no skipping)
- Reversal updates ledger correctly

Produce: `.ai/reports/FINANCIAL_REVIEW_<PHASE>_<TASK>.md`

### Step 9 — Targeted Tests

```powershell
C:\xampp\php\php.exe artisan test --filter=<FeatureUnderTest>
```

All targeted tests must pass (exit 0) before proceeding to regression.

If any fail → REWORK immediately (do not proceed to regression).

### Step 10 — Regression Tests

```powershell
C:\xampp\php\php.exe artisan test
```

Full suite must pass. If regressions detected → fix them before proceeding.

### Step 11 — Production Build

```powershell
npm run build
```

Must exit 0. Vite build warnings are acceptable; errors are not.

### Step 12 — E2E / Browser Verification (when applicable)

For user-facing features:
```powershell
npx playwright test
```

All E2E tests must pass. If failing:
1. Read error output
2. Identify root cause (setup script? selector? actual UI bug?)
3. Fix and re-run
4. Max 3 auto-remediation cycles before escalating to BLOCKED

### Step 13 — Gatekeeper Decision

The Integration Gatekeeper reviews ALL evidence:
- Code review report
- Security review report  
- Financial review (if applicable)
- Targeted test results
- Regression test results
- Build result
- E2E results (if applicable)

**Gatekeeper CANNOT be the implementing agent.**

Returns exactly one of:
```
PASS     → proceed to Step 14
REWORK   → identify specific gaps, loop back to Step 5
BLOCKED  → record blocker in .ai/BLOCKERS.md, update state, EXIT
OWNER_DECISION_REQUIRED → record in .ai/AUTONOMY_STATE.json, EXIT
```

### Step 14 — Evidence Seal & State Synchronisation (on PASS)

1. Write evidence to `.ai/EVIDENCE_INDEX.md`
2. Update `.ai/AUTONOMY_STATE.json`:
   - `gate_status = PASS`
   - `last_verified_phase = current_phase` (if phase complete)
   - `current_task = next_task`
3. Update `.ai/PROJECT_STATE.md`
4. Update `.ai/TASK_QUEUE.md` (mark task VERIFIED/CLOSED)
5. Update `.ai/AGENT_ACTIVITY.md` with run summary

### Step 15 — Atomic Commit

```powershell
git add -A
git commit -m "feat(<phase>/<task>): <description> [autonomous]"
```

Never force-push. Never commit secrets.

### Step 16 — Advance to Next Task

Go to Step 3 immediately. Do NOT stop and ask the owner if they want to continue.

---

## OWNER_DECISION_REQUIRED Conditions (only these)

Require owner input ONLY for:
- Production deployment of material risk
- Irreversible migrations on PRODUCTION/SHARED_STAGING
- Unresolved business policy (e.g. ambiguous commission qualifying event)
- Security credential changes
- Force push or history rewrite
- Real external certificate issuance outside deterministic rules
- Historical financial data mutation

**Do NOT stop for**: implementation patterns, schema names, refactoring style,
test strategy, agent assignment, ordinary bug fixes, frontend choices.

---

## BLOCKED Conditions

Record in `.ai/BLOCKERS.md` and exit if:
- Required service (MySQL, PHP, Node) cannot be started without elevation
- Required external API is unreachable and the task depends on it
- Git conflict cannot be safely auto-resolved
- E2E failure after 3 remediation attempts with no clear root cause

Scheduled runs re-check whether the blocker is resolved before taking action.

---

## NO-SPAM Rule

If `AUTONOMY_STATE.owner_decision_required == true`:
  Scheduled wake → check if state has changed → if not, EXIT silently.

If `AUTONOMY_STATE.runner_status == "BLOCKED"`:
  Scheduled wake → verify blocker still exists → if resolved, clear and resume.
  If still blocked → EXIT silently.

---

## Completion

When ALL Master Roadmap phases are independently PASS:

1. Set `AUTONOMY_STATE.gate_status = COMPLETE`
2. Set `AUTONOMY_STATE.runner_status = COMPLETE`
3. Create `.ai/reports/FINAL_PROJECT_ACCEPTANCE_REPORT.md`
4. Run final regression + E2E
5. Create final commit tagged `final-acceptance`
6. Update Windows Task Scheduler task to disabled state
7. Do NOT invent new roadmap phases

---

## Heartbeat Protocol

Every 5 minutes of active work:
```javascript
const lock = JSON.parse(fs.readFileSync('.ai/runtime/ACTIVE_RUN.json'));
lock.last_heartbeat_at = new Date().toISOString();
fs.writeFileSync('.ai/runtime/ACTIVE_RUN.json', JSON.stringify(lock, null, 2));
```

---

## Safety Absolute Rules

NEVER:
- migrate:fresh / db:wipe on non-disposable databases
- DROP DATABASE
- git push --force / git push -f
- git reset --hard HEAD~N (more than 1 commit)
- rm -rf on broad paths
- expose .env contents in commits or logs
- weaken or skip tests to obtain PASS
- self-approve implementation (implementer ≠ gatekeeper)
- invent phases beyond MASTER_IMPLEMENTATION_ROADMAP.md
- cross-center data access
- trust client-supplied financial amounts without server validation
