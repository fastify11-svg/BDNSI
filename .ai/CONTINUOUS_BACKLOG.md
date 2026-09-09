# BDNSI Continuous Autonomous Development Backlog (Cycle 3)

## P0 - Critical Regressions
*None active.*

## P1 - High Value Security / Core
*None active.*

## P2 - Medium Value Improvements
*None active.*

## P3 - Low Priority Polish
*None active.*

## BLOCKED
- [BLOCKED] `FIX_ADMIN_RBAC_TEST_FAILURES` - Local test database connection (`bdnsi_testing` on 127.0.0.1:3306) refuses connection, preventing local PHPUnit execution.

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
