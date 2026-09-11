---
name: legacy-artifact-cleanup
description: Safely clean obsolete Antigravity/supervisor/generated artifacts from the Cursor working branch without deleting source code, current evidence, tests, or rewriting Git history. Use for repository cleanup, stale agent files, logs, duplicate reports, generated evidence, or IDE migration cleanup.
---

# Legacy Artifact Cleanup

Cleanup is inventory-first and reversible through Git history.

## Classify before deleting

For each candidate, classify it as:
- `SOURCE` — application/test/config required to build or operate the product.
- `CURRENT_CONTROL` — active Cursor rule/skill/status/handoff material.
- `CURRENT_EVIDENCE` — needed to prove a current acceptance/release fact.
- `HISTORICAL` — useful old evidence but not active instructions.
- `GENERATED_NOISE` — logs, caches, screenshots, transient reports, build output, copied artifacts.
- `OBSOLETE_AUTOMATION` — retired AgentRouter/Antigravity/supervisor control-plane material.
- `UNKNOWN` — do not delete until resolved.

## Safe cleanup order

1. Remove generated/runtime noise that is already reproducible and ignored.
2. Remove obsolete automation instructions that Cursor could accidentally discover or execute.
3. Consolidate duplicate reports into one current summary when evidence must be retained.
4. Add appropriate ignore rules so removed noise does not return.
5. Keep application source, migrations, meaningful tests, current roadmap, current Cursor controls and required deployment evidence.

## Guardrails

- Never rewrite Git history automatically; history purge is a separate destructive operation requiring explicit approval.
- Never delete production backups or real user data from a server as part of repository cleanup.
- Never remove a failing test merely because it is inconvenient.
- Do not delete unknown files based only on age or name.
- Old `.agents/skills` are especially risky because Cursor discovers `.agents/skills` automatically; replace obsolete workflows with scoped `.cursor/skills` rather than allowing conflicting skill systems.

## Verification

After cleanup, verify Git status/diff, essential config/docs existence, dependency manifests, CI workflow paths, and that Cursor has one clear active instruction/skill system.