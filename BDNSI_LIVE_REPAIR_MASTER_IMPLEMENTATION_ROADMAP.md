# BDNSI Post-Deployment Live Repair Master Implementation Roadmap — Round 2

**Project:** BDNSI  
**Repository:** `fastify11-svg/BDNSI`  
**Canonical live/test environment:** `https://nenobet.live`  
**Execution engine:** Gemini 3.1 Pro High / Google Antigravity IDE  
**Purpose:** Precise, evidence-gated implementation specification for repairing the remaining post-deployment live acceptance failures without reopening the completed A–U roadmap.

---

## 0. EXECUTION CONTRACT — NON-NEGOTIABLE

This is a **POST-CLOSURE LIVE ACCEPTANCE REPAIR — ROUND 2** task. It is not a new product phase and must not reopen completed Phases A–U.

The execution agent MUST obey all of the following:

1. **MySQL is canonical.** Do not switch test execution to SQLite and do not add SQLite-only workarounds.
2. **GitHub Actions is CI only.** Never add, restore, or use GitHub-based SSH deployment.
3. **Deployment remains `ANTIGRAVITY_DIRECT_SSH -> nenobet.live`.**
4. Never run `migrate:fresh`, `db:wipe`, `DROP`, `TRUNCATE`, mass reset, or any destructive live database operation.
5. Never extract, display, log, commit, or copy plaintext passwords, API keys, payment credentials, SMS credentials, SSH credentials, tokens, or secrets.
6. Never perform real-money transactions during verification.
7. Never rewrite or delete legitimate live business data merely to make a test pass.
8. Prefer the smallest root-cause fix. No broad redesign, speculative refactor, framework replacement, or unrelated cleanup.
9. Every repair lane has an **Evidence Gate**. The agent must prove the actual cause before implementing a hypothesis.
10. A blocked lane must not stop unrelated repair lanes unless it is a true dependency.
11. Preserve historical acceptance reports. New evidence should be appended or written to new post-repair reports rather than rewriting history.
12. Do not declare **PRODUCTION READY** because code compiles, tests pass, CI is green, or deployment succeeds. Production-readiness requires a fresh hands-on live browser acceptance with the required positive workflows.

---

## 1. EVIDENCE HIERARCHY

When evidence conflicts, use this priority order:

1. **Actual post-deployment hands-on browser evidence from `nenobet.live`.**
2. **Actual server exception/log evidence and read-only live schema inspection.**
3. **Current `main` implementation, migrations, models, services, routes, and tests.**
4. **The supplied Gemini root-cause audit.**
5. **Hypotheses/guesses.** Guesses must never directly drive a code or schema change.

The supplied diagnostic audit is useful but is **not authoritative where it conflicts with the browser report or where it remapped IDs**.

---

## 2. REQUIRED AUDIT RECONCILIATION BEFORE ANY EDIT

Create/update a working note under `.ai/` named:

`POST_DEPLOYMENT_LIVE_REPAIR_ROUND2_WORKLOG.md`

Before modifying application code, record the following reconciliation exactly and then update each item as evidence is collected.

| Item | Authoritative live symptom | Diagnostic-audit claim | Initial confidence / treatment |
|---|---|---|---|
| LIVE-001 | Center Create email clears immediately; Center cannot be created | Browser password-manager/autofill interference | **UNVERIFIED.** Must reproduce and trace React state/events before changing autocomplete behavior. |
| LIVE-004 | Session Save returns HTTP 500 | Legacy `start_date` / `end_date` NOT NULL schema remains on live | **UNVERIFIED until actual exception + schema confirm it.** |
| LIVE-005 | Payment and SMS provider definitions are absent | Audit discusses Center Hub Orders/Auth guard 500 instead | **MIS-MAPPED.** The real LIVE-005 was not diagnosed by the audit. Diagnose provider bootstrap separately. |
| LIVE-007 | Six policy switches visible; Center-specific pricing, dues, ledger navigation missing | Audit discusses District/Thana serialization | **MIS-MAPPED.** Finance UI parity still requires diagnosis. District/Thana is a separate acceptance blocker. |
| LIVE-008 | Sidebar clicks from `/admin/session` do not navigate | Audit discusses SubAdmin provisioning/role | **MIS-MAPPED.** Sidebar interception still requires diagnosis. Staff/SubAdmin is a separate acceptance blocker. |
| LIVE-010 | CRM Lead Phone clears immediately; Lead cannot be created | Browser password-manager/autofill interference | **UNVERIFIED.** Must trace state/events and compare with LIVE-001. |
| LIVE-011 | `/admin/center-risk` returns HTTP 500 | `StudentDocument::whereIn('center_id', ...)` against table without `center_id` | **HIGHLY PLAUSIBLE only if current code/schema + actual exception confirm.** |
| District/Thana blocker | Student/related forms expose unusable location options | `mapWithKeys()` payload omits `id` while frontend expects `d.id` | **PLAUSIBLE. Verify current payload shape and live/reference data.** |
| Restricted Staff/SubAdmin blocker | No safe restricted DEMO identity workflow available in tested UI | Missing `sub_admin` Laratrust role may cause provisioning 500 | **UNVERIFIED and separate from LIVE-008.** Confirm current role invariant, seeders, controller, and actual error. |
| Center Hub Orders/Auth hypothesis | Not established as LIVE-005 by the authoritative browser report | Missing `center` guard / CenterScope fallback loop | **AUXILIARY HYPOTHESIS ONLY.** Do not alter auth guards unless independently reproduced/proven. |

