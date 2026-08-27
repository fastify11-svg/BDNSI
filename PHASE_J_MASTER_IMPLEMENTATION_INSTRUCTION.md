# PHASE J — MASTER IMPLEMENTATION INSTRUCTION

**Project:** BDNSI Laravel Institute Website  
**Environment:** Local development and verified staging at `https://nenobet.live`  
**Primary executor:** Google Antigravity IDE  
**Instruction mode:** Autonomous, evidence-driven, security-first, regression-safe  
**Phase boundary:** Execute Phase J only. Never begin Phase K.

---

## 1. Mission

You are responsible for completing **Phase J** of the existing BDNSI Laravel institute website from discovery through verified staging acceptance.

This is not a greenfield implementation. Phases A–I form an established, verified architectural and operational baseline. Your job is to:

1. inspect the real repository and authoritative project records;
2. discover the documented or code-evidenced intended scope of Phase J;
3. determine the true current implementation status;
4. classify every relevant capability;
5. build a dependency and risk map;
6. implement only missing, defective, unsafe, or incomplete Phase J work;
7. preserve all correct Phase A–I functionality and architectural invariants;
8. prove correctness locally before any staging change;
9. deploy only the verified delta to `nenobet.live` using the already proven Hostinger/SSH/connector workflow;
10. verify the deployed system with evidence, clean up temporary artifacts, and produce the required continuation report.

Do not guess what Phase J means. Do not invent a feature merely because it seems useful. Phase J scope must be established from authoritative repository evidence before implementation begins.

---

## 2. Authoritative Sources and Precedence

Inspect all available sources before declaring Phase J scope. At minimum, inspect:

1. `PROJECT_MEMORY.md` in full;
2. `AGENT_OPERATING_SYSTEM.md` in full;
3. repository-level and nested `AGENTS.md` files applicable to files you may change;
4. Phase A–I plans, reports, status documents, audit reports, continuation reports, templates, and acceptance evidence;
5. Phase J plans, placeholders, TODOs, issue references, roadmap entries, or specifications, if present;
6. current Laravel application code, configuration, routes, middleware, policies, services, jobs, listeners, notifications, commands, models, controllers, requests, resources, views, and frontend components;
7. database migrations, seeders, factories, constraints, indexes, and existing production-data assumptions;
8. automated tests and test helpers;
9. build configuration and frontend dependencies;
10. deployment scripts, Hostinger/SSH/connector procedures, cron definitions, queue configuration, and environment documentation;
11. the verified Phase I staging baseline at `https://nenobet.live`, using safe read-only or non-destructive checks;
12. Git history or diffs when useful for intent, without resetting or overwriting working files.

### Source precedence

Apply this order when sources conflict:

1. explicit current business requirements and approved Phase J specification;
2. security, financial-integrity, tenant-isolation, and data-integrity invariants;
3. the latest approved project memory and operating instructions;
4. verified Phase A–I acceptance reports and tests;
5. current working implementation and database schema;
6. older plans, drafts, comments, and inferred intent.

Record every material conflict and its resolution in the final report. Never silently choose a lower-authority source over a higher-authority source.

---

## 3. Non-Negotiable Safety Rules

1. **Phase A–I is a frozen verified baseline.** Preserve its working behavior unless a Phase J requirement explicitly demands a compatible extension or a proven defect requires repair.
2. **Do not invent Phase J scope.** If authoritative evidence does not establish a scope, stop and report the evidence gap.
3. **Never start Phase K**, prepare Phase K implementation, or modify the system solely for a presumed Phase K need.
4. Never run `php artisan migrate:fresh`, `db:wipe`, destructive reseeding, bulk truncation, or any equivalent destructive database command against staging or production-like data.
5. Never blindly overwrite `.env`, secrets, credentials, storage links, server configuration, cron configuration, or runtime-specific settings.
6. Never use `git reset --hard`, destructive filesystem resets, broad deletion commands, or an unverified recursive copy that can erase server or user data.
7. Do not deploy through GitHub. Use only the already proven Hostinger/SSH/connector workflow documented in the project.
8. Staging deployment must be **delta-only**: transfer or change only reviewed Phase J files, required compatible migrations, and explicitly approved configuration deltas.
9. Never make real payment transactions to test the system. Use test fixtures, database-safe simulations, mocks/fakes, or an approved provider sandbox.
10. Never expose private documents, PII, credentials, tokens, financial details, debug output, stack traces, or internal file paths.
11. Never add authentication bypasses, temporary public Artisan runners, debug routes, unrestricted diagnostic endpoints, or web-accessible database scripts.
12. Do not weaken authorization, validation, tenant scopes, policies, CSRF protection, rate limits, signature validation, storage privacy, audit trails, or financial controls merely to make a test pass.
13. Never modify historical migrations already applied on staging. Add a new forward-only, backward-compatible migration when schema change is necessary.
14. Do not automatically run `db:seed` on staging. Seed only if a specific, reviewed, staging-safe seed operation is explicitly required and proven non-destructive.
15. Never claim PASS without command output, HTTP result, test output, database evidence, or another reproducible observation.

### Genuine stopping conditions

Stop implementation and request human direction only when at least one condition is true:

- authoritative sources cannot establish the intended Phase J business scope;
- two high-authority sources impose materially incompatible requirements;
- the only viable action creates a credible risk of data loss or irreversible corruption;
- a security-critical or financial rule is genuinely ambiguous and cannot be resolved from code, schema, tests, reports, or current behavior;
- required credentials, server access, signing keys, provider sandbox access, or protected business inputs are unavailable;
- existing staging data/schema drift makes a safe forward migration indeterminate;
- the requested behavior may violate a legal, contractual, privacy, or regulated-data obligation;
- a destructive staging operation appears necessary.

