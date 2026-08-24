# 04 — System Architecture

## Overview

BDNSI uses a **Monolithic Inertia.js architecture** — Laravel handles all HTTP routing and business logic server-side while React renders the UI client-side. There is no separate API service; Inertia bridges the gap.

---

## Request Lifecycle

```
Browser Request
       │
       ▼
Hostinger LiteSpeed Web Server (port 80/443)
       │
       ▼
public/index.php  ← Vite-compiled assets served from public/build/
       │
       ▼
Bootstrap (app.php → config, providers, middleware)
       │
       ▼
Http Kernel
  ├─ Global Middleware Stack
  │    TrustHosts → TrustProxies → HandleCors →
  │    PreventRequestsDuringMaintenance → ValidatePostSize →
  │    TrimStrings → ConvertEmptyStringsToNull
  │
  └─ Web Group Middleware (per request)
       throttle:web → EncryptCookies → AddQueuedCookiesToResponse →
       StartSession → CaptureReferralMiddleware →
       ShareErrorsFromSession → VerifyCsrfToken →
       SubstituteBindings → LanguageMiddleware →
       HandleInertiaRequests (shares global props to React)
       │
       ▼
Route Matching (web.php / admin.php / staff.php / student.php)
       │
       ├─ Route-level Middleware (auth:admin, throttle:X, module:toggle_X)
       │
       ▼
Controller Method
  ├─ Form Request Validation
  ├─ Business Logic / Service Layer
  ├─ Eloquent Model Operations (MySQL)
  └─ Inertia::render('PageComponent', $props)
       │
       ▼
HandleInertiaRequests::share() — merges global props:
  auth.user / auth.admin / auth.staff / auth.student
  flash messages / locale / site_config / footer_links
       │
       ▼
Inertia Response (JSON on XHR, full HTML on first load)
       │
       ▼
React (Client-side)
  app.jsx → createInertiaApp → resolves Page component
  Layout wraps page (AdminLayout / FrontendLayout / etc.)
  Props hydrated from server → component renders
```

---

## Authentication Architecture (Multi-Guard)

```
4 Independent Authentication Guards:

  ┌──────────────────┐   ┌──────────────────┐
  │   Guard: web     │   │   Guard: admin   │
  │   Model: User    │   │   Model: Admin   │
  │   Table: users   │   │   Table: admins  │
  │   Route: /login  │   │  Route:/admin/   │
  │                  │   │        login     │
  └──────────────────┘   └──────────────────┘
  
  ┌──────────────────┐   ┌──────────────────┐
  │  Guard: student  │   │   Guard: staff   │
  │  Model: Student  │   │   Model: Team    │
  │  Table: students │   │   Table: teams   │
  │  Route:/students/│   │  Route:/staff/   │
  │        login     │   │        login     │
  └──────────────────┘   └──────────────────┘
```

All guards use **session-based authentication** (no JWT/tokens for web).

---

## Tenant Isolation Architecture

The `CenterScope` global scope automatically filters `Student` and `Result` queries when logged in as a **center user** (guard: `web`, with `center_id`):

```
CenterScope::apply()
  if (auth('web')->user()->center_id)
    → WHERE students.center_id = {center_id}
    → OR WHERE results.student_id IN (students scoped to center)
```

Admin (guard: `admin`) and Staff (guard: `staff`) bypass this scope.

---

## Feature Flag Architecture

```
SiteConfig table (single-row config)
  → toggle_result_verify
  → toggle_success_students
  → toggle_notice_board
  → toggle_contact_form
  → toggle_center_apply
  → toggle_video_gallery
  → toggle_verified_centers
  → toggle_sponsors
  → toggle_whatsapp
  → toggle_student_portal

CheckModuleEnabled middleware:
  Route → middleware('module:toggle_result_verify')
  → SiteConfig::isEnabled('toggle_result_verify')
  → if disabled: Inertia::render('Frontend/ComingSoon')
```

---

## Document Generation Architecture

Two parallel systems:

### System A — PHP Template Engine
```
Admin selects template + student
→ DocumentGenerationController::generate()
→ DocumentGeneratorService::generate()
→ Loads DocumentTemplate + DocumentField records
→ Renders HTML template with student data
→ Returns HTML or PDF (via html2pdf.js client-side)
```

### System B — Enterprise Node.js PDF Engine (newer)
```
Admin triggers bulk generation
→ BulkDocumentController::bulkGenerate()
→ GenerateBulkDocumentsJob dispatched (queue)
→ PdfEngineService::renderPdf()
→ Calls Node.js pdf_engine.mjs via shell exec
→ Returns ZIP of PDFs
→ BulkDocumentController::bulkDownload()
```

---

## Payment Architecture

```
User → /payment/checkout → PaymentController::checkout()
         ↓ shows active gateways from PaymentGateway table
User selects gateway + submits
         ↓
PaymentController::process()
  → Creates pending Transaction record (polymorphic)
  → For bKash: calls bKash API → redirect to bKashURL
  → For SSLCommerz: posts to SSLCommerz API → redirect to GatewayPageURL

External Payment Gateway
         ↓
PaymentController::callback() [bKash] or success/IPN [SSLCommerz]
  → Verifies payment with gateway API
  → Updates Transaction.status = 'success'
  → Fires PaymentSucceeded event
         ↓
UpdateStudentFinancialStatus listener
  → Updates student.paid_amount, student.payment_status
         ↓
Redirect to /payment/success or /payment/failed
```

---

## Caching Architecture

```
SiteConfig::firstCached()          → Cache::remember('site_config_cache', 24h)
Homepage data                      → Cache::remember('homepage_*', varies)
Footer links                       → Cache::remember('footer_links', 1h)
Footer logos                       → Cache::remember('footer_logos', 1h)
Unread inquiries count             → Cache::remember('unread_inquiries', 1min)
Admin inquiry badge count          → shared via HandleInertiaRequests

Cache Invalidation:
  Models: Slider, Subject, Team, YoutubeVideo, Notice, Center, Student, SiteConfig
  All fire ClearsFrontendCache trait on save/delete
  → Forgets all 'homepage_*' keys
```

---

## SMS Architecture

```
SmsGateway model (table: sms_gateways)
  → driver: 'reve' or 'twilio'
  → credentials stored in DB

SmsGatewayFactory::make(SmsGateway $gateway)
  → returns ReveSmsDriver or TwilioSmsDriver

SendStudentSmsJob / SendPaymentConfirmationSmsJob
  → dispatched to queue
  → calls driver->send(phone, message)
```

> ⚠️ The SMS system has drivers and jobs defined but the triggering wiring in controllers is NOT fully connected. SMS is partially implemented.
