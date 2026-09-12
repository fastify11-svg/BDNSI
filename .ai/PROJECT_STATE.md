# BDNSI Project State

## Overall Status
**CURSOR_HANDOFF_ACTIVE | RELEASE_CANDIDATE_VERIFIED | READY_FOR_OWNER_MERGE_REVIEW | FINAL_LIVE_ACCEPTANCE_PENDING**

## Current Development Lane
- Repository: `fastify11-svg/BDNSI`
- Working branch: `cursor-development`
- Release branch: `main` — keep unchanged until owner merge/release approval.
- Safety copy: `fastify11-svg/BDNSI-Cursor` at handoff baseline; keep untouched unless recovery is required.
- Draft PR: `cursor-development -> main`.

## Verified Release Candidate
- Canonical database: **MySQL 8.0**.
- PHP runtime: **^8.3**.
- Framework: **Laravel 13.31.0**.
- Verified application/release candidate SHA: `7eab678eb3ef0bb3b57c3569ca782c5dca45322e`.
- GitHub Actions run `34724341256`: **SUCCESS** on that exact release-candidate SHA.
- PHPUnit: **145 passed**.
- Playwright: **11/11 passed**.
- Composer audit: **clean**.
- npm production high-severity audit: **0**.
- Subsequent documentation/control-only branch tips must obtain their own CI before merge, but do not invalidate the verified application SHA above unless they change application/release behavior.

GitHub/PR CI is authoritative for the exact current branch tip. Do not create self-referential documentation commits merely to echo a moving tip SHA.

## Deployment Contract
```text
GITHUB_ACTIONS = CI_ONLY
DEPLOYMENT_METHOD = ANTIGRAVITY_DIRECT_SSH
TARGET = nenobet.live
HISTORICAL_RECORDED_DEPLOYED_SHA = 2e24c1ddbdaa0d23af9291b272a53539d2466d84
```

The direct-SSH deployment path is hardened for strict host verification, explicit owner approval, backup-readiness confirmation, clean/exact merged `main` SHA verification, existing production `.env` enforcement, and post-deploy SHA/health verification. GitHub Actions must not be converted into a production SSH deployer unless the owner explicitly changes policy.

## Historical Roadmap State
Phases A-U and post-Phase-U closure tasks C-1 through C-5 remain completed. Do not reopen them merely because old phase documents exist. Current code/tests/CI outrank stale reports; a regression or missing acceptance proof must be demonstrated before implementation work is reopened.

## Remaining Release Gates
1. Owner review/approval of the verified release candidate and draft PR.
2. Merge the exact approved release to `main` only after required CI/review gates remain green.
3. Confirm production backup + rollback readiness at the deployment gate.
4. Deploy the exact approved merged `main` SHA via **Antigravity direct SSH** only.
5. Run independent hands-on live acceptance on `nenobet.live` using disposable `DEMO-UAT` data only.
6. Mark Production Ready only after deployed-SHA and live-acceptance evidence agree.

## Evidence Rule
Never mark `DEPLOYED` or `PRODUCTION READY` from repository/CI evidence alone. Tie release conclusions to the exact relevant code SHA, CI/test evidence, deployed SHA, and independent live acceptance evidence.
