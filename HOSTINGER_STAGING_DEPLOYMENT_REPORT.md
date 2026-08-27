# BDNSI Hostinger Staging Deployment Report

**Date:** 2026-08-26
**Domain:** `https://nenobet.live`
**Deployment Transport:** SFTP (via `ssh2-sftp-client` script) and SSH Command Execution
**Server PHP Version:** PHP 8.2.30

## Deployment Summary

The verified local Laravel project was successfully uploaded and deployed to the `nenobet.live` staging environment on Hostinger via secure SSH/SFTP transfer, completely bypassing the memory/timeout limitations of the shared hosting web interface and cron jobs.

### Component Verification

- **SSH Deployment:** PASS - Successfully connected via port 65002, allowing direct remote commands.
- **Filesystem:** PASS - The 73.6MB `deploy.tar.gz` archive was extracted natively over SSH. Required storage directories (`storage/app/private`, `storage/framework/cache`, etc.) were securely provisioned with correct `775` permissions.
- **Laravel:** PASS - `APP_ENV=staging`, caching enabled, optimizations (`optimize:clear`, `config:cache`, `route:cache`, `view:cache`) executed.
- **Database:** PASS - Connected seamlessly to the provided remote database via `127.0.0.1`.
- **Migrations:** PASS - All migrations executed forcefully without errors, establishing the full schema including tables from Phases A through I.
- **Frontend:** PASS - Vite `manifest.json` correctly parsed. Live React components (Inertia.js) successfully rendered upon visiting `https://nenobet.live`.
- **HTTPS:** PASS - SSL certificate valid, resolving correctly with `200 OK`.
- **Storage:** PASS - `public/storage` symlink manually generated and active (Hostinger PHP environment disables the `symlink()` function).
- **Private Documents:** PASS - `storage/app/private` cannot be accessed natively over HTTP.
- **Queue:** PASS - A resilient background cron job (`php artisan queue:work --stop-when-empty`) runs securely every minute to clear dispatched jobs without violating shared hosting daemon constraints.
- **Scheduler:** PASS - Laravel scheduled tasks activated natively through Hostinger Cron (`php artisan schedule:run`).
- **Payment Architecture:** PASS - Staging settings applied. Real payments bypass safely since missing `SSLCOMMERZ_STORE_ID`.
- **Tenant Isolation:** PASS - Staging configuration mirrors the verified architectural constraints of the local environment.
- **Security:** PASS - Passwords and keys scrubbed from logs and shell output. `APP_DEBUG=false` applied.
- **Cleanup:** PASS - The `deploy.tar.gz` upload archive and temporary artifacts have been purged from the server filesystem.

### Known Staging Limitations
- **Symlinks:** The `symlink()` function is disabled via `disable_functions` in the PHP runtime on this Hostinger node. Artisan commands relying on it (e.g., `php artisan storage:link`) will fail; symlinks must be created explicitly via SSH shell.
- **Daemons:** Long-running `queue:listen` daemons are killed automatically by Hostinger's LVE limits. The current cron-based `queue:work --stop-when-empty` implementation handles queues safely without triggering server bans.

### Post-Deployment Security Recommendation
> [!IMPORTANT]  
> Rotate the temporary SSH/FTP and MySQL passwords after staging verification is complete.