Do **not** stop for ordinary engineering decisions that can be resolved safely from established code patterns, documentation, tests, Laravel conventions, or compatible conservative defaults. Document such decisions and continue.

---

## 4. Phase A–I Frozen Baseline

Treat the following as established architectural invariants. Locate and inspect their actual implementations before changing adjacent behavior:

- tenant isolation and tenant-aware data access;
- `PricingService` as the pricing authority;
- `FinancialLedgerService` as the financial-ledger authority;
- `PaymentAllocationService` for payment allocation rules;
- `RegistrationService` for registration workflows;
- `AcademicAccessPolicy` for academic authorization;
- `DocumentAccessPolicy` for private-document authorization;
- `CertificateGenerationService` for certificate generation;
- `CommissionService` for commission rules;
- `AuditLog` and the established audit trail;
- `CenterRiskService` and production RBAC for Center Risk workflows;
- workflow automation already accepted in prior phases;
- notification idempotency and duplicate-delivery prevention;
- private document storage and controlled delivery;
- public certificate verification with safe public exposure boundaries;
- established payment, balance, allocation, credit, refund, and ledger rules;
- queue execution, retry behavior, uniqueness controls, and scheduler operation;
- database integrity, financial health, reconciliation, and system-health commands;
- current admin, center, institute, student/user, and other role portal behavior;
- the verified staging security baseline, including absence of emergency migration scripts and authentication-bypass routes.

Before modifying any of these components, prove why the change is required, identify all consumers, add regression coverage, and preserve backward compatibility unless the authoritative Phase J requirement explicitly says otherwise.

Do not create parallel pricing, ledger, allocation, registration, policy, certificate, commission, audit, risk, workflow, or notification systems. Extend or call the existing authority.

---

## 5. Autonomous Execution Protocol

Execute in this order. Do not skip gates.

### Stage 1 — Establish repository truth

- Record current branch, commit, dirty working-tree state, runtime versions, database connection target, and environment identity without exposing secrets.
- Preserve unrelated existing changes; do not overwrite them.
- Identify applicable instruction files and read them fully.
- Inventory project reports, plans, templates, routes, migrations, services, policies, jobs, commands, and tests.
- Identify the exact known-good Phase A–I local and staging baseline.

### Stage 2 — Discover Phase J

- Search authoritative sources for `Phase J`, roadmap ordering, incomplete acceptance criteria, TODOs, planned modules, and dependencies.
- Trace each proposed Phase J capability to evidence.
- Separate documented scope from inference.
- If scope is supported only by weak inference, continue investigation; do not implement yet.

### Stage 3 — Audit and classify

Classify each Phase J capability as exactly one primary status:

- `COMPLETE` — implemented, integrated, tested, secure, and verified against acceptance criteria;
- `PARTIAL` — meaningful implementation exists but one or more requirements/gates are missing;
- `MISSING` — required capability is absent;
- `BROKEN` — implementation exists but does not operate correctly;
- `DUPLICATED` — overlapping implementation violates or risks violating the established authority;
- `UNSAFE` — security, financial, privacy, isolation, concurrency, or data-integrity risk exists;
- `UNVERIFIED` — implementation may exist but available evidence is insufficient.

Use secondary flags where necessary, but never hide an unsafe state behind `PARTIAL` or `UNVERIFIED`.

### Stage 4 — Map dependencies and risks

- Map routes/UI to requests/controllers/actions/services/models/jobs/events/notifications/storage/schema/commands/tests.
- Identify upstream and downstream dependencies.
- Identify tenant, role, data, financial, queue, storage, and deployment risks.
- Establish implementation order based on dependency and risk.

### Stage 5 — Implement the minimum correct delta

- Fix only `PARTIAL`, `MISSING`, `BROKEN`, `DUPLICATED`, or `UNSAFE` Phase J work.
- For `UNVERIFIED`, verify first; do not rewrite working code merely to gain confidence.
- Prefer small, reviewable, backward-compatible changes.
- Add or update tests with every behavioral fix.

### Stage 6 — Verify locally

- Run focused tests during implementation.
- Run complete regression, build, integrity, financial, reconciliation, health, and security gates.
- Do not deploy if any required local gate fails.

### Stage 7 — Deploy safely to staging

- Prepare backup and rollback artifacts.
- Review the exact delta.
- Apply only the approved delta using the proven Hostinger/SSH/connector approach.
- Run only safe forward migrations.
- execute controlled cache/build/restart steps appropriate to the verified hosting environment.

### Stage 8 — Accept and clean up

- Verify HTTPS, portals, RBAC, tenant isolation, Phase J behavior, queue/scheduler, logs, and health.
- Remove every temporary diagnostic artifact.
- Produce the required evidence-based report.
- Stop. Do not begin Phase K.

---

## 6. Phase J Scope Discovery

Create a Phase J scope evidence table before writing implementation code:

| Candidate capability | Authoritative evidence | Required behavior | Existing implementation | Confidence | Decision |
|---|---|---|---|---|---|
| `<capability>` | `<file/section/test/route/history>` | `<acceptance behavior>` | `<path or absent>` | High/Medium/Low | Include/Exclude/Blocked |

Rules:

1. Every included capability requires at least one direct authoritative source and corroborating code/schema/test evidence when available.
2. A generic roadmap label is insufficient if it does not define expected behavior. Trace it to business rules or existing architecture.
3. Do not convert unrelated technical debt into Phase J scope unless it blocks Phase J or violates a non-negotiable invariant.
4. Necessary security or integrity repairs discovered along a Phase J execution path are in scope; document why.
5. Preserve deferred work explicitly assigned to later phases.
6. If Phase J was partially implemented, recover intended acceptance criteria from tests, reports, routes, UI, schema, and service contracts before changing it.

