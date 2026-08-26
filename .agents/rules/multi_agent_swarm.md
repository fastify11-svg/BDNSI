# Multi-Agent Orchestration Protocol

## Objective

Use the smallest effective team. Do not simulate agents or create parallel work merely for ceremony; it wastes credits and obscures accountability.

## When to Use One Agent

Use one agent for audits, one-module fixes, migrations, financial changes, or work where files/data are tightly coupled.

## When to Delegate

Delegate only independent, bounded work that can be reviewed separately, for example:

| Role | Allowed independent output |
| --- | --- |
| Architect | Plan, dependency map, invariant checklist |
| Backend reviewer | Server-side authorization, financial, migration review |
| Frontend reviewer | UI/component impact and build review |
| QA reviewer | Test matrix and regression evidence |

## Coordination Rules

1. The lead agent owns scope, final integration, and the user-facing report.
2. Each delegate receives exact files, an explicit output format, and a bounded question.
3. No delegate may commit, push, deploy, migrate, or delete data.
4. Do not assign two agents overlapping edits to the same file.
5. Run parallel work only after shared assumptions are recorded in the implementation plan.
6. The lead validates every delegated claim with source evidence or a test before acting on it.

## Required Gate Sequence

`Audit/plan → minimal implementation → targeted test → independent review when warranted → full regression → user approval for release`
