$report = @"
# PC_AGENTROUTER_REMOVAL_REPORT

## Executive Summary
A comprehensive PC-wide audit was conducted to locate and remove any residual configurations, routing overrides, shell wrappers, or processes related to AgentRouter/AnyRouter. The system was found to be largely clean of deep integrations. The root cause of the unexpected routing behavior was isolated to user-level environment variables overriding the default API endpoints for Anthropic-based tooling. These variables have been successfully removed, restoring normal default routing and behavior.

## AgentRouter Components Found
- Two User-level Environment Variables in the Registry:
  - ANTHROPIC_BASE_URL
  - ANTHROPIC_AUTH_TOKEN

## Root Cause of Automatic Routing
The automatic routing to AgentRouter for certain applications was caused by the existence of the ANTHROPIC_BASE_URL and ANTHROPIC_AUTH_TOKEN environment variables in the Windows User Environment (Registry). Because these are global user-level variables, any application or development tool querying these variables for Anthropic API connections automatically inherited the AnyRouter endpoint instead of the official API endpoint.

## Environment Variables Removed
- ANTHROPIC_BASE_URL
- ANTHROPIC_AUTH_TOKEN

## PATH Entries Removed
- None (No AgentRouter paths were found in User or System PATH).

## PowerShell Changes
- None (All profiles checked: AllUsersAllHosts, AllUsersCurrentHost, CurrentUserAllHosts, CurrentUserCurrentHost were clean).

## CMD Changes
- None.

## Proxy Changes
- None (WinHTTP and WinINET proxies were inspected and confirmed to be clean).

## DNS/Hosts Changes
- None (The C:\Windows\System32\drivers\etc\hosts file contained no AgentRouter/AnyRouter mappings).

## Codex/OpenAI Configuration Changes
- None (No specific OpenAI or Codex developer tool overrides were found).

## npm/pnpm/yarn Changes
- None (Global packages and proxy settings were clean).

## Startup Entries Removed
- None.

## Scheduled Tasks Removed
- None.

## Services Removed
- None.

## Processes Stopped
- None.

## Files/Directories Removed
- None (Searches across AppData\Roaming, AppData\Local, and home directory dotfiles revealed no residual AgentRouter directories).

## Registry Changes
- **[DELETED]** HKCU:\Environment\ANTHROPIC_BASE_URL
- **[DELETED]** HKCU:\Environment\ANTHROPIC_AUTH_TOKEN

## Backups Created
- None (Changes were minimal and restricted to deleting two specific environment variables).

## Remaining AgentRouter References
- None.

## MANUAL_REVIEW_REQUIRED
- None.

## MANUAL_ADMIN_ACTION_REQUIRED
- None.

## Restart/Logoff Required
**YES.**
To ensure that all running background applications (like File Explorer, IDEs, or background services that spawned before this cleanup) drop the old environment variables and inherit the clean environment block, you should log off and log back in, or restart the PC.

## Verification Results
- A fresh PowerShell command execution confirmed that the specific Registry keys under HKCU:\Environment are successfully deleted.
- Deep searches across configuration files, startup locations, and shell profiles confirmed no other active configuration remains.

---

PC AGENTROUTER CLEANUP: COMPLETE - RESTART REQUIRED
"@
Set-Content -Path "C:\Users\Naeem\Desktop\PC_AGENTROUTER_REMOVAL_REPORT.md" -Value $report -Encoding utf8
