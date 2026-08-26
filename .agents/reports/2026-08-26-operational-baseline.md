# BDNSI Operational Baseline — 2026-08-26

## Scope

Financial remediation, Telescope recovery, Phase I analytics baseline, CI hardening, cleanup safety, and permanent Antigravity workflow setup.

## Verified Evidence

| Check | Result |
| --- | --- |
| Phase I analytics | 7 tests, 19 assertions, pass |
| Full PHP regression | 93 tests, 310 assertions, 0 failures, 0 errors |
| Frontend production build | Pass |
| Local database integrity | Pass |
| Financial reconciliation | Pass |
| Financial health | Pass |
| Active system health | Pass |

## Database State

- A pre-migration local database backup was created before the Telescope migration.
- Telescope storage tables were created and recorded by migration `2026_08_26_060000_create_telescope_storage_tables`.
- No legacy order-status rows existed, so no historical data rewrite was required.

## Release Control

- GitHub CI now provisions the isolated MySQL test database required by the PHPUnit safety guard.
- A `main` branch push verifies code but cannot deploy.
- Production deployment requires a manual GitHub workflow run with `deploy=true` and configured SSH secrets.

## Cleanup Control

- Dangerous public `fix_db.php` and unused `fix_permissions.php` were moved to local quarantine, not destroyed.
- Uploads, student images, certificates, `.env`, and database backups are protected from automated cleanup.