### Mandatory stop condition

If a root cause from the diagnostic audit is contradicted by current code, live schema, or the real exception, **do not implement the audit's suggested fix**. Record the contradiction and repair only the proven root cause.

---

## 3. REGRESSION FREEZE — CURRENT LIVE PASS ITEMS

The following previously failing items are now live PASS and must remain protected:

- LIVE-002 — Admin Result renders without 500.
- LIVE-003 — Student Create renders without 500.
- LIVE-006 — plaintext Center password exposure removed.
- LIVE-009 — Verified Center CTA routes to the correct Center login flow.
- LIVE-012 — public/Admin student count contradiction removed.
- LIVE-013 — literal `@routes` is no longer rendered.

Before major implementation, identify existing automated coverage for these. Where coverage is absent and a small regression test is practical, add it during the related repair lane. Never reintroduce plaintext credential display for convenience.

---

# 4. REPAIR LANES

Execute the lanes in the dependency-aware order in Section 5. Each lane has four gates:

- **Evidence Gate** — prove root cause.
- **Implementation Gate** — smallest correct repair.
- **Regression Gate** — targeted tests pass on MySQL/frontend as applicable.
- **Acceptance Gate** — define what the next browser test must prove.

---

## LANE A — LIVE-001 + LIVE-010: CONTROLLED INPUTS CLEARING

### Scope

- Center Create email field.
- Sales CRM Lead phone field.

The diagnostic audit names candidate frontend paths such as `Admin/Center/Create.jsx` and `Leads/Index.jsx`. Treat these as **candidate paths from the audit**; verify their exact current repository locations before editing.

### Evidence Gate A1 — reproduce without assumptions

For each field, inspect the exact current component and record:

- `value` binding.
- `name`, `id`, and `type`.
- `onChange` / `onInput` / shared handler.
- Inertia/React `useForm` state key.
- any `useEffect` that writes/reset fields.
- validation error effect.
- normalization function.
- component `key` that may cause remount.
- modal open/close reset logic.
- props rehydration or server-provided defaults.
- browser autofill/autocomplete attributes.

Then reproduce while observing both DOM value and React/form state.

Attempt, where tooling permits:

1. Normal typing.
2. Paste.
3. Browser context with password manager/autofill disabled or clean context.
4. Dispatch/input behavior in an automated browser test.

The objective is to distinguish:

- application state resets,
- normalization rejecting the input,
- remount/reset,
- shared handler cross-wiring,
- or genuine browser autofill interference.

### Implementation Gate A2

**If application state/handler bug is proven:** repair the handler, mapping, normalization, or reset lifecycle at the source.

**If browser autofill interference is actually proven:** use semantically correct autocomplete behavior. Do not blindly set ordinary email/phone fields to `autocomplete="new-password"` merely to defeat the browser. Prefer standards-consistent values such as `email` / `tel`, or `off` only where justified by the demonstrated application behavior.

Do NOT use:

- delayed `setTimeout` value restoration,
- polling,
- random forced rerenders,
- uncontrolled DOM mutation fighting React,
- globally disabling autofill without evidence.

### Regression Gate A3

Add/adjust browser/component tests that actually type values and assert persistence:

**Center:**
- type a valid reserved test email,
- change focus to another field,
- assert email still equals input,
- submit a valid DEMO payload in isolated test DB,
- assert validation does not turn a valid email into blank.

