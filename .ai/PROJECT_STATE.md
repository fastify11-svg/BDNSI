# BDNSI Project State

## Overall Status
**ROADMAP_COMPLETE | CI_VERIFIED | DEPLOYMENT_METHOD=ANTIGRAVITY_DIRECT_SSH**

## CI Status
- GitHub Actions: **CI-only** (no production SSH deployment)
- PHP Regression: PASS (131 tests)
- Frontend build: PASS
- Playwright smoke: PASS
- Workflow: `.github/workflows/autonomous.yml`

## Deployment Architecture
```
DEPLOYMENT_METHOD = ANTIGRAVITY_DIRECT_SSH
Target:            nenobet.live
SSH host:          145.79.212.19
SSH port:          65002
SSH user:          u881397359
SSH key (local):   .deploy_key  (ED25519, committed to .gitignore)
Remote path:       /home/u881397359/domains/nenobet.live/public_html
Deploy script:     node deploy_to_production.mjs
```

## SSH Key Setup Required
To enable deployment, add this public key to Hostinger hPanel → SSH Access:
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIL0xOE7LdNtHkPE1q7emMWSjPeOfGM+728pcOxcPlPLm bdnsi-deploy-antigravity
```
URL: https://hpanel.hostinger.com/hosting/1008135371/advanced/ssh-access

## Current Branch
- main (commit: c6e0376 and newer CI-only fixes)

## Completed Phases
PHASE_A through PHASE_U — all complete.

## Pending
- [ ] Add SSH public key to Hostinger panel
- [ ] Run: `node deploy_to_production.mjs`
- [ ] Verify live site at https://nenobet.live
- [ ] Record PRODUCTION_DEPLOYED_AND_VERIFIED
