---
name: ci-root-cause-triage
description: Diagnose BDNSI GitHub Actions or local CI-parity failures by isolating the first root failure instead of repeatedly rerunning pipelines or making broad speculative changes. Use for failing workflows, tests, builds, Playwright jobs, environment mismatch, or flaky CI.
paths:
  - ".github/workflows/**/*.yml"
  - ".github/workflows/**/*.yaml"
  - "phpunit.xml"
  - "playwright.config.js"
  - "composer.json"
  - "package.json"
---

# CI Root-Cause Triage

## Fast triage

1. Identify the exact commit, workflow run, failed job and first failed step.
2. Read only the relevant failure lines plus enough surrounding context to understand them.
3. Classify the failure before editing:
   - application regression
   - test-data/schema problem
   - dependency/runtime mismatch
   - workflow/configuration error
   - missing secret/external service
   - flaky timing/network/browser behavior
   - infrastructure outage
4. Reproduce the smallest failing command locally or in the same environment when possible.
5. Change only the layer responsible for the root cause.
6. Re-run the failed command first; rerun broader CI only after a material fix.

## Guardrails

- MySQL 8 remains canonical; do not switch to SQLite to silence CI database failures.
- Do not mass-upgrade Composer/npm packages because one job fails.
- Do not add sleeps/retries until flakiness is proven and the retry is bounded/appropriate.
- Do not remove tests, assertions, authorization or validation to get green CI.
- Treat secret/credential absence as configuration, not an excuse to hardcode values.
- When CI and local results differ, compare PHP/Node/MySQL versions, env variables, caches, lockfiles and service readiness before rewriting code.

## Output

Produce a compact root-cause statement, failed gate, exact evidence, minimal fix, verification result and whether full CI still needs to run. Avoid dumping complete logs into repository documents.