---
name: test-budget-optimizer
description: Select the smallest reliable BDNSI verification sequence so fixes are proven without repeatedly running expensive full suites. Use whenever choosing tests, validating a change, investigating a failure, or preparing a release.
paths:
  - "tests/**/*.php"
  - "tests/e2e/**/*.js"
  - "phpunit.xml"
  - "playwright.config.js"
  - "package.json"
---

# Test Budget Optimizer

Testing should maximize confidence per minute and per agent/tool call.

## Verification ladder

Start at the lowest level that can prove the changed behavior, then escalate only when risk requires it:

1. **Local syntax/static check** for touched files when useful.
2. **Single test / filter** covering the exact defect or service.
3. **Affected test class/module** including negative cases.
4. **Frontend build** if frontend, asset, dependency or Vite behavior changed.
5. **Single Playwright spec/journey** for interactive integration behavior.
6. **Full PHP regression + build + required E2E** for cross-cutting changes, milestone gates, CI parity or release candidates.

## Selection rules

- Find existing tests before creating new ones.
- Prefer a regression test that fails before the fix and passes after it.
- Do not run full Playwright after every backend edit when a unit/feature test proves the behavior.
- Do not rerun the same expensive suite if no relevant code/config/environment changed since its last trustworthy result.
- If one gate fails, fix or classify that first root failure before spending resources on later gates.
- Separate app defects from flaky browser timing, missing services, test-data pollution and environment incompatibility.
- Never delete or weaken meaningful assertions simply to get green output.

## Release exception

Cost optimization never means skipping required release gates. Before merge/deploy, run the exact CI-equivalent regression needed by the project's current workflow and record the exact commit plus results.

## Evidence format

Keep evidence compact: command, scope, pass/fail, first root failure when failed, and commit/worktree state. Avoid pasting entire successful logs into status documents.