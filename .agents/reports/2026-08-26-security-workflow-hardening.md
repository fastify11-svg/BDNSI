# Security and Workflow Hardening Report — 2026-08-26

## Completed

- Removed legacy root-level deployment, live-debug, and repair scripts that could connect to production outside the reviewed GitHub release workflow.
- Removed the legacy plaintext deployment password from the local root and `scratch/` scripts.
- Removed `npm` shortcuts that could automatically push, migrate a database, or deploy production.
- Changed the GitHub deployment workflow from password-based SSH to dedicated SSH key authentication with strict host-key verification.
- Kept deployment manual-only: pushes to `main` verify the application but cannot deploy production.
- Added a versioned GitHub secret setup guide at `.github/DEPLOYMENT_SECRETS_SETUP.md`.

## Verification

| Check | Result |
| --- | --- |
| Plaintext legacy deployment password in root/scratch scripts | Not found after cleanup |
| Phase I analytics regression suite | 7 passed, exit code 0 |
| Frontend production build | `public/build/manifest.json` regenerated successfully |
| Previous full regression baseline | 93 tests, 310 assertions, 0 failures/errors |

## Required External Follow-Up

The old hosting password was previously stored in repository history. It must be rotated in the hosting provider account. This cannot be done safely from the local repository.

Before any future production deployment, configure the five GitHub Actions secrets described in `.github/DEPLOYMENT_SECRETS_SETUP.md`. Until then, manual deployment correctly fails closed.

## Safety Outcome

The repository no longer contains a supported automatic route to commit, push, migrate, or deploy from `npm`. Releases require a reviewed change set, explicit approval, CI verification, and a manually initiated GitHub deployment.
