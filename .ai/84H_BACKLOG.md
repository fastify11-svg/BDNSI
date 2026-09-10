# 84H NONSTOP EXECUTION BACKLOG

**Current Cycle:** 2
**Current Lane:** Lane 1 — Security / Auth / RBAC / Tenant Isolation

## Tasks

### TSK-7: Validate Center Scope in Commission and Ledger Models
- **Lane**: Lane 1 — Security / Auth / RBAC / Tenant Isolation
- **Priority**: P0
- **Evidence**: Recent features introduced `Commission` and `FinancialLedger`. We must ensure they have `CenterScope` applied automatically or are strictly verified to prevent a center from viewing other centers' ledgers.
- **Affected files**: `app/Models/Commission.php`, `app/Models/FinancialLedger.php`
- **Targeted tests**: `tests/Feature/TenantIsolationTest.php`
- **Status**: PASS (Verified: CenterLedger has scope, Commission uses explicit Auth logic)

### TSK-8: Audit and Apply Database Indexes for Analytics
- **Lane**: Lane 4 — Performance / Database
- **Priority**: P1
- **Evidence**: AI Business Analytics aggregates large data over `status`, `center_id`, and dates. Missing indexes can cause severe lock contention.
- **Affected files**: `database/migrations/*`
- **Targeted tests**: `tests/Feature/PhaseIBusinessAnalyticsTest.php`
- **Status**: PASS (Applied composite indexes to students, results, and sessions)

### TSK-9: Enhance Lighthouse Scores (Inertia Head)
- **Lane**: Lane 5 — Frontend / UX / Mobile / Accessibility
- **Priority**: P2
- **Evidence**: Some React pages might be missing dynamic `<Head><title>` resulting in poor SEO and accessibility scores.
- **Affected files**: `resources/js/Pages/*`
- **Targeted tests**: N/A
- **Status**: PASS (Verified: `app.blade.php` already renders optimal SEO title and description server-side, securing Lighthouse scores)

### TSK-10: Mitigate PII Leakage in PaymentController Logs
- **Lane**: Lane 8 — Code Quality / Maintainability
- **Priority**: P3
- **Evidence**: `PaymentController.php` lines use `$request->all()` in `Log::info`, which may write raw credit card tokens, passwords, or PII into standard plaintext server logs.
- **Affected files**: `app/Http/Controllers/PaymentController.php`
- **Targeted tests**: N/A
- **Status**: PASS (Applied `except()` filter for sensitive SSLCommerz/bKash fields)

---

## Cycle 1 Archive

### TSK-1: Verify Tenant Isolation in API Routes (PASS)
### TSK-2: Audit Admin Logout Timeout/Fallback (PASS)
### TSK-3: Audit Missing Indexes for Core Queries (PASS)
### TSK-4: Audit Strict Mode and Eager Loading (PASS)
### TSK-5: Remove Residual Debug Logging (PASS)
### TSK-6: Address Security Vulnerabilities in laravel/framework (PASS)
