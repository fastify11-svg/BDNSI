---
name: laravel-surgical-fix
description: Diagnose and fix Laravel backend defects in BDNSI with the smallest evidence-backed patch. Use for routes, controllers, requests, middleware, services, policies, models, queues, jobs, Blade/PDF backend logic, or failing PHP tests.
paths:
  - "app/**/*.php"
  - "routes/**/*.php"
  - "tests/**/*.php"
---

# Laravel Surgical Fix

Treat the existing architecture as intentional until evidence proves otherwise.

## Trace before editing

1. Reproduce or identify the exact failing behavior.
2. Trace the request path: route -> auth/tenant middleware -> request validation -> controller -> service/policy -> model/query -> response/job/document.
3. Find the closest existing test and the nearest analogous working implementation.
4. Name the root cause in one or two sentences before changing code.

## Patch rules

- Prefer the existing service/policy/model boundary; do not move unrelated logic during a bug fix.
- Reuse established helpers and domain services instead of creating duplicate abstractions.
- Preserve Laravel 8 compatibility and the currently installed package APIs; do not use a framework upgrade as a shortcut.
- Validate server-side. Authorization belongs on the server, not in hidden buttons or frontend filters.
- Preserve queue/job idempotency where retries are possible.
- Keep database writes transactional when multiple records must stay consistent.
- Avoid N+1 fixes, broad naming changes, formatting sweeps, or controller rewrites unless they are part of the verified root cause.

## Efficient verification

1. Run syntax/static checks only for touched PHP files when useful.
2. Run the closest PHPUnit test/class/filter first.
3. Add or tighten a regression test when the defect was not covered.
4. Run the affected feature/module suite if the targeted test passes.
5. Run full PHP regression only for cross-cutting changes or release gating.

If the failure is environment/configuration-specific, prove that before rewriting application code.

## Completion evidence

Report the root cause, files changed, targeted test command/result, and any residual risk. Do not call a defect fixed solely because the code looks correct.