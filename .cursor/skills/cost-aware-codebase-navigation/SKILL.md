---
name: cost-aware-codebase-navigation
description: Explore or audit the BDNSI codebase with a search-first, minimal-context workflow that avoids unnecessary file reads, repeated scans, noisy logs, and wasted agent usage. Use for unfamiliar code, broad debugging, audits, architecture tracing, or any task where scope is not yet known.
---

# Cost-Aware Codebase Navigation

Optimize for useful evidence per tool call, not maximum activity.

## Search-first workflow

1. Start from the user's concrete outcome, error, route, class, database table, UI label, or test name.
2. Search exact symbols/strings first; use semantic search only when names are unknown.
3. Open the smallest likely dependency slice. Typical first pass is route -> middleware/policy -> controller/service -> model -> test, not the whole repository.
4. Read only the relevant ranges of large logs, reports, migrations or generated files.
5. Expand the search only when current evidence creates a specific unanswered question.
6. Reuse facts already established in the same task; do not re-open unchanged files just to reconfirm them.

## Context budget

- Do not inventory every file for a narrow bug.
- Do not read `vendor/`, `node_modules/`, compiled assets, caches, backups or full generated reports unless the task specifically requires them.
- Prefer grep/search for an error signature over dumping complete logs.
- Prefer current code/tests/CI over lengthy historical reports.
- For broad unfamiliar discovery, use Cursor's Explore subagent when available and ask it to return a concise file/symbol map rather than file dumps.
- Do not launch parallel agents when one focused search would answer the question. Parallelize only independent investigations whose combined result will reduce total work.

## Edit discipline

Before editing, state the root cause or verified gap. If the root cause is not known, keep investigating instead of guessing. Touch the fewest files that correctly solve the problem; avoid opportunistic cleanup and formatting churn.

## Verification budget

Run the narrowest meaningful check first. Escalate to module tests, build, E2E, and full regression only when change scope or release stage justifies it. Never repeat an unchanged expensive check without a material code/config/environment change.

## Stop rule

When sufficient evidence answers the task, stop. Do not keep searching for hypothetical issues, generate duplicate audit documents, or perform unrelated refactors merely because context remains available.