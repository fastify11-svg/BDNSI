---
name: supervised-roadmap-loop
description: Orchestrates the internal implementation loop before invoking the external supervisor.
---

# Supervised Roadmap Loop

Use this skill when advancing through roadmap tasks in the `.ai/MASTER_ROADMAP.md` while utilizing the Automated AI Supervisor Bridge.

## Instructions
1. **Implement Task**: Execute the coding tasks for the current roadmap phase.
2. **Local Verification**: Run all local verifications (unit tests, manual checks).
3. **Generate Reports**: Generate `IMPLEMENTATION_REPORT.md`, `TEST_REPORT.md`, `SECURITY_REPORT.md`, etc.
4. **Trigger Supervisor**: 
   - Commit and push to a feature branch to trigger the `.github/workflows/ai-supervisor.yml` action.
   - Wait for the action to complete.
5. **Process Verdict**:
   - If the supervisor updates `.ai/FIX_REQUEST.md` (Verdict: REWORK_REQUIRED), analyze the root cause, fix safely, run targeted tests, and resubmit.
   - If the supervisor updates `.ai/PROJECT_STATE.md` to `VERIFIED` (Verdict: PASS), select the next legitimate unfinished roadmap task.
