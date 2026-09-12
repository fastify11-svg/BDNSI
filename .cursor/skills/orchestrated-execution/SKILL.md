---
name: orchestrated-execution
description: Coordinate complex BDNSI work across the main Cursor agent and focused subagents with explicit handoffs, disjoint ownership, evidence gates, and minimal context/CI cost. Use for multi-step, multi-domain, or release-critical tasks; skip for simple single-file fixes.
---

# BDNSI Orchestrated Execution

Use this workflow only when the task is genuinely complex enough to benefit from delegation. The main agent remains accountable for the final diff and evidence.

## 1. Classify and choose the cheapest execution shape

First run the roadmap/gap classification and narrow codebase search.

- Simple, localized, well-understood change -> main agent implements directly.
- Concrete failing test/runtime/CI -> delegate root-cause isolation to `debugger`.
- Unclear architecture or multi-domain impact -> delegate a read-only map to `architect`.
- Auth/RBAC/tenant/finance/document/certificate trust boundary -> request `security-reviewer` after the candidate diff exists, or earlier if the risk model is unclear.
- Meaningful completion/release gate -> request independent `verifier` after implementation.
- Broad unfamiliar discovery -> prefer Cursor's built-in Explore subagent for a concise symbol/file map.

Do not spawn agents merely to appear parallel. Each subagent must reduce uncertainty, isolate context, or provide independent verification.

## 2. Handoff contract

Every delegated task must contain:

- GOAL: one concrete question/outcome;
- SCOPE: exact domain/files/symbols or search boundary;
- INVARIANTS: business/security constraints that may not change;
- OUTPUT: the compact evidence/result expected;
- STOP CONDITION: when the subagent must return instead of expanding scope.

Subagent returns should be consumed as evidence, not pasted into permanent reports unless verified project state changed.

## 3. Parallelism rules

Parallelize only independent investigations or disjoint file ownership.

Safe examples:
- architect maps backend boundaries while Explore maps relevant frontend symbols;
- security reviewer analyzes the completed diff while verifier selects the minimal regression set;
- two read-only investigations of unrelated failures.

Do not parallelize writes to overlapping controllers, models, migrations, React pages, shared routes, lockfiles, workflows, or canonical status files. The main agent should integrate overlapping changes serially.

## 4. Implementation ownership

The main agent normally owns the final edit set so there is one coherent diff. A subagent may implement only when its file ownership is explicitly disjoint and the main agent will review the resulting diff before verification.

Use existing services/policies/components. Do not create duplicate engines or new abstractions unless the current architecture cannot safely satisfy the requirement.

## 5. Evidence ladder

After implementation:

1. syntax/static/focused check;
2. targeted PHP/Playwright test for changed behavior;
3. affected-domain regression if risk warrants it;
4. security reviewer for changed trust boundaries;
5. verifier for independent completion evidence;
6. full PHP/build/Playwright/CI only at cross-cutting or release gates.

Never rerun unchanged expensive gates without a material reason.

## 6. Built-in Cursor acceleration

Use current Cursor built-ins when they shorten the work:

- `/review` for an implementation review;
- `/review-security` for a security-focused review;
- `/autopilot` to monitor and repair PR feedback/check failures when appropriate;
- `/split-to-prs` only when a large independent change set genuinely benefits from separate PRs;
- `/loop` only for bounded repeatable checks, never as an uncontrolled token loop;
- `/automate` only for recurring/scheduled maintenance that has a clear stop condition.

The project safety hook still applies to shell execution. Production deployment remains outside the Cursor development lane.

## 7. Completion report

Return one compact handoff:

- OUTCOME
- ROOT CAUSE / VERIFIED GAP
- CHANGED FILES
- TEST / REVIEW EVIDENCE
- CI SHA/STATUS if run
- REMAINING RISK OR OWNER-ONLY GATE

Stop when the requested outcome is proven. Do not generate duplicate roadmaps or phase reports.
