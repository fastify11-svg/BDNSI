# BDNSI Hostinger Staging Finalization Report

**Date:** 2026-08-26
**Domain:** `https://nenobet.live`
**Environment:** Staging / Live Testing
**Baseline Git Commit:** `b6d7984` — `deploy: bootstrap fresh Hostinger environment`

---

## Finalization Summary

The staging environment has been secured and finalized following the initial deployment. All credentials have been rotated (MySQL automatically via API; SSH/FTP manually by the administrator). All temporary deployment artifacts have been removed from the live server. The environment is frozen as a verified known-good baseline.

---

## Credential Rotation Status

| Credential | Status | Method |
|---|---|---|
| SSH Password | ✅ PASS | Manual rotation by administrator; old password confirmed dead |
| FTP Password | ✅ PASS | Manual rotation by administrator |
| MySQL Password | ✅ PASS | Rotated via Hostinger API; `.env` updated via TUS upload |

---

## Backup Status

| Artifact | Status | Location |
|---|---|---|
| Database dump | ✅ PASS | `~/deployment_backups/post_live_verified/db_backup.sql` |
| Application archive | ✅ PASS | `~/deployment_backups/post_live_verified/app_backup.tar.gz` |

---

## System & Security Verifications

| Check | Status | Notes |
|---|---|---|
| Database connectivity | ✅ PASS | `system:health-check` confirmed |
| Cache/Redis connectivity | ✅ PASS | `system:health-check` confirmed |
| Public Storage | ✅ PASS | `system:health-check` confirmed |
| Private Storage | ✅ PASS | `system:health-check` confirmed |
| SSLCommerz Gateway API | ✅ PASS | Reachable (Sandbox mode) |
| HTTPS / TLS | ✅ PASS | Site loads securely |
| Frontend (Inertia/Vite) | ✅ PASS | Assets render correctly |
| `/login` (Student portal) | ✅ PASS | HTTP 200 |
| `/admin/login` | ✅ PASS | HTTP 200 |
| `/staff/login` | ✅ PASS | HTTP 200 |
| Migrations | ✅ PASS | All ran — Batch 1 |
| Queue strategy | ✅ PASS | Cron-driven `queue:work --stop-when-empty` every minute |
| Scheduler | ✅ PASS | `schedule:run` via cron every minute |
| Payment isolation | ✅ PASS | Sandbox credentials only — no real charges possible |
| Tenant isolation | ✅ PASS | Verified |
| Private document access | ✅ PASS | `storage/app/private` inaccessible via public URL |
| Secret leakage scan | ✅ PASS | No exposed credentials found in code, logs, or live server |

---

## Artifact Cleanup — Final Verification

### Live Server (`public_html/` root)
All temporary deployment artifacts confirmed removed:

| File | Status |
|---|---|
| `health.php` | ✅ Removed |
| `health_runner.sh` | ✅ Removed |
| `health_runner_final.sh` | ✅ Removed |
| `health_single.sh` | ✅ Removed |
| `pub_clean.sh` | ✅ Removed |
| `reset_password.php` | ✅ Removed |
| `zip_it.php` | ✅ Removed |

### Live Server (`public_html/public/`)
All temporary diagnostic outputs confirmed removed (verified by directory listing):

| File | Status |
|---|---|
| `health.php` | ✅ Removed |
| `health_report.txt` | ✅ Removed |
| `health_report_final.txt` | ✅ Removed |
| `health_report_single.txt` | ✅ Removed |

### Local Repository
All temporary deployment scripts removed from local workspace. `.env.staging` and `.env.upload` added to `.gitignore`.

---

## Known Staging Limitations

1. **SSH/FTP credential rotation:** Cannot be performed autonomously via the Hostinger API — requires hPanel.
2. **Symlinks:** `symlink()` disabled by Hostinger PHP security policy; `storage:link` requires shell execution.
3. **Queue daemons:** Persistent Supervisor daemons are blocked by Hostinger LVE constraints; cron-based queue workers are the approved pattern.
4. **Session driver:** `file` (not Redis) — appropriate for this shared hosting tier.

---

## Git Baseline Record

```
Commit:  b6d7984
Message: deploy: bootstrap fresh Hostinger environment
Branch:  main
```

**Recent commit history:**
```
b6d7984 deploy: bootstrap fresh Hostinger environment
de7d6a7 security: retire unsafe deployment automation
2385d3e ci: isolate tests and require manual deployments
3b26644 feat: harden finance analytics and agent workflow
a629012 Phase H: isolate test database and harden preflight safeguards
```

---

## Final Baseline Status

> [!IMPORTANT]
> **FINALIZATION STATUS: VERIFIED**
> **STAGING BASELINE FROZEN** — 2026-08-26
> No further deployment, configuration, database, business-logic, or architecture changes are authorized until explicitly approved.
