---
name: documentation-drift-control
description: Keep BDNSI roadmap, handoff, status, and technical documentation synchronized with verified behavior while avoiding duplicate reports and stale claims. Use when updating README/status/roadmap/report files or when documentation conflicts with code/tests/CI.
paths:
  - "**/*.md"
---

# Documentation Drift Control

Documentation must compress evidence, not multiply it.

## Source discipline

- `MASTER_IMPLEMENTATION_ROADMAP.md` remains the business/implementation roadmap unless the owner explicitly approves a replacement.
- Current source/tests/CI/live evidence determine implementation status.
- `.ai/PROJECT_STATE.md` is a handoff snapshot and may contain historical deployment/tooling language; verify before repeating it.
- Old `.agents/` plans/reports are historical evidence, not active Cursor instructions.

## Update rules

1. Change documentation only when verified behavior, configuration, status, or decision changed.
2. Prefer updating an existing canonical file over creating another `FINAL_*`, `REPORT_*`, or duplicate roadmap.
3. Record exact evidence compactly: commit SHA, test/workflow result, deployment SHA, unresolved blocker.
4. Separate `verified`, `inferred`, `historical`, and `pending` facts.
5. Remove or mark stale statements that would cause an agent to repeat completed work.
6. Do not paste long terminal logs, chat transcripts, screenshots-as-text, or duplicated implementation detail into status files.
7. Keep sensitive credentials, tokens, private infrastructure details and personal data out of repository docs.

## Cost control

Do not regenerate all documentation after every edit. Update status only at a meaningful milestone, release, changed invariant, or handoff. A code fix whose documentation contract did not change needs no documentation churn.

## Completion

After editing docs, check that they do not contradict `composer.json`, `package.json`, current branch policy, database policy, CI workflow, or actual deployment evidence.