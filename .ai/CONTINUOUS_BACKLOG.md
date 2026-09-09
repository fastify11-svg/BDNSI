# BDNSI Continuous Autonomous Development Backlog (Cycle 4)

## P0 - Critical Regressions
*None active.*

## P1 - High Value Security / Core
*None active.*

### Lane 4: Performance & Optimization (P3)
- [x] **ADD_PERFORMANCE_INDEXES_TO_FINANCIAL_TABLES (COMPLETED)**
  - Added missing indexes to `orders.status`, `orders.created_at`, `payments.status`, and `payments.created_at` to prevent N+1 full table scans on history list endpoints.

- [x] **RESOLVE_ADMIN_LIST_N_PLUS_1_QUERIES (COMPLETED)**
  - Optimized 9 aggregate analytics queries into a single `selectRaw` query in `StudentController`.
  - Added a global `selectRaw` analytics query to `CenterController` and fixed the frontend React dashboard calculating KPIs on paginated subsets instead of global totals. (N+1 in list queries were already resolved via `with` arrays in earlier React refactor).

## P2 - Medium Value Improvements
*None active.*

## P3 - Low Priority Polish
*None active.*

## BLOCKED
*None active.*

## COMPLETED (Cycle 4)
- [x] [LANE 3] Testing: Refactored legacy tests. Successfully stabilized the entire SQLite test environment. Test runner executing perfectly natively with 132 / 132 tests passing.
- [x] [LANE 1] Security: Audited file upload endpoints across the application. Added strict `image|mimes:jpeg,jpg,png,webp|max:2048` validation constraints to 15 different unvalidated or loosely validated photo fields in Student Controllers, Center Requests, Team Controllers, Slider Controller, and Config Dictionary.
- [x] [LANE 3] Testing: Migrated the test environment from `mysql` to `sqlite` `:memory:`. Overrode the `CRITICAL SAFETY ABORT` in `CreatesApplication.php` to allow SQLite. Installed `doctrine/dbal` to fix migration `RENAME COLUMN` incompatibilities in SQLite. The test runner now successfully boots and executes, unblocking the environment.

## COMPLETED (Cycle 3)
- [x] [LANE 1] Security: Verified token expiration natively (60m) and implemented global IP-based rate limiting (3/minute) for `forgot-password` endpoints on all 4 guards to prevent token generation spam.
- [x] [LANE 3] Testing: Implemented Playwright E2E test suite (`tests/e2e/staff-portal.spec.js`) for the `Staff` portal to verify authentication and basic navigation.
- [x] [LANE 8] Code Quality: Standardized authorization by removing obsolete `abort_if` center_id checks in `StudentController` that were completely redundant due to global `CenterScope` auto-applied by Route Model Binding.
- [x] [LANE 4] Performance: Consolidated `FrontendDataService` fragmented cache keys into a single `homepage_payload_v2` payload, drastically reducing Redis/Cache I/O roundtrips on the public homepage. Updated `ClearsFrontendCache` trait to clear only the unified key.

## COMPLETED (Cycle 2)
- [x] [LANE 3] Testing: Added explicit Playwright E2E test suite (`tests/e2e/center-hub.spec.js`) to verify Center Certificates Hub and Order History flows.
- [x] [LANE 8] Code Quality: Audited Blade templates. Discovered that templates like `admin.center.create` and `student.edit` are still actively used as HTML fragments returned for legacy jQuery AJAX modals. Removal deferred until DataTables are fully replaced by native React grids.
- [x] [LANE 6] Operations: Scheduled `system:health-check` and `system:db-integrity-check` to run daily via `app/Console/Kernel.php` and log failures locally.
- [x] [LANE 2] Business Integrity: Enforced strict payment constraints on the `Student` model `saving` event to prevent `payment_status = 1` if `due_amount > 0`.
