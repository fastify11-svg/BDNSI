$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

# Safe release-level verifier for the local Windows/XAMPP Cursor workspace.
# Refuses migrate:fresh unless APP_ENV=testing + MySQL + a disposable test DB.

$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectRoot

if (-not (Test-Path '.env')) { Copy-Item '.env.example' '.env' }

function Get-DotEnvValue([string]$Key) {
    $line = Get-Content '.env' | Where-Object { $_ -match "^$([regex]::Escape($Key))=" } | Select-Object -Last 1
    if (-not $line) { return '' }
    return ($line -split '=', 2)[1].Trim()
}

$appEnv = Get-DotEnvValue 'APP_ENV'
$dbConnection = Get-DotEnvValue 'DB_CONNECTION'
$dbDatabase = Get-DotEnvValue 'DB_DATABASE'

if ($appEnv -ne 'testing') { throw "REFUSING: APP_ENV must equal testing (current: '$appEnv')." }
if ($dbConnection -ne 'mysql') { throw "REFUSING: DB_CONNECTION must equal mysql (current: '$dbConnection')." }
if ($dbDatabase -notmatch '(?i)(test|testing|bdnsi_ci)') {
    throw "REFUSING migrate:fresh: DB_DATABASE does not look disposable/test-only (current: '$dbDatabase')."
}

$php = 'C:\xampp\php\php.exe'
$composer = 'C:\xampp\php\composer.bat'
if (-not (Test-Path $php)) { $php = (Get-Command php -ErrorAction Stop).Source }
if (-not (Test-Path $composer)) { $composer = (Get-Command composer -ErrorAction Stop).Source }

$nodeMajor = [int]((node -p "process.versions.node.split('.')[0]").Trim())
if ($nodeMajor -lt 24) { throw "Node 24+ is required for the current locked frontend stack." }

Write-Host "Using PHP: $php"
Write-Host "Using Composer: $composer"
Write-Host "Verified disposable DB: $dbDatabase"

& $composer validate --no-check-publish
if ($LASTEXITCODE -ne 0) { throw 'Composer metadata validation failed.' }
& $composer install --no-scripts --no-ansi --no-interaction --no-progress --prefer-dist
if ($LASTEXITCODE -ne 0) { throw 'Composer install failed.' }
& $php artisan key:generate --force
if ($LASTEXITCODE -ne 0) { throw 'Key generation failed.' }
& $php artisan package:discover --ansi
if ($LASTEXITCODE -ne 0) { throw 'Package discovery failed.' }
& $php artisan tinker --execute="if (DB::connection()->getDriverName() !== 'mysql') { throw new RuntimeException('Database driver must be mysql'); } echo 'DB driver: mysql'.PHP_EOL;"
if ($LASTEXITCODE -ne 0) { throw 'MySQL driver assertion failed.' }
& $php artisan migrate:fresh --seed --force
if ($LASTEXITCODE -ne 0) { throw 'Disposable database migrate/seed failed.' }
& $php artisan test
if ($LASTEXITCODE -ne 0) { throw 'PHP regression suite failed.' }
& npm ci --legacy-peer-deps
if ($LASTEXITCODE -ne 0) { throw 'NPM dependency install failed.' }
& npm run build
if ($LASTEXITCODE -ne 0) { throw 'Frontend build failed.' }

$buildStatus = git status --porcelain -- public/build
if ($buildStatus) {
    Write-Host $buildStatus
    throw 'Committed public/build differs from a fresh production build.'
}

& node --check deploy_to_production.mjs
if ($LASTEXITCODE -ne 0) { throw 'Deploy script syntax check failed.' }
& npx playwright install chromium
if ($LASTEXITCODE -ne 0) { throw 'Playwright Chromium install failed.' }
& npx playwright test tests/e2e/frontend.spec.js tests/e2e/frontend-connectivity.spec.js
if ($LASTEXITCODE -ne 0) { throw 'Release-critical Playwright smoke tests failed.' }

Write-Host 'BDNSI Cursor Windows baseline verification: PASS'
