# 18 — Current Status

## Master Status Table

| Area | Status | Evidence | Problems | Next Action |
|---|---|---|---|---|
| **Public Homepage** | 🟢 COMPLETE | `Welcome.jsx` (43KB), `HomeController.php` | None critical | Polish/SEO |
| **Course Listings** | 🟢 COMPLETE | `AllCourse.jsx`, `HomeController::all_course()` | None | — |
| **Result Verification** | 🟢 COMPLETE | `Result.jsx` (52KB), `ResultController.php` | Rate limit needs monitoring | — |
| **Notice Board** | 🟢 COMPLETE | `NoticeList.jsx`, `NoticeDetails.jsx`, toggle supported | — | — |
| **Contact Form** | 🟢 COMPLETE | `ContactUs.jsx`, rate limited, toggle supported | — | — |
| **Centre Application** | 🟢 COMPLETE | `CenterRequest.jsx`, `CenterRequestController.php` | — | — |
| **Verified Centres** | 🟢 COMPLETE | `VerifiedCenter.jsx`, toggle supported | — | — |
| **Success Students** | 🟢 COMPLETE | `SuccessStudent.jsx`, toggle supported | — | — |
| **Video Gallery** | 🟢 COMPLETE | `VideoGallery.jsx`, toggle supported | — | — |
| **License Verification** | 🟢 COMPLETE | `LicenseView.jsx`, `LicenseController.php` | — | — |
| **Multi-language (i18n)** | 🟡 PARTIAL | `translations` table, `LanguageMiddleware`, en/bn/ar | Not fully applied to all UI | Complete translation keys |
| **Admin Login/Auth** | 🟢 COMPLETE | All auth controllers, throttled | — | — |
| **Admin Dashboard** | 🟢 COMPLETE | Analytics: monthly chart, status pie, top centres | — | — |
| **Admin Student CRUD** | 🟢 COMPLETE | `StudentController.php` (32KB), import/export | — | — |
| **Admin Centre CRUD** | 🟢 COMPLETE | `CenterController.php`, status management | — | — |
| **Admin Subject CRUD** | 🟢 COMPLETE | `SubjectController.php` (18KB) | — | — |
| **Admin Session CRUD** | 🟢 COMPLETE | `SessionController.php`, toggle status | — | — |
| **Admin Result Entry** | 🟢 COMPLETE | `ResultController.php` (11KB), GPA calc | — | — |
| **Admin Notice CRUD** | 🟢 COMPLETE | `NoticeController.php` | — | — |
| **Admin Slider CRUD** | 🟢 COMPLETE | `SliderController.php` | — | — |
| **Admin Team/Staff CRUD** | 🟢 COMPLETE | `TeamController.php` | — | — |
| **Admin Exam CRUD** | 🟡 PARTIAL | `ExamController.php`, `QuestionController.php` | Student exam flow not complete | Connect student exam flow |
| **Admin Document Builder** | 🟢 COMPLETE | Template + fields + preview + publish | Bulk PDF needs Node.js service running | Verify Node.js service on production |
| **Admin Bulk PDF** | 🟡 PARTIAL | `BulkDocumentController.php`, `GenerateBulkDocumentsJob.php` | Requires queue worker running | Setup supervisor/queue worker |
| **Admin Financial Records** | 🟡 PARTIAL | `FinancialController.php`, `Payment` model | Not linked to student payment flow | Wire to payment reconciliation |
| **Admin Grade Scales** | 🟢 COMPLETE | `GradeScaleController.php`, dynamic rules | — | — |
| **Admin Registration Review** | 🟡 PARTIAL | `RegistrationReviewController.php` | Workflow unclear | Define workflow |
| **Admin Diploma Management** | 🟡 PARTIAL | `DiplomaController.php` | Minimal — index + update only | Expand |
| **Admin Team Performance** | 🟢 COMPLETE | `TeamPerformanceController.php`, KPI dashboard | — | — |
| **Admin Payment Gateway** | 🟢 COMPLETE | `PaymentGatewayController.php`, bKash + SSLCommerz config | Credentials not encrypted | Encrypt credentials |
| **Admin SMS Gateway** | 🟢 COMPLETE | `SmsGatewayController.php`, config stored | SMS not triggered in controllers | Wire SMS triggers |
| **Admin Site Config/CMS** | 🟢 COMPLETE | `SiteConfig`, feature toggles, theme colors | — | — |
| **Admin Backup** | 🟡 PARTIAL | `BackupController.php` | Manual — no scheduled auto-backup | Add schedule |
| **Admin License CRUD** | 🟢 COMPLETE | `LicenseController.php` | — | — |
| **Admin Sub-admin CRUD** | 🟡 PARTIAL | `SubadminController.php` | RBAC enforcement inconsistent | Audit permissions |
| **Admin Contact Inquiries** | 🟢 COMPLETE | `ContactUsController.php`, AI analysis, mark-read | — | — |
| **Admin Footer/Sponsor** | 🟢 COMPLETE | `FooterLinkController`, `SponsorController`, `FooterPartnerLogoController` | — | — |
| **Centre User Auth** | 🟢 COMPLETE | Standard Breeze auth, `center_id` scoping | — | — |
| **Centre Dashboard** | 🟡 PARTIAL | `CenterLayout.jsx`, basic dashboard | Data connectivity gaps | Complete analytics |
| **Centre Student Management** | 🟢 COMPLETE | Via web.php `StudentController` resource | — | — |
| **Staff Login** | 🟢 COMPLETE | `staff/login` route | No password reset | Add password reset |
| **Staff Dashboard** | 🟢 COMPLETE | `Staff/Dashboard.jsx` (28KB), KPI charts | — | — |
| **Staff Student CRUD** | 🟢 COMPLETE | `Staff/StudentController.php` | Scoped to team | — |
| **Staff Subject CRUD** | 🟢 COMPLETE | `Staff/SubjectController.php` | Scoped to team | — |
| **Staff Session CRUD** | 🟢 COMPLETE | `Staff/SessionController.php` | Scoped to team | — |
| **Staff Document Generation** | 🟢 COMPLETE | `Staff/DocumentController.php`, uses admin templates | — | — |
| **Student Login** | 🟢 COMPLETE | `students/login`, password reset implemented | — | — |
| **Student Dashboard** | 🟢 COMPLETE | `Student/Dashboard.jsx` | — | — |
| **Student Results** | 🟢 COMPLETE | `Student/Results.jsx`, own results only | — | — |
| **Student Documents** | 🟡 PARTIAL | ID card, admit card, registration, marksheet routes | Document linking to templates | Verify all docs render |
| **Student Online Exam** | 🔴 INCOMPLETE | `ExamController.php`, `Student/Exam/` | No UI flow connected | Build exam taking flow |
| **Payment Checkout** | 🟡 PARTIAL | `PaymentController.php`, bKash + SSLCommerz | Not battle-tested in production | Test with sandbox |
| **Payment Callback** | 🟡 PARTIAL | Callback handler implemented | SSLCommerz IPN URL configuration needed | Set IPN URL in gateway |
| **SMS Notifications** | 🔴 30% | Drivers exist, jobs defined | Triggers not wired | Wire to student events |
| **AI/Gemini OCR** | 🟡 PARTIAL | `GeminiOcrController.php` | API key needed, not tested in production | Test |
| **Referral Tracking** | 🟢 COMPLETE | `CaptureReferralMiddleware`, `?ref=` param, team referral codes | — | — |
| **Laravel Telescope** | 🟢 COMPLETE | `/telescope`, secured to admin gate | — | — |
| **Test Suite** | 🟢 COMPLETE | 31/31 PHPUnit tests passing | E2E Playwright tests fragile | Maintain and expand |
| **Deployment Pipeline** | 🟡 PARTIAL | SFTP + SSH scripts work | No automated CI/CD (GitHub Actions stub only) | Setup GitHub Actions |

---

## Summary Statistics

| Metric | Count |
|---|---|
| Total models | 35 |
| Total migrations | 75 |
| Total routes (approx) | 120+ |
| Total controllers | 60+ |
| Total React pages | 70+ |
| PHPUnit tests | 31 passing |
| Playwright E2E specs | 16 files |
| Authentication guards | 4 |
| Feature flag toggles | 10 |
