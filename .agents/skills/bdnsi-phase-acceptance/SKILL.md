---
name: bdnsi-phase-acceptance
description: Final gatekeeper approval for a phase.
---

# BDNSI Phase Acceptance

## Trigger
Use this skill when a Phase has completed all tasks and is ready for final approval.

## Instructions
1. Aggregate evidence from: QA/Test Engineer, Security Reviewer, DB/Finance Reviewer, E2E Reviewer.
2. Verify all Acceptance Criteria matrix items are checked.
3. Ensure Git evidence is present.
4. Output EXACTLY ONE state: `PASS`, `REWORK`, `BLOCKED`, or `OWNER_DECISION_REQUIRED`.
5. Update `PROJECT_STATE.md` and `EVIDENCE_INDEX.md`.