**Lead:**
- type a valid test Bangladesh-format phone supported by existing validation,
- blur/focus another field,
- assert phone persists,
- submit and assert Lead creation succeeds.

If LIVE-001 and LIVE-010 prove to have different causes, keep their fixes/tests separate. Do not force a shared abstraction simply because the symptoms look similar.

### Acceptance Gate A4

Next live browser test must successfully create:

- `DEMO-UAT CENTER A`
- `DEMO-UAT CENTER B`
- `DEMO-UAT LEAD ...`

A field merely remaining visible is insufficient; successful submit/persistence is required.

---

## LANE B — LIVE-004: SESSION SAVE HTTP 500

### Evidence Gate B1 — capture the real failure

Do not code from the presumed `start_date/end_date` explanation until verified.

Using safe diagnostics only:

1. Identify the exact route/controller store action.
2. Capture the precise current exception from application/server logs without exposing secrets.
3. Inspect the live `sessions` table schema read-only using framework schema introspection or safe `INFORMATION_SCHEMA` / `SHOW CREATE TABLE` equivalent.
4. Compare live schema against the full migration history and current canonical schema.
5. Inspect Session model fillable/casts/defaults.
6. Inspect current validation and exact insert/update payload.
7. Confirm whether MySQL Strict Mode is involved.

Explicitly check:

- whether `start_date` exists;
- whether `end_date` exists;
- nullability/defaults if they exist;
- `duration` type;
- `exam_date`;
- `result_published_date`;
- timestamps and any other required column omitted from the payload.

### Implementation Gate B2

If evidence confirms legacy `start_date`/`end_date` columns are still present and NOT NULL contrary to the canonical schema, create a **forward-only, safe, idempotent reconciliation migration**.

Preferred order:

1. If canonical schema clearly removed obsolete columns and current code no longer uses them, safely reconcile toward the canonical schema using supported MySQL operations.
2. If cross-version hosting compatibility prevents safe removal in this repair, a documented nullable transitional reconciliation may be acceptable only if it preserves semantics and does not hide another required field.
3. Do **not** invent meaningless model-observer default dates just to satisfy stale columns unless the business domain actually defines those values. A fake default is not a schema repair.

If the actual exception points somewhere else, fix only that proven cause.

### Regression Gate B3

Run on MySQL:

- fresh canonical migration + Session create test;
- Session update test;
- a migration-compatibility test or fixture representing the relevant legacy schema if technically practical;
- validation tests for duration/date fields;
- existing Session-related tests.

No SQL-mode disabling to make the test green.

### Acceptance Gate B4

Live browser must create `DEMO-UAT SESSION 2026`, see it in the list, reopen/edit it, and encounter no 500.

---

## LANE C — LIVE-011: CENTER RISK HTTP 500

### Evidence Gate C1

Verify all three before changing the query:

1. The actual live exception contains an unknown/missing column or equivalent error.
2. Current `CenterRiskService` (or actual current service) queries `student_documents.center_id` directly or otherwise references a nonexistent field.
3. Current `student_documents` schema truly does not contain that column, while the correct Center relationship is reachable through Student or another canonical relation.

### Implementation Gate C2

If confirmed, repair the batch query using the canonical relationship rather than adding a duplicate `center_id` column solely for this report.

Preferred design properties:

- derive Center ownership through Students (join/relationship/subquery as appropriate);
- retain batching/aggregate behavior;
- avoid N+1 queries;
- preserve tenant boundaries;
- handle Centers with zero students/documents;
- handle null/missing document rows;
- preserve current risk semantics and thresholds;
- do not alter risk business rules unless a separate policy decision is required.

### Regression Gate C3

Add service/feature tests covering:

- zero Centers / zero data;
- active Center with no students;
- Center with students but no documents;
- Center with documents;
- multiple Centers with independent aggregates;
- no cross-center contamination;
- expected response/page renders without SQL errors on MySQL.

### Acceptance Gate C4

`/admin/center-risk` must render live, and its visible active/approved Center population must be reconcilable with Center Directory according to existing product rules.

---

## LANE D — LIVE-005: PAYMENT + SMS PROVIDER DEFINITIONS ABSENT

**Important:** The supplied root-cause audit did not actually diagnose the authoritative LIVE-005. Diagnose it now.

### Evidence Gate D1

Trace separately for Payment and SMS:

- route;
- controller;
- model;
- table/schema;
- expected provider-name/type/status fields;
- existing seeders/bootstrap routines;
- configuration files;
- deployment provisioning docs/scripts;
- UI behavior when table contains zero rows;
- whether credentials are stored in DB or environment.

