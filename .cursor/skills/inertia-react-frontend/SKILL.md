---
name: inertia-react-frontend
description: Implement or repair BDNSI React/Inertia/Vite UI behavior with minimal changes and without unnecessary framework upgrades. Use for pages, forms, props, navigation, frontend validation, build errors, styling regressions, or browser-side defects.
paths:
  - "resources/js/**/*.js"
  - "resources/js/**/*.jsx"
  - "resources/css/**/*.css"
  - "vite.config.*"
  - "package.json"
---

# Inertia / React Frontend

The installed manifests and lockfile are the compatibility source of truth. Do not modernize React, Inertia, Vite, Tailwind or related packages as a side effect of a UI fix.

## Trace first

1. Locate the Inertia page/component and the Laravel action that supplies its props.
2. Confirm whether the defect originates in server data, authorization, client state, rendering, navigation or build tooling.
3. Find an analogous working component before inventing a new pattern.
4. Keep security and financial decisions on the server; frontend checks are UX only.

## Patch discipline

- Preserve existing routing and Inertia conventions.
- Keep form state and validation errors deterministic; do not silently discard server errors.
- Avoid broad component rewrites for a small bug.
- Do not add dependencies when the current stack can solve the problem clearly.
- Keep accessibility basics intact: labels, keyboard interaction, meaningful buttons/links and visible error states.
- Avoid copying large components solely to create a variant; extract shared code only when duplication is real and the change is low-risk.

## Efficient verification

1. Run lint on touched files or the narrowest available lint command.
2. Exercise the exact affected page/flow in the browser when behavior is interactive.
3. Run `npm run build` after dependency/config/build-sensitive changes or before release; do not rebuild repeatedly after every trivial edit.
4. Run the closest Playwright spec for the changed journey before expanding to broader E2E.

If a build failure is caused by dependency/Node incompatibility, diagnose that specifically; do not randomly upgrade multiple packages.