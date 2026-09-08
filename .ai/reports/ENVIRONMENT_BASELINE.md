# BDNSI Environment Baseline

**Generated:** 2026-09-08T08:39:00Z  
**Host:** DESKTOP-CKSIK07  
**OS:** Windows 10/11 (PowerShell + CMD available)

---

## Toolchain

| Tool | Path / Version | Status |
|------|---------------|--------|
| Node.js | v24.20.0 (global, `C:\Program Files\nodejs\`) | ✅ Available |
| npm | 11.19.0 | ✅ Available |
| npx | bundled with npm 11 | ✅ Available |
| Git | 2.55.0.windows.5 | ✅ Available |
| PHP | C:\xampp\php\php.exe (XAMPP) | ✅ Available |
| Composer | C:\xampp\php\composer.bat | ✅ Available |
| MySQL | C:\xampp\mysql\bin\mysql.exe (XAMPP) | ✅ Available |
| Playwright | 1.62.1 | ✅ Available |
| Antigravity IDE | C:\Users\Naeem\AppData\Local\Programs\Antigravity IDE\bin | ✅ Running |
| Antigravity CLI (agy) | NOT installed (no binary found in PATH) | ⚠️ Unavailable — scheduler uses Windows Task Scheduler fallback |

---

## Laravel Environment

- Framework: Laravel 10.x
- DB: MySQL via XAMPP (local, DB_DATABASE=yttccomb_bdnsi)
- Frontend: Vite + React + Inertia.js + Tailwind CSS
- Testing: PHPUnit (Laravel feature/unit) + Playwright (E2E)
- APP_URL: http://127.0.0.1:8000

---

## Antigravity Capabilities Detected

| Capability | Status |
|------------|--------|
| `/goal` slash command | ✅ IDE feature — available |
| `/schedule` slash command | ✅ IDE feature — available |
| Custom Skills | ✅ .agents/skills/ — 14 skills loaded |
| Hooks (PreToolUse, PostToolUse, PreInvocation, Stop) | ✅ hooks.json wired |
| Custom Agents | .agents/agents/ exists (agent definitions) |
| Sidecars (agentapi) | agy CLI not installed — fallback to Windows Task Scheduler |
| Browser Subagent | ✅ chrome-devtools MCP available |

---

## Security Notes

- No secrets, API keys, or passwords recorded in this file.
- .env file excluded from all agent commits via .gitignore.
- MySQL credentials only in .env (not in any .ai/ or .agents/ file).
