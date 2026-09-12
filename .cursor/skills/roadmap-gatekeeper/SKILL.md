---
name: roadmap-gatekeeper
description: Decide whether a BDNSI request is genuinely remaining roadmap work, a regression, missing acceptance evidence, or a new requirement before implementation. Use for feature requests, phase/status work, broad finish-the-project tasks, or whenever old reports conflict with current code.
---

# Roadmap Gatekeeper

Prevent expensive rework. The repository is mature; never assume that an item mentioned in an old plan is still missing.

## Truth order

1. Current source code and schema.
2. Current targeted tests and reproducible behavior.
3. Current CI evidence for the exact commit.
4. `CURSOR_EXECUTION_STATUS.md` / `CURSOR_HANDOFF_AUDIT.md` when present.
5. `.ai/PROJECT_STATE.md` as a historical handoff baseline.
6. `MASTER_IMPLEMENTATION_ROADMAP.md` for business scope and invariants.
7. Older Antigravity reports only as historical evidence.

## Procedure

1. Restate the requested outcome in one sentence.
2. Search exact route, model, service, policy, component and test names before opening broad folders.
3. Classify the item as one of:
   - `VERIFIED_COMPLETE` — implementation and evidence already exist.
   - `REGRESSION` — previously working behavior is now broken.
   - `VERIFIED_GAP` — required behavior is absent or incorrect.
   - `UNVERIFIED` — likely present but current evidence is insufficient.
   - `NEW_REQUIREMENT` — not part of the existing approved roadmap.
4. If `VERIFIED_COMPLETE`, do not rewrite it. Report the evidence and stop unless acceptance coverage is still missing.
5. If `UNVERIFIED`, obtain the smallest missing proof before editing code.
6. If `VERIFIED_GAP` or `REGRESSION`, identify the smallest dependency slice, expected test, and risk area; then implement only that slice.
7. If `NEW_REQUIREMENT` changes money, certificate/result policy, production data, credentials, or architecture, require owner approval before implementation.

## Planning rule

Use Cursor Plan Mode for genuinely cross-cutting or ambiguous work. Do not create a large plan artifact for a one-file or obvious defect. A plan must reduce implementation risk, not become another document to maintain.

## Stop conditions

Stop investigation when the requested behavior is proven and the next action is clear. Do not reopen completed phases merely to make documentation look current, do not create a second master roadmap, and do not perform speculative modernization while checking status.