---
name: bdnsi-state-recovery
description: Recovers orchestrator context after interruption.
---

# BDNSI State Recovery

## Trigger
Use this skill immediately upon agent startup or session reset.

## Instructions
1. Read `MASTER_IMPLEMENTATION_ROADMAP.md`, `.ai/PROJECT_STATE.md`, `.ai/TASK_QUEUE.md`, `.ai/BLOCKERS.md`, `.ai/EVIDENCE_INDEX.md`.
2. Inspect `git status` and recent `git log`.
3. Reconstruct the current phase, task, last accepted commit, active branch, unfinished reviews, and outstanding failed gates.
4. Resume execution from the last verified state. Do NOT assume an interrupted task was successful.
