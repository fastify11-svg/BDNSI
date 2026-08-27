# HOSTINGER STAGING DEPLOYMENT MASTER INSTRUCTION

## Context

This is the existing BDNSI project currently being developed locally inside Antigravity IDE.

The final production domain/hosting has NOT been selected yet.

For now, deploy the current verified project to:

**Domain:** `nenobet.live`

**Purpose:** Temporary live staging/testing environment only.

This is NOT the final production deployment.

Do NOT use GitHub deployment for this staging environment.

The Hostinger Connector extension is already connected to Antigravity using a Hostinger API token. Use that existing connector directly where supported.

Do NOT ask the owner to manually perform routine deployment steps if the Hostinger Connector and local project access allow those steps to be performed safely.

---

## 1. PRIMARY OBJECTIVE

Build a safe, repeatable, automated staging deployment workflow:

**LOCAL PROJECT → VERIFY → BACKUP → BUILD → HOSTINGER → CONFIGURE → DATABASE → STORAGE → QUEUE → SCHEDULER → SSL → HEALTH CHECK → LIVE SMOKE TEST**

The goal is to make `https://nenobet.live` a stable live testing environment for the current project.

---

## 2. CRITICAL SAFETY RULES

1. Do NOT use GitHub deployment.
2. Do NOT modify or delete the local project unnecessarily.
3. Do NOT run destructive database commands such as `php artisan migrate:fresh` or `php artisan db:wipe`.
4. Do NOT delete existing Hostinger files/databases unless verified that they belong exclusively to this staging deployment.
5. Do NOT expose the Hostinger API token.
6. Do NOT write API tokens, database passwords, SSH passwords, payment secrets, APP_KEY, or other credentials into source-controlled files.
7. Do NOT place secrets inside JavaScript/frontend bundles.
8. Do NOT enable `APP_DEBUG=true` on the publicly accessible staging environment unless absolutely necessary for a controlled diagnostic session.
9. Never expose `.env`, storage logs, database backups, private documents, deployment scripts, or credentials through public URLs.
10. Preserve all verified Phase A–I architecture and business logic.
11. Do not rewrite application architecture just for deployment.

---

## 3. INSPECT HOSTINGER CONNECTION

First verify the Hostinger Connector integration.

Determine automatically, where supported:

- Connected Hostinger account
- Hosting plan
- Target hosting/server
- `nenobet.live` domain
- document root
- PHP version
- database capability
- filesystem access
- SSH/terminal capability
- cron capability
- SSL capability

Do not expose credentials in reports.

If the Connector cannot perform a specific operation directly, identify the smallest safe manual requirement.

Do NOT switch to GitHub deployment.

---

## 4. INSPECT LOCAL PROJECT

Before uploading anything, inspect the actual local project.

Verify:

- Laravel application structure
- React/Inertia/Vite frontend
- `composer.json`
- `package.json`
- `.env.example`
- migrations
- storage configuration
- queue configuration
- scheduler
- payment integrations
- document/certificate generation
- private file storage
- public assets
- database requirements
- PHP extensions
- Node build requirements

Determine the correct Hostinger deployment architecture based on the ACTUAL codebase.

---

## 5. PRE-DEPLOYMENT VERIFICATION

Run where available:

```bash
php artisan test
npm run build
php artisan system:financial-health-check
php artisan system:financial-reconciliation
php artisan system:db-integrity-check
php artisan system:health-check
php artisan system:production-health-check
php artisan migrate:status
```

If any CRITICAL security, financial, database, or build failure exists:

**STOP DEPLOYMENT.**

Fix or report the blocker first.

Do not deploy a known-broken build.

---

## 6. STAGING ENVIRONMENT CONFIGURATION

Treat `nenobet.live` as `APP_ENV=staging` or the project's safest equivalent.

Configure server-side environment variables securely, including where applicable:

- `APP_NAME`
- `APP_ENV`
- `APP_KEY`
- `APP_DEBUG=false`
- `APP_URL=https://nenobet.live`
- DB settings
- cache settings
- session settings
- `QUEUE_CONNECTION`
- mail/SMS settings
- filesystem settings
- payment gateway settings

Do not invent credentials.