At the end of discovery, state a concise **Phase J Scope Contract** containing:

- included capabilities;
- excluded/deferred capabilities;
- dependencies;
- acceptance criteria;
- security and data constraints;
- evidence supporting each scope decision.

Implementation is forbidden until this contract is supportable from evidence.

---

## 7. Deep Audit Checklist

Audit every discovered Phase J execution path.

### Application and domain

- business rules and state transitions;
- source-of-truth service reuse;
- validation and normalization;
- failure behavior and user-safe error responses;
- duplicate requests and replay behavior;
- partial completion and recovery;
- backward compatibility with Phase A–I;
- events, listeners, observers, side effects, and notification timing.

### Routing and authorization

- route grouping, middleware, authentication, verified-account requirements, and throttling;
- role and permission enforcement at server side;
- policy/gate coverage for record-level access;
- route-model binding scoped to the current tenant/owner;
- IDOR attempts using foreign-tenant and foreign-owner identifiers;
- admin, center, institute, staff, student/user, guest, and unauthorized outcomes;
- mass-assignment and over-posting resistance;
- safe Inertia/API props without confidential field leakage.

### Database and multitenancy

- tenant key presence and immutable ownership rules;
- tenant-scoped queries, relationships, aggregates, exports, commands, and jobs;
- foreign keys, unique constraints, check constraints, indexes, nullability, and defaults;
- migration compatibility with existing staging rows;
- query plans or likely N+1/full-scan issues;
- soft-delete and restoration behavior;
- concurrency, duplicate insertion, and race conditions;
- reconciliation between denormalized/cached values and authoritative records.

### Financial operations

- exclusive use of established financial authorities;
- immutable/double-entry or project-established ledger semantics;
- amounts stored and calculated with exact decimal/integer-minor-unit behavior, never binary floating point;
- allocation totals never exceed eligible amount;
- credit/payment/refund/commission state transitions;
- transaction boundaries and rollback behavior;
- row locking or atomic conditional update where concurrent mutation is possible;
- idempotency keys and duplicate provider callback protection;
- references between business operation, payment/allocation, and ledger/audit records;
- reconciliation and financial-health command compatibility.

### Documents and certificates

- private storage disk and non-public paths for protected documents;
- policy-controlled download/preview;
- expiring/signed access where appropriate;
- safe filename, MIME, size, extension, and content handling;
- path traversal and executable-upload protection;
- public certificate verification exposes only approved fields;
- verification identifiers are unguessable or appropriately rate-limited;
- generation remains delegated to `CertificateGenerationService`.

### Queues, scheduler, automation, and notifications

- correct queue assignment and serializable payloads;
- job idempotency, uniqueness, retry/backoff, timeout, and failure behavior;
- tenant and actor context safely restored in workers;
- no duplicate notification under retry or concurrent dispatch;
- scheduling frequency, overlap prevention, single-server semantics where required, and timezone;
- failed-job observability and safe manual retry;
- workflow state consistency across job failure and recovery.

### Auditability and observability

- successful sensitive actions and denied/failed critical actions logged where established policy requires;
- actor, tenant, action, subject, safe metadata, timestamp, and correlation/reference identity;
- no password, token, secret, raw payment credential, or unnecessary PII in logs;
- logs distinguish expected validation failures from operational failures;
- health and reconciliation commands detect Phase J failure modes.

### Frontend and UX

- role-appropriate navigation and route visibility;
- server-side authorization independent of hidden UI;
- loading, empty, success, validation, error, conflict, retry, and permission-denied states;
- pagination/filter/sort query correctness and tenant safety;
- responsive layout and accessibility basics;
- no sensitive information embedded in page source, initial props, or client logs;
- no broken Phase A–I screens or navigation.

### Performance

- N+1 query detection;
- bounded pagination and exports;
- correct eager loading and selected columns;
- indexed tenant, foreign-key, state, reference, and commonly filtered fields;
- caching only where invalidation and tenant separation are safe;
- large work moved to queues without sacrificing consistency;
- no unbounded memory use or synchronous bulk operations on request paths.

---

## 8. Gap Matrix

Create and maintain this matrix before and after implementation:

| ID | Capability | Status | Evidence | Expected behavior | Root cause/gap | Dependencies | Risk | Required action | Tests | Final evidence |
|---|---|---|---|---|---|---|---|---|---|---|
| J-001 | `<name>` | `COMPLETE/PARTIAL/MISSING/BROKEN/DUPLICATED/UNSAFE/UNVERIFIED` | `<paths/results>` | `<criteria>` | `<analysis>` | `<items>` | Critical/High/Medium/Low | `<delta>` | `<test IDs>` | `<results>` |

Rules:

- `COMPLETE` requires no rewrite; only add missing evidence if needed.
- `UNVERIFIED` must be investigated and reclassified before final completion.
- `UNSAFE`, `BROKEN`, and data-integrity gaps receive priority over cosmetic work.
- Every implemented row must link to at least one focused automated test unless automation is technically impossible; explain any exception and provide reproducible manual evidence.
- No row may be omitted from the final report.

---

## 9. Implementation Rules

