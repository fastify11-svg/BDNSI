# BDNSI Continuous Autonomous Development Backlog (Cycle 2)

## P0 - Critical Regressions
*None active.*

## P1 - High Value Security / Core
- [ ] [LANE 2] Business Integrity: Enforce strict payment constraints on the `Student` model `saving` event. Prevent `payment_status = 1` if `due_amount > 0`.

## P2 - Medium Value Improvements
- [ ] [LANE 3] Testing: Add explicit Playwright E2E tests for the Center Certificates hub and Order invoices.
- [ ] [LANE 6] Operations: Schedule `system:health-check` and `system:db-integrity-check` to run daily in `app/Console/Kernel.php` and log failures.

## P3 - Low Priority Polish
- [ ] [LANE 8] Code Quality: Audit and remove unused/obsolete Blade templates that were replaced by React/Inertia pages.

## BLOCKED
- [BLOCKED] `FIX_ADMIN_RBAC_TEST_FAILURES` - Local test database connection (`bdnsi_testing` on 127.0.0.1:3306) refuses connection, preventing local PHPUnit execution.

## COMPLETED (Cycle 1)
- [x] [LANE 7] Safe minor dependency updates via `npm update` (Playwright, Vite, Tailwind, etc).
- [x] [LANE 5] Frontend Error States: Added `@inertiajs/progress` and global axios interceptors for timeouts, offline states, and 419 session expiration.
- [x] [LANE 1] Audited Center routes (`OrderController`, `CertificateController`, `StudentController`, etc.). Confirmed `CenterScope` global scope natively mitigates IDOR, and controllers include defense-in-depth explicit `center_id` validation. No vulnerabilities found.
- [x] [LANE 8] Abstracted Student and B2B Target calculation logic from controllers into a centralized `TeamPerformanceService`. Fixed missing/broken metric display in `Staff\DashboardController`.
- [x] [LANE 7] Audit and resolve NPM vulnerabilities (Axios, PDF.js, etc.)
- [x] [LANE 4] Fix severe O(N) N+1 query loop and memory leak in `Admin\CommissionController@index`.
- [x] [LANE 4] Optimize O(N) N+1 query loop in `Admin\TeamPerformanceController@index`.
- [x] [LANE 8] Configure ESLint for React/Inertia to enforce code maintainability.
