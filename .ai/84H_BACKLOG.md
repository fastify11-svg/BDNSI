# 84H NONSTOP EXECUTION BACKLOG

**Current Cycle:** 1
**Current Lane:** Lane 1 — Security / Auth / RBAC / Tenant Isolation

## Tasks

### TSK-1: Verify Tenant Isolation in API Routes
- **Lane**: Lane 1 — Security / Auth / RBAC / Tenant Isolation
- **Priority**: P0
- **Evidence**: Recent changes fixed session bleeding, need to ensure CenterScope global scopes cannot be bypassed via API routes.
- **Affected files**: `app/Models/Center.php`, `routes/api.php`
- **Targeted tests**: `tests/Feature/TenantIsolationTest.php`
- **Status**: PASS

### TSK-2: Audit Admin Logout Timeout/Fallback
- **Lane**: Lane 1 — Security / Auth / RBAC / Tenant Isolation
- **Priority**: P1
- **Evidence**: Playwright tests occasionally failed due to logout UI animations; ensure actual server-side token invalidation is strictly enforced independent of the UI.
- **Affected files**: `app/Http/Controllers/Auth/AuthenticatedSessionController.php`
- **Targeted tests**: PHPUnit Auth tests
- **Status**: DISCOVERED