Classify records into exactly these categories:

1. **Reference/provider definition metadata** — names, driver identifiers, enabled capability metadata that are safe to bootstrap idempotently.
2. **Secrets/configuration values** — merchant keys, API secrets, tokens, sender credentials; never invent or commit these.
3. **Business/transaction data** — never seed to live to satisfy acceptance.

### Implementation Gate D2

If current architecture clearly expects provider definition rows and existing safe seeders/bootstrap data already define them, ensure deployment/bootstrap can create those reference rows **idempotently** without overwriting real configuration.

If a new targeted reference-data seeder is needed, it must:

- contain no credentials;
- use stable keys / update-or-create semantics only where safe;
- preserve any existing configured row;
- never blank existing secrets;
- be independently invokable during deployment;
- be covered by tests.

The UI must distinguish "provider exists but credentials/config are incomplete" from "no provider definition exists" without leaking secrets.

If product-specific gateway selection requires an owner decision, mark `BLOCKED_POLICY_DECISION` rather than inventing a provider.

### Regression Gate D3

Tests must prove:

- reference bootstrap on empty DB;
- rerunning bootstrap is idempotent;
- existing provider configuration is not overwritten;
- no secret is present in source/fixtures/output;
- settings pages render provider definitions;
- missing external credentials result in safe configuration-required status rather than 500.

### Acceptance Gate D4

Live UI should show the expected safe provider definitions. If actual test credentials remain intentionally absent, payment/SMS transaction testing should be recorded as `BLOCKED_CONFIGURATION_REQUIRED`, not FAIL due to missing definitions and not fake PASS.

---

## LANE E — DISTRICT / THANA REFERENCE DATA + SERIALIZATION BLOCKER

This is a separate acceptance prerequisite, not LIVE-007.

### Evidence Gate E1

Determine whether the failure is **data absence**, **serialization loss**, **frontend mapping**, or a combination.

Inspect:

- District table row count (read-only live inspection).
- Thana/Upazila table row count.
- controller payload structure.
- `mapWithKeys()` or equivalent transformations.
- exact frontend option loop.
- dependent District -> Thana filtering key.

If the backend payload uses IDs only as object keys but `Object.values(...)` discards those keys while frontend expects `item.id`, record that as confirmed.

### Implementation Gate E2

If serialization is the cause, ensure each serialized option contains its own stable `id` plus relationship IDs and display name. Keep API/view-model shape consistent across Center, Student, Staff/SubAdmin, and other forms using the same reference data.

If tables are empty, locate the canonical existing reference-data source/seeder/import. Use only authoritative project data. Do not invent a Bangladesh District/Thana dataset ad hoc inside application code.

Bootstrap must be idempotent and must not overwrite legitimate edited business records if these tables are user-managed.

### Regression Gate E3

Tests/browser checks:

- District options have non-empty values.
- Selecting District exposes correct Thana/Upazila options.
- selected IDs submit correctly.
- Student Create still renders (protect LIVE-003).
- Center Create location inputs work.

### Acceptance Gate E4

A live DEMO Student must be able to select a valid District and Thana and submit those values through the actual form.

---

## LANE F — LIVE-008: SIDEBAR NAVIGATION INTERCEPTED FROM SESSION PAGE

**Important:** The diagnostic audit did not diagnose this actual LIVE-008.

### Evidence Gate F1

Reproduce exactly:

1. Visit `/admin/session`.
2. Open Session modal/action surface.
3. Close it normally.
4. Click Result.
5. Click Sales CRM.
6. Click Commissions or another later module.

Inspect:

- remaining modal/backdrop DOM;
- iframe/action surface;
- invisible overlay;
- `pointer-events`;
- `z-index`;
- modal lifecycle cleanup;
- focus trap;
- `preventDefault()` / propagation handlers;
- SPA/Inertia navigation handlers;
- browser console errors;
- whether failure exists before opening modal or only after it;
- whether Escape/close leaves stale state.

Identify the exact DOM element or event handler intercepting the click.

### Implementation Gate F2

Fix the component/modal lifecycle root cause. The correct fix should remove/deactivate the stale intercepting layer when the modal closes and restore normal navigation semantics.

Do not globally raise sidebar `z-index` or disable pointer events across the application unless evidence proves that is the canonical lifecycle fix. Avoid CSS arms races that hide stale overlays.

### Regression Gate F3

Add Playwright/E2E coverage:

