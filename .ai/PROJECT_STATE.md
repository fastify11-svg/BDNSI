# BDNSI Project State

## Overall Status
**ROADMAP_COMPLETE | CI_VERIFIED | PRODUCTION_DEPLOYED_AND_VERIFIED**

## CI Status
- GitHub Actions: **CI-only** (no production SSH deployment)
- PHP Regression: PASS (131 tests)
- Frontend build: PASS
- Playwright smoke: PASS
- Workflow: `.github/workflows/autonomous.yml`

## Deployment Architecture
```
DEPLOYMENT_METHOD = ANTIGRAVITY_DIRECT_SSH
Target:            nenobet.live (test server)
SSH host:          145.79.212.19
SSH port:          65002
SSH user:          u881397359
SSH key (local):   .deploy_key
Remote path:       /home/u881397359/domains/nenobet.live/public_html
```

## Current Branch
- main (commit: 6a2b8f0)

## Completed Phases
PHASE_A through PHASE_U — all complete.

## Pending
None. The deployment to nenobet.live has been successfully completed and smoke tested.
