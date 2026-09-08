---
name: bdnsi-roadmap-runner
description: Orchestrates the execution of the Master Implementation Roadmap.
---

# BDNSI Roadmap Runner

## Trigger
Use this skill when initializing the execution of the next available roadmap phase.

## Instructions
1. Check `.ai/PROJECT_STATE.md` to determine the current active phase.
2. Read the `MASTER_IMPLEMENTATION_ROADMAP.md` for that specific phase.
3. Validate dependencies: verify all prior phases have a `PASS` status in `.ai/EVIDENCE_INDEX.md`.
4. Delegate to `bdnsi-phase-planner` to create the actionable task list.
5. Coordinate the execution loop until the Integration Gatekeeper returns `PASS` for the entire phase.
