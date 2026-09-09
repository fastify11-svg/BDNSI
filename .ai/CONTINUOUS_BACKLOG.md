# BDNSI Continuous Autonomous Development Backlog

## P0 - Critical Regressions
*None active.*

## P1 - High Value Security / Core
- [ ] [LANE 1] Audit route protection for newly added Center routes (Ensure `CenterScope` or `center_id` authorization is absolute).

## P2 - Medium Value Improvements
- [ ] [LANE 8] Reduce duplicate business logic: Abstract `Student` and `Result` target calculations out of controllers into `PerformanceService` to dry up `Admin\TeamPerformanceController` and `Staff\TeamPerformanceController`.
- [ ] [LANE 5] Frontend Error States: Ensure all forms properly handle network timeouts gracefully.

## P3 - Low Priority Polish
- [ ] [LANE 7] Safe dependency updates: Check if any minor packages (like `tailwindcss`, `vite`) need updating without breaking changes.

## BLOCKED
- [BLOCKED] `FIX_ADMIN_RBAC_TEST_FAILURES` - Local test database connection (`bdnsi_testing` on 127.0.0.1:3306) refuses connection, preventing local PHPUnit execution.

## COMPLETED (Recent)
- [x] [LANE 7] Audit and resolve NPM vulnerabilities (Axios, PDF.js, etc.)
- [x] [LANE 4] Fix severe O(N) N+1 query loop and memory leak in `Admin\CommissionController@index`.
- [x] [LANE 4] Optimize O(N) N+1 query loop in `Admin\TeamPerformanceController@index`.
- [x] [LANE 8] Configure ESLint for React/Inertia to enforce code maintainability.
