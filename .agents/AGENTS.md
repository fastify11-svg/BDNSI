# Workspace Rules & Autonomous Development Workflow (v4.0)

> **Operating system:** Read `.agents/AGENT_OPERATING_SYSTEM.md` and `.agents/PROJECT_MEMORY.md` before every task. Use `.agents/reports/REPORT_TEMPLATE.md` for every completion report.

**Project**: BDNSI — Next-Gen Affiliate & Agent Management System
**Stack**: Laravel 10 + React (Inertia.js) + Vite + Tailwind CSS + MySQL
**Local URL**: `http://127.0.0.1:8000`
**Live Server**: Hostinger (deploy via SSH/FTP)
**GitHub**: `https://github.com/fastify11-svg/BDNSI.git`
**IDE**: Antigravity IDE (Google Deepmind) — NO VS Code, NO external editors

---

## System Paths (Always use these)

- **PHP**: `C:\xampp\php\php.exe`
- **Composer**: `C:\xampp\php\composer.bat`
- **MySQL**: `C:\xampp\mysql\bin\mysql.exe`
- **Node**: `node` (v24.19.0 — available globally)
- **NPM**: `npm` (PowerShell ExecutionPolicy = RemoteSigned ✅)
- **Artisan**: `C:\xampp\php\php.exe artisan`
- **Project Root**: `C:\BDNSI`

## Quick Command Reference

```powershell
# Laravel server start
C:\xampp\php\php.exe artisan serve

# Vite dev server
npm run dev

# Run migrations
C:\xampp\php\php.exe artisan migrate

# Composer install
C:\xampp\php\composer.bat install

# Playwright tests
npx playwright test

# Build frontend
npm run build

# Git push
git add -A && git commit -m "message" && git push origin main
```

---

## Agentic Workflow Rules (v4.0)

### 1. No External Editor

All coding, execution, and testing within **Antigravity IDE only**. Never reference VS Code, ignore `.vscode/` configs.

### 2. GitHub and Deployment Approval

After a sprint, feature, or bugfix, prepare the verification result and Git diff. Commit, push, deployment, and any live-server action require the user's explicit approval for that specific change set.

### 3. Internal Execution

All servers, builds, tests run via internal terminal. Never ask user to run commands manually.

### 4. Self-Healing Bug Loop

On any error:

1. Read terminal/log output
2. Identify root cause
3. Fix the code
4. Re-run test
5. Report the fix and wait for approval before any GitHub or deployment action

Repeat until ✅ green.

### 5. CI/CD via GitHub Actions

Every push triggers `.github/workflows/autonomous.yml` automatically. Ensure it stays valid.

### 6. Full E2E Verification Lifecycle

After code changes:

1. Run `npx playwright test`
2. Fix any failures autonomously
3. Verify data flow end-to-end
4. Report the exact verification result
5. Wait for explicit approval before pushing or deploying

### 7. Laravel-Specific Rules

- Always run `C:\xampp\php\php.exe artisan` (never bare `php artisan`)
- Always run `C:\xampp\php\composer.bat` (never bare `composer`)
- Clear cache after config changes: `C:\xampp\php\php.exe artisan optimize:clear`
- Use `APP_URL=http://127.0.0.1:8000` for local testing

### 8. Database Rules

- Local DB: MySQL via XAMPP (`DB_DATABASE=yttccomb_bdnsi`, `DB_HOST=127.0.0.1`)
- Always backup before migrations: `C:\xampp\mysql\bin\mysqldump.exe -u root yttccomb_bdnsi > backup.sql`
- Use `migrate:fresh --seed` only in CI, never locally without backup
- **SAFETY RULE**: `migrate:fresh`, `db:wipe`, destructive resets, or destructive schema cleanup MUST NEVER execute against production or valuable shared staging data. Such commands are allowed ONLY in explicitly verified disposable local test environments.

### 9. Frontend Rules

- Vite + React + Inertia.js
- Tailwind CSS for styling
- Build: `npm run build` → outputs to `public/build/`
- Dev HMR: `npm run dev` + separate terminal for Laravel

### 10. Deployment Rules

- SSH credentials in `.env` (never hardcode in scripts)
- FTP via `basic-ftp` npm package
- Deploy script: `node auto_deploy.mjs`
- GitHub webhook secret in repo secrets as `DEPLOY_WEBHOOK_URL`

---

## Multi-Step Planning Mode (MANDATORY)

### When to Create an Implementation Plan

ALWAYS create `implementation_plan.md` artifact BEFORE writing code when:

- Feature touches **3 or more files**
- Feature requires a **database migration**
- Feature is a **new page or module**
- Request involves **API design**
- Task is **ambiguous or underspecified**
- Task may have **breaking changes**