- navigate to Session;
- open/close modal;
- click Result and assert URL/page heading;
- return to Session;
- repeat and click Sales CRM;
- repeat and click Commissions;
- verify normal clicks, not direct `page.goto()` substitutions.

### Acceptance Gate F4

Actual browser clicks from Session must navigate; direct URL success is not enough.

---

## LANE G — LIVE-007: PHASE-C FINANCIAL UI PARITY

**Important:** The supplied diagnostic audit mislabeled District/Thana as LIVE-007. The real LIVE-007 remains unresolved until this lane is completed.

### Evidence Gate G1 — architecture map

Map existing functionality from UI down to domain services for:

- Center-specific pricing;
- orders;
- dues / outstanding balance;
- ledger;
- credit enabled;
- credit limit;
- registration without payment;
- result without payment;
- certificate without payment;
- auto restriction.

For each capability record:

`route -> middleware/RBAC -> controller -> service -> model -> table -> view/component`

Classify each into:

- **A: Backend exists; UI/navigation missing.**
- **B: Partially implemented/wired.**
- **C: Missing implementation despite documented domain requirement.**
- **D: Exists but inaccessible because of incorrect RBAC/navigation.**
- **E: Requires unresolved business policy.**

### Implementation Gate G2

For A/D: expose/wire the existing feature using current routes/services and correct authorization. Do not duplicate business logic in controllers/components.

For B: complete wiring to the existing service contract, keeping financial mutation atomic and authorized.

For C: implement only if the already-established project domain documentation/services clearly define the semantics. If semantics are not defined, stop that subfeature as `BLOCKED_POLICY_DECISION`.

For E: do not invent pricing/payment/credit rules.

Required UI outcome for an authorized Admin Center profile/edit area:

- clear access to center-specific pricing;
- current due / financial summary where supported;
- ledger history/navigation;
- existing six policy controls preserved.

### Regression Gate G3

Tests must cover, as applicable:

- authorized Admin visibility/access;
- restricted role denial;
- center-specific price fallback behavior;
- due/ledger reads scoped to correct Center;
- financial values not mutated by merely opening UI;
- existing credit policy tests remain green.

### Acceptance Gate G4

The next browser reacceptance must be able to reach Center-specific pricing, dues and ledger from the expected Center workflow without guessing hidden URLs.

---

## LANE H — RESTRICTED STAFF / SUB-ADMIN PROVISIONING BLOCKER

This is an acceptance prerequisite and is separate from LIVE-008.

### Evidence Gate H1

Verify:

- current Laratrust roles and permissions migrations/seeders;
- whether `sub_admin` is an established required role name in code/tests;
- current `SubadminController@store` behavior;
- whether `attachRole('sub_admin')` or equivalent assumes an existing role;
- whether live role definition is absent;
- actual exception if the current UI produces a 500;
- whether Admin UI intentionally allows or forbids creating restricted portal identities.

### Implementation Gate H2

If `sub_admin` is unquestionably an existing product invariant and the only problem is missing **reference role data**, add/use a safe idempotent role bootstrap that creates only the required canonical role/permissions already defined by the application.

Do not silently skip role attachment when the role is missing; that could create an accidentally unprivileged or incorrectly privileged account.

If the permissions set or provisioning policy is not established in existing code/tests/documentation, mark `BLOCKED_POLICY_DECISION` instead of inventing access rights.

Never expose generated passwords in reports.

### Regression Gate H3

If evidence supports implementation:

- provisioning creates a restricted test identity correctly;
- restricted identity cannot access finance/settings/admin-only routes defined as forbidden;
- permitted routes work;
- existing Admin retains required access;
- no role escalation through direct URL.

### Acceptance Gate H4

A safe DEMO restricted identity must exist for browser RBAC verification, or the final report must carry an explicit policy/configuration blocker.

---

## LANE I — AUXILIARY CENTER HUB ORDERS / AUTH-GUARD HYPOTHESIS

The diagnostic audit labeled an Orders/Auth issue as LIVE-005, but the authoritative LIVE-005 was missing Payment/SMS provider definitions.

Therefore:

- do **not** add a new `center` guard merely because the audit suggested it;
- do **not** rewrite `CenterScope` based only on speculation;
- do **not** broaden scope into auth architecture without evidence.

Only activate this lane if one of the following occurs:

1. a current automated test reproduces a real Orders/CenterScope failure;
2. post-repair browser acceptance reproduces a Center Hub Orders 500;
3. a verified server exception proves auth/provider resolution is wrong.