Use existing secure values or create staging-specific configuration where appropriate.

The staging deployment must not accidentally use an unrelated production database or destructive credentials.

---

## 7. DOMAIN & DOCUMENT ROOT

Configure `nenobet.live` to serve Laravel correctly.

The public web root must point to `/public`, not the Laravel project root.

Public web access must never expose:

- `app/`
- `bootstrap/`
- `config/`
- `database/`
- `resources/`
- `routes/`
- `storage/`
- `vendor/`
- `.env`
- composer files
- deployment files

---

## 8. PHP & SERVER REQUIREMENTS

Use the PHP version required by the current project.

Verify required PHP extensions actually used by the application, such as:

- `pdo_mysql`
- `openssl`
- `mbstring`
- `tokenizer`
- `xml`
- `ctype`
- `json`
- `fileinfo`
- `curl`
- `gd`
- `zip`

Do not install/change unnecessary components.

Verify Composer compatibility.

---

## 9. DEPLOY APPLICATION FILES

Deploy the verified local project using the safest supported Hostinger Connector workflow.

Do not upload unnecessary local files such as:

- `node_modules/`
- `.git/`
- local logs
- temporary files
- IDE metadata
- local database dumps
- test artifacts
- secret files

Use deployment exclusions.

---

## 10. COMPOSER / BACKEND SETUP

Install production PHP dependencies safely, where compatible:

```bash
composer install --no-dev --optimize-autoloader
```

Then verify Laravel can boot.

Do not run destructive Artisan commands.

---

## 11. FRONTEND ASSETS

Use one consistent strategy:

- build locally and deploy generated assets, or
- build safely on the server if supported.

Verify Vite manifest/assets resolve correctly from `nenobet.live`.

---

## 12. DATABASE SETUP

Create or select a dedicated staging database for `nenobet.live`.

Do NOT point staging to an unrelated production database.

Run:

```bash
php artisan migrate --force
```

ONLY after:

- database target is confirmed,
- migration status is reviewed,
- migrations are non-destructive,
- backup/rollback strategy is available.

Never use `migrate:fresh`.

---

## 13. STORAGE & FILE PERMISSIONS

Configure writable directories:

- `storage/`
- `bootstrap/cache/`

Use safe permissions.

Run `php artisan storage:link` only for content intended to be public.

Sensitive student documents must remain on private storage.

---

## 14. LARAVEL OPTIMIZATION

After environment configuration is correct, use safe optimization where compatible:

```bash
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear
```

Then, where compatible:

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## 15. QUEUE WORKER

Configure a persistent queue worker using the safest Hostinger-supported mechanism.

Verify:

- worker starts,
- worker survives/restarts,
- retries work,
- failed jobs are visible,
- duplicate processing does not occur.

Do not silently fall back to synchronous queue execution if the app depends on background processing.

---

## 16. SCHEDULER / CRON

Configure Laravel scheduler with a Hostinger cron equivalent to:

```bash
php artisan schedule:run
```

every minute, where supported and appropriate.

Verify scheduled tasks and prevent duplicate cron definitions.

---

## 17. SSL / HTTPS

Configure SSL for `https://nenobet.live`.

Verify:

- valid certificate,
- HTTPS works,
- HTTP redirects safely to HTTPS,
- `APP_URL` uses HTTPS,
- no mixed-content errors,
- payment callback URLs use HTTPS where required.

---

## 18. PAYMENT STAGING SAFETY

Use sandbox/test payment configuration where available.

Do NOT accidentally process real financial transactions unless explicitly authorized.

Verify staging callback/IPN URLs.

Maintain:

- idempotency,
- amount verification,
- order verification,
- transaction verification.

---

## 19. PRIVATE DOCUMENT SECURITY

Verify sensitive uploads remain outside public storage.

Attempt direct access to private files.

Expected: `403` or `404`.

Verify Center A cannot access Center B files.

---

## 20. WEB SERVER SECURITY

Attempt public access to:

- `/.env`
- `/composer.json`
- `/storage/logs/laravel.log`
- `/database/`
- `/vendor/`
- `/deploy.env`
- `/.git/`

All must be inaccessible.

Verify directory listing is disabled.

---

