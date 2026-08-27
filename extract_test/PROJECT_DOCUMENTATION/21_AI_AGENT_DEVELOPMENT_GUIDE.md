# 21 — AI Agent Development Guide

## MANDATORY READING FOR ALL AI CODING AGENTS

This document contains the rules every AI coding agent MUST follow before making any changes to this codebase.

---

## PRE-CHANGE CHECKLIST

Before modifying ANY file, the AI agent MUST:

1. **Read `PROJECT_MASTER_DOCUMENTATION.md`** to understand overall system context.
2. **Read the specific documentation section** for the area being changed.
3. **Read the actual source file(s)** using `view_file` before editing.
4. **Understand the current state** — what exists, what's partial, what's broken.
5. **Check all dependencies** — controllers, models, routes, frontend pages.
6. **Check authentication requirements** — which guard is required?
7. **Check tenant scoping** — does `CenterScope` apply? Are global scopes in play?
8. **Check if a feature flag toggle exists** — is this route behind `module:toggle_X`?
9. **Reuse existing components** — check `resources/js/Components/` before creating new ones.
10. **Make the smallest safe change** — do not refactor unrelated code.

---

## CRITICAL SYSTEM RULES

### Rule 1: Multi-Guard Architecture
```
NEVER use auth()->user() alone.
ALWAYS specify the guard:
  auth('admin')->user()   ← for admin context
  auth('staff')->user()   ← for staff context
  auth('student')->user() ← for student context
  auth()->user()          ← ONLY for web (centre user) context
```

### Rule 2: Tenant Isolation via CenterScope
```
NEVER bypass CenterScope unless you are an admin controller.
NEVER use DB::table('students') without manual where('center_id', ...).
Student and Result models have CenterScope global scope applied.
Admin bypass is automatic (guard 'admin' does not trigger scope).
Web (centre user) guard AUTOMATICALLY filters by center_id.
```

### Rule 3: Feature Flags
```
Public routes that should be togglable MUST use:
  ->middleware('module:toggle_FEATURE_NAME')
  
Feature flag names are columns in the site_configs table.
Adding a new toggleable feature requires:
  1. Adding column to site_configs via migration
  2. Adding column to SiteConfig::$fillable
  3. Adding toggle UI in Admin/ConfigDictionary or site config form
  4. Adding middleware to route
```

### Rule 4: Caching
```
When you modify Slider, Subject, Team, YoutubeVideo, Notice, Center, Student, or SiteConfig:
  → ClearsFrontendCache trait auto-fires on save/delete
  → Clears all 'homepage_*' cache keys

For SiteConfig, it also uses SiteConfig::CACHE_KEY = 'site_config_cache'
  → Clears on save via static::saved() observer

NEVER cache data without defining a cache key and clearing strategy.
```

### Rule 5: Inertia Response Pattern
```php
// ALL controllers MUST return Inertia responses for page renders:
return Inertia::render('Admin/SomePage', ['data' => $data]);

// For redirects after form submission:
return redirect()->back()->with('success', 'Message here');
// OR use the ResponseMixin:
return response()->success('Message here');
```

### Rule 6: Route Naming Convention
```
Admin routes:  admin.{resource}.{action}   e.g. admin.student.index
Staff routes:  staff.{resource}.{action}   e.g. staff.student.index
Student routes: student.{resource}.{action} e.g. student.documents
```

### Rule 7: Model Enums
```
These fields use PHP-backed Enums — always use the enum class, not raw strings:
  Student.status       → StudentStatus::Pending / StudentStatus::Approved / StudentStatus::Hide
  Student.gender       → Gender::Male / Gender::Female
  Student.religion     → Religion::Islam / etc.
  Student.blood_group  → BloodGroup::APositive / etc.
  Student.course_type  → CourseType::Regular / CourseType::Short_Course / CourseType::Diploma
  Center.status        → CenterStatus enum
  Session.status       → SessionStatus enum
  Exam.status          → ExamStatus enum
```

### Rule 8: Image Storage
```
All image storage goes through app/Lib/Image.php
  Image::store($requestFieldName, $folder) → returns relative path

Images are served via app/Casts/ImageField.php
  → Automatically prepends asset URL to stored path

NEVER store full URLs in the database. Store relative paths only.
```