If activated, first map actual guard/provider architecture and tenant identity model, then produce a small supplemental evidence note before modifying anything.

---

# 5. REQUIRED EXECUTION ORDER

Use this order because it unlocks the positive end-to-end acceptance chain while keeping independent infrastructure defects separable:

1. **Baseline / evidence capture + regression freeze.**
2. **Lane A — LIVE-001 + LIVE-010 input persistence.** Center creation is a critical dependency.
3. **Lane B — LIVE-004 Session save.** Session is a critical Student dependency.
4. **Lane C — LIVE-011 Center Risk 500.** Independent P1/P2 runtime failure; fix while evidence is fresh.
5. **Lane D — LIVE-005 provider reference definitions.** Separate provider metadata from credentials.
6. **Lane E — District/Thana.** Required before positive Student registration.
7. **Lane F — LIVE-008 sidebar navigation.** Browser usability regression.
8. **Lane G — LIVE-007 financial UI parity.** Required for finance acceptance after a DEMO Center exists.
9. **Lane H — Staff/SubAdmin provisioning.** Implement only if security/policy evidence is sufficient.
10. **Lane I only if independently proven.**
11. Full local/MySQL verification.
12. GitHub CI.
13. Protected direct-SSH deployment only after green CI + owner approval.
14. Independent hands-on live browser reacceptance.

A lane may be reordered only if a concrete dependency discovered in evidence requires it; record the reason in the worklog.

---

# 6. COMMIT/Diff STRATEGY

Prefer small, reviewable commits with one root cause or tightly related pair per commit.

Suggested commit grouping (actual messages may differ):

1. `test: lock live repair regression cases`
2. `fix: preserve center email and lead phone form state` — only if evidence proves a genuinely shared cause; otherwise separate.
3. `fix: reconcile session persistence with canonical schema`
4. `fix: correct center risk document aggregation`
5. `fix: bootstrap safe payment and sms provider definitions`
6. `fix: restore district and thana option identifiers`
7. `fix: clean session modal overlay navigation lifecycle`
8. `fix: expose center pricing dues and ledger workflows`
9. `fix: restore canonical restricted role provisioning` — only if evidence/policy permits.
10. `docs: update round 2 repair evidence and acceptance readiness`

Do not mix large formatting changes, dependency upgrades, generated artifacts, or unrelated refactors into these commits.

---

# 7. AUTOMATED VERIFICATION GATES

Before requesting deployment, all applicable gates must pass.

## PHP / Laravel / MySQL

- Full PHP regression suite.
- Tests explicitly running against MySQL.
- Assert effective DB driver is MySQL in CI.
- Full migrations on clean test DB.
- Targeted migration compatibility test where needed for Session repair.
- No `SET SESSION sql_mode=''` bypass.
- No SQLite override in `phpunit.xml` or workflow.

## Frontend

- dependency install with lockfile-respecting command;
- frontend unit/component tests where present;
- production build;
- no console/build errors introduced.

## Browser / Playwright

At minimum automate what can be deterministic locally/CI:

- Center email persists during typing/blur/submit.
- Lead phone persists during typing/blur/submit.
- Session form submit succeeds against test environment.
- Session modal close restores actual sidebar click navigation.
- District/Thana option values are usable.
- known LIVE-002/003/009/012/013 presentation paths do not regress where testable.

## Security

- no plaintext credential output;
- no secrets in diffs/fixtures/logs;
- authorization tests remain green;
- tenant-scoped queries remain scoped;
- reference seeders do not overwrite credentials or business data.

---

# 8. STATE / REPORT RECONCILIATION

After code verification but before deployment:

- Keep Phases A–U closed.
- Current lane should be represented as **POST-CLOSURE LIVE ACCEPTANCE REPAIR — ROUND 2**.
- Reconcile the active `.ai` execution/state metadata to the actual latest commit/CI without rewriting historical milestones.
- `.ai/TASK_QUEUE.md` must not be changed to reopen completed roadmap phases.
- Historical pre-repair and first post-deployment REWORK reports must be preserved.
- Create a new repair-round evidence report rather than falsely converting the previous REWORK evidence to PASS.

Recommended report:

`.ai/LIVE_ACCEPTANCE_REPAIR_ROUND2_REPORT.md`

Include per lane:

- evidence gate result;
- proven root cause;
- files changed;
- migration/seeder impact;
- tests added/changed;
- targeted test result;
- full-suite result;
- residual blocker.

