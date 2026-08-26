# BDNSI Project Memory

## Verified Environment

- Local project root: `C:\BDNSI`
- Stack: Laravel 10, React with Inertia, Vite, Tailwind, MySQL
- Canonical Git remote: `https://github.com/fastify11-svg/BDNSI.git`
- Local commands use `C:\xampp\php\php.exe` and `C:\xampp\mysql\bin\mysql.exe`
- Tests must use the isolated `bdnsi_testing` MySQL database and `bdnsi_test_user`; `tests/CreatesApplication.php` enforces this.

## Core Invariants

1. Orders use only: `pending`, `partially_paid`, `paid`, `failed`, `cancelled`.
2. Transactions use only: `pending`, `success`, `failed`, `cancelled`.
3. Center ledger entries use only: `debit` and `credit`; commissions belong to the `commissions` table.
4. A successful payment must be verified and processed idempotently before it changes orders, students, ledgers, or commissions.
5. Tenant data is protected by `CenterScope` and server-side authorization; frontend filtering is never authorization.
6. High-impact actions must be auditable and exports/bulk actions must be authorized and queue-safe.

## Current Operational Baseline

- Telescope storage migration: `2026_08_26_060000_create_telescope_storage_tables`
- Phase I has begun only with the Business Analytics foundation. Do not claim Phase I completion until every module, verification gate, and report is complete.
- Before a financial or schema change: create and verify a database backup.

## Known Guardrails

- Local backup files belong in `storage/app/backups/` and must never be committed.
- No commit, push, or deployment without explicit user approval for the reviewed change set.
- Cleanup is inventory-first: classify candidates as generated, cache/log, archival, source, or unknown before proposing deletion.
