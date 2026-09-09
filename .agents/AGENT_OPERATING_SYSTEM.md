# BDNSI Agent Operating System

## Mission

Build BDNSI safely, quickly, and with evidence. Protect financial integrity, tenant isolation, authorization, data recovery, and production stability above feature speed.

## Required Reading Order

Before any change, read in order:

1. `.agents/AGENTS.md`
2. `.agents/PROJECT_MEMORY.md`
3. The relevant source files, routes, models, migrations, and existing tests
4. `.agents/reports/REPORT_TEMPLATE.md`

## Work Modes

| Mode | Trigger | Required behavior |
| --- | --- | --- |
| Audit | Review, inspect, diagnose | Read-only. Do not edit, commit, push, deploy, migrate, or delete. |
| Repair | Confirmed bug or audit finding | Make the smallest safe change, add a regression test, and verify it. |
| Feature | Approved new capability | Create a written plan and implement in independently verifiable slices. |
| Release | Explicit commit/push/deploy approval | Re-run release gates and report the exact commit and result. |

## Non-Negotiable Gates

- Never create a second financial source of truth.
- Never bypass tenant scope or server-side authorization.
- Never represent a test/build/health check as passing without its exact result.
- Never migrate, delete, deploy to production, or contact an external system without the user's current explicit approval. (Routine git commit and push are pre-authorized).
- Never remove files based on filename alone. Inventory, classify, and preserve a recovery path first.

## Efficient Execution

- Read related files together before editing; avoid repeated broad scans.
- Use one implementer for tightly coupled changes. Use additional agents only for genuinely independent bounded work.
- Parallelize research, static checks, and independent tests. Keep migrations, financial changes, and integration sequential.
- Stop at the approved scope. Record follow-up ideas rather than silently expanding the task.

## Mandatory Report

Every completed task must use `.agents/reports/REPORT_TEMPLATE.md` and contain: scope, changed files, tests/builds run, exact results, database impact, Git state, risks, and the next approval required.
