# 10 — Authentication & Authorization

## Authentication System

### Guards Configured

| Guard | Model | Table | Login Route |
|---|---|---|---|
| `web` | `User` | `users` | `/login` |
| `admin` | `Admin` | `admins` | `/admin/login` |
| `student` | `Student` | `students` | `/students/login` |
| `staff` | `Team` | `teams` | `/staff/login` |

All guards use **session driver** (no JWT).  
All passwords hashed with **bcrypt**.

---

### Admin Authentication (`admin` guard)

**Routes** (`/admin/login`):
- `GET /admin/login` — show login form
- `POST /admin/login` — authenticate (throttle: 5/min)
- `POST /admin/logout`
- `GET/POST /admin/forgot-password` — password reset
- `GET/POST /admin/reset-password/{token}`
- `GET/POST /admin/verify-email` — email verification
- `POST /admin/email/verification-notification`

**Registration**: DISABLED (commented out in admin.php)  
**First admin**: Created via `php artisan` or `admin/userCreate` API (auth:admin required).

**Authorization**: Uses **Laratrust** RBAC:
```php
Admin::class uses LaratrustUserTrait
→ $admin->hasRole('super-admin')
→ $admin->hasPermission('edit-students')
```

---

### Centre User Authentication (`web` guard)

**Routes** (`/login`):
- Standard Laravel Breeze auth flow
- Password reset via email

Centre users have a `center_id` which activates `CenterScope` for data isolation.

---

### Student Authentication (`student` guard)

**Routes** (`/students/login`):
- All student routes prefixed with `middleware('portal.student')` — checks `toggle_student_portal` before any student route resolves.
- Login, forgot password, reset password implemented.

**Student credentials**: Set by admin on student record (email + password).

---

### Staff Authentication (`staff` guard)

**Routes** (`/staff/login`):
- Login, logout implemented.
- NO password reset flow implemented for staff.

---

## Authorization / Permission System

### RBAC via Laratrust (Admin only)

The **Admin model** uses `LaratrustUserTrait`:
- Roles and permissions stored in `roles`, `permissions`, `role_user`, `permission_role`, `permission_user` tables.
- Admin panel shared props include `auth.admin.permissions` (array of permission names).

### Middleware-Based Route Protection

| Middleware | Purpose | Applied On |
|---|---|---|
| `auth:admin` | Requires admin session | All `/admin/*` CRUD routes |
| `auth:staff` | Requires staff session | All `/staff/*` routes |
| `auth:student` | Requires student session | All `/students/*` routes |
| `auth` (web) | Requires centre user session | Centre CRUD routes |
| `guest:admin` | Redirect if admin logged in | Admin login page |
| `guest:staff` | Redirect if staff logged in | Staff login page |
| `guest:student` | Redirect if student logged in | Student login page |
| `module:toggle_X` | Feature flag check | Result, contact, notice, etc. |
| `portal.student` | Student portal toggle | All student routes |
| `throttle:admin-login` | 5 attempts/min | Admin login POST |
| `throttle:results` | 10 requests/min | Public result route |
| `throttle:contact` | 3 requests/min | Contact form |

### Telescope Gate (Admin only)
```php
Gate::define('viewTelescope', function ($user = null) {
    $admin = auth('admin')->user();
    return $admin && ($admin->id === 1 || $admin->hasPermission('super-admin'));
});
```

---

## Permission Matrix (Approximate)

| Feature | Admin | Sub-Admin | Centre User | Staff | Student | Public |
|---|---|---|---|---|---|---|
| Admin Dashboard | ✅ Full | ✅ Full | ❌ | ❌ | ❌ | ❌ |
| Manage Students | ✅ All centres | ✅ (role-limited) | ✅ Own centre | ✅ Own students | ❌ | ❌ |
| Manage Centres | ✅ Full | ⚠️ Limited | ❌ | ❌ | ❌ | ❌ |
| Manage Subjects | ✅ Full | ✅ | ❌ | ✅ Own (team_id) | ❌ | ❌ |
| Manage Sessions | ✅ Full | ✅ | ❌ | ✅ Own (team_id) | ❌ | ❌ |
| Manage Results | ✅ Full | ✅ | ❌ | ❌ | ❌ | ❌ |
| View Results | ✅ | ✅ | ✅ | ❌ | ✅ Own | ✅ (if enabled) |
| Document Templates | ✅ Full | ✅ | ❌ | ❌ | ❌ | ❌ |
| Generate Documents | ✅ Full | ✅ | ❌ | ✅ (limited) | ✅ Own docs | ❌ |
| Financial Records | ✅ Full | ⚠️ | ❌ | ❌ | ❌ | ❌ |
| Payment Gateway Config | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Site Config (CMS) | ✅ | ⚠️ | ❌ | ❌ | ❌ | ❌ |
| Notice Board | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ (if enabled) |
| Telescope | ✅ (id=1 or perm) | ❌ | ❌ | ❌ | ❌ | ❌ |

> ⚠️ Sub-admin RBAC permissions are defined by Laratrust but the granular enforcement per-route may be inconsistent. Many admin routes use only `auth:admin` middleware, not permission checks.

---

## Security Notes on Authentication

### ✅ Implemented
- bcrypt password hashing
- CSRF protection on all web forms
- Rate limiting on login (5/min), results (10/min), contact (3/min)
- Session-based auth (no long-lived tokens)
- Multi-guard isolation (admin session can't bleed to student)
- Student portal toggle (disable student access globally)

### ⚠️ Needs Review
- Sub-admin route permissions are not consistently enforced
- Staff password reset flow is NOT implemented
- Some admin routes lack `verified` middleware (email verification disabled)

### 🔴 Critical Issues
- `/live_deploy` route in `web.php` (line 130–140) executes Artisan commands without any authentication — **CRITICAL security vulnerability**
- `/ping` and `/test-transcript` are open debug routes in production