### When to Skip Planning (Simple Tasks)

Skip planning for:

- Single-file bug fixes
- CSS/style tweaks
- Adding a single route
- Log inspection or cache clearing
- Config value changes

### Planning Template

```text
## Goal
[What this accomplishes]

## Affected Files
- [NEW] path/to/new/file.php
- [MODIFY] path/to/existing/file.jsx
- [DELETE] path/to/removed/file.php

## DB Changes
- Migration: create_xxx_table
- Columns: id, name, ...

## API/Routes
- GET /route → Controller@method

## Verification
- Playwright test: tests/e2e/xxx.spec.js
- Manual check: [describe]
```

---

## Parallel Execution Strategy

### Tasks That CAN Run in Parallel

Launch these simultaneously using multiple tool calls:

| Parallel Group | Tasks |
| --- | --- |
| **Dev Servers** | `php artisan serve` + `npm run dev` |
| **File Creation** | Migration + React Component + Playwright test stub |
| **Research** | Read multiple files simultaneously |
| **Verification** | Screenshot + run tests + check logs |

### Tasks That MUST Run Sequentially

```text
1. Migration → Model → Controller → Route
2. Backend complete → Frontend integration
3. Code written → Tests run → Tests pass → user approval → Git push
4. Git push → GitHub Actions → user approval → Deploy → Verify live
```

### Parallel Tool Call Pattern

When creating multiple independent files, call all write tools simultaneously:

```text
[write Controller] + [write Model] + [write React page] ← all at once
```

---

## Verification Gates (Strict)

### Gate 1 — Before Any Code Change

- Read the file first (`view_file`)
- Understand the current state
- Plan the minimal change

### Gate 2 — After Terminal Command

- Check exit code (0 = success)
- Read first 20 lines of output
- If error → self-heal immediately (do not stop)

### Gate 3 — After Feature Complete

- Run `npx playwright test`
- All tests must pass
- No exceptions

### Gate 4 — Before Deployment

- Gate 3 must pass
- `npm run build` must succeed
- `git status` must be clean (or staged intentionally)

### Gate 5 — After Deployment

- Navigate to live URL via Chrome DevTools MCP
- Take screenshot as proof
- Verify no console errors

---

## Active Skills (Auto-loaded)

| Skill | Trigger |
| --- | --- |
| `bdnsi-deploy` | "deploy", "push to live", "go live" |
| `bdnsi-debug` | "500 error", "not working", "fix bug", "broken" |
| `bdnsi-feature` | "build", "add feature", "new page", "implement" |

---

## Project Architecture

```text
D:\BDNSI/
├── app/                  # Laravel PHP (Models, Controllers, Middleware)
├── resources/js/         # React components, Inertia pages
├── resources/css/        # Tailwind CSS
├── routes/               # web.php, api.php
├── database/             # Migrations, Seeders, Factories
├── public/build/         # Compiled Vite assets
├── tests/e2e/            # Playwright E2E tests
├── .github/workflows/    # CI/CD (autonomous.yml)
├── .agents/              # Antigravity IDE workspace config
│   ├── AGENTS.md         # This file — master rules
│   ├── hooks.json        # Lifecycle hooks
│   ├── mcp_config.json   # MCP servers
│   ├── hooks/            # Hook scripts (Node.js)
│   │   ├── pre_command_gate.js
│   │   ├── post_command_audit.js
│   │   ├── pre_invocation_reminder.js
│   │   └── stop_guard.js
│   ├── skills/           # Custom workflow skills
│   │   ├── bdnsi-deploy/
│   │   ├── bdnsi-debug/
│   │   └── bdnsi-feature/
│   └── logs/             # Command audit trail
└── playwright.config.js  # E2E test config
```

## Known Issues & Fixes

| Issue | Fix |
| --- | --- |
| `npm` blocked | ExecutionPolicy = RemoteSigned (already fixed) |
| `php` not in PATH | Use full path: `C:\xampp\php\php.exe` |
| `composer` not in PATH | Use: `C:\xampp\php\composer.bat` |
| Session errors | `php artisan session:table && php artisan migrate` |
| Vite manifest missing | Run `npm run build` first |
| 500 on live | Check `storage/` permissions on server |

---

## MCP Tools Available in Antigravity IDE

- **chrome-devtools-mcp** (project): Browser automation, screenshots, debugging
- **chrome-devtools** (global): Built-in Antigravity Chrome DevTools

Use `chrome-devtools-mcp` for:

- Taking screenshots of local dev server
- Clicking through UI flows
- Running Lighthouse audits
- Debugging JavaScript errors in browser
