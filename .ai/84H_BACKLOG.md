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
- **Affected files**: `routes/auth.php`, `routes/admin.php`, `routes/staff.php`, `routes/student.php`
- **Targeted tests**: PHPUnit Auth tests
- **Status**: PASS

### TSK-3: Audit Missing Indexes for Core Queries
- **Lane**: Lane 4 — Performance / Database
- **Priority**: P2
- **Evidence**: Repeated count/aggregate queries on students and results might lack indexes, causing slowdowns on large center databases.
- **Affected files**: `database/migrations/*`
- **Targeted tests**: N/A
- **Status**: PASS

### TSK-4: Audit Strict Mode and Eager Loading
- **Lane**: Lane 4 — Performance / Database
- **Priority**: P2
- **Evidence**: `Model::preventLazyLoading` might not be consistently enforced in production/staging. Need to check if there are N+1 queries.
- **Affected files**: `app/Providers/AppServiceProvider.php`
- **Targeted tests**: Run test suite to see if any tests fail when preventLazyLoading is enabled globally.
- **Status**: PASS
