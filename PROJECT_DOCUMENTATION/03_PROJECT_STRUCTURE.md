# 03 — Project Directory Structure

## Root Directory Overview

```
c:\BDNSI/
├── .agents/                    # Antigravity IDE workspace config, skills, rules
├── .env                        # Active environment variables (NEVER commit)
├── .env.example                # Environment variable template
├── .github/                    # GitHub Actions CI/CD workflows
├── app/                        # Laravel application code (PHP)
├── bootstrap/                  # Laravel bootstrap files + cache
├── config/                     # Laravel configuration files
├── database/                   # Migrations, seeders, factories
├── node_modules/               # NPM packages (gitignored)
├── package.json                # NPM dependencies + scripts
├── composer.json               # PHP/Composer dependencies
├── playwright.config.js        # Playwright E2E test config
├── PROJECT_DOCUMENTATION/      # ← This folder (master documentation)
├── public/                     # Publicly accessible files (web root)
│   └── build/                  # Vite compiled assets
├── resources/                  # Frontend source files (JS, CSS, views)
├── routes/                     # Laravel route definitions
├── storage/                    # Logs, uploaded files, cache
├── tailwind.config.js          # Tailwind CSS configuration
├── tests/                      # PHPUnit + Playwright tests
├── vendor/                     # Composer packages (gitignored)
└── vite.config.mjs             # Vite build configuration

# Deployment scripts at root (not production application code):
auto_deploy.mjs                 # SSH git-pull based deployment
direct_deploy.mjs               # SFTP file-upload deployment
deploy_telescope.mjs            # Telescope-specific deployment
full_auto_deploy.mjs            # Combined full deployment
frontend_deploy.mjs             # Frontend assets deployment
pdf_engine.mjs                  # Node.js PDF rendering engine
```

---

## Application Code (`app/`)

```
app/
├── Casts/
│   └── ImageField.php          # Custom Eloquent cast for image paths
├── Console/
│   └── Kernel.php              # Artisan command scheduler
├── Enums/
│   ├── BloodGroup.php          # Blood group enum (A+, B+, etc.)
│   ├── CenterStatus.php        # Pending, Approved, Suspended
│   ├── CourseType.php          # Regular, Short_Course, Diploma
│   ├── ExamStatus.php          # Draft, Published, Closed
│   ├── Gender.php              # Male, Female, Other
│   ├── Religion.php            # Islam, Hindu, Christian, Buddhist, Other
│   ├── SessionStatus.php       # Active, Inactive
│   ├── SliderType.php          # Image, Video
│   └── StudentStatus.php       # Pending, Approved, Hide
├── Events/
│   └── PaymentSucceeded.php    # Fired after successful payment callback
├── Exceptions/
│   └── Handler.php             # Global exception handler
├── Http/
│   ├── Controllers/
│   │   ├── Admin/              # 38 admin controllers
│   │   │   ├── Auth/           # Admin authentication controllers
│   │   │   ├── AdminListController.php
│   │   │   ├── ApiSettingController.php
│   │   │   ├── BackupController.php
│   │   │   ├── BulkDocumentController.php    # Enterprise bulk PDF
│   │   │   ├── CenterController.php
│   │   │   ├── ConfigDictionaryController.php
│   │   │   ├── ContactUsController.php
│   │   │   ├── DashboardController.php       # Analytics dashboard
│   │   │   ├── DiplomaController.php
│   │   │   ├── DocumentGenerationController.php
│   │   │   ├── DocumentTemplateController.php # Template builder
│   │   │   ├── ExamController.php
│   │   │   ├── FinancialController.php
│   │   │   ├── FooterLinkController.php
│   │   │   ├── FooterPartnerLogoController.php
│   │   │   ├── GradeScaleController.php
│   │   │   ├── LicenseController.php
│   │   │   ├── NoticeController.php
│   │   │   ├── PaymentGatewayController.php
│   │   │   ├── QuestionController.php        # Exam questions
│   │   │   ├── RegistrationReviewController.php
│   │   │   ├── ResultController.php
│   │   │   ├── SessionController.php
│   │   │   ├── SliderController.php
│   │   │   ├── SmsGatewayController.php
│   │   │   ├── SponsorController.php
│   │   │   ├── StudentController.php         # Largest: 32KB
│   │   │   ├── SubadminController.php
│   │   │   ├── SubjectController.php         # 18KB
│   │   │   ├── TeamController.php
│   │   │   ├── TeamPerformanceController.php # KPI dashboard
│   │   │   ├── TranslationController.php
│   │   │   ├── UpazilaStoreController.php
│   │   │   ├── UserController.php
│   │   │   ├── WhatappLinkController.php
│   │   │   └── YoutubeVideoController.php
│   │   ├── Auth/               # Center/User authentication
│   │   ├── Staff/              # 5 staff controllers
│   │   │   ├── Auth/
│   │   │   ├── DashboardController.php
│   │   │   ├── DocumentController.php
│   │   │   ├── SessionController.php
│   │   │   ├── StudentController.php
│   │   │   └── SubjectController.php
│   │   ├── Student/            # 4 student controllers
│   │   │   ├── Auth/
│   │   │   ├── DashboardController.php
│   │   │   ├── DocumentController.php
│   │   │   └── ExamController.php
│   │   ├── Controller.php      # Base controller
│   │   ├── DashboardController.php
│   │   ├── FrontendController.php
│   │   ├── GeminiOcrController.php   # AI-powered OCR
│   │   ├── HomeController.php        # Public pages (5.5KB)
│   │   ├── PaymentController.php     # bKash + SSLCommerz (12KB)
│   │   ├── PortalController.php
│   │   ├── ResultController.php      # Public result verification
│   │   └── VerifyController.php
│   ├── Middleware/             # 14 middleware files
│   │   ├── CaptchaCodeChecker.php
│   │   ├── CaptureReferralMiddleware.php  # Tracks ?ref= referral codes
│   │   ├── CheckModuleEnabled.php         # Feature flag gating
│   │   ├── CheckStudentPortalActive.php   # Student portal toggle
│   │   ├── HandleInertiaRequests.php      # Global shared props (8KB)
│   │   └── LanguageMiddleware.php         # i18n locale switching
│   ├── Requests/               # Form request validation classes
│   └── Kernel.php              # Middleware registration
├── Jobs/
│   ├── GenerateBulkDocumentsJob.php   # Async bulk PDF generation
│   ├── SendPaymentConfirmationSmsJob.php
│   └── SendStudentSmsJob.php
├── Lib/
│   ├── Image.php               # Image storage utility
│   └── helpers.php             # Global helper functions (autoloaded)
├── Listeners/
│   └── UpdateStudentFinancialStatus.php   # Post-payment reconciliation
├── Mixin/
│   └── ResponseMixin.php       # `response()->success()` helper
├── Models/                     # 35 Eloquent models
├── Observers/
│   ├── ResultObserver.php      # Auto-actions on result save/delete
│   └── StudentObserver.php     # Auto-actions on student events
├── Providers/
│   ├── AppServiceProvider.php  # Cache clearing, Blade directives, Vite
│   ├── AuthServiceProvider.php
│   ├── EventServiceProvider.php # Event-listener mapping
│   ├── RouteServiceProvider.php # Rate limiters, route registration
│   └── TelescopeServiceProvider.php # Telescope auth gate
├── Scopes/
│   └── CenterScope.php        # Tenant isolation (center_id filter)
├── Services/
│   ├── DocumentGeneratorService.php  # HTML/CSS template → PDF
│   ├── FrontendDataService.php       # Cached frontend data aggregator
│   ├── PdfEngineService.php          # Node.js PDF rendering bridge
│   └── Sms/
│       ├── ReveSmsDriver.php         # Reve SMS gateway
│       ├── SmsDriverInterface.php
│       ├── SmsGatewayFactory.php
│       └── TwilioSmsDriver.php
├── Traits/
│   ├── BelongsToStaff.php      # Scopes Subject/Session to staff team
│   ├── ClearsFrontendCache.php # Model auto cache-busting
│   ├── DeletesImage.php        # Auto-delete image on model delete
│   └── Student/
│       └── HasGrades.php       # GPA calculation trait
└── View/
    └── (View composers if any)
```

---

## Routes (`routes/`)

```
routes/
├── web.php       # Public + center user routes (145 lines)
├── admin.php     # Admin panel routes (201 lines)
├── staff.php     # Staff portal routes (50 lines)
├── student.php   # Student portal routes (50 lines)
├── auth.php      # Center/User authentication routes
├── api.php       # (minimal — Sanctum skeleton only)
├── channels.php  # Broadcast channels (unused)
└── console.php   # Artisan console routes
```

---

## Resources (`resources/`)

```
resources/
├── css/
│   └── app.css
├── js/
│   ├── app.jsx               # Inertia app entrypoint
│   ├── bootstrap.js          # Axios setup
│   ├── Components/
│   │   ├── Document/         # Document builder components
│   │   ├── SmartScanner.jsx  # Gemini AI OCR scanner
│   │   └── Welcome/          # Homepage components
│   ├── Layouts/
│   │   ├── AdminLayout.jsx   # Admin sidebar + nav (20KB)
│   │   ├── CenterLayout.jsx  # Centre user layout (18KB)
│   │   ├── FrontendLayout.jsx # Public website layout (27KB)
│   │   ├── StaffLayout.jsx   # Staff portal layout (16KB)
│   │   └── StudentLayout.jsx # Student portal layout (15KB)
│   ├── Pages/
│   │   ├── Admin/            # 30+ admin page directories
│   │   ├── Auth/             # Center user auth pages
│   │   ├── Center/           # Centre dashboard pages
│   │   ├── CenterRequest/    # Centre application flow
│   │   ├── Frontend/         # Public website pages
│   │   ├── Payment/          # Checkout, Success, Failed, Cancelled
│   │   ├── Staff/            # Staff portal pages
│   │   ├── Student/          # Student portal pages
│   │   ├── Welcome.jsx       # Homepage (43KB — largest file)
│   │   ├── Result.jsx        # Public result checker (52KB)
│   │   ├── AllCourse.jsx     # Course listings
│   │   ├── ContactUs.jsx     # Contact form
│   │   ├── VerifiedCenter.jsx
│   │   ├── SuccessStudent.jsx
│   │   ├── NoticeList.jsx
│   │   ├── NoticeDetails.jsx
│   │   └── VideoGallery.jsx
│   ├── data/                 # Static data (districts, divisions)
│   └── utils/                # Frontend utility functions
└── views/
    ├── app.blade.php         # Inertia root template
    ├── admin/                # Blade views (admit card, certificate, transcript)
    ├── student/              # Student Blade views
    └── frontend/             # Legacy Blade frontend views
```

---

## Database (`database/`)

```
database/
├── migrations/    # 75 migration files (2011–2026)
├── seeders/       # Database seeders
├── factories/     # Model factories for testing
└── database.sqlite # SQLite for PHPUnit testing
```

---

## Tests (`tests/`)

```
tests/
├── Feature/
│   ├── BasicRoutesTest.php
│   ├── FrontendE2ETest.php
│   ├── FrontendHomepageTest.php
│   ├── ModuleToggleTest.php        # Feature flag tests
│   ├── RateLimitingTest.php
│   ├── SiteControlCenterTest.php
│   ├── StudentLifecycleTest.php
│   └── TenantIsolationTest.php
├── Unit/
│   └── ExampleTest.php
└── e2e/                            # 16 Playwright spec files
    ├── admin.spec.js
    ├── auth.spec.js
    ├── frontend.spec.js
    ├── student-enrollment.spec.js
    └── ... (12 more)
```
