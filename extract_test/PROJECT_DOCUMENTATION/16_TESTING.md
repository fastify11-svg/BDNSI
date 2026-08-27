# 16 — Testing

## Current Testing Infrastructure

### PHPUnit (Feature + Unit Tests)
- **Location**: `tests/Feature/`, `tests/Unit/`
- **Database**: SQLite (`database/database.sqlite`)
- **Config**: `phpunit.xml`
- **Run**: `C:\xampp\php\php.exe artisan test`
- **Current Status**: ✅ **31/31 tests passing** (as of 2026-08-24)

### Test Files

| Test File | Description | Tests |
|---|---|---|
| `BasicRoutesTest.php` | Home, contact, login routes return 200 | 3 |
| `FrontendE2ETest.php` | All public frontend pages | 9 |
| `FrontendHomepageTest.php` | Homepage, all-courses, contact | 3 |
| `ModuleToggleTest.php` | Feature flags disable/enable routes | 3 |
| `RateLimitingTest.php` | Rate limit enforcement (results, contact, admin-login) | 3 |
| `SiteControlCenterTest.php` | Admin site settings save, logo upload, middleware sync | 3 |
| `StudentLifecycleTest.php` | GPA calculation for Regular/Diploma, student creation | 3 |
| `TenantIsolationTest.php` | Center user sees only own students, admin sees all | 2 |
| `ExampleTest.php` | Basic sanity check | 1 |
| `Unit/ExampleTest.php` | Unit sanity check | 1 |

---

### Playwright E2E Tests (Browser-based)
- **Location**: `tests/e2e/*.spec.js`
- **Config**: `playwright.config.js`
- **Run**: `npx playwright test`
- **Total files**: 16 spec files

| Spec File | Description |
|---|---|
| `admin.spec.js` | Admin panel basic navigation |
| `admin_health_audit.spec.js` | Admin CRUD health checks |
| `auth.spec.js` | Login/logout flows |
| `document-templates.spec.js` | Document template CRUD |
| `document_templates.spec.js` | Extended document template tests |
| `feature.spec.js` | Feature flag tests |
| `frontend-connectivity.spec.js` | Frontend route connectivity |
| `frontend.spec.js` | Public pages |
| `images-check.spec.js` | Image upload checks |
| `live_audit.spec.js` | Live site audit |
| `student-enrollment.spec.js` | Full student enrollment flow |
| `student-payload.spec.js` | Student form payload validation |
| `team-performance.spec.js` | Staff KPI dashboard |
| `youtube-video-access.spec.js` | YouTube video module |

---

## Test Coverage Analysis

### ✅ Well Tested
- Public frontend page responses
- Module toggle feature flags
- Rate limiting
- Admin site settings
- Student GPA lifecycle
- Multi-tenant isolation

### ⚠️ Partially Tested
- Student enrollment flow (E2E spec exists, may be fragile)
- Authentication flows (Playwright spec exists)
- Document template generation

### 🔴 Not Tested
- Payment flow (bKash / SSLCommerz callbacks)
- SMS notification delivery
- Online examination flow
- Staff portal CRUD
- PDF bulk generation
- Permission/role enforcement

---

## Recommended Testing Plan

### Priority 1 — Critical Business Logic
1. **Payment integration tests** — mock bKash/SSLCommerz callbacks, verify transaction records
2. **Permission tests** — verify sub-admin cannot access admin-only routes
3. **Student lifecycle end-to-end** — enroll → result entry → certificate generation

### Priority 2 — API/Controller Tests
4. **Result CRUD tests** — create, update, validate mark limits
5. **Document generation tests** — template render with student data
6. **Financial record tests** — payment entry, student balance update

### Priority 3 — Security Tests
7. **Rate limit enforcement** — verify lockout after threshold
8. **CSRF tests** — verify forms reject requests without token
9. **Tenant isolation** — verify center user cannot see other centres' data

### Priority 4 — E2E Flows
10. **Admin complete workflow** — login → add student → enter result → generate certificate
11. **Student portal workflow** — login → view results → download documents
12. **Staff portal workflow** — login → view KPI → manage own students
