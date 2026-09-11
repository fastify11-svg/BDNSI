# BDNSI Cursor Skill System

These repo-level skills are intentionally split by workflow so Cursor can use progressive, on-demand context instead of loading one huge permanent prompt. Cursor discovers each `SKILL.md` automatically and decides when its description is relevant; a skill can also be invoked explicitly with `/skill-name`.

## Skills

| Skill | Primary purpose |
|---|---|
| `roadmap-gatekeeper` | Prevent reopening completed work; classify real gap vs regression vs new requirement. |
| `cost-aware-codebase-navigation` | Search-first repository exploration with strict context/scan discipline. |
| `laravel-surgical-fix` | Small evidence-backed Laravel backend fixes. |
| `mysql-migration-safety` | MySQL 8 schema/migration safety and non-destructive verification. |
| `financial-integrity` | Orders, payments, ledgers, dues, credit and commission invariants. |
| `rbac-tenant-security` | Laratrust, guards, CenterScope, policies and IDOR/tenant boundaries. |
| `academic-document-flow` | Registration documents, results, certificates and verification lifecycle. |
| `inertia-react-frontend` | Focused React/Inertia/Vite UI work without upgrade churn. |
| `test-budget-optimizer` | Run the smallest useful test first; reserve broad suites for risk/release. |
| `ci-root-cause-triage` | Fix the first CI root failure instead of rerunning noisy pipelines. |
| `dependency-change-control` | Prevent unnecessary Composer/npm/framework upgrade churn. |
| `security-regression-review` | Focused security review at the changed trust boundary. |
| `release-readiness` | Exact-SHA release, rollback and live acceptance gates. |
| `documentation-drift-control` | Keep canonical docs factual without duplicate report generation. |
| `legacy-artifact-cleanup` | Remove obsolete generated/Antigravity artifacts safely. |

## Focused subagents

Only two custom subagents are kept because unnecessary parallel agents multiply token/compute usage.

| Subagent | Use when |
|---|---|
| `verifier` | After meaningful implementation or before marking a task complete; independently prove the smallest required behavior. |
| `debugger` | A concrete runtime/test/build/CI failure exists; isolate one root cause and converge with a minimal fix. |

Use Cursor's built-in Explore subagent for large unfamiliar codebase searches instead of creating another custom explorer. Do not spawn multiple subagents for simple tasks; each subagent has its own context and usage cost.

## Usage philosophy

The normal task path is:

`roadmap-gatekeeper -> relevant domain skill -> test-budget-optimizer -> verifier when completion evidence matters -> documentation only if state changed`

For a concrete failure:

`debugger -> targeted failing check -> smallest fix -> targeted re-run -> verifier only if risk justifies independent confirmation`

Use `release-readiness` only when approaching merge/deploy/live acceptance. For broad unfamiliar tasks, use `cost-aware-codebase-navigation` and Cursor's built-in Explore capability first.

Do not load every skill into every prompt. Their descriptions and optional `paths` scopes exist specifically to keep unrelated instructions out of context.

## Credit / usage discipline

- Search exact symbols, routes, tests and errors before opening whole directories.
- Reuse current CI evidence for an unchanged commit instead of locally repeating the same full suite without reason.
- Run targeted tests first; full PHP/build/Playwright regression belongs at risk/release gates.
- Do not repeat failed CI without a material change or new diagnostic evidence.
- Do not create duplicate plans/reports when an existing canonical file can be updated.
- Stop once the requested behavior is proven and no relevant blocker remains.
- Prefer one main agent for small tasks. Use subagents only when context isolation or independent verification is worth their extra token cost.

## Why no high-frequency hooks

No automatic `afterFileEdit` full test/build hook is installed. A hook that runs an expensive suite after every edit would consume time/compute and frequently test an incomplete intermediate state. The skill/test ladder runs cheap targeted checks first and moves to full regression only at appropriate gates.

## Legacy skill warning

Cursor also discovers `.agents/skills/`. The Cursor migration should not keep an active second, conflicting Antigravity skill set there. Preserve needed historical knowledge in Git history/current docs, but keep the active skill system under `.cursor/skills/`.