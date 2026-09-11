---
name: mysql-migration-safety
description: Design, review, or repair BDNSI database migrations and schema changes safely for canonical MySQL 8. Use for migrations, indexes, foreign keys, data backfills, seeders, schema drift, or database-related test failures.
paths:
  - "database/**/*.php"
  - "app/Models/**/*.php"
  - "tests/**/*.php"
---

# MySQL Migration Safety

MySQL 8 is canonical. Do not make SQLite the source of truth merely because it is easier to run.

## Before changing schema

1. Search existing migrations, model casts/relations, queries, factories, seeders and tests for the affected columns/tables.
2. Determine whether the change is additive, corrective, data-transforming, or destructive.
3. Check production-data compatibility: nullability, defaults, existing rows, indexes, foreign keys, charset/length and rollback behavior.
4. For financial, identity, certificate, or tenant columns, identify every write/read path before editing.

## Safe implementation

- Prefer additive and backward-compatible migrations.
- Never edit an already-applied historical migration just to change production schema; add a new migration unless the repository evidence proves it has never shipped.
- Make backfills deterministic and resumable when practical.
- Add indexes only for evidenced query/access patterns; avoid speculative index storms.
- Preserve foreign-key and tenant integrity.
- Keep seeders repeatable enough for disposable test environments.
- Do not run `migrate:fresh`, `db:wipe`, DROP, destructive cleanup, or production data backfills against production/valuable shared data without explicit owner approval and a verified backup/rollback plan.

## Verification ladder

1. Run the relevant migration/test on the isolated MySQL test database.
2. Verify rollback only when the migration is intended to be reversible and doing so is safe in the disposable environment.
3. Run affected model/service tests.
4. Use full `migrate:fresh --seed` only on a positively identified disposable test database and when schema-wide verification is warranted.

## Reject these shortcuts

Do not switch CI to SQLite, suppress SQL errors, drop constraints to make tests pass, or silently coerce financial/identifier data. If production data shape is unknown, stop at a migration plan rather than guessing.