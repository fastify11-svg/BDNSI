# 84H NONSTOP EXECUTION BACKLOG

**Current Cycle:** 3
**Current Lane:** Lane 1-8 — Full Security + Performance Audit

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

## Cycle 2 Archive

### TSK-7: Validate Center Scope in Commission and Ledger Models (PASS)
### TSK-8: Audit and Apply Database Indexes for Analytics (PASS)
### TSK-9: Enhance Lighthouse Scores (Inertia Head) (PASS)
### TSK-10: Mitigate PII Leakage in PaymentController Logs (PASS)

---

## Cycle 3 Tasks

### TSK-11: Apply Login Rate Limiting to Center/Staff/Student Portals
- **Lane**: Lane 1 — Security / Auth
- **Priority**: P0
- **Evidence**: POST /login, /staff/login, /students/login had no throttle — brute-force vector
- **Fix**: Added `throttle:center-login`, `throttle:staff-login`, `throttle:student-login` in RouteServiceProvider + applied to route files
- **Status**: PASS (Verified on production via artisan route:list)

### TSK-12: Add Security Headers Middleware
- **Lane**: Lane 2 — Security Headers
- **Priority**: P1
- **Evidence**: No X-Frame-Options, X-Content-Type-Options, or Referrer-Policy headers on any response
- **Fix**: Created `SecurityHeaders.php` middleware, registered globally in Kernel.php
- **Status**: PASS (Verified live: curl https://nenobet.live confirms all 5 headers active)

### TSK-13: N+1 Query Audit in Admin Controllers
- **Lane**: Lane 4 — Performance
- **Priority**: P1
- **Evidence**: Checked all paginate() calls in Admin controllers
- **Finding**: All major controllers already use with() eager loading; CommissionController, StudentDocumentController verified PASS
- **Status**: PASS

### TSK-14: Mass Assignment Safety Audit
- **Lane**: Lane 3 — Code Security
- **Priority**: P1
- **Evidence**: Role and Permission models use public $guarded = [] (Laratrust standard pattern)
- **Finding**: All user-facing models use explicit $fillable; Role/Permission only written by seeders/admin — PASS
- **Status**: PASS

### TSK-15: GeminiOCR Endpoint Security Audit
- **Lane**: Lane 1 — Security / Auth
- **Priority**: P0
- **Evidence**: AI OCR endpoint could expose API keys or internal errors
- **Finding**: Endpoint behind auth:admin + throttle:10,1; no stack traces in responses — PASS
- **Status**: PASS

### TSK-16: Financial Routes Authorization Audit
- **Lane**: Lane 1 — Security / Auth
- **Priority**: P0
- **Evidence**: Financial data must be super-admin only
- **Finding**: All financial routes inside middleware(['role:admin']) group — PASS
- **Status**: PASS

### TSK-17: CenterRiskController N+1 Performance (DEFERRED)
- **Lane**: Lane 4 — Performance
- **Priority**: P2
- **Evidence**: evaluateRisk() called per-center; each call makes 2+ DB queries; O(N) issue
- **Finding**: Admin-only, low frequency dashboard. Acceptable for current scale. Defer to Cycle 4.
- **Status**: DEFERRED — P2 backlog for Cycle 4

### TSK-18: Backup Controller Authorization Audit
- **Lane**: Lane 1 — Security / Auth
- **Priority**: P0
- **Evidence**: Backup download must be super-admin only
- **Finding**: Inside auth:admin group. path traversal prevented via basename(). Only .sql extension allowed. PASS
- **Status**: PASS

---

## Cycle 1 Archive

### TSK-1: Verify Tenant Isolation in API Routes (PASS)
### TSK-2: Audit Admin Logout Timeout/Fallback (PASS)
### TSK-3: Audit Missing Indexes for Core Queries (PASS)
### TSK-4: Audit Strict Mode and Eager Loading (PASS)
### TSK-5: Remove Residual Debug Logging (PASS)
### TSK-6: Address Security Vulnerabilities in laravel/framework (PASS)