## 21. LIVE STAGING SMOKE TEST

Verify on the actual HTTPS staging site:

- Public website
- Center login
- Admin login
- Student registration
- Order creation
- Pay Now/Credit flow using safe test configuration
- Center dashboard
- Student document access rules
- Result access
- Certificate access
- Public verification
- Reports
- Notifications/queues where safe
- Tenant isolation

---

## 22. FINANCIAL POST-DEPLOY CHECK

Run:

```bash
php artisan system:financial-health-check
php artisan system:financial-reconciliation
php artisan system:db-integrity-check
```

Do not accept the deployment if critical inconsistencies are detected.

---

## 23. SYSTEM POST-DEPLOY CHECK

Run:

```bash
php artisan system:health-check
```

Verify:

- Database
- Cache
- Queue
- Storage
- Scheduler
- Critical configuration

Check logs for deployment-related errors without exposing logs publicly.

---

## 24. REPEATABLE DIRECT HOSTINGER DEPLOYMENT

After the first successful deployment, create a reusable safe workflow:

**Local verification → Build → Backup → Upload changes → Composer install → Safe migrations → Clear/cache → Restart queue → Health checks → Smoke test**

Do NOT use GitHub deployment.

Do not store secrets in source files.

---

## 25. DEPLOYMENT DOCUMENTATION

Create:

`HOSTINGER_STAGING_DEPLOYMENT.md`

Document:

- target domain
- environment type
- application root
- public root
- PHP version
- deployment workflow
- database strategy
- queue setup
- scheduler setup
- SSL setup
- storage strategy
- backup procedure
- rollback procedure
- health-check commands
- smoke-test checklist

Do NOT include secret values.

---

## 26. ROLLBACK PLAN

Rollback should cover:

- application files
- database rollback only when safe
- environment configuration
- frontend assets
- queue workers

Always create backup/checkpoint before risky deployment changes.

---

## 27. APPROVAL BOUNDARIES

Handle safe routine operations automatically through the connected Hostinger Connector when supported.

STOP and request owner approval before:

- destructive database changes
- deleting existing hosting data
- replacing an unknown existing website
- changing DNS unrelated to `nenobet.live`
- enabling real payment processing
- changing irreversible Hostinger account settings

---

## 28. FINAL ACCEPTANCE GATE

Staging deployment is complete only when:

- [ ] `https://nenobet.live` loads successfully
- [ ] SSL is valid
- [ ] Laravel public root is correct
- [ ] Environment is staging-safe
- [ ] Secrets are protected
- [ ] Database is connected
- [ ] Migrations are correct
- [ ] Frontend assets load
- [ ] Queue worker operates
- [ ] Scheduler operates
- [ ] Private files are protected
- [ ] Tenant isolation works
- [ ] Payment staging config is safe
- [ ] Financial health check passes
- [ ] Financial reconciliation passes
- [ ] Database integrity check passes
- [ ] System health check passes
- [ ] Critical smoke tests pass
- [ ] No critical deployment errors remain
- [ ] `HOSTINGER_STAGING_DEPLOYMENT.md` exists
- [ ] Repeatable direct deployment workflow exists

---

## 29. FINAL REPORT

Create:

`HOSTINGER_STAGING_DEPLOYMENT_REPORT.md`

Include:

- Deployment status
- Domain
- Environment
- PHP version
- Database status
- Migration status
- Frontend build status
- SSL status
- Queue status
- Scheduler status
- Storage/private document status
- Financial health result
- Database integrity result
- System health result
- Smoke-test result
- Known limitations
- Remaining manual requirements
- Rollback readiness

Never include passwords, API tokens, secret keys, or private credentials.

---

## 30. FINAL STOP RULE

After `nenobet.live` staging deployment is complete:

STOP.

Do not deploy to the future final production domain.

Do not change final production hosting.

Do not introduce new application features as part of deployment.

Wait for explicit owner instruction.

---

## 31. START NOW

1. Inspect the connected Hostinger environment.
2. Inspect the local project.
3. Perform pre-deployment verification.
4. Build the safe staging deployment plan.
5. Execute the safe deployment automatically where the Hostinger Connector supports it.
6. Verify `nenobet.live` end-to-end.
