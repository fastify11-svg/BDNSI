# CURSOR HANDOFF AUDIT

Status: `ADVANCED_HANDOFF_REVIEW_COMPLETE | APPLICATION_RELEASE_AUDIT_CONTINUES`
Working branch: `cursor-development`

## 1. Verified current facts
- Existing mature Laravel application; not a greenfield rebuild.
- `composer.json` requires PHP 8.2 and Laravel 8.
- MySQL 8.0 is the canonical verification database.
- Frontend is React/Inertia/Vite/Tailwind; lockfiles are authoritative for exact dependency resolution.
- Draft PR #1 isolates Cursor work from `main`.
- Safety repository `fastify11-svg/BDNSI-Cursor` preserves the handoff baseline.
- Last fully verified Cursor predecessor `4ad7597a670fc60314825355e4641c9fa2a9812f`: GitHub Actions Run #189 SUCCESS.

## 2. Documentation conflicts / stale claims
- Legacy `.agents/` content contains Antigravity-specific paths/workflows and stale framework claims; it is not active Cursor instruction.
- Historical `.ai` execution files contain many superseded 48H/84H/autonomy reports. Cursor indexing now excludes them by default while retaining `.ai/PROJECT_STATE.md`.
- `.ai/PROJECT_STATE.md` was reconciled to distinguish historical roadmap/deploy evidence from the current Cursor lane.

## 3. Current environment / toolchain
- PHP 8.2.
- Laravel 8.
- MySQL 8.0.
- Node is now pinned to 24 via `.nvmrc` because the resolved Select2 package advertises Node >=24; old CI used Node 22 and emitted an engine warning.
- CI uses lockfile-based deterministic npm installation (`npm ci --legacy-peer-deps`).
- Playwright Chromium is the release-critical browser test target.

## 4. CI / test baseline
Run #189 on predecessor `4ad7597...` proved:
- MySQL migrate/fresh + seed PASS on disposable CI DB.
- PHP: 143 PASS + 1 risked assertionless debug probe.
- Frontend production build PASS.
- Public/server smoke PASS.
- Playwright release-critical specs PASS.

Hardening actions taken after that baseline:
- removed the assertionless `Live002CurlTest` debug probe;
- upgraded CI action/runtime contract to Node 24 and deterministic npm install;
- added CI concurrency cancellation to prevent superseded PR runs wasting compute;
- made smoke checks fail on non-200 responses;
- added tracked `public/build` parity enforcement;
- added deploy-script syntax validation;
- added informational Composer/npm production advisory checks.

The exact current hardening head still requires its own final CI SUCCESS before release conclusions.

## 5. Security / RBAC / tenant findings
Verified CI tests already cover important boundaries including Admin RBAC, tenant isolation, document IDOR, payment idempotency, password-reset rate limiting, certificate privacy and public verification privacy.
No reintroduced `/live_deploy` or `test-transcript` debug endpoint was found in the targeted review.

Hardening gap found and addressed: the direct SSH deploy script previously disabled SSH host-key checking. It is being replaced with strict known-host verification and exact-SHA gates.

## 6. Finance / payment / credit findings
Run #189 contains passing focused tests for ledger debit/credit, credit-limit policy, pay-now/credit reconciliation, duplicate-payment protection, SSLCommerz IPN, pricing resolution and commission lifecycle.
No finance rewrite is justified from current evidence. Cursor should reopen only a reproduced gap/regression.

## 7. Business-flow findings
Automated coverage exists for student lifecycle, registration policy, result access, certificate gating, document review, reporting, CRM lead conversion and commission paths.
Independent live acceptance remains required because automated green tests do not prove the deployed browser journeys.

## 8. Deployment / rollback findings
Historical deployment is direct SSH; GitHub Actions remains CI-only.
Advanced review found the old deploy script had these weaknesses:
- `StrictHostKeyChecking=no`;
- remote reset to branch head rather than a strongly gated exact release SHA;
- fallback from missing production `.env` to `.env.example`;
- `composer --ignore-platform-reqs`;
- no explicit owner-approval or backup-readiness gate;
- SHA mismatch only warned rather than failed;
- no strict post-deploy HTTP health gate.

The Cursor lane hardens these controls without deploying anything.

## 9. Verified defects / quality gaps addressed
- Assertionless risked debug test in release suite — removed.
- AgentRouter/AI Supervisor variables left in `.env.example` — removed.
- Corrupted/duplicated `.gitignore` — normalized.
- Excess historical `.ai` material consuming Cursor context — excluded from normal indexing.
- CI Node 22 vs package engine requirement — Node 24 pinned.
- Non-deterministic `npm install` in CI — replaced by `npm ci`.
- Weak smoke checks — made strict.
- Repeated superseded PR CI runs — concurrency cancellation added.
- Direct SSH trust/exact-SHA/env safety weaknesses — hardened.

## 10. Unverified / release-bound items
- Exact production Composer residual risk after Laravel 8 EOL advisories (owner migration gate).
- Current real deployed SHA reconciliation on `nenobet.live`.
- Final independent live browser acceptance.
- Production backup/rollback readiness at deployment time.

## 11. Prioritized execution queue
- P0: none proven by this review.
- P1 residual: Laravel 8 EOL framework advisories require owner-approved major upgrade path; live acceptance + exact-SHA deploy remain owner-gated.
- P1 closed on this continuation: upload client-extension spoofing hardened in `App\Lib\Image`; axios production highs cleared via `1.20.0` override; exact-head CI green for `bf7fb3505b7d60aebba49dd2852f31d1ab221ac8...`.
- P2: large Vite chunks; abandoned legacy packages/framework tech debt; improve only when justified by risk/performance.
- P3: historical documentation/archive cleanup beyond what affects active Cursor context.

## 12. Evidence
- Handoff `main` baseline: `696ddab326ea7720f02a6dee88c81b309a99ac54`.
- Last fully verified Cursor predecessor: `4ad7597a670fc60314825355e4641c9fa2a9812f` / Run #189 SUCCESS.
- Current Cursor head before this continuation fix: `bf7fb3505b7d60aebba49dd2852f31d1ab221ac8` / Actions run `34718185619` SUCCESS.
- Tip SHA `8b6925a6bb25529aa718c86a5320af93dbf4d415` / Actions run `34722857917` SUCCESS.
- Local full PHP after upload/axios hardening: **145 passed** (includes new `ImageUploadHardeningTest`); Playwright release specs 11/11 PASS.
- Composer audit on Laravel 8.x-dev: 3 advisories (signed URL path confusion; email CRLF; file validation bypass). Framework upgrade is an owner gate; upload path mitigated in application code.
- npm axios highs: mitigated by pinning/overriding axios to `1.20.0` (direct + nested). Remaining audit noise is non-high / non-axios.

## Audit rule
Do not turn warnings into speculative framework/dependency rewrites. Reproduce or identify the exact affected package/path, choose the smallest compatible remedy, then verify it.
