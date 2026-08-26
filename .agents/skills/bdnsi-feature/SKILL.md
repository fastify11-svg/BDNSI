---
name: bdnsi-feature
description: >-
  Use this skill when building a new feature for the BDNSI project.
  Covers the full feature development lifecycle: plan → branch → implement
  (Laravel backend + React frontend) → test → review → merge → deploy.
  Activate when the user says "build", "add feature", "create page",
  "new module", "implement", or describes a new user story.
---

# BDNSI New Feature Development Workflow

## Step 1 — Create Implementation Plan

Before writing any code, create `.agents/plans/<feature-name>.md` with:

- **Goal**: What does this feature do?
- **Affected files**: Controllers, Models, Migrations, React pages
- **API routes**: New routes in `routes/web.php` or `routes/api.php`
- **DB changes**: New tables or columns (migration names)
- **UI components**: New React components needed
- **Tests**: Which Playwright specs to add/update

Request user review if plan has breaking changes.

## Step 2 — Database Migration (if needed)

```powershell
C:\xampp\php\php.exe artisan make:migration create_<table>_table
# Edit the migration file in database/migrations/
C:\xampp\php\php.exe artisan migrate
```

## Step 3 — Laravel Backend

Order of implementation:

1. **Model** — `app/Models/<Name>.php` with relationships
2. **Controller** — `app/Http/Controllers/<Name>Controller.php`
3. **Request** — `app/Http/Requests/<Name>Request.php` (validation)
4. **Routes** — Add to `routes/web.php` (Inertia) or `routes/api.php`
5. **Middleware** — Apply auth/role guards as needed

```powershell
C:\xampp\php\php.exe artisan make:model <Name> -mcr
```

## Step 4 — React Frontend (Inertia.js)

1. Create page: `resources/js/Pages/<Name>/Index.jsx`
2. Add Inertia link in nav component if needed
3. Use Tailwind CSS for styling
4. Test with hot reload: `npm run dev`

## Step 5 — Write Playwright Test

Add test to `tests/e2e/<feature>.spec.js`:

```js
import { test, expect } from '@playwright/test';

test('<Feature> loads correctly', async ({ page }) => {
  await page.goto('/your-route');
  await expect(page.locator('h1')).toContainText('Expected Title');
});
```

## Step 6 — Run Full Test Suite

```powershell
npx playwright test
```

All must pass ✅.

## Step 7 — Verification Handoff

Report the changed files, exact test/build results, migration impact, and Git diff. Commit, push, and deployment require the user's explicit approval for the reviewed change set.

## Parallel Execution Pattern

These tasks CAN run in parallel (no dependency):

- Writing migration ↔ Writing React component
- Writing Controller ↔ Writing Playwright test scaffold
- `npm run dev` (Vite) ↔ `php artisan serve` (Laravel)

These tasks MUST run sequentially:

1. Migration → Model → Controller → Route
2. Backend done → Frontend integration
3. Code done → Tests → Review report → User approval → Push
