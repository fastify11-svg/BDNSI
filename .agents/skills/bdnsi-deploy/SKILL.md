---
name: bdnsi-deploy
description: >-
  Use this skill when deploying the BDNSI project to the live Hostinger server.
  Covers the full deploy pipeline: build assets, run tests, create archive,
  FTP upload via basic-ftp, and verify live site. Activate when the user says
  "deploy", "push to live", "upload to server", or "go live".
---

# BDNSI Deploy to Live Server

## Prerequisites

- XAMPP MySQL running (Apache not required)
- All local tests passing: `npx playwright test`
- `.env` has SSH/FTP credentials
- The user has explicitly approved this exact reviewed change set for deployment.

## Step 1 — Run Tests First (MANDATORY)

```powershell
npx playwright test
```

If any test fails → **STOP, fix the bug, re-run tests** before proceeding.

## Step 2 — Build Frontend Assets

```powershell
npm run build
```

Verify `public/build/manifest.json` exists after build.

## Step 3 — Create Deploy Archive

```powershell
node create_dump.mjs
```

## Step 4 — Upload via FTP

```powershell
node auto_deploy.mjs
```

Monitor output for errors. If FTP times out, retry with:

```powershell
node full_auto_deploy.mjs
```

## Step 5 — Verify Live Site

Use Chrome DevTools MCP to navigate to the live URL and take a screenshot:

1. Navigate to `https://bdnsi.yttc.com.bd` (or configured live URL)
2. Take screenshot and verify page loads correctly
3. Check no 500 errors in Network tab

## Step 6 — Record Release State

Report the deployed commit, exact verification evidence, and rollback reference. Do not create a new commit merely to deploy.

## Rollback

If live site breaks:

```powershell
git revert HEAD
git push origin main
node auto_deploy.mjs
```
