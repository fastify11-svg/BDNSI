# BDNSI Institute Platform

A secure, multi-center institute management and digital credential platform built with Laravel, React, Inertia.js, and MySQL.

[![Laravel](https://img.shields.io/badge/Laravel-8-FF2D20?logo=laravel&logoColor=white)](https://laravel.com)
[![PHP](https://img.shields.io/badge/PHP-8.2-777BB4?logo=php&logoColor=white)](https://www.php.net)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=111827)](https://react.dev)
[![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com)
[![Tests](https://img.shields.io/badge/Tests-PHPUnit%20%2B%20Playwright-2EAD33)](#testing)

## Overview

BDNSI supports center-driven student administration and the complete lifecycle of verified academic documents:

```text
Registration → Documents → Pricing → Payment/Credit → Result → Approval → Certificate → Verification
```

Partner centers manage student registration and training operations, while the platform controls documents, financial rules, approvals, certificates, and public verification.

## Core Capabilities

- Multi-center student registration and administration
- Courses, programs, sessions, results, and academic records
- ID cards, registration cards, admit cards, transcripts, and certificates
- Unique certificate identities with public verification and QR support
- Center-specific pricing, discounts, orders, payments, dues, and credit limits
- SSLCommerz payment and IPN workflows
- Role-based access control for admins, staff, and centers
- Tenant-aware authorization and protected document downloads
- SMS jobs, audit logs, queues, and operational reporting
- Automated regression and end-to-end tests

## Technology

| Layer | Technology |
|---|---|
| Backend | PHP 8.2, Laravel 8, Laravel Sanctum |
| Frontend | React, Inertia.js, Tailwind CSS, Vite |
| Database | MySQL, migrations, transactional services |
| Authorization | Laratrust RBAC, policies, tenant isolation |
| Documents | PDF generation, image processing, QR codes |
| Quality | PHPUnit, Playwright, ESLint |
| Delivery | GitHub Actions, queue workers, environment-based deployment |

## Architecture Principles

- Keep business rules in services and policies
- Use database transactions for financial operations
- Enforce authorization at every protected route and document endpoint
- Record sensitive operational changes in audit logs
- Keep credentials and production configuration outside version control
- Verify changes with automated tests before deployment

## Local Development

### Requirements

- PHP 8.2+
- Composer
- Node.js and npm
- MySQL

### Setup

```bash
composer install
cp .env.example .env
php artisan key:generate
npm install
npm run build
php artisan migrate
php artisan serve
```

Configure database, queue, mail, SMS, and payment values only through your local `.env` file.

## Testing

```bash
php artisan test
npm run test:e2e
```

Additional frontend commands:

```bash
npm run lint
npm run test:report
```

## Security

- Never commit `.env`, API keys, payment credentials, or production backups
- Review route authorization and tenant isolation for every new feature
- Validate payment callbacks and use idempotent transaction handling
- Keep dependencies, backups, monitoring, and incident procedures current

Security-sensitive details should be reported privately to the repository owner instead of being posted in a public issue.

## Documentation

- [Project Master Documentation](PROJECT_MASTER_DOCUMENTATION.md)
- [Master Implementation Roadmap](MASTER_IMPLEMENTATION_ROADMAP.md)
- [Phase B Verification Report](PHASE_B_VERIFICATION_REPORT.md)

## Project Status

Active development. The platform is being advanced through documented implementation, testing, security review, and deployment phases.

---

Copyright BDNSI. All rights reserved.
