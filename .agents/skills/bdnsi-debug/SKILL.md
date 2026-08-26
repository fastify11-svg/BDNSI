---
name: bdnsi-debug
description: >-
  Use this skill when debugging errors in the BDNSI Laravel + React project.
  Covers reading Laravel logs, PHP errors, Vite build errors, MySQL connection
  issues, and Inertia.js rendering failures. Activate when the user reports
  a 500 error, blank page, console error, or test failure.
---

# BDNSI Debug & Self-Healing Workflow

## Step 1 — Identify Error Source

Run these in order until the error is found:

```powershell
# Check Laravel log (last 50 lines)
Get-Content storage\logs\laravel.log -Tail 50

# Check artisan route list
C:\xampp\php\php.exe artisan route:list

# Check DB connection
C:\xampp\php\php.exe artisan migrate:status
```

## Step 2 — Common Error Fixes

### 500 Internal Server Error

```powershell
# Clear all caches
C:\xampp\php\php.exe artisan optimize:clear
C:\xampp\php\php.exe artisan config:clear
C:\xampp\php\php.exe artisan cache:clear
C:\xampp\php\php.exe artisan view:clear
```

### Vite Manifest Missing (419 / blank page)

```powershell
npm run build
```

### Session/Cookie Errors

```powershell
C:\xampp\php\php.exe artisan session:table
C:\xampp\php\php.exe artisan migrate
```

### MySQL Connection Refused

- Start XAMPP Control Panel → Start MySQL
- Verify `.env`: `DB_HOST=127.0.0.1`, `DB_PORT=3306`, `DB_USERNAME=root`, `DB_PASSWORD=`

### Inertia.js Page Not Found

```powershell
C:\xampp\php\php.exe artisan route:list | findstr /i "inertia"
```

## Step 3 — Run Playwright to Verify Fix

```powershell
npx playwright test --reporter=list
```

All tests must pass (✅) before pushing.

## Step 4 — Verification Handoff

Report the root cause, changed files, exact regression result, and remaining risk. Commit, push, or deployment requires explicit user approval.

## Laravel Log Location

`C:\BDNSI\storage\logs\laravel.log`

## Playwright Report

```powershell
npx playwright show-report
```
