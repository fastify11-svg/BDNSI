# Laravel Major Upgrade Plan (cursor-development)

**Start SHA:** `109d9844291070a78b0789c80014f5676e28944f`  
**Start:** Laravel 8.x-dev / PHP 8.2 / Composer platform PHP 8.2.0  
**Desired end:** Laravel 13 (PHP ^8.3) — incremental only  

## Compatibility audit summary

| Package | Current | L9 | L10 | L11 | L12 | L13 | Notes |
|---|---|---|---|---|---|---|---|
| laravel/framework | ^8 / 8.x-dev | ^9 | ^10 | ^11 | ^12 | ^13 | L13 requires PHP ^8.3 |
| fideloper/proxy | ^4.2 | REMOVE | — | — | — | — | Use Illuminate TrustProxies |
| fruitcake/laravel-cors | ^2.0 | REMOVE | — | — | — | — | Use Illuminate HandleCors |
| facade/ignition | ^2.3 | → spatie/laravel-ignition | keep | ^2 | ^2 | ^2 | |
| fzaninotto/faker | abandoned | → fakerphp/faker | keep | keep | keep | keep | |
| painlesscode/breeze-multiauth | ^1.1 | ^3 (L8–9 only) | REMOVE | — | — | — | Scaffolding only; no app code imports |
| bensampo/laravel-enum | ^4.2 | ^5/^6 | ^6 | ^6 | ^6 | ^6 | Enum classes in `app/Enums` |
| santigarcor/laratrust | ^7.1 | ^7.2 | ^7.2/^8 | ^8 | ^8 | ^8 | |
| yajra/laravel-datatables-oracle | ^9.19 | ^10 | ^10 | ^11 | ^12 | ^13 | Major tracks Laravel |
| inertiajs/inertia-laravel | ^0.6 | ^0.6/^1 | ^0.6/^1 | ^1/^2 | ^1/^2 | ^2/^3 | Keep frontend API stable |
| laravel/sanctum | ^2.11 | ^2/^3 | ^3 | ^4 | ^4 | ^4 | |
| laravel/telescope | 4.6 | ^4.17/^5 | ^5 | ^5 | ^5 | ^5 | |
| tightenco/ziggy | ^1.8 | ^1/^2 | ^2 | ^2 | ^2 | ^2 | |
| intervention/image | ^2.7 | keep v2 | keep v2 | keep v2* | keep/replace | keep/replace | v3 API break; preserve v2 while possible |
| simplesoftwareio/simple-qrcode | ^4.2 | keep | keep | keep | keep | verify | |
| phpunit/phpunit | ^9.3 | ^9.5 | ^10 | ^10/^11 | ^11 | ^11 | |
| nunomaduro/collision | ^5 | ^6 | ^6/^7 | ^8 | ^8 | ^8 | |

\* Intervention Image v2 may become unsupported; prefer keeping API via adapter until forced.

## Runtime

- Dev/CI may move to PHP 8.3+ (owner-authorized). Production runtime untouched.
- CI workflow PHP pin must follow the active Laravel stage (8.2 through L12; 8.3 for L13).

## Stage gates (each stage)

1. `composer validate` + `composer update` scoped  
2. App code compatibility edits (middleware, providers, config)  
3. `php artisan optimize:clear`  
4. Disposable MySQL migrate  
5. Full PHPUnit + critical filters  
6. `npm run build` + Playwright release specs  
7. Commit on `cursor-development` and confirm CI for exact SHA  

## Stop conditions

- If a package forces unsafe business redesign → document blocker, choose safest replacement or freeze at last green Laravel major that clears EOL advisories.
- Clearing Laravel EOL advisories is the security goal; reaching L13 is preferred but not forced if a hard blocker remains.
