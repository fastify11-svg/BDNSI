# 07 — Pages & Routes Inventory

## Public Routes (Unauthenticated)

| Route | Method | Controller | Page Component | Status |
|---|---|---|---|---|
| `/` | GET | `HomeController::index` | `Welcome.jsx` | ✅ |
| `/all-course` | GET | `HomeController::all_course` | `AllCourse.jsx` | ✅ |
| `/course-details/{id}` | GET | `HomeController::courseDetails` | `CourseDetails.jsx` | ✅ |
| `/institute-details/{id}` | GET | `HomeController::instituteDetails` | `CourseDetails.jsx` | ✅ |
| `/verify` | GET/POST | `VerifyController` | `Verify.jsx` | ✅ |
| `/result` | GET | `ResultController` | `Result.jsx` | ✅ (module:toggle_result_verify) |
| `/license-view/{number?}` | GET | `HomeController::license` | `LicenseView.jsx` | ✅ |
| `/all-notice-list` | GET | `HomeController::frontendNoticeList` | `NoticeList.jsx` | ✅ (module:toggle_notice_board) |
| `/all-notice-list/{id}` | GET | `HomeController::noticeDetails` | `NoticeDetails.jsx` | ✅ (module:toggle_notice_board) |
| `/video-gallery` | GET | `HomeController::videoGallery` | `VideoGallery.jsx` | ✅ (module:toggle_video_gallery) |
| `/success-student` | GET | `HomeController::successStudent` | `SuccessStudent.jsx` | ✅ (module:toggle_success_students) |
| `/verified-center` | GET | `HomeController::verifiedCenter` | `VerifiedCenter.jsx` | ✅ (module:toggle_verified_centers) |
| `/verified-institute` | GET | `HomeController::verifiedCenter` | `VerifiedCenter.jsx` | ✅ |
| `/contact-us` | GET/POST | `HomeController::contactUs` | `ContactUs.jsx` | ✅ (module:toggle_contact_form) |
| `/center-request/create` | GET | `CenterRequestController::create` | `CenterRequest.jsx` | ✅ (module:toggle_center_apply) |
| `/center-request` | POST | `CenterRequestController::store` | — | ✅ |
| `/page/{type}` | GET | `HomeController::dynamicPage` | `DynamicPage.jsx` | ✅ |
| `/success-student-details/{id}` | GET | `FrontendController::successStudentDetails` | — | ✅ |
| `/whatapp-link/{phone}` | GET | Closure | `frontend.page.whatapplink` (Blade) | ✅ |
| `/lang-change` | GET | Closure | — | ✅ |
| `/health` | GET | Closure | JSON response | ✅ |
| `/ping` | GET | Closure | text 'pong' | ⚠️ Debug route |
| `/live_deploy` | GET | Closure | — | 🔴 SECURITY CRITICAL |
| `/test-transcript` | GET | Closure | Blade view | ⚠️ Debug route |

---

## Auth Routes (Centre User — `web` guard)

| Route | Method | Status |
|---|---|---|
| `/login` | GET | ✅ |
| `/login` | POST | ✅ |
| `/logout` | POST | ✅ |
| `/forgot-password` | GET/POST | ✅ |
| `/reset-password/{token}` | GET/POST | ✅ |
| `/verify-email` | GET | ✅ |
| `/verify-email/{id}/{hash}` | GET | ✅ |
| `/confirm-password` | GET/POST | ✅ |

---

## Centre User Protected Routes (`auth` guard)

| Route | Method | Controller | Page | Status |
|---|---|---|---|---|
| `/dashboard` | GET | `DashboardController` | `dashboard.blade.php` | ✅ |
| `/student` | GET | `StudentController::index` | — | ✅ |
| `/student/create` | GET | `StudentController::create` | — | ✅ |
| `/student` | POST | `StudentController::store` | — | ✅ |
| `/student/{id}` | GET/PUT/DELETE | `StudentController::*` | — | ✅ |
| `/student-submission/create` | GET | `StudentSubmissionController` | — | ✅ |
| `/center-student-result` | GET | `CenterTotalResultController` | — | ✅ |
| `/password-update/create` | GET/POST | `PasswordUpdateController` | — | ✅ |
| `/profile-update/create` | GET/POST | `ProfileUpdateController` | — | ✅ |
| `/student-info/{id}` | GET | `FrontendController::studentInfo` | — | ✅ |
| `/portal/{user}` | GET | `PortalController` | — | ✅ |

---

## Payment Routes

| Route | Method | Controller | Page | Status |
|---|---|---|---|---|
| `/payment/checkout` | GET | `PaymentController::checkout` | `Payment/Checkout.jsx` | 🟡 |
| `/payment/process` | POST | `PaymentController::process` | — | 🟡 |
| `/payment/callback/{gateway}` | GET/POST | `PaymentController::callback` | — | 🟡 |
| `/payment/success` | GET/POST | `PaymentController::success` | `Payment/Success.jsx` | 🟡 |
| `/payment/failed` | GET/POST | `PaymentController::failed` | `Payment/Failed.jsx` | 🟡 |
| `/payment/cancel` | GET/POST | `PaymentController::cancel` | `Payment/Cancelled.jsx` | 🟡 |

---

## Admin Routes (`/admin/*` — `auth:admin`)