1. Follow the existing project structure, naming, patterns, formatting, and service boundaries.
2. Use thin controllers. Put domain logic in the established application/domain service layer.
3. Use dedicated Form Requests or equivalent centralized validation and authorization.
4. Reuse policies and services; do not duplicate rules in controllers, jobs, frontend, or SQL.
5. Treat client-submitted price, tenant, role, commission, credit, ownership, and status values as untrusted.
6. Derive sensitive values server-side from authoritative records.
7. Use explicit database transactions for multi-write business operations.
8. Lock authoritative rows or use atomic guarded updates when concurrent actions can produce double spending, double allocation, duplicate registration, duplicate issuance, or invalid state transitions.
9. Design externally retried and user-retried operations to be idempotent.
10. Use database constraints as a final integrity boundary, not application validation alone.
11. Dispatch jobs/events after commit when they depend on committed state.
12. Ensure retrying a job cannot duplicate money movement, certificate issuance, workflow transition, commission, or notification.
13. Preserve public API/UI compatibility unless Phase J explicitly changes it; document intentional changes.
14. Add safe, forward-only migrations with indexes and constraints justified by real queries and invariants.
15. Avoid irreversible migrations. Where unavoidable and explicitly approved, provide a tested rollback/data-restoration plan.
16. Never log secrets or return raw exceptions to users.
17. Use private storage by default; public exposure requires explicit business justification.
18. Update documentation and operational commands when Phase J introduces a new observable failure mode.
19. Keep changes narrowly scoped. Do not perform broad refactors unless required to eliminate a proven duplication, defect, or security flaw.
20. Review the final diff for accidental secrets, debug code, temporary routes, generated artifacts, unrelated formatting churn, and hidden destructive operations.

---

## 10. Financial, Data, and Security Invariants

The following must remain true before and after Phase J:

### Tenant and ownership invariants

- A user can read or mutate only records allowed by role, tenant, institute/center relationship, ownership, and applicable policy.
- Changing a URL, request identifier, nested route identifier, filter, export parameter, job payload, or API field cannot cross a tenant boundary.
- Super-admin exceptions, if supported, must be explicit, authorized, auditable, and covered by tests.
- Tenant context must never be accepted solely from the browser when it can be derived from the authenticated actor or parent record.

### Financial invariants

- Pricing comes from `PricingService`.
- Ledger writes go through `FinancialLedgerService`.
- Allocations go through `PaymentAllocationService`.
- Commissions go through `CommissionService`.
- A single business action cannot create duplicate financial effects under retries, double clicks, concurrent requests, callbacks, or queue redelivery.
- Every financial mutation is atomic, traceable, and reconcilable.
- No balance or summary cache becomes an independent source of truth.
- Payment, allocation, credit, refund, reversal, and commission amounts obey existing eligibility and upper-bound rules.
- Failed transactions leave no partial ledger/allocation/business state.

### Registration, academic, document, and certificate invariants

- Registration behavior remains owned by `RegistrationService`.
- Academic access remains enforced by `AcademicAccessPolicy`.
- Protected document access remains enforced by `DocumentAccessPolicy`.
- Certificate generation remains owned by `CertificateGenerationService`.
- Public certificate verification is narrowly read-only and exposes only approved verification data.
- Private documents never become publicly addressable through predictable storage URLs.

### Audit and operational invariants

- Sensitive business changes remain attributable through `AuditLog` or the established audit mechanism.
- `CenterRiskService` remains the authority for center-risk behavior.
- Workflow automation and notifications remain idempotent.
- Queue and scheduler configuration continue to run the established jobs without overlap or duplication.
- Database-integrity, financial-health, reconciliation, and system-health checks remain passing and are expanded if Phase J creates new invariants.

---

## 11. Testing Gates

### Focused tests for every fix

For each gap, add tests covering as applicable:

- expected success path;
- validation failures and boundary values;
- unauthenticated behavior;
- forbidden role behavior;
- foreign-tenant and foreign-owner IDOR attempts;
- allowed privileged behavior;
- duplicate submission/idempotency;
- concurrent execution or locking-sensitive behavior;
- transaction rollback after an induced failure;
- queue retry, uniqueness, and failed-job behavior;
- notification deduplication;
- private-document denial and authorized delivery;
- public certificate-verification field restrictions;
- audit-log creation without secret leakage;
- database constraints and migration compatibility;
- financial reconciliation after success, reversal, and failure where applicable.

### Full regression gate

Run the repository’s complete authoritative backend test suite, not only Phase J tests. Use the documented project command; typically this may include `php artisan test` or the project-specific PHPUnit command.

Requirements:

- zero failing tests;
- zero errors;
- no skipped security-critical or financial-critical test without explicit justification;
- no environment accidentally targeting staging or production data;
- test output recorded in the final report.

If the full suite contains a pre-existing failure, prove it is pre-existing, assess whether Phase J touches its execution path, and repair it if safely within scope. A required gate still does not pass merely because the failure was pre-existing.

### Static and quality checks

Run all project-configured linters, format checks, static analysis, type checks, and security/dependency checks that are already part of the repository workflow. Do not introduce broad automatic formatting churn.

---

## 12. Frontend and Production Build Gate

1. Install dependencies only through the repository’s locked, documented process.
2. Run focused frontend tests and type/lint checks if configured.
3. Run the production build, normally:

```bash
npm run build
```

4. Require a successful exit with no unresolved module, type, bundling, or asset-manifest errors.
5. Inspect relevant Phase J pages for responsive layout, state handling, role visibility, accessibility basics, and confidential-data leakage.
6. Verify the build does not break established Phase A–I routes/pages.
7. Do not deploy unreviewed local generated files unless the proven hosting workflow explicitly requires built assets as part of the delta.

---

## 13. Local Final Gate

Staging deployment is forbidden until every applicable item passes locally:

- Phase J Scope Contract established from evidence;
- gap matrix has no `UNVERIFIED` row;
- all required Phase J gaps implemented or explicitly blocked by a genuine stopping condition;
- focused tests pass;
- full regression suite passes;
- production frontend build passes;
- database migrations reviewed for existing-data compatibility and safe rollback;
- database-integrity command passes;
- financial-health command passes;
- reconciliation command passes;
- system-health command passes;
- relevant queue and scheduler checks pass;
- RBAC, tenant-isolation, and IDOR tests pass;
- private-storage and certificate-verification tests pass where relevant;
- performance review completed with no unbounded or clearly unsafe query path;
- final diff reviewed for secrets, debug code, temporary artifacts, unrelated changes, and destructive operations;
- local evidence captured.

Use the exact command names discovered in the repository. Do not fabricate a successful command if a named check does not exist. If Phase J introduces an invariant that existing health/reconciliation tooling cannot detect, extend the appropriate command and test it.

---

## 14. Staging Deployment Protocol

### 14.1 Pre-deployment proof

Before changing staging:

1. Confirm the target is the verified `nenobet.live` staging environment, not another site.
2. Confirm HTTPS and core role portals currently respond as expected.
3. Record current deployed version or an equivalent file/hash baseline.
4. Verify the exact list of files, migrations, build artifacts, and operational commands in the Phase J delta.
5. Confirm no unrelated local file is included.
6. Review new migrations against the actual staging schema and relevant row shapes/counts using safe read-only checks.
7. Confirm backups and rollback steps are ready.

### 14.2 Required backups

Create or verify recoverable backups appropriate to the delta:

- database backup or provider snapshot before schema/data changes;
- backup of every server file that will be replaced or removed;
- current environment/configuration backup when configuration changes are approved;
- cron/queue/scheduler configuration backup if touched;
- a manifest mapping original files to backup locations and restoration commands.

Do not expose backup contents publicly. Verify backup existence and reasonable size/readability before deployment.

### 14.3 Delta-only deployment

- Use the already proven Hostinger File Manager REST API, SSH, and/or established connector approach documented by the project.
- Do not deploy through GitHub.
- Upload/change only the reviewed Phase J delta.
- Preserve server-owned files, user uploads, storage data, secrets, and runtime configuration.
- Put the application in maintenance mode only if the migration/operation genuinely requires it and a safe access strategy is established.
- Run only reviewed forward migrations using the normal non-destructive migration command.
- Never run `migrate:fresh`, `db:wipe`, broad seeding, or a destructive rollback.
- Run the minimum required cache clear/rebuild commands compatible with the server.
- Restart queue workers safely if code consumed by long-running workers changed.
- Verify scheduler and queue processes/crons remain configured exactly as intended.
- Remove maintenance mode promptly after successful deployment or rollback.

### 14.4 No live financial testing

- Do not initiate a real payment, refund, payout, charge, commission, or provider-side financial transaction.
- Use approved non-financial fixtures, a provider sandbox, or reversible application-level test records clearly isolated from real data.
- Never alter a real user’s balance or ledger merely to create evidence.

---

## 15. Post-Deployment Acceptance and Security Cleanup

Verify all applicable items on the live staging URL and record evidence.

### Platform smoke tests

- `https://nenobet.live` returns the expected HTTPS response;
- TLS/HTTPS has no browser-blocking certificate problem;
- public pages and assets load;
- admin portal login and key dashboard route work;
- center portal works for an authorized center user;
- institute/staff/student/user portals relevant to the application work;
- unauthenticated users are redirected or rejected as designed;
- expected forbidden roles receive `403` or the project’s approved denial response;
- no debug stack trace or sensitive error data is exposed.

### Phase J acceptance

- execute every Phase J acceptance criterion from the Scope Contract;
- verify success, validation, forbidden-role, unauthenticated, and foreign-tenant/IDOR behavior;
- verify state changes in the UI and authoritative database records;
- verify audit evidence;
- verify idempotency/replay behavior without creating real financial effects;
- verify relevant jobs, notifications, automation, and scheduled operations;
- verify private-document and public-certificate boundaries where involved;
- verify established Phase A–I flows adjacent to changed code.

### Operational verification

- run or safely inspect database-integrity results;
- run financial-health and reconciliation checks when permitted and safe;
- run system-health checks;
- confirm queue workers process an approved safe test job or show healthy operation;
- confirm scheduler/cron definitions are present, non-duplicated, and intended;
- review recent application, PHP, web-server, queue, scheduler, and deployment logs;
- distinguish old historical errors from new deployment-time errors;
- require no new unresolved critical exception caused by Phase J.

### Mandatory cleanup

Delete all temporary artifacts created for verification after their purpose is complete:

- temporary PHP or Artisan runner scripts;
- diagnostic endpoints and routes;
- authentication or authorization bypasses;
- temporary controllers, commands, middleware, or public files;
- exported database/debug files in web-accessible locations;
- temporary credentials or tokens;
- temporary cron entries;
- duplicate worker/scheduler entries;
- scratch uploads and test records not required as permanent fixtures;
- local/server debug flags introduced for this work.

After cleanup, re-verify that temporary URLs return `404` or the expected safe response, the application still returns `200` where expected, and queues/scheduler remain healthy.

---

## 16. Rollback Procedure

Prepare the exact rollback before deployment. If a critical acceptance check fails:

1. stop further changes;
2. prevent additional Phase J asynchronous effects if safe and necessary, without disabling unrelated production behavior;
3. enable maintenance mode only when required to protect consistency;
4. capture error/log evidence before it is lost;
5. restore changed application files from the verified backup manifest;
6. reverse schema changes only with a reviewed, data-safe rollback; otherwise deploy a forward repair;
7. restore the database backup only when authorized and when a targeted forward repair cannot safely recover consistency;
8. restore prior cron/queue/configuration state if changed;
9. clear/rebuild compatible caches and restart workers;
10. disable maintenance mode;
11. verify HTTPS, role portals, Phase A–I critical flows, integrity, financial health, reconciliation, system health, queue, scheduler, and logs;
12. document the failure, affected interval, rollback evidence, and remaining risk.

Never improvise a destructive rollback. Prefer a forward-compatible repair when reverting a migration could lose legitimate data created after deployment.

Rollback triggers include:

- data corruption or tenant leakage;
- unauthorized access or IDOR;
- incorrect financial posting/allocation/commission;
- broken authentication or critical role portal;
- unrecoverable queue duplication or workflow inconsistency;
- failed migration with uncertain partial effects;
- widespread `5xx` responses;
- a new unresolved critical exception;
- inability to prove system consistency after deployment.

---

## 17. Completion Definition

Phase J may be declared `COMPLETE` only when all statements are true:

1. Phase J scope is proven from authoritative sources and recorded.
2. Every scoped capability has a final classification of `COMPLETE`.
3. No scoped item remains `PARTIAL`, `MISSING`, `BROKEN`, `DUPLICATED`, `UNSAFE`, or `UNVERIFIED`.
4. All Phase J acceptance criteria are met.
5. All required focused and regression tests pass.
6. Production frontend build passes.
7. Database integrity, financial health, reconciliation, and system health pass.
8. Tenant isolation, RBAC, IDOR resistance, private storage, auditability, idempotency, locking, queue retry/uniqueness, and performance have been verified where applicable.
9. Safe delta deployment to `nenobet.live` is complete.
10. Post-deployment role portals and Phase J behavior pass over HTTPS.
11. No new unresolved critical log error exists.
12. Temporary scripts, routes, files, credentials, test records, and crons are removed.
13. Backup/rollback evidence is recorded.
14. The required final report is complete and evidence-based.
15. Phase K has not been started.

If any statement is false, the verdict must be `PHASE J: INCOMPLETE`, with exact blockers and safe continuation steps. Do not soften or disguise an incomplete result.

---

## 18. Exact Execution Checklist

Execute and check off in order:

### Discovery

- [ ] Record repository/environment baseline without revealing secrets.
- [ ] Read `PROJECT_MEMORY.md` fully.
- [ ] Read `AGENT_OPERATING_SYSTEM.md` fully.
- [ ] Read all applicable `AGENTS.md` instructions.
- [ ] Inventory Phase A–I reports, plans, templates, and acceptance evidence.
- [ ] Inspect Phase J references and roadmap evidence.
- [ ] Inspect routes, controllers/actions, services, policies, models, jobs, listeners, notifications, commands, UI, migrations, and tests.
- [ ] Safely inspect the verified `nenobet.live` baseline.
- [ ] Produce the Phase J scope evidence table.
- [ ] Produce the Phase J Scope Contract.

### Audit and planning

- [ ] Build the full gap matrix.
- [ ] Classify every capability.
- [ ] Trace each end-to-end execution path.
- [ ] Build dependency map.
- [ ] Build risk map.
- [ ] Identify Phase A–I regression surfaces.
- [ ] Identify genuine blockers; continue through ordinary resolvable decisions.

### Implementation

- [ ] Implement only required Phase J deltas.
- [ ] Reuse established services and policies.
- [ ] Add transaction and rollback safety.
- [ ] Add locking/atomic guards where concurrent mutation is possible.
- [ ] Add idempotency for replayable operations.
- [ ] Enforce tenant isolation, RBAC, and record-level authorization.
- [ ] Enforce private storage and safe public verification boundaries.
- [ ] Add auditable, secret-safe events/logs.
- [ ] Add queue retry/backoff/uniqueness/failure safety.
- [ ] Add safe forward migrations, constraints, and necessary indexes.
- [ ] Review query performance and eliminate N+1/unbounded paths.
- [ ] Add focused automated tests for every fix.

### Local verification

- [ ] Focused tests pass.
- [ ] Full backend regression suite passes.
- [ ] Linters/static/type/security checks pass as configured.
- [ ] `npm run build` passes.
- [ ] Database-integrity check passes.
- [ ] Financial-health check passes.
- [ ] Reconciliation check passes.
- [ ] System-health check passes.
- [ ] Queue and scheduler checks pass.
- [ ] RBAC/IDOR/tenant isolation checks pass.
- [ ] Private-document/public-verification checks pass.
- [ ] Final diff and migration review pass.
- [ ] No secret, debug code, temporary artifact, or unrelated change remains.

### Staging deployment

- [ ] Confirm correct `nenobet.live` staging target.
- [ ] Capture pre-deploy HTTPS/portal baseline.
- [ ] Verify database and changed-file backups.
- [ ] Write and verify rollback manifest.
- [ ] Review exact delta.
- [ ] Deploy only through proven Hostinger/SSH/connector approach.
- [ ] Apply only safe forward migrations.
- [ ] Perform required cache/build/worker operations.
- [ ] Confirm queue and scheduler configuration.
- [ ] Do not use GitHub deployment.
- [ ] Do not run destructive database/filesystem commands.
- [ ] Do not perform a real payment transaction.

### Post-deployment acceptance

- [ ] HTTPS and assets pass.
- [ ] Public and authenticated portals pass.
- [ ] Authorized roles pass.
- [ ] Unauthorized and unauthenticated behavior pass.
- [ ] Cross-tenant/IDOR attempts fail safely.
- [ ] Every Phase J acceptance criterion passes.
- [ ] Adjacent Phase A–I regression smoke tests pass.
- [ ] Audit, queue, scheduler, notification, and automation behavior pass.
- [ ] Integrity, financial health, reconciliation, and system health pass.
- [ ] Recent logs contain no new unresolved critical exception.
- [ ] Temporary scripts/routes/files/crons/credentials/test data are removed.
- [ ] Temporary endpoints are confirmed inaccessible.
- [ ] Final gap matrix contains only `COMPLETE`.
- [ ] Final continuation report is created.
- [ ] Final verdict is issued.
- [ ] Stop without starting Phase K.

---

## 19. Required Output: `PHASE_J_CURRENT_STATUS_AND_CONTINUATION_REPORT.md`

Create this file at the appropriate project-report location established by repository convention. Complete every section; do not leave placeholder claims.

Use this template:

```markdown
# PHASE J — CURRENT STATUS AND CONTINUATION REPORT

**Project:** BDNSI Laravel Institute Website  
**Phase:** J  
**Report date/time:** <ISO timestamp with timezone>  
**Executor:** Google Antigravity IDE  
**Repository branch:** <branch>  
**Local commit/baseline:** <commit or precise baseline>  
**Staging:** https://nenobet.live  
**Deployed version/baseline:** <commit/hash/file-manifest identifier>  
**Final verdict:** PHASE J: COMPLETE | PHASE J: INCOMPLETE

## 1. Executive Summary

<What Phase J was proven to be, what existed before this run, what was changed,
what was verified locally and on staging, and the final outcome.>

## 2. Authoritative Sources Reviewed

| Source | Location | Version/date | Relevant conclusion |
|---|---|---|---|
| PROJECT_MEMORY.md | <path> | <value> | <conclusion> |
| AGENT_OPERATING_SYSTEM.md | <path> | <value> | <conclusion> |
| Phase reports/templates | <paths> | <value> | <conclusion> |
| Code/schema/tests | <paths> | <value> | <conclusion> |
| Staging baseline | https://nenobet.live | <timestamp> | <conclusion> |

## 3. Phase J Scope Contract

### Included capabilities

1. <capability and authoritative evidence>

### Excluded or deferred capabilities

1. <capability, reason, and intended phase if documented>

### Acceptance criteria

1. <criterion>

### Constraints and invariants

- <constraint>

### Source conflicts and resolutions

- <conflict, precedence decision, and evidence>

## 4. Pre-Implementation Audit and Gap Matrix

| ID | Capability | Initial status | Evidence | Gap/root cause | Dependencies | Risk | Planned action |
|---|---|---|---|---|---|---|---|
| J-001 | <name> | <classification> | <evidence> | <gap> | <dependencies> | <risk> | <action> |

## 5. Dependency and Risk Map

### Dependency map

- <capability> -> <routes/controllers/services/schema/jobs/UI/tests>

### Critical/high risks and controls

| Risk | Impact | Likelihood | Control implemented | Verification |
|---|---|---|---|---|
| <risk> | <impact> | <level> | <control> | <evidence> |

## 6. Implementation Summary

| Gap ID | Files changed | Behavior implemented/fixed | Why required | Compatibility notes |
|---|---|---|---|---|
| J-001 | <paths> | <behavior> | <evidence> | <notes> |

### Migrations and data changes

- <migration, compatibility analysis, index/constraint, result>

### Deliberately unchanged baseline components

- <Phase A-I component and why no change was needed>

## 7. Security, Tenant, and Privacy Verification

| Control | Test/check | Expected | Actual | Evidence | Result |
|---|---|---|---|---|---|
| Authentication | <check> | <expected> | <actual> | <output/status> | PASS/FAIL |
| RBAC | <check> | <expected> | <actual> | <output/status> | PASS/FAIL |
| Tenant isolation | <check> | <expected> | <actual> | <output/status> | PASS/FAIL |
| IDOR | <check> | <expected> | <actual> | <output/status> | PASS/FAIL |
| Private storage | <check> | <expected> | <actual> | <output/status> | PASS/FAIL |
| Public verification | <check> | <expected> | <actual> | <output/status> | PASS/FAIL |
| Secret/PII leakage | <check> | <expected> | <actual> | <output/status> | PASS/FAIL |

## 8. Financial and Data Integrity Verification

| Invariant/check | Command/test | Result | Evidence |
|---|---|---|---|
| Transaction rollback | <test> | PASS/FAIL | <evidence> |
| Locking/concurrency | <test> | PASS/FAIL | <evidence> |
| Idempotency | <test> | PASS/FAIL | <evidence> |
| Payment/credit/allocation rules | <test> | PASS/FAIL | <evidence> |
| Ledger consistency | <command/test> | PASS/FAIL | <evidence> |
| Commission consistency | <command/test> | PASS/FAIL | <evidence> |
| Database integrity | <exact command> | PASS/FAIL | <evidence> |
| Financial health | <exact command> | PASS/FAIL | <evidence> |
| Reconciliation | <exact command> | PASS/FAIL | <evidence> |

State explicitly that no real payment transaction was used for testing, or
record a critical policy violation if one occurred.

## 9. Queue, Scheduler, Workflow, and Notification Verification

| Area | Configuration/check | Retry/uniqueness/idempotency evidence | Result |
|---|---|---|---|
| Queue | <check> | <evidence> | PASS/FAIL |
| Scheduler | <check> | <evidence> | PASS/FAIL |
| Workflow | <check> | <evidence> | PASS/FAIL |
| Notifications | <check> | <evidence> | PASS/FAIL |
| Failed jobs | <check> | <evidence> | PASS/FAIL |

## 10. Test and Build Evidence

| Gate | Exact command | Passed/failed/skipped | Counts/output summary | Evidence location |
|---|---|---|---|---|
| Focused Phase J tests | <command> | <result> | <summary> | <location> |
| Full regression suite | <command> | <result> | <summary> | <location> |
| Static/lint/type checks | <command> | <result> | <summary> | <location> |
| Production frontend build | npm run build | <result> | <summary> | <location> |
| System health | <command> | <result> | <summary> | <location> |

List every skipped test or unavailable check with a precise reason and impact.

## 11. Performance Review

| Execution path | Risk examined | Query/index/job evidence | Change made | Final result |
|---|---|---|---|---|
| <path> | <N+1/scan/bulk/etc.> | <evidence> | <change or none> | PASS/FAIL |

## 12. Staging Backup and Deployment Evidence

### Pre-deployment baseline

- HTTPS/status evidence: <value>
- Portal evidence: <value>
- Database/schema baseline: <value>
- Deployed-file baseline: <value>

### Backups

| Backup | Protected location/identifier | Verification | Restoration method |
|---|---|---|---|
| Database | <safe identifier, no secret> | <evidence> | <method> |
| Changed files | <safe identifier> | <evidence> | <method> |
| Config/cron | <safe identifier> | <evidence> | <method> |

### Delta manifest

| Operation | Target | Reason | Result |
|---|---|---|---|
| Add/modify/migrate/remove | <path or migration> | <reason> | <result> |

### Commands/actions executed

1. `<exact safe command/action>` — <result>

Confirm explicitly:

- GitHub deployment was not used.
- `migrate:fresh` and `db:wipe` were not used.
- `.env` was not blindly overwritten.
- no destructive filesystem reset was used.
- no automatic/broad `db:seed` was used.
- no real payment transaction was used.

## 13. Post-Deployment Acceptance Evidence

| Check | Role/actor | URL/action | Expected | Actual | Evidence | Result |
|---|---|---|---|---|---|---|
| HTTPS home | Guest | <URL> | <expected> | <actual> | <status/output> | PASS/FAIL |
| Admin portal | Admin | <URL> | <expected> | <actual> | <status/output> | PASS/FAIL |
| Center portal | Center | <URL> | <expected> | <actual> | <status/output> | PASS/FAIL |
| Phase J criterion | <role> | <action> | <expected> | <actual> | <evidence> | PASS/FAIL |
| Unauthorized access | <role> | <action> | 403/safe denial | <actual> | <evidence> | PASS/FAIL |
| Unauthenticated access | Guest | <action> | redirect/denial | <actual> | <evidence> | PASS/FAIL |
| Cross-tenant IDOR | <role> | <action> | 403/404 | <actual> | <evidence> | PASS/FAIL |

## 14. Logs and Operational Health

| Source | Time window | Findings | New/old | Resolution | Result |
|---|---|---|---|---|---|
| Laravel log | <window> | <finding> | <classification> | <resolution> | PASS/FAIL |
| Web/PHP log | <window> | <finding> | <classification> | <resolution> | PASS/FAIL |
| Queue/scheduler | <window> | <finding> | <classification> | <resolution> | PASS/FAIL |

## 15. Cleanup Evidence

| Temporary artifact | Location/URL | Removal evidence | Post-removal verification | Result |
|---|---|---|---|---|
| <artifact or NONE> | <location> | <evidence> | <404/safe state> | PASS/FAIL |

Confirm there are no temporary public scripts, bypass routes, debug endpoints,
temporary credentials, duplicate crons, or diagnostic files remaining.

## 16. Final Gap Matrix

| ID | Capability | Final status | Final evidence | Remaining issue |
|---|---|---|---|---|
| J-001 | <name> | COMPLETE/<other> | <evidence> | <none or issue> |

## 17. Rollback Readiness or Rollback Performed

- Rollback trigger status: <not triggered/triggered>
- Exact restoration plan: <steps>
- If performed, result and post-rollback verification: <evidence>
- Remaining recovery risk: <none or explanation>

## 18. Known Limitations and Blockers

1. <none, or exact blocker with impact and required authority/input>

Do not list ordinary future enhancements as Phase J blockers.

## 19. Safe Continuation Instructions

If incomplete:

1. <exact next safe action>
2. <required evidence/input>
3. <gate to rerun>

If complete, state only the operational monitoring/follow-up required for Phase J.
Do not define or begin Phase K work.

## 20. Final Declaration

<Use exactly one verdict:>

PHASE J: COMPLETE

or

PHASE J: INCOMPLETE

**Reason:** <concise evidence-based reason>  
**Phase K status:** NOT STARTED
```

---

## 20. Final Operating Directive

Proceed autonomously through discovery, audit, implementation, local verification, safe staging deployment, acceptance, cleanup, and reporting when the repository and authoritative records provide sufficient evidence.

Make conservative, technically sound implementation decisions without repeatedly requesting approval for routine work. Stop only for the genuine stopping conditions defined above.

Evidence is mandatory. A feature that appears to work but lacks required authorization, tenant isolation, transaction safety, idempotency, auditability, tests, operational verification, or staging acceptance is not complete.

The only permitted terminal verdicts are:

```text
PHASE J: COMPLETE
```

or

```text
PHASE J: INCOMPLETE
```

After issuing the verdict and writing `PHASE_J_CURRENT_STATUS_AND_CONTINUATION_REPORT.md`, stop. **Do not start Phase K.**
