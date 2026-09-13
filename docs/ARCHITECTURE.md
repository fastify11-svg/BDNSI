# BDNSI Architecture

## Source of truth

The `main` branch is the authoritative development source. It contains framework/application source, migrations, tests, frontend source, CI, and the release builder. Generated deployment artifacts are not committed.

## Runtime domains

The application is organized around center-driven institute operations:

- centers and staff
- students and academic sessions
- results and certificates
- document generation and verification
- pricing, orders, payments, dues, and credit policy
- commissions and sales/lead workflows
- authorization, audit, messaging, and operational configuration

Business rules should stay in application services/policies rather than deployment scripts or controllers where possible. Financial writes must remain transactional and protected from duplicate execution.

## Delivery architecture

```text
clean main source
      │
      ├── CI: MySQL + tests + frontend build
      │
      └── release builder
            ├── Composer --no-dev
            ├── Vite production build
            ├── fresh MySQL migrations/required seeders
            ├── database.sql
            └── flat shared-hosting package
                  ↓
          BDNSI_PUBLIC_HTML_READY.zip
```

The shared-hosting package is a generated runtime product, not a second development branch. This prevents deployment-specific copies from drifting away from `main`.

## Repository hygiene

Active source should not contain historical AI-agent state, temporary prompts, browser screenshots, deployment probes, generated logs, one-off repair scripts, or phase-by-phase reports. Historical material remains recoverable from Git history and the pre-clean safety branch.

## Deployment contract

The release package must always satisfy these invariants:

- `index.php` exists at archive root.
- `.htaccess` exists at archive root.
- `vendor/autoload.php` is included.
- compiled `build/` assets are included.
- `database.sql` is non-empty and generated from the same commit.
- `.env` is production-safe and contains database placeholders, never real credentials.
- Laravel internals are blocked from direct HTTP access.
- public storage works without a hosting-side symlink command.
- the archive is flat and can be extracted directly into `public_html`.

If a future framework change breaks any invariant, the release build must fail rather than publish a misleading "ready" package.