| Route | Controller | Status |
|---|---|---|
| `/admin/dashboard` | `Admin/DashboardController::index` | ✅ |
| `/admin/student` (CRUD) | `Admin/StudentController` | ✅ |
| `/admin/student/export` | `Admin/StudentController::exportCsv` | ✅ |
| `/admin/student/import` | `Admin/StudentController::importCsv` | ✅ |
| `/admin/admit-card/{id}` | `Admin/StudentController::admit` | ✅ |
| `/admin/certificate/{id}` | `Admin/StudentController::certificate` | ✅ |
| `/admin/subject` (CRUD) | `Admin/SubjectController` | ✅ |
| `/admin/session` (CRUD) | `Admin/SessionController` | ✅ |
| `/admin/exam` (CRUD) | `Admin/ExamController` | 🟡 |
| `/admin/question` (CRUD) | `Admin/QuestionController` | 🟡 |
| `/admin/result` (CRUD) | `Admin/ResultController` | ✅ |
| `/admin/center` (CRUD) | `Admin/CenterController` | ✅ |
| `/admin/notice` (CRUD) | `Admin/NoticeController` | ✅ |
| `/admin/slider` (CRUD) | `Admin/SliderController` | ✅ |
| `/admin/team` (CRUD) | `Admin/TeamController` | ✅ |
| `/admin/team-performance` | `Admin/TeamPerformanceController` | ✅ |
| `/admin/sub-admin` (CRUD) | `Admin/SubadminController` | 🟡 |
| `/admin/user` (CRUD) | `Admin/UserController` | ✅ |
| `/admin/license` (CRUD) | `Admin/LicenseController` | ✅ |
| `/admin/document-templates` (CRUD) | `Admin/DocumentTemplateController` | ✅ |
| `/admin/document-templates/{id}/preview` | `Admin/DocumentTemplateController::preview` | ✅ |
| `/admin/documents/bulk-generate` | `Admin/BulkDocumentController` | 🟡 |
| `/admin/financial` | `Admin/FinancialController` | 🟡 |
| `/admin/grade-scales` | `Admin/GradeScaleController` | ✅ |
| `/admin/registration-review` | `Admin/RegistrationReviewController` | 🟡 |
| `/admin/diplomas` | `Admin/DiplomaController` | 🟡 |
| `/admin/payment-gateway` | `Admin/PaymentGatewayController` | ✅ |
| `/admin/sms-gateway` | `Admin/SmsGatewayController` | ✅ |
| `/admin/contactUs` | `Admin/ContactUsController` | ✅ |
| `/admin/translation` (CRUD) | `Admin/TranslationController` | ✅ |
| `/admin/sponsor` (CRUD) | `Admin/SponsorController` | ✅ |
| `/admin/backup` | `Admin/BackupController` | 🟡 |
| `/admin/whatapp-link` (CRUD) | `Admin/WhatappLinkController` | ✅ |
| `/admin/youtube-video` (CRUD) | `Admin/YoutubeVideoController` | ✅ |
| `/admin/footer-link` (CRUD) | `Admin/FooterLinkController` | ✅ |
| `/admin/footer-logo` (CRUD) | `Admin/FooterPartnerLogoController` | ✅ |
| `/admin/api-settings` | `Admin/ApiSettingController` | ✅ |
| `/telescope` | Laravel Telescope | ✅ (admin-gated) |

---

## Staff Routes (`/staff/*` — `auth:staff`)

| Route | Method | Controller | Status |
|---|---|---|---|
| `/staff/login` | GET/POST | `Staff/Auth/AuthenticatedSessionController` | ✅ |
| `/staff/logout` | POST | — | ✅ |
| `/staff/dashboard` | GET | `Staff/DashboardController` | ✅ |
| `/staff/courses` | GET/POST | `Staff/SubjectController` | ✅ |
| `/staff/courses/{id}` | PUT/DELETE | `Staff/SubjectController` | ✅ |
| `/staff/sessions` | GET/POST | `Staff/SessionController` | ✅ |
| `/staff/sessions/{id}` | PUT/DELETE | `Staff/SessionController` | ✅ |
| `/staff/students` | GET | `Staff/StudentController` | ✅ |
| `/staff/students/create` | GET | `Staff/StudentController` | ✅ |
| `/staff/students` | POST | `Staff/StudentController` | ✅ |
| `/staff/students/{student}` | GET/PUT/DELETE | `Staff/StudentController` | ✅ |
| `/staff/documents` | GET | `Staff/DocumentController` | ✅ |
| `/staff/documents/generate/{template}/{student}` | GET | `Staff/DocumentController` | ✅ |

---

## Student Routes (`/students/*` — `auth:student`, `portal.student`)

| Route | Method | Controller | Status |
|---|---|---|---|
| `/students/login` | GET/POST | `Student/Auth/AuthenticatedSessionController` | ✅ |
| `/students/forgot-password` | GET/POST | `Student/Auth/PasswordResetLinkController` | ✅ |
| `/students/reset-password/{token}` | GET/POST | `Student/Auth/NewPasswordController` | ✅ |
| `/students/logout` | POST | — | ✅ |
| `/students/dashboard` | GET | `Student/DashboardController` | ✅ |
| `/students/results` | GET | `Student/DocumentController::results` | ✅ |
| `/students/documents` | GET | `Student/DocumentController::index` | 🟡 |
| `/students/id-card` | GET | `Student/DocumentController::idCard` | 🟡 |
| `/students/admit-card` | GET | `Student/DocumentController::admitCard` | 🟡 |
| `/students/registration-card` | GET | `Student/DocumentController::registrationCard` | 🟡 |
| `/students/marksheet` | GET | `Student/DocumentController::marksheet` | 🟡 |
| `/students/exam` | GET | `Student/ExamController` | 🔴 Incomplete |
| `/students/confirm-password` | GET/POST | — | ✅ |
