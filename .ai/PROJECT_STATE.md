# BDNSI Project State

## Overall Status
**CURSOR_HANDOFF_ACTIVE | VERIFIED_CI_BASELINE | RELEASE_AUDIT_PENDING | FINAL_LIVE_ACCEPTANCE_PENDING**

## Current Development Lane
- Repository: `fastify11-svg/BDNSI`
- Working branch: `cursor-development`
- Release branch: `main` — keep unchanged until release gates pass.
- Safety copy: `fastify11-svg/BDNSI-Cursor` at handoff baseline; keep untouched unless recovery is required.
- Draft PR: `cursor-development -> main`.

## Verified CI Baseline
- Canonical database: **MySQL 8.0**.
- PHP runtime: **8.2**.
- Last fully verified Cursor control-layer predecessor: `4ad7597a670fc60314825355e4641c9fa2a9812f`.
- GitHub Actions Run **#189 — SUCCESS**.
- MySQL migrate/fresh + seed: PASS in disposable CI DB.
- PHP regression: PASS (143 passed; one assertionless legacy debug probe was identified afterward and removed from the Cursor lane).
- Frontend production build: PASS.
- Server smoke: PASS.
- Playwright release-critical specs: PASS.

Current hardening work after that verified baseline must obtain its own exact-head CI evidence before being treated as release-ready. GitHub/PR CI is authoritative for the exact current SHA; do not create self-referential documentation commits merely to echo a SHA.

## Deployment Contract
```text
GITHUB_ACTIONS = CI_ONLY
DEPLOYMENT_METHOD = ANTIGRAVITY_DIRECT_SSH
TARGET = nenobet.live
HISTORICAL_RECORDED_DEPLOYED_SHA = 2e24c1ddbdaa0d23af9291b272a53539d2466d84
```

The direct-SSH deployment script is being hardened for strict host verification, explicit owner approval, backup-readiness confirmation, clean/exact `main` SHA verification, existing production `.env` enforcement, and post-deploy SHA/health verification. GitHub Actions must not be converted into a production SSH deployer unless the owner explicitly changes policy.

## Historical Roadmap State
Phases A-U were recorded complete before the Cursor handoff. Do not reopen them merely because old phase documents exist. Current code/tests/CI outrank stale reports; a regression or missing acceptance proof must be demonstrated before implementation work is reopened.

## Current Release Work
1. Finish evidence-backed Cursor handoff/application audit.
2. Review exact production dependency advisories; do not use force-upgrade commands blindly.
3. Fix only verified P0/P1 release gaps and run risk-based regression.
4. Keep PR draft until the exact release candidate is green and reviewed.
5. Obtain owner approval at the real production deploy gate.
6. Deploy the exact approved merged `main` SHA through direct SSH with rollback/backup readiness.
7. Run independent hands-on live acceptance on `nenobet.live` using disposable `DEMO-UAT` data only.

## Evidence Rule
Never mark `PASS`, `DEPLOYED`, `COMPLETE`, or `PRODUCTION READY` from historical claims alone. Tie every release conclusion to the exact relevant code SHA, CI/test evidence, deployed SHA, and live acceptance evidence.
