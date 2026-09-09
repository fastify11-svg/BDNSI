# BDNSI Continuous Autonomous Development Backlog (Cycle 3)

## P0 - Critical Regressions
*None active.*

## P1 - High Value Security / Core
- [ ] [LANE 1] Security: Verify that password reset tokens have strict expiration times and limit token generation per IP.

## P2 - Medium Value Improvements
- [ ] [LANE 4] Performance: Consolidate `FrontendDataService` fragmented cache keys into a single payload `homepage_data_v2`, reducing Redis/Cache I/O roundtrips by 90% on the public homepage. Update `ClearsFrontendCache` trait accordingly.
- [ ] [LANE 3] Testing: Implement Playwright E2E tests for the `Staff` Portal.

## P3 - Low Priority Polish
- [ ] [LANE 8] Code Quality: Standardize inline `abort_if(403)` checks in controllers to use Laravel Policies or Gates.

## BLOCKED
- [BLOCKED] `FIX_ADMIN_RBAC_TEST_FAILURES` - Local test database connection (`bdnsi_testing` on 127.0.0.1:3306) refuses connection, preventing local PHPUnit execution.

## COMPLETED (Cycle 2)
- [x] [LANE 3] Testing: Added explicit Playwright E2E test suite (`tests/e2e/center-hub.spec.js`) to verify Center Certificates Hub and Order History flows.
- [x] [LANE 8] Code Quality: Audited Blade templates. Discovered that templates like `admin.center.create` and `student.edit` are still actively used as HTML fragments returned for legacy jQuery AJAX modals. Removal deferred until DataTables are fully replaced by native React grids.
- [x] [LANE 6] Operations: Scheduled `system:health-check` and `system:db-integrity-check` to run daily via `app/Console/Kernel.php` and log failures locally.
- [x] [LANE 2] Business Integrity: Enforced strict payment constraints on the `Student` model `saving` event to prevent `payment_status = 1` if `due_amount > 0`.
