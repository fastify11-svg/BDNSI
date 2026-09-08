---
name: bdnsi-regression-gate
description: Ensures that existing functionality is not broken.
---

# BDNSI Regression Gate

## Trigger
Use this skill after implementation but before acceptance.

## Instructions
1. Run all existing PHPUnit and Pest tests.
2. Run frontend build `npm run build`.
3. Run existing Playwright E2E tests `npx playwright test`.
4. If ANY test fails that was previously passing, return `REWORK` and include the test output.
