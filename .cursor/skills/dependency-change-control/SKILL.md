---
name: dependency-change-control
description: Control Composer/npm/runtime dependency changes in BDNSI so bug fixes do not turn into costly framework upgrades or compatibility churn. Use when editing composer/package manifests, lockfiles, PHP/Node requirements, Vite/Inertia/React packages, or resolving dependency/install/build conflicts.
paths:
  - "composer.json"
  - "composer.lock"
  - "package.json"
  - "package-lock.json"
  - "vite.config.*"
---

# Dependency Change Control

Dependency changes have a large regression radius. Require evidence before changing them.

## Before changing a version

1. Identify the exact failing package/API/runtime constraint and reproduce it.
2. Inspect the lockfile and current imports/usages; distinguish declared version drift from actual installed behavior.
3. Prefer a code/config fix when the dependency is not the root cause.
4. Check compatibility with Laravel 8, PHP 8.2, the current Inertia/React integration, Vite, Playwright and Node used by CI.
5. Decide whether the change is patch/minor maintenance or a major platform migration.

## Rules

- Never perform a major Laravel/React/Inertia/Vite/Node migration as a side effect of a feature or bug fix.
- Change the fewest packages necessary; do not run blanket `update`/latest upgrades without a scoped reason.
- Keep manifest and lockfile synchronized.
- Preserve `npm install --legacy-peer-deps` only if current project compatibility still requires it; do not remove it casually.
- Do not weaken security by pinning known-bad versions merely to preserve an old API.
- Major framework/platform migration requires explicit owner approval and a dedicated plan.

## Verification

After a justified dependency change, verify install reproducibility, the affected build/test, and then the relevant regression surface. Run broad regression/release gates only after targeted compatibility is proven.

Record why the dependency changed, from/to versions, and the behavior that required it. If no concrete behavior requires the upgrade, do not spend the change budget.