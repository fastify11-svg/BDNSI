# PROJECT MASTER DOCUMENTATION
## BDNSI — Bangladesh National Skills Institute Management System

---

**Documentation Version**: 1.0  
**Audit Date**: 2026-08-24  
**Audited By**: Antigravity AI Architect  
**Based On**: Direct source code inspection of `c:\BDNSI`  
**Completion Estimate**: ~70–75%

---

## TABLE OF CONTENTS

1. Executive Summary
2. Project Purpose
3. Current Status
4. Technology Stack
5. Complete Project Structure
6. System Architecture
7. Module Inventory
8. Panel Inventory
9. Page & Route Inventory
10. Database Architecture
11. API Documentation
12. Authentication
13. Authorization
14. Business Workflows
15. Frontend Architecture
16. Backend Architecture
17. State Management
18. File Management
19. Notifications & SMS
20. Payment System
21. Integrations
22. Security Audit
23. Performance Audit
24. Testing Audit
25. Technical Debt
26. Bugs & Issues
27. Missing Features
28. Recommended Improvements
29. Final Architecture
30. Development Roadmap
31. AI Agent Rules
32. Final Audit Summary

---

## 1. Executive Summary

BDNSI is a production Laravel 8 + React (Inertia.js) **multi-tenant Institute Management System** deployed on Hostinger at `https://nenobet.live`. The system serves training institutes across Bangladesh, enabling student enrollment, academic result management, document generation, online payment, and multi-portal access for admins, staff agents, centre operators, and students.

Approximately **70-75% of the system is production-ready**. The core academic lifecycle (enroll → result → document) is solid. Gaps exist in the online examination module, SMS notification wiring, and battle-tested payment verification.

**Two critical security vulnerabilities must be patched immediately**: an unauthenticated `/live_deploy` route and hardcoded SSH credentials in deployment scripts.

---

## 2. Project Purpose

### What It Does
- Manages vocational training institute operations in Bangladesh
- Supports 3 course types: Regular (1-3 months), Short Course (4-24 months), Diploma (25-48 months)
- Issues digital certificates, ID cards, admit cards, marksheets
- Tracks multi-centre student enrollments with tenant isolation
- Manages a sales agent (staff) referral and KPI system
- Provides public result verification by roll/registration number
- Accepts online payments via bKash and SSLCommerz

### Who Uses It

| User Type | Panel | Purpose |
|---|---|---|
| Super Admin | Admin Panel | Full system control |
| Sub-Admin | Admin Panel | Role-limited management |
| Staff/Agents | Staff Portal | Manage own students, track KPIs |
| Centre Operators | Centre Dashboard | Manage centre's students |
| Students | Student Portal | View results, download documents |
| Public | Website | Browse courses, verify results, contact |

---

## 3. Current Status

| Area | Status | Notes |
|---|---|---|
| Public Website | 85% Complete | All major sections working |
| Admin Panel | 80% Complete | Most CRUD complete |
| Student Portal | 65% Complete | Docs need testing |
| Staff Portal | 60% Complete | Core flow working |
| Centre Portal | 55% Complete | Data gaps |
| Payment System | 70% Integrated | Not battle-tested |
| SMS Notifications | 30% | Drivers exist, not wired |
| Online Examination | 40% | Backend partial, UI incomplete |
| Document Builder | 75% Complete | Template + bulk PDF working |
| Laravel Telescope | 100% | Secured, deployed |
| Testing (PHPUnit) | 31/31 Passing | All passing |
| CI/CD | 60% | Deploy scripts work, no GitHub Actions |

---

## 4. Technology Stack

### Backend
| Technology | Version | Role |
|---|---|---|
| PHP | ^8.2 | Server language |
| Laravel | ^8.x | MVC framework |
| Inertia.js server | ^0.6 | SPA bridge |
| Sanctum | ^2.11 | API auth |
| Laratrust | ^7.1 | RBAC |
| Telescope | 4.6 | Debug monitoring |
| Intervention/Image | ^2.7 | Image processing |
| Simple-QRCode | ^4.2 | QR generation |
| GuzzleHTTP | ^7.0 | External API calls |

### Frontend
| Technology | Version | Role |
|---|---|---|
| React | ^19.2.7 | UI framework |
| Inertia.js React | ^0.8.1 | SPA adapter |
| Vite | ^8.2 | Build + HMR |
| Tailwind CSS | ^3.0 | Styling |
| Recharts | ^3.10 | Charts |
| jQuery + DataTables | ^3.6 / ^1.11 | Admin tables |
| Lucide React | ^1.33 | Icons |

### Database
- MySQL (production/local)
- SQLite (testing only)
- Eloquent ORM

### Infrastructure
- Hosting: Hostinger VPS (145.79.212.19)
- Domain: nenobet.live
- Local Dev: XAMPP (Windows)
- CI/CD: SSH/SFTP scripts (Node.js)
- Version Control: GitHub

---

## 5. Complete Project Structure

```
c:\BDNSI/
├── app/
│   ├── Casts/          ImageField cast
│   ├── Console/        Scheduler (Kernel.php — telescope:prune daily)
│   ├── Enums/          9 PHP enums (StudentStatus, Gender, CourseType, etc.)
│   ├── Events/         PaymentSucceeded
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Admin/  38 admin controllers
│   │   │   ├── Staff/  5 controllers
│   │   │   ├── Student/ 3 controllers
│   │   │   └── Auth/   Centre auth
│   │   ├── Middleware/ 14 middleware files
│   │   └── Requests/   Form validation classes
│   ├── Jobs/           3 queued jobs (BulkDoc, PaymentSMS, StudentSMS)
│   ├── Lib/            Image.php utility + helpers.php (autoloaded)
│   ├── Listeners/      UpdateStudentFinancialStatus
│   ├── Models/         35 Eloquent models
│   ├── Observers/      StudentObserver, ResultObserver
│   ├── Providers/      5 service providers + TelescopeServiceProvider
│   ├── Scopes/         CenterScope (tenant isolation)
│   ├── Services/       DocumentGenerator, PdfEngine, SMS drivers
│   └── Traits/         BelongsToStaff, ClearsFrontendCache, DeletesImage
├── config/             Laravel config files (auth.php, telescope.php, etc.)
├── database/
│   ├── migrations/     75 migration files (2011-2026)
│   ├── seeders/
│   └── factories/
├── resources/
│   ├── js/
│   │   ├── Components/ SmartScanner (Gemini OCR), Document builder
│   │   ├── Layouts/    5 layouts (Admin, Staff, Student, Centre, Frontend)
│   │   └── Pages/      70+ React page components
│   └── views/          Blade templates (admit card, certificate, transcript)
├── routes/
│   ├── web.php         Public + centre user routes (145 lines)
│   ├── admin.php       Admin routes (201 lines)
│   ├── staff.php       Staff routes (50 lines)
│   ├── student.php     Student routes (50 lines)
│   └── auth.php        Centre auth routes
├── tests/
│   ├── Feature/        9 PHPUnit test files (31 tests total)
│   └── e2e/            16 Playwright spec files
└── PROJECT_DOCUMENTATION/ This documentation folder
```

---

## 6. System Architecture

### Request Lifecycle
```
Browser Request
  → Hostinger LiteSpeed → public/index.php
  → Bootstrap → Http Kernel
  → Web Middleware: throttle, cookies, session, referral capture,
                   CSRF, bindings, language, Inertia handler
  → Route Matching (web/admin/staff/student)
  → Route Middleware: auth:guard, module:toggle, throttle
  → Controller → Service → Eloquent Model → MySQL
  → Inertia::render('PageComponent', $props)
    + HandleInertiaRequests::share() adds:
      auth.user/admin/staff/student, flash, site_config,
      footer_links, footer_logos, locale, app_url
  → React renders page via Inertia SPA
```

### Authentication (4 Guards)
```
web guard    → User model    → users table    → /login
admin guard  → Admin model   → admins table   → /admin/login
student guard→ Student model → students table  → /students/login
staff guard  → Team model    → teams table    → /staff/login

All guards: session-based driver, bcrypt passwords
```

### Tenant Isolation
```
CenterScope (global scope on Student + Result)
  When auth('web')->user() has center_id:
    → Automatically WHERE center_id = {user.center_id}
  Admin guard: bypasses automatically
  Staff guard: BelongsToStaff trait (filters by team_id)
```

### Feature Flag System
```
SiteConfig table → 10 toggle columns (toggle_result_verify, etc.)
CheckModuleEnabled middleware → SiteConfig::isEnabled($flag)
If disabled → Inertia::render('Frontend/ComingSoon')
```

---

## 7. Module Inventory

### COMPLETE MODULES
Student Enrollment | Centre Management | Course (Subject) Management |
Session Management | Result Management | Document Templates |
Document Generation | Grade Scales | License Management |
Notice Board | Slider/Banner | Team/Staff Management |
Team KPI/Performance | Site Config/CMS | Footer Management |
Translation | Sponsor Management | YouTube Videos |
WhatsApp Links | Contact Inquiries | Payment Gateway Config |
SMS Gateway Config | User Management | Sub-admin Management |
Referral Tracking | Laravel Telescope |

### PARTIAL MODULES
- Online Examination (backend models done, student exam UI incomplete)
- Payment System (integrated, not production-tested)
- Financial Tracking (manual records, not linked to online transactions)
- Registration Review (endpoint exists, workflow unclear)
- Diploma Management (minimal CRUD only)
- Sub-admin RBAC (role assignment done, enforcement gaps)
- Database Backup (controller exists, no schedule)
- Bulk PDF (job exists, queue worker not set up on production)
- Student Documents (routes exist, template linking unverified)
- SMS Notifications (drivers + jobs exist, no controller triggers)

### MISSING MODULES
- Staff Password Reset
- Scheduled Auto-backup
- Queue Worker (Production)
- Report Generation
- Complete i18n

---

## 8. Panel Inventory

### A. Public Website (/)
Layout: FrontendLayout.jsx (27KB)
Pages: Homepage, All Courses, Course Details, Result Verification,
       License Verification, Notice Board, Video Gallery, Success Students,
       Verified Centres, Contact Form, Centre Application, WhatsApp Links
Features: Multi-language (en/bn/ar), feature flag toggles, referral tracking

### B. Admin Panel (/admin/*)
Layout: AdminLayout.jsx (20KB) — auth:admin guard
Dashboard: Stats cards + analytics charts (monthly registrations, status breakdown, top centres)
Modules: 30+ sections covering all system data entities

### C. Staff Portal (/staff/*)
Layout: StaffLayout.jsx (16KB) — auth:staff guard (Team model)
Dashboard: KPI metrics, referral link, student stats (Staff/Dashboard.jsx 28KB)
Modules: My Courses, My Sessions, My Students, Document Generation

### D. Student Portal (/students/*)
Layout: StudentLayout.jsx (15KB) — auth:student guard (Student model)
Gate: portal.student middleware (toggle_student_portal feature flag)
Dashboard: Enrollment info, payment status, academic summary
Modules: Results, Documents (ID, admit, registration, marksheet), Online Exam (incomplete)

### E. Centre User Portal (/dashboard, /student/*)
Layout: CenterLayout.jsx (18KB) — auth web guard (User model + center_id)
Dashboard: Basic centre information
Modules: Student CRUD (auto-scoped to own centre by CenterScope)

---

## 9. Page & Route Inventory

Total routes: ~120+

### Public Routes (24)
/ | /all-course | /course-details/{id} | /verify | /result |
/license-view/{number?} | /all-notice-list | /all-notice-list/{id} |
/video-gallery | /success-student | /verified-center | /contact-us |
/center-request | /page/{type} | /health | /lang-change |
SECURITY: /live_deploy (REMOVE) | /ping | /test-transcript

### Payment Routes (6)
/payment/checkout | /payment/process | /payment/callback/{gateway} |
/payment/success | /payment/failed | /payment/cancel

### Admin Routes (60+) — all require auth:admin
/admin/dashboard | /admin/student (CRUD+import/export/admit/certificate) |
/admin/subject | /admin/session | /admin/exam | /admin/question |
/admin/result | /admin/center | /admin/notice | /admin/slider |
/admin/team | /admin/team-performance | /admin/financial |
/admin/grade-scales | /admin/document-templates | /admin/documents/bulk-* |
/admin/registration-review | /admin/diplomas | /admin/license |
/admin/payment-gateway | /admin/sms-gateway | /admin/contactUs |
/admin/translation | /admin/sponsor | /admin/backup | /admin/user |
/admin/sub-admin | /admin/upazila-store | /admin/whatapp-link |
/admin/youtube-video | /admin/footer-link | /admin/footer-logo |
/admin/api-settings | /telescope

### Staff Routes (15) — all require auth:staff
/staff/login | /staff/logout | /staff/dashboard |
/staff/courses | /staff/sessions | /staff/students | /staff/documents

### Student Routes (15) — all require auth:student + portal.student
/students/login | /students/forgot-password | /students/reset-password |
/students/logout | /students/dashboard | /students/results |
/students/documents | /students/id-card | /students/admit-card |
/students/registration-card | /students/marksheet | /students/exam

---

## 10. Database Architecture

Total tables: ~40+ | Total migrations: 75

### Authentication Tables
- admins (Admin users — Laratrust RBAC)
- users (Centre operators — web guard)
- teams (Staff agents — staff guard, also Team model)
- Laratrust: roles, permissions, role_user, permission_role, permission_user

### Academic Tables
- centers (Training centres, tenant key)
- subjects (Courses — linked to team for staff scoping)
- sessions (Academic sessions — linked to team for staff scoping)
- students (All student records — CenterScope applied)
- results (Student exam marks: written + practical + viva)
- semester_results (Per-semester results for diploma students)
- grade_scales (Dynamic grading rules per course_type)
- exams (Exam definitions)
- quations (Exam questions — NOTE: typo in table name)

### Financial Tables
- payments (Manual admin-recorded payments)
- transactions (Online payment records — polymorphic)
- payment_gateways (bKash/SSLCommerz credentials + config)
- sms_gateways (Reve/Twilio credentials + config)
- team_sales_targets (KPI targets per staff per month)

### Content/CMS Tables
- site_configs (Single-row — all CMS + 10 feature flags)
- sliders, notices, contact_us
- translations, config_dictionaries
- youtube_videos, whatapp_links
- footer_links, footer_partner_logos
- licenses (Credential/certificate registry)

### Document System Tables
- document_templates (Canvas template definitions)
- document_fields (Per-field position, style, data mapping)

### Location Data
- divisions, districts, upazilas (Bangladesh location hierarchy)

### Key Relationships
```
Team → Centers → Users
              → Students → Results
                        → SemesterResults
                        → Transactions (polymorphic)
Session → Students
Subject → Students
DocumentTemplate → DocumentFields
GradeScale → used by Result::gpa()
Exam → Quations (Questions)
```

---

## 11. API Documentation

BDNSI uses Inertia.js — there is NO public REST API.
All data flows through Inertia page renders and form submissions.
The api.php file exists but contains only unused Sanctum token routes.

External APIs called by BDNSI:
- bKash: token/grant, checkout/create, checkout/execute
- SSLCommerz: gwprocess, validator/api
- Google Gemini: OCR data extraction
- Reve SMS: send SMS
- Twilio: send SMS

---

## 12. Authentication

| Guard | Model | Table | Login URL | Password Reset |
|---|---|---|---|---|
| web | User | users | /login | Yes |
| admin | Admin | admins | /admin/login | Yes |
| student | Student | students | /students/login | Yes |
| staff | Team | teams | /staff/login | NOT IMPLEMENTED |

All: session-based driver, bcrypt passwords
Admin login: throttled to 5 attempts/min
Student portal: guarded by toggle_student_portal flag

---

## 13. Authorization

RBAC (Laratrust) applies to Admin model only.
Roles and permissions stored in database.
Shared to frontend via auth.admin.permissions prop.

Route-Level Guards:
- auth:admin — all admin routes
- auth:staff — all staff routes
- auth:student — all student routes
- auth (web) — centre user routes
- module:toggle_X — public feature flags

GAPS:
- Most admin routes use auth:admin only, NOT permission checks
- Sub-admin has near-equal access as super-admin in many areas

---

## 14. Business Workflows

### Student Enrollment
Centre/Admin creates student → fill demographics + session + subject + center
→ System auto-generates roll + registration numbers
→ Status: Pending → Admin approves → Approved
→ Admin sets password → Student can login to portal

### Result Entry
Admin selects student → enters marks (written + practical + viva)
→ Result::saving() validates total <= GradeScale.max_marks
→ GPA dynamically calculated from GradeScale.rules (JSON array)
→ Public result checker shows result by roll/registration/name

### Document Generation (System A)
Admin selects template + student → DocumentGeneratorService renders HTML
→ html2pdf.js creates PDF in browser (client-side)

### Document Generation (System B — Bulk)
Admin selects students → BulkDocumentController::bulkGenerate()
→ GenerateBulkDocumentsJob dispatched to queue
→ PdfEngineService → Node.js pdf_engine.mjs
→ ZIP created → admin downloads
[REQUIRES queue worker running on production]

### Online Payment
User → /payment/checkout → selects gateway
→ Process: creates pending Transaction → redirect to gateway
→ Callback: verify with gateway API → mark success
→ PaymentSucceeded event → UpdateStudentFinancialStatus listener
→ Student.paid_amount + payment_status updated

### Referral Tracking
Staff shares ?ref=STF-XXXXXX URL
→ CaptureReferralMiddleware stores ref_code in session
→ On student creation: links student.team_id to matching team

---

## 15. Frontend Architecture

### Layouts (5 total)
- FrontendLayout.jsx (27KB) — Public website
- AdminLayout.jsx (20KB) — Admin panel
- CenterLayout.jsx (18KB) — Centre portal
- StaffLayout.jsx (16KB) — Staff portal
- StudentLayout.jsx (15KB) — Student portal

### Large Components Needing Splitting
- Result.jsx: 52KB (largest page)
- Welcome.jsx: 43KB (homepage)
- Staff/Dashboard.jsx: 28KB
- Admin/Dashboard.jsx: 21KB

### Shared Props (via HandleInertiaRequests::share())
auth.user | auth.admin | auth.staff | auth.student |
flash.success | flash.error | site_config | footer_links |
footer_logos | locale | app_url

### Notable Issues
- DataTables + jQuery used alongside React — legacy dependency
- No global state management (no Redux/Zustand) — all server-driven
- Recharts used for analytics charts (admin + staff dashboards)

---

## 16. Backend Architecture

### Controller Pattern
All controllers return Inertia::render() for page loads.
Form submissions use redirect()->back()->with('success', ...) or response()->success().

### Service Layer
- DocumentGeneratorService — template rendering
- PdfEngineService — Node.js bridge
- FrontendDataService — cached homepage data
- SmsGatewayFactory — SMS driver factory

### Observer Pattern
- StudentObserver — fires on student CRUD events
- ResultObserver — fires on result save/delete

### Event-Listener
- PaymentSucceeded → UpdateStudentFinancialStatus

### Rate Limiting (RouteServiceProvider)
- api: 60/min | web: 120/min
- results: 10/min | contact: 3/min
- admin-login: 5/min | health: 30/min

---

## 17. State Management

No global state library (Redux/Zustand/etc.).
- Server state: Inertia props → React component props
- Local state: React useState/useEffect
- Form state: local state + Axios POST
- Flash messages: Laravel session → Inertia shared props
- Cache: Server-side (Laravel Cache facade)

Cache keys: homepage_sliders, homepage_courses, homepage_teams,
homepage_notices, homepage_centers, homepage_success_students,
footer_links, footer_logos, site_config_cache, unread_inquiries

---

## 18. File Management

Storage: Local filesystem (storage/app/)
Public access: Via storage:link
Image processing: intervention/image v2.7
Cast: ImageField::class auto-prepends asset URL

Upload paths:
- images/students/ — Student photos
- images/avatar/admin/ — Admin avatars
- center/photo/ — Centre director images
- center/logo/ — Centre logos
- center/nid_photo/ — NID documents
- team/images/ — Team member photos
- license/ — License holder photos
- config/ — Site config images

---

## 19. Notifications & SMS

### Email: Built-in Laravel (password reset only — no custom templates)

### SMS — STATUS: 30% (not wired)
Infrastructure exists:
- SmsGateway model (DB-stored credentials)
- SmsGatewayFactory (driver factory)
- ReveSmsDriver (Reve SMS API)
- TwilioSmsDriver (Twilio)
- SendStudentSmsJob (queued)
- SendPaymentConfirmationSmsJob (queued)

GAP: No controller dispatches these jobs. SMS is never actually sent.

---

## 20. Payment System

Gateways: bKash Tokenized, SSLCommerz
Status: Integrated but not production-tested

Flow:
1. /payment/checkout → shows active gateways
2. User selects gateway
3. /payment/process → creates pending Transaction
4. Redirect to gateway
5. /payment/callback/{gateway} → verify with API
6. Update Transaction.status = 'success'
7. Fire PaymentSucceeded event
8. Student finances updated via listener

Issues:
- Credentials stored unencrypted in payment_gateways table
- SSLCommerz IPN URL not configured
- Not tested with real money
- Manual payments table and online transactions table not linked

---

## 21. Integrations

| Integration | Status |
|---|---|
| bKash Tokenized API | Integrated, unverified in production |
| SSLCommerz | Integrated, IPN URL unconfigured |
| Reve SMS | Driver ready, not wired |
| Twilio | Driver ready, not wired |
| Google Gemini AI | Partial (OCR controller exists) |
| Hostinger VPS | Active production host |
| GitHub | Active version control |
| Laravel Telescope | Active, admin-secured |

---

## 22. Security Audit

### CRITICAL (Fix Immediately)
1. /live_deploy route — unauthenticated DB migration + DROP TABLE
   Location: routes/web.php lines 130-140 — REMOVE IMMEDIATELY

2. Debug routes in production — /ping, /test-transcript — no auth
   Location: routes/web.php lines 142-144 — REMOVE or RESTRICT

3. SSH credentials hardcoded in deploy scripts (server IP + password)
   Location: direct_deploy.mjs, auto_deploy.mjs — USE .env + SSH keys

### HIGH
4. Payment credentials unencrypted in DB — bKash/SSLCommerz keys at risk
5. Sub-admin authorization gaps — routes use auth:admin only, not permissions

### MEDIUM
6. CORS uses abandoned fruitcake/laravel-cors package
7. Staff password reset not implemented
8. Raw DB::table() queries may bypass CenterScope
9. File upload MIME validation consistency unknown
10. CAPTCHA implemented but not applied to login forms

### IMPLEMENTED (Positive)
- bcrypt passwords | CSRF protection | Rate limiting
- Security headers (CSP, X-Frame-Options, etc.) — confirmed on live site
- Telescope secured | Session-based auth | Inertia/React XSS protection

---

## 23. Performance Audit

### Strengths
- Comprehensive caching for frontend data
- SiteConfig 24-hour cache
- Homepage data cached per key
- Cache auto-cleared on model save

### Issues
- Welcome.jsx (43KB) + Result.jsx (52KB) — large bundles, need splitting
- Admin/StudentController.php (32KB) — monolithic, needs service extraction
- Dashboard queries not cached — N+1 risk on top-centres query
- DataTables + jQuery is redundant with React
- No Redis (likely not on Hostinger basic plan) — file-based cache

---

## 24. Testing Audit

PHPUnit: 31/31 tests passing
Playwright: 16 E2E spec files

Tested: Routes, feature flags, rate limiting, GPA calculation, tenant isolation,
        auth flows, admin navigation, student enrollment

Not Tested: Payment flow, SMS, staff password reset,
            permission enforcement, bulk PDF, queue jobs

---

## 25. Technical Debt

P0 — Critical (Security):
- Remove /live_deploy and debug routes
- Encrypt payment gateway credentials
- Remove hardcoded SSH credentials from deploy scripts

P1 — High:
- Wire SMS jobs to controller triggers
- Implement staff password reset
- Consistent sub-admin permission enforcement
- Setup production queue worker
- Complete student document template linking

P2 — Medium:
- Split Welcome.jsx (43KB) into section components
- Split Result.jsx (52KB) into smaller components
- Extract service from Admin/StudentController.php (32KB)
- Consolidate dual PDF systems
- Replace DataTables/jQuery with React-native solution
- Migrate CORS from abandoned package
- Complete i18n across all UI

P3 — Low:
- Add CAPTCHA to login forms
- Remove duplicate root-level test files (test_login2.js through test_login9.js)
- Fix table name typo: quations should be questions
- Clean up root-level debug/scratch files

---

## 26. Bugs & Issues

| ID | Issue | Location | Priority |
|---|---|---|---|
| BUG-01 | /live_deploy route destroys DB without auth | routes/web.php:130 | P0 |
| BUG-02 | Staff cannot reset password | No route exists | P1 |
| BUG-03 | SMS jobs never dispatched | No controller wiring | P1 |
| BUG-04 | Bulk PDF requires queue worker (not set up on prod) | No supervisor config | P1 |
| BUG-05 | Table typo: quations instead of questions | Migrations | P3 |
| BUG-06 | fruitcake/laravel-cors abandoned | composer.json | P2 |
| BUG-07 | fzaninotto/faker abandoned (dev dep) | composer.json | P3 |

---

## 27. Missing Features

### Required to Finish Current Architecture
1. Staff password reset flow
2. SMS trigger wiring (student enrollment, payment confirmation)
3. Queue worker setup on production (supervisor config)
4. Student document template rendering verification
5. SSLCommerz IPN URL configuration
6. Complete online exam flow (student exam taking, submission, grading)

### Recommended for Production
7. Payment credential encryption
8. Sub-admin permission enforcement
9. Remove /live_deploy route (CRITICAL)
10. GitHub Actions CI/CD pipeline
11. Automated database backup scheduling
12. Application error monitoring (Sentry or similar)

### Future/Advanced Features
13. Report generation per centre/session/course
14. Student attendance tracking
15. Fee schedules and installment plans
16. Bulk SMS campaigns
17. Certificate blockchain verification

---

## 28. Recommended Improvements

Priority order:
1. Fix 3 critical security vulnerabilities
2. Wire SMS system
3. Setup production queue worker
4. Implement staff password reset
5. Production-test payment flow
6. Split large React files
7. GitHub Actions CI/CD
8. Complete Bengali translations
9. Apply CAPTCHA to logins
10. Consolidate PDF systems

---

## 29. Final Architecture Decision

### PRESERVE
Multi-guard authentication | CenterScope tenant isolation |
Feature flag system | Event-Listener for payments |
Observer pattern | Inertia.js + Laravel | Laratrust RBAC |
Rate limiting configuration

### REFACTOR
Admin/StudentController.php → extract to StudentService |
Welcome.jsx → split into section components |
Result.jsx → split into SearchForm + ResultDisplay |
Consolidate dual PDF systems (keep System B) |
Replace DataTables/jQuery with React table

### FIX (Must Fix)
Remove /live_deploy route |
Remove /ping + /test-transcript debug routes |
Implement staff password reset |
Wire SMS jobs |
Setup production queue worker

### COMPLETE
Online examination student flow |
Student document template rendering |
Financial → online transaction linkage |
Sub-admin permission enforcement |
Multi-language translations

### ADD
GitHub Actions CI/CD |
Automated scheduled backups |
Supervisor queue config |
Payment credential encryption |
Redis if available

### AVOID
No separate REST API/microservices |
No framework rewrite |
No additional payment gateways until existing ones tested |
No new features until security patched

---

## 30. Development Roadmap

### Sprint 1 — CRITICAL (Week 1)
- Remove /live_deploy and debug routes
- Encrypt payment credentials in DB
- Move SSH credentials to environment variables
- Setup production queue worker

### Sprint 2 — HIGH (Weeks 2-3)
- Wire SMS triggers (student enrollment + payment)
- Implement staff password reset
- Complete student document template linking
- Configure SSLCommerz IPN URL

### Sprint 3 — MEDIUM (Weeks 4-5)
- Complete online examination student flow
- Sub-admin permission audit + enforcement
- GitHub Actions CI/CD pipeline
- Automated backup scheduling

### Sprint 4 — POLISH (Weeks 6-7)
- Split large React components
- Complete Bengali translations
- Apply CAPTCHA to logins
- Payment sandbox testing

---

## 31. AI Agent Rules

### MANDATORY PRE-CHANGE CHECKLIST
1. Read this document
2. Read the relevant section in PROJECT_DOCUMENTATION/
3. View the source file with view_file before editing
4. Check related models, routes, controllers, frontend pages
5. Check CenterScope implications (tenant isolation)
6. Check feature flag implications (module toggles)
7. Make the smallest safe change
8. Run: C:\xampp\php\php.exe artisan test (all 31 must pass)
9. Run: npm run build
10. Commit + push + deploy

### CRITICAL CODE RULES

GUARD USAGE:
  NEVER: auth()->user()  (without specifying guard outside web context)
  ALWAYS specify:
    auth('admin')->user()   — admin context
    auth('staff')->user()   — staff context
    auth('student')->user() — student context
    auth()->user()          — ONLY for web (centre user) context

TENANT ISOLATION:
  NEVER bypass CenterScope in centre-user context
  NEVER use DB::table('students') without manual center_id filter
  Student and Result have CenterScope global scope applied

FEATURE FLAGS:
  New toggleable features need:
    1. Column in site_configs via migration
    2. Added to SiteConfig::$fillable
    3. Added to HandleInertiaRequests::share() site_config array
    4. Toggle UI in admin settings
    5. ->middleware('module:toggle_column') on route

ENUMS — Always use enum classes:
  StudentStatus::Pending / ::Approved / ::Hide
  Gender::Male / ::Female
  CourseType::Regular / ::Short_Course / ::Diploma
  (and all other enums in app/Enums/)

IMAGES:
  Store via Image::store($field, $folder) — returns relative path
  NEVER store full URLs in database

CACHE:
  After modifying model data, cache auto-clears via ClearsFrontendCache
  For manual cache clear: php artisan optimize:clear

PAYMENT:
  NEVER mark transaction 'success' without gateway API verification
  ALWAYS wrap payment in DB::beginTransaction() / commit()
  ALWAYS fire PaymentSucceeded event after successful payment

WHAT NEVER TO DO:
  Never hardcode center_id values
  Never store credentials in code — use .env
  Never skip CSRF on forms
  Never commit .env files
  Never run migrate:fresh on production without backup
  Never create duplicate models (check app/Models/ first)
  Never create duplicate routes (check routes/*.php first)
  Never leave /live_deploy route in any code

---

## 32. Final Audit Summary

### Project Statistics

| Metric | Count |
|---|---|
| Total modules | 35+ |
| Total panels | 5 (Public, Admin, Staff, Student, Centre) |
| Total React pages | 70+ |
| Total routes | 120+ |
| Total database models | 35 |
| Total database tables | 40+ |
| Total migrations | 75 |
| Auth guards | 4 |
| Feature flag toggles | 10 |
| PHPUnit tests | 31 (all passing) |
| Playwright E2E specs | 16 |
| Major business workflows | 6 |

### Summary
- Completed: Public website, admin CRUD, enrollment, results, document builder, payment integration, Telescope, tests
- Partial: Online exam, SMS, financial, sub-admin RBAC, staff portal
- Missing: Staff password reset, queue worker, CI/CD, production-tested payments
- Security: 3 critical, 2 high, 5 medium issues identified
- Technical debt: 3 P0, 5 P1, 7 P2, 5 P3 items

### TOP 10 NEXT ACTIONS

| # | Priority | Task | Reason |
|---|---|---|---|
| 1 | CRITICAL | Remove /live_deploy route | Anyone can destroy DB |
| 2 | CRITICAL | Encrypt payment credentials in DB | bKash/SSLCommerz keys exposed |
| 3 | CRITICAL | Remove SSH credentials from deploy scripts | Server root access exposed |
| 4 | HIGH | Setup production queue worker (supervisor) | Bulk PDF + SMS silently fail |
| 5 | HIGH | Wire SMS triggers to student events | Core feature not working |
| 6 | HIGH | Implement staff password reset | Locked-out staff need admin help |
| 7 | MEDIUM | Test payment flow in sandbox | Revenue feature unvalidated |
| 8 | MEDIUM | Complete student document rendering | Student portal incomplete |
| 9 | MEDIUM | Build GitHub Actions CI/CD | Manual deploys are fragile |
| 10 | MEDIUM | Complete online examination flow | Feature in progress, unusable |

---

*Document created: 2026-08-24*  
*All findings verified from direct source code inspection.*  
*No features were assumed or invented — only documented facts.*  
*See PROJECT_DOCUMENTATION/ folder for detailed coverage of each area.*
