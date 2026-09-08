---
name: bdnsi-code-review
description: Standardized code review process for implementation tasks.
---

# BDNSI Code Review

## Trigger
Use this skill when a code implementation task is marked ready for review.

## Instructions
1. Check `.ai/TASK_QUEUE.md` for the Acceptance Criteria and Invariants.
2. Verify that the implemented code adheres to `AGENTS.md` and `MASTER_IMPLEMENTATION_ROADMAP.md` constraints.
3. Ensure no overlapping files were modified incorrectly.
4. Check for test coverage and request the QA/Test Engineer to run relevant tests.
5. Document findings in `.ai/reports/` and flag any issues for `REWORK`.