---

# 9. DEPLOYMENT GATE

Do not deploy until all of the following are true:

1. latest changes committed and pushed to `main`;
2. latest GitHub CI for the exact commit is GREEN;
3. no known new regression is hidden behind a skipped failing test;
4. owner deployment approval has been obtained where the workflow requires it;
5. deployment method is confirmed as `ANTIGRAVITY_DIRECT_SSH`;
6. target is exactly `nenobet.live`;
7. any required schema migration is forward-only and reviewed as non-destructive;
8. any required reference-data bootstrap is explicit, targeted, idempotent, credential-free, and preserves existing real configuration.

During deployment:

- verify exact commit SHA being deployed;
- use maintenance/backup practices already established by the project without destructive resets;
- run only necessary forward migrations;
- run only the specifically approved reference-data bootstrap needed by the repair;
- do not run generic seeders that could alter unrelated live business data;
- confirm `APP_URL`/environment target remains `nenobet.live` without printing secrets;
- perform basic HTTP/application smoke checks.

Deployment success is **not** final acceptance.

---

# 10. POST-DEPLOYMENT HANDS-ON LIVE ACCEPTANCE ORDER

The independent browser workflow must test the actual UI in this order so later tests are not attempted before prerequisites exist.

## Gate 1 — Core prerequisite creation

1. Create `DEMO-UAT CENTER A`.
2. Create `DEMO-UAT CENTER B`.
3. Create `DEMO-UAT SESSION 2026`.
4. Verify District/Thana usable.
5. Create `DEMO-UAT STUDENT A` under Center A.
6. Create `DEMO-UAT STUDENT B` under Center B.

If any prerequisite fails, record the failure but continue unrelated LIVE-item checks.

## Gate 2 — Navigation + Admin runtime

- `/admin/result` remains healthy.
- `/admin/center-risk` renders.
- Session sidebar click navigation works.
- CRM Lead with phone can be created.
- plaintext password remains absent.
- `@routes` remains absent.
- public/Admin student count remains coherent.

## Gate 3 — Center finance

Using DEMO records only:

- center-specific pricing access;
- due/ledger navigation;
- credit limit settings;
- registration/result/certificate payment-policy switches;
- order creation where supported;
- within-limit behavior;
- over-limit rejection;
- ledger/due effects;
- payment only through a safe non-production mechanism if configured.

If external credentials are absent, mark transaction-dependent tests `BLOCKED_CONFIGURATION_REQUIRED`; do not simulate real payment success by editing live DB rows.

## Gate 4 — Documents

For DEMO Student A:

- ID Card;
- Registration Card;
- Admit Card;
- generate/view/download;
- correct student/Center information;
- authorization.

## Gate 5 — Result + Certificate

- create/publish DEMO result;
- test allowed and denied payment/credit policy cases;
- issue/generate DEMO certificate;
- verify access/download gating.

## Gate 6 — Public verification

Test both:

- valid DEMO result/certificate;
- invalid `DEMO-UAT-NOTFOUND` values.

## Gate 7 — RBAC

If a safe restricted DEMO identity was provisioned:

- permitted pages succeed;
- finance/settings/admin-only routes deny as expected;
- direct URL attempts do not bypass authorization.

## Gate 8 — Tenant isolation

Center A must not be able to read Center B:

- Students;
- documents;
- orders;
- pricing;
- ledger.

Use safe read/access-denial testing only.

## Gate 9 — Mobile/UI

Where viewport controls allow:

- public mobile navigation/forms;
- verification pages;
- important Admin pages;
- no debug/template leakage.

---

# 11. DEFINITION OF DONE

Round 2 is complete only when:

1. Proven root causes—not unverified audit hypotheses—have been repaired.
2. All originally live-PASS items remain PASS.
3. LIVE-001, 004, 005, 007, 008, 010, 011 have fresh live outcomes after deployment.
4. Core DEMO prerequisites Center A/B + Session + Student A/B succeed.
5. Positive end-to-end flows are executed far enough to test finance, documents, result, certificate, verification, RBAC and tenant isolation, except explicitly documented external-configuration/policy blockers.
6. Full MySQL CI is green.
7. Deployed SHA matches latest verified green `main`.
8. No destructive DB operation, credential exposure, GitHub SSH deployment, or real-money test occurred.
9. A new post-deployment browser report is produced.
10. Final browser verdict is **`PASS — LIVE ACCEPTANCE COMPLETE`** before anyone declares the system production-ready.

