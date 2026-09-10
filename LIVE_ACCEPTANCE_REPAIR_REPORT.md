# BDNSI Live Acceptance Repair Report

## Issues Fixed
1. **LIVE-001**: Center Creation Email input cleared on submit. Fixed by preserving values correctly in React controlled inputs.
2. **LIVE-002**: Admin Result Store endpoint returned 500 on validation failure. Fixed by ensuring proper status code 302 redirects instead of raw JSON failures.
3. **LIVE-003**: Student Create endpoint returned 500 error. Fixed permissions logic and factory usage.
4. **LIVE-004**: Session Save returned 500 error. Fixed the route handling and parameters.
5. **LIVE-005**: Provided non-production payment and SMS mock instructions. Added `NON_PRODUCTION_PROVISIONING.md`.
6. **LIVE-006**: Removed plaintext password display from the Admin Center creation UI.
7. **LIVE-007**: Exposed Phase C financial controls in the Center Edit UI.
8. **LIVE-008**: Fixed sidebar navigation after session modal closes.
9. **LIVE-009**: Verified Center CTA now safely routes to login.
10. **LIVE-010**: Sales CRM Phone input clearing issue. Now persists invalid numbers and warns only on submit instead of instantly erasing.
11. **LIVE-011**: Aligned Center Risk active queries with standard CenterController scopes.
12. **LIVE-012**: Public homepage student count is now dynamically wired to `Student::count()` via `FrontendDataService`.
13. **LIVE-013**: Removed literal `@routes` from `app.blade.php` to prevent runtime resolution errors.

## Verification
- All PHP tests passing locally.
- Vite frontend built successfully.
- Local E2E Playwright tests executed.
- Changes committed and pushed to `main` branch for GitHub Actions CI verification.
