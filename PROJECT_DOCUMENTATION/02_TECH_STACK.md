# 02 — Technology Stack

## Backend Stack

| Technology | Version | Purpose | Used In |
|---|---|---|---|
| **PHP** | ^8.2 | Server language | All backend logic |
| **Laravel Framework** | ^8.x (8.x-dev branch) | MVC backend framework | All routes, controllers, models |
| **Laravel Inertia** | ^0.6 | Server-side routing for SPA | All page responses |
| **Laravel Sanctum** | ^2.11 | API token auth | API guard |
| **Laratrust** | ^7.1 | RBAC roles/permissions | Admin user permissions |
| **painlesscode/breeze-multiauth** | ^1.1 | Multi-guard auth scaffolding | Admin/Student/Staff auth |
| **bensampo/laravel-enum** | ^4.2 | PHP enum helpers | Enums (StudentStatus, Gender, etc.) |
| **intervention/image** | ^2.7 | Image processing & storage | Photo uploads |
| **simplesoftwareio/simple-qrcode** | ^4.2 | QR code generation | ID cards, admit cards |
| **yajra/laravel-datatables-oracle** | ^9.19 | Server-side DataTables | Admin list views |
| **laravel/telescope** | 4.6 | Debug monitoring | `/telescope` — admin only |
| **guzzlehttp/guzzle** | ^7.0.1 | HTTP client | Payment APIs, Gemini OCR |

## Frontend Stack

| Technology | Version | Purpose | Used In |
|---|---|---|---|
| **React** | ^19.2.7 | UI framework | All SPA pages |
| **Inertia.js (React)** | ^0.8.1 | SPA adapter | Page rendering |
| **Vite** | ^8.2.0 | Build tool & HMR | Asset bundling |
| **Tailwind CSS** | ^3.0.18 | Utility CSS framework | All styling |
| **Lucide React** | ^1.33.0 | Icon library | UI icons |
| **Recharts** | ^3.10.1 | Chart components | Admin dashboard analytics |
| **jQuery** | ^3.6.0 | DOM manipulation | DataTables integration |
| **DataTables.net** | ^1.11.5 | Table pagination/search | Admin list tables |
| **Select2** | ^4.1.0-rc.0 | Enhanced select boxes | Form dropdowns |
| **html2pdf.js** | ^0.14.0 | Client-side PDF | Document downloads |
| **AlpineJS** | ^3.4.2 | Minimal reactivity | Blade template interactions |
| **Font Awesome** | ^7.3.1 | Icons | General UI |

## Database

| Technology | Version | Purpose |
|---|---|---|
| **MySQL** | (XAMPP local / Hostinger live) | Primary database |
| **Eloquent ORM** | Laravel 8 built-in | All database operations |
| SQLite | (testing only) | PHPUnit test database |

## Infrastructure

| Service | Purpose | Config Location |
|---|---|---|
| **Hostinger VPS** | Production hosting | `.env` (production) |
| **XAMPP** | Local development | `C:\xampp\` |
| **GitHub** | Version control | `.git/` |
| **SSH/SFTP** | Deployment | `direct_deploy.mjs`, `auto_deploy.mjs` |
| **bKash Tokenized** | Payment gateway | `payment_gateways` table |
| **SSLCommerz** | Payment gateway | `payment_gateways` table |
| **Reve SMS** | SMS notifications | `app/Services/Sms/ReveSmsDriver.php` |
| **Twilio** | SMS notifications (alt) | `app/Services/Sms/TwilioSmsDriver.php` |
| **Gemini AI (Google)** | OCR + AI analysis | `app/Http/Controllers/GeminiOcrController.php` |
| **Laravel Telescope** | Debug monitoring | `/telescope` route |
| **Playwright** | E2E testing | `tests/e2e/` |

## Testing

| Tool | Type | Location |
|---|---|---|
| **PHPUnit** | Feature + Unit tests | `tests/Feature/`, `tests/Unit/` |
| **Playwright** | E2E browser tests | `tests/e2e/*.spec.js` |

## Build Tools

| Tool | Script | Purpose |
|---|---|---|
| `npm run dev` | `vite` | HMR dev server |
| `npm run build` | `vite build` | Production bundle → `public/build/` |
| `npm run test` | `npx playwright test` | E2E tests |
| `node auto_deploy.mjs` | SSH git pull | Hostinger git-based deploy |
| `node direct_deploy.mjs` | SFTP + SSH | Direct file upload deploy |
| `node deploy_telescope.mjs` | SFTP + SSH | Telescope-specific deploy |