A code-only or CI-only PASS is not Definition of Done.

---

# 12. GEMINI 3.1 PRO HIGH EXECUTION PROTOCOL

The execution model should behave as a constrained implementation engine rather than independently redesigning the solution.

For every lane:

1. Read this roadmap completely before acting.
2. Read the authoritative live acceptance evidence and the diagnostic audit.
3. Inspect current `main`; do not assume audit file paths are still exact.
4. Write an **Evidence Gate Result** in the Round-2 worklog before editing.
5. State confidence as `CONFIRMED`, `HIGH`, `MEDIUM`, or `UNKNOWN`.
6. If `UNKNOWN`, gather more non-destructive evidence; do not patch blindly.
7. Make the minimum root-cause change.
8. Add the smallest meaningful regression coverage.
9. Run targeted tests immediately.
10. Continue unrelated lanes if one lane is blocked.
11. After all implementable lanes, run full MySQL/frontend/E2E verification.
12. Review the final diff for secrets, destructive migration behavior, broad scope creep, accidental roadmap reopening, and deployment-workflow changes.
13. Commit/push only verified changes.
14. Wait for the exact latest CI commit to become green.
15. Do not deploy until the green-CI/approval gate is satisfied.
16. Deploy only by Antigravity direct SSH.
17. Never infer live acceptance from local tests; require independent browser evidence.

### Required behavior when evidence contradicts this roadmap or the audit

The roadmap intentionally contains conditional branches. If actual evidence shows a different root cause:

- stop that proposed implementation;
- document the evidence;
- repair the real cause if it stays within existing requirements and safety constraints;
- if the necessary change would create a new business/security policy, mark `BLOCKED_POLICY_DECISION` and continue unrelated work.

### Forbidden shortcuts

- autocomplete hacks without proving autofill caused LIVE-001/010;
- fake Session defaults solely to satisfy stale schema;
- adding duplicate denormalized columns solely to avoid a correct relationship query;
- inventing payment/SMS credentials;
- assigning permissive roles because a role row is missing;
- global CSS/z-index hacks without identifying the Session overlay lifecycle defect;
- changing auth guard architecture because of the mis-mapped LIVE-005 hypothesis;
- disabling failing tests;
- switching CI to SQLite;
- replacing live browser acceptance with curl or source inspection.

---

# 13. FINAL EXECUTION COMMAND FOR ANTIGRAVITY / GEMINI

Use the following instruction after this file is placed in the repository:

> Read `BDNSI_LIVE_REPAIR_MASTER_IMPLEMENTATION_ROADMAP.md` completely before modifying anything. Execute it in the stated dependency order. Treat every Evidence Gate, safety rule, stop condition, MySQL requirement, regression gate, CI gate, and deployment gate as mandatory. The supplied root-cause audit contains ID remapping and hypotheses, so do not implement a proposed cause until current code/server/schema evidence confirms it. Do not broaden scope, reopen Phases A–U, invent business/security policy, expose credentials, alter legitimate live business data, or use destructive database operations. Continue unrelated lanes when one is blocked. GitHub Actions remains CI only; deployment remains ANTIGRAVITY_DIRECT_SSH to `nenobet.live`. Report exact evidence, files changed, tests, commits, CI status, blockers, and deployed SHA. Do not declare Production Ready until a separate hands-on post-deployment browser reacceptance returns `PASS — LIVE ACCEPTANCE COMPLETE`.

---

## Appendix A — Why the diagnostic audit must not be executed literally

The diagnostic audit is valuable, but three ID mappings do not match the authoritative post-deployment browser failures:

- Its **LIVE-005** section discusses Center Hub Orders/Auth guards, while live LIVE-005 is missing Payment/SMS provider definitions.
- Its **LIVE-007** section diagnoses District/Thana option serialization, while live LIVE-007 is missing Center-specific pricing/dues/ledger UI. District/Thana is still important, but it is a separate blocker.
- Its **LIVE-008** section diagnoses SubAdmin role provisioning, while live LIVE-008 is Session-page sidebar click interception. Restricted-role provisioning is also important, but separate.

Additionally, the password-manager explanation for LIVE-001/LIVE-010 and the legacy-column explanation for LIVE-004 are hypotheses until runtime evidence confirms them. This roadmap therefore converts those proposed causes into evidence-gated branches rather than blindly implementing them.

That distinction is intentional: the objective is not to make the repository resemble the audit. The objective is to make the real `nenobet.live` workflows pass safely and reproducibly.
