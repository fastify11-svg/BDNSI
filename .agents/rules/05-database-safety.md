# 05 Database Safety
1. Before schema changes, inspect existing migrations and live assumptions.
2. Prefer forward-safe migrations.
3. Consider backward compatibility, nullable/default strategies, indexes, and large-table implications.
4. Never run destructive reset commands (e.g., `migrate:fresh`) on valuable data or staging/production environments.
5. Never modify old executed migrations merely for convenience unless clearly justified and safe for the project's migration strategy.