---

## SAFE CHANGE PATTERNS

### Adding a New Admin CRUD Feature
```
1. Create migration → php artisan migrate
2. Create Model (with $fillable, $casts, relationships)
3. Create Controller in app/Http/Controllers/Admin/
4. Add route in routes/admin.php (inside auth:admin group)
5. Create React page in resources/js/Pages/Admin/{Feature}/
6. Test: php artisan test
7. Build: npm run build (if needed)
8. Commit and push
```

### Adding a New Public Feature Flag Toggle
```
1. Add column to site_configs table via migration
2. Add to SiteConfig::$fillable
3. Add to HandleInertiaRequests::share() site_config array
4. Add toggle UI in admin site settings page
5. Apply ->middleware('module:toggle_your_column') to route
6. Test: SiteConfig::isEnabled('toggle_your_column')
```

### Modifying Student Data
```
1. ALWAYS check CenterScope applies to your query
2. For admin bulk operations: use Student::withoutGlobalScope() if needed
3. StudentObserver fires on student events — don't duplicate logic
4. GPA is calculated in Result::gpa() and HasGrades trait
5. Roll/Registration numbers are auto-generated — don't hardcode
```

### Adding Payment Logic
```
1. The Transaction model is polymorphic (payable_type, payable_id)
2. After successful payment, fire PaymentSucceeded event
3. UpdateStudentFinancialStatus listener handles paid_amount, payment_status
4. Never mark a transaction as success without gateway verification
5. Always wrap payment operations in DB::beginTransaction() / commit()
```

---

## WHAT TO NEVER DO

```
❌ NEVER hardcode center_id values — use auth()->user()->center_id
❌ NEVER store plain credentials in code — use .env or encrypted DB
❌ NEVER skip CSRF — all web forms need @csrf or axios with CSRF header
❌ NEVER bypass CenterScope in center-user context
❌ NEVER commit .env files
❌ NEVER run migrate:fresh on production without backup
❌ NEVER create duplicate models — check app/Models/ first
❌ NEVER create duplicate routes — check routes/*.php first
❌ NEVER store payment data without a Transaction record
❌ NEVER expose the /live_deploy route (SECURITY CRITICAL — REMOVE IT)
```

---

## DEPLOYMENT RULES

```
1. Run: npm run build
2. Run: php artisan test (all 31 must pass)
3. Run: git add . && git commit -m "feat: description"
4. Run: git push origin main
5. Run: node direct_deploy.mjs (SFTP upload + SSH commands)
6. Verify: https://nenobet.live/health → {"status":"ok"}
7. Verify: https://nenobet.live/telescope → 403 (secured)
```

---

## KEY FILES TO ALWAYS READ BEFORE CHANGES

| File | Read Before |
|---|---|
| `app/Http/Middleware/HandleInertiaRequests.php` | Any change to shared data |
| `app/Scopes/CenterScope.php` | Any student/result query |
| `app/Models/SiteConfig.php` | Feature flags, site settings |
| `app/Models/Student.php` | Anything student-related |
| `app/Models/Result.php` | Result entry, GPA, certificate |
| `routes/admin.php` | Adding admin routes |
| `app/Providers/AppServiceProvider.php` | Cache clearing, Blade directives |
| `app/Providers/RouteServiceProvider.php` | Rate limiters |
| `app/Providers/EventServiceProvider.php` | Events and observers |
| `config/auth.php` | Authentication guards |

---

## ARCHITECTURE DECISION LOG

| Decision | Reason | Impact |
|---|---|---|
| Inertia.js (not REST API) | Single team, simpler architecture | No separate API layer needed |
| Multiple auth guards | Different user types, different tables | Each portal is isolated |
| CenterScope (global) | Multi-tenancy without schema separation | Automatic isolation, bypassable by admin |
| Feature flag toggles in DB | Admin can enable/disable without deployment | Requires cache clearing on change |
| Laratrust for RBAC | Established Laravel RBAC package | Complex permission matrix possible |
| Two PDF systems | Historic + newer enterprise system coexist | Migration needed to consolidate |
| MySQL (not PostgreSQL) | Hostinger compatibility | Some MySQL-specific queries (DATE_FORMAT) |
