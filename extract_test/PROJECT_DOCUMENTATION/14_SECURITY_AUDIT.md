# 14 — Security Audit

## Security Review Summary

**Audit Date**: 2026-08-24  
**Basis**: Static code analysis of routes, controllers, models, middleware

---

## 🔴 CRITICAL

### C-01: Unauthenticated `/live_deploy` Route
- **Location**: `routes/web.php` lines 130–140
- **Problem**: An open GET route that drops and re-creates database tables and runs `php artisan migrate --force`. No authentication, no authorization.
- **Risk**: Anyone who knows the URL can destroy the production database.
- **Fix**: Remove immediately from production. If needed, convert to an artisan command.

```php
// CRITICAL — REMOVE THIS:
Route::get('/live_deploy', function () {
    Schema::dropIfExists('semester_results');
    ...
    Artisan::call('migrate', ['--force' => true]);
});
```

---

### C-02: Open Debug Routes in Production
- **Location**: `routes/web.php` lines 142–144
- **Problem**: `/ping`, `/test-transcript` routes exist with no authentication.
- **`/test-transcript`** renders a student transcript Blade view with fabricated data — information leakage risk and confirms Blade template paths.
- **Fix**: Remove or protect behind `auth:admin`.

---

### C-03: SSH/SFTP Credentials Hardcoded in Deploy Scripts
- **Location**: `direct_deploy.mjs`, `auto_deploy.mjs`, `deploy_telescope.mjs`
- **Problem**: Production server IP, SSH username, and password are hardcoded in plain text.
- **Risk**: Anyone with repository access has server root SSH access.
- **Fix**: Move to `.env` or GitHub Secrets. Use SSH key authentication instead of passwords.

---

## 🟠 HIGH

### H-01: Sub-admin Permission Enforcement Gap
- **Location**: All `/admin/*` routes in `admin.php`
- **Problem**: Routes use only `auth:admin` middleware. There is no `$this->authorize()` or permission check in most controllers. A sub-admin can potentially access admin-only features.
- **Fix**: Add Laratrust `can:` middleware or permission checks in controllers for sensitive operations.

### H-02: Credentials Potentially Stored in `payment_gateways` Table (Unencrypted)
- **Location**: `payment_gateways` table — columns `store_id`, `store_password`, `app_key`, `app_secret`, `username`, `password`
- **Problem**: Payment gateway credentials are stored in plaintext in the database. A database dump exposes production payment credentials.
- **Fix**: Encrypt at-rest using Laravel's `encrypt()` / encrypted cast.

### H-03: Gemini API Key Storage
- **Location**: `app/Http/Controllers/GeminiOcrController.php`, `admin/api-settings` route
- **Problem**: API keys stored in `config_dictionaries` table (plaintext). If the table is exposed, the Gemini API key leaks.
- **Fix**: Store sensitive API keys in `.env`, not in the database.

---

## 🟡 MEDIUM

### M-01: CORS Configuration (Permissive)
- **Package**: `fruitcake/laravel-cors` (abandoned package)
- **Location**: `app/Http/Kernel.php`
- **Problem**: CORS policy should be reviewed. If the default config allows `*`, it could enable cross-origin attacks.
- **Fix**: Migrate to `spatie/laravel-cors` or Laravel 9's built-in CORS. Review `config/cors.php`.

### M-02: Missing Staff Password Reset
- **Location**: `routes/staff.php`
- **Problem**: Staff (Team model) has no password reset route. Locked-out staff can only be reset by admin.
- **Fix**: Implement staff password reset flow.

### M-03: Student Data Filtering Relies on Global Scope (Bypassable)
- **Location**: `app/Scopes/CenterScope.php`
- **Problem**: The CenterScope is a global scope that can be bypassed with `Student::withoutGlobalScope(CenterScope::class)`. If any controller fails to use the guarded model, it can return all students.
- **Risk**: Low if all code uses Eloquent, but raw DB queries bypass it.
- **Fix**: Audit for any `DB::table('students')` calls that bypass the scope.

### M-04: File Upload Validation
- **Location**: Multiple controllers (StudentController, CenterController, etc.)
- **Problem**: Image uploads use `intervention/image`. Ensure MIME type validation is enforced, not just extension validation.
- **Fix**: Verify `$request->validate(['image' => 'image|mimes:jpg,jpeg,png|max:2048'])` is consistently applied.

### M-05: No CAPTCHA on Login Forms
- **Location**: `app/Http/Middleware/CaptchaCodeChecker.php` exists but is not applied to login routes.
- **Problem**: Rate limiting (5/min for admin) is the only brute-force protection. CAPTCHA is implemented but not connected.
- **Fix**: Apply `CaptchaCodeChecker` middleware to admin/staff/student login routes.

---

## 🟢 LOW

### L-01: Security Headers Implemented ✅
- CSP, X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy are set (verified in live site HTTP headers).

### L-02: Rate Limiting Implemented ✅
- `admin-login: 5/min`, `results: 10/min`, `contact: 3/min`, `web: 120/min`, `api: 60/min`

### L-03: CSRF Protection Implemented ✅
- `VerifyCsrfToken` middleware active on all web routes.

### L-04: Debug Mode Should Be OFF in Production
- `.env.example` shows `APP_DEBUG=false` — verify actual production `.env` has this.

### L-05: Telescope Secured ✅
- Gate requires `admin` guard with `id=1` OR `super-admin` permission.
- Returns `403 Forbidden` to unauthorized users.

### L-06: Session Driver
- `.env.example` shows `SESSION_DRIVER=database` — ensures sessions are server-side, not easily hijacked via cookies.

---

## Security Checklist Summary

| Check | Status |
|---|---|
| Authentication (bcrypt passwords) | ✅ |
| CSRF Protection | ✅ |
| XSS (Inertia/React escapes output) | ✅ |
| SQL Injection (Eloquent ORM) | ✅ |
| Rate Limiting | ✅ |
| Security Headers | ✅ |
| Unauthenticated Admin Routes | 🔴 C-01 |
| CORS Policy | 🟡 Review needed |
| Payment Credential Encryption | 🟠 |
| Sub-admin Authorization | 🟠 |
| Hardcoded Server Credentials | 🔴 C-03 |
| Staff Password Reset | 🟡 Missing |
| CAPTCHA | 🟡 Implemented but not applied |
| File Upload Validation | 🟡 Review needed |
