#!/usr/bin/env bash
set -euo pipefail

SOURCE_SHA="${GITHUB_SHA:-$(git rev-parse HEAD)}"
ROOT="${GITHUB_WORKSPACE:-$(pwd)}"
SRC="$ROOT/.release-build/source"
OUT="$ROOT/package_out"
RELEASE="$OUT/public_html"
MYSQL_CONTAINER="bdnsi-release-mysql-${GITHUB_RUN_ID:-local}"

cleanup() {
  docker rm -f "$MYSQL_CONTAINER" >/dev/null 2>&1 || true
  rm -rf "$ROOT/.release-build"
}
trap cleanup EXIT

rm -rf "$ROOT/.release-build" "$OUT"
mkdir -p "$SRC" "$RELEASE"

git cat-file -e "${SOURCE_SHA}^{commit}"
git archive "$SOURCE_SHA" | tar -x -C "$SRC"
cd "$SRC"

# Isolated MySQL is used only to produce a clean, importable database.sql.
docker run -d --name "$MYSQL_CONTAINER" -p 3306:3306 \
  -e MYSQL_DATABASE=bdnsi_release \
  -e MYSQL_USER=bdnsi_release_user \
  -e MYSQL_PASSWORD=safe_release_password \
  -e MYSQL_ROOT_PASSWORD=root \
  mysql:8.0 >/dev/null

for i in $(seq 1 60); do
  if docker exec "$MYSQL_CONTAINER" mysqladmin ping -uroot -proot --silent >/dev/null 2>&1; then
    break
  fi
  if [ "$i" = "60" ]; then
    docker logs "$MYSQL_CONTAINER"
    exit 1
  fi
  sleep 2
done

cp .env.example .env
set_env() {
  local key="$1" value="$2"
  if grep -q "^${key}=" .env; then
    sed -i "s#^${key}=.*#${key}=${value}#" .env
  else
    printf '%s=%s\n' "$key" "$value" >> .env
  fi
}
set_env APP_ENV production
set_env APP_DEBUG false
set_env APP_URL https://YOUR-DOMAIN.COM
set_env DB_CONNECTION mysql
set_env DB_HOST 127.0.0.1
set_env DB_PORT 3306
set_env DB_DATABASE bdnsi_release
set_env DB_USERNAME bdnsi_release_user
set_env DB_PASSWORD safe_release_password
set_env CACHE_DRIVER file
set_env SESSION_DRIVER file
set_env QUEUE_CONNECTION sync

composer install --no-dev --no-scripts --no-ansi --no-interaction --no-progress --prefer-dist --optimize-autoloader
php artisan key:generate --force
php artisan package:discover --ansi

npm ci --legacy-peer-deps
NODE_ENV=production npm run build
test -d public/build/assets
test -f public/build/manifest.json -o -f public/build/.vite/manifest.json

php artisan migrate:fresh --force
php artisan db:seed --class='Database\\Seeders\\LaratrustSeeder' --force
php artisan db:seed --class='Database\\Seeders\\ConfigSeeder' --force
php artisan db:seed --class='Database\\Seeders\\SiteConfigSeeder' --force

INSTALL_ADMIN_PASSWORD="$(openssl rand -base64 48 | tr -dc 'A-Za-z0-9@#%+=_' | head -c 24)"
export INSTALL_ADMIN_PASSWORD
php artisan tinker --execute='use App\\Models\\Admin; use App\\Models\\Role; use Illuminate\\Support\\Facades\\Hash; $p=getenv("INSTALL_ADMIN_PASSWORD"); $a=Admin::updateOrCreate(["email"=>"admin@bdnsi.local"],["name"=>"BDNSI Administrator","password"=>Hash::make($p)]); $r=Role::whereName("admin")->first(); if ($r) { $a->syncRoles([$r]); }'
printf 'Admin login for this fresh database\nEmail: admin@bdnsi.local\nPassword: %s\n\nChange this password immediately after first login.\n' "$INSTALL_ADMIN_PASSWORD" > FIRST_LOGIN.txt

docker exec "$MYSQL_CONTAINER" mysqldump \
  -ubdnsi_release_user -psafe_release_password \
  --single-transaction --routines --triggers --no-tablespaces \
  --default-character-set=utf8mb4 bdnsi_release > database.sql
test -s database.sql

# Runtime Laravel source. Deliberately allowlisted: no AI plans, scratch files or dev artifacts.
for dir in app bootstrap config database resources routes storage vendor; do
  test -d "$dir"
  cp -a "$dir" "$RELEASE/$dir"
done
if [ -d packages ]; then cp -a packages "$RELEASE/packages"; fi

# Public web assets are flattened to public_html, matching the proven live package.
cp -a public/. "$RELEASE/"

for file in artisan composer.json composer.lock package.json package-lock.json vite.config.mjs postcss.config.js .env.example; do
  if [ -f "$file" ]; then cp "$file" "$RELEASE/$file"; fi
done

cp database.sql "$RELEASE/database.sql"
cp FIRST_LOGIN.txt "$RELEASE/FIRST_LOGIN.txt"
printf '%s\n' "$SOURCE_SHA" > "$RELEASE/SOURCE_COMMIT.txt"

APP_KEY_LINE="$(grep '^APP_KEY=' .env | head -n1)"
cp .env.example "$RELEASE/.env"
release_env() {
  local key="$1" value="$2"
  if grep -q "^${key}=" "$RELEASE/.env"; then
    sed -i "s#^${key}=.*#${key}=${value}#" "$RELEASE/.env"
  else
    printf '%s=%s\n' "$key" "$value" >> "$RELEASE/.env"
  fi
}
release_env APP_ENV production
release_env APP_DEBUG false
release_env APP_URL https://YOUR-DOMAIN.COM
release_env APP_KEY "${APP_KEY_LINE#APP_KEY=}"
release_env DB_CONNECTION mysql
release_env DB_HOST localhost
release_env DB_PORT 3306
release_env DB_DATABASE CHANGE_ME
release_env DB_USERNAME CHANGE_ME
release_env DB_PASSWORD CHANGE_ME
release_env CACHE_DRIVER file
release_env SESSION_DRIVER file
release_env QUEUE_CONNECTION sync

mkdir -p \
  "$RELEASE/storage/framework/cache/data" \
  "$RELEASE/storage/framework/sessions" \
  "$RELEASE/storage/framework/views" \
  "$RELEASE/storage/logs" \
  "$RELEASE/storage/app/public" \
  "$RELEASE/bootstrap/cache"
find "$RELEASE/storage/logs" -mindepth 1 ! -name '.gitignore' -delete 2>/dev/null || true
find "$RELEASE/storage/framework/sessions" -mindepth 1 ! -name '.gitignore' -delete 2>/dev/null || true
find "$RELEASE/storage/framework/views" -mindepth 1 ! -name '.gitignore' -delete 2>/dev/null || true
find "$RELEASE/storage/framework/cache/data" -mindepth 1 ! -name '.gitignore' -delete 2>/dev/null || true

cat > "$RELEASE/index.php" <<'PHP'
<?php

use Illuminate\Contracts\Http\Kernel;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

if (file_exists(__DIR__.'/storage/framework/maintenance.php')) {
    require __DIR__.'/storage/framework/maintenance.php';
}

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->usePublicPath(__DIR__);

$kernel = $app->make(Kernel::class);

$response = tap($kernel->handle(
    $request = Request::capture()
))->send();

$kernel->terminate($request, $response);
PHP

cat > "$RELEASE/.htaccess" <<'HTACCESS'
<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>

    RewriteEngine On

    # Preserve Authorization header for API/auth requests.
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    # Serve Laravel public-disk files without requiring `php artisan storage:link`.
    RewriteRule ^storage/(.*)$ public-storage.php?path=$1 [L,QSA,NC]

    # Never expose application source/runtime directories directly.
    RewriteRule ^(?:app|bootstrap|config|database|resources|routes|vendor|packages)(?:/|$) - [F,L,NC]

    # Protect sensitive root files while keeping them editable in File Manager.
    RewriteRule ^(?:artisan|composer\.(?:json|lock)|package(?:-lock)?\.json|vite\.config\.(?:js|mjs|ts)|phpunit\.xml|database\.sql|FIRST_LOGIN\.txt|SOURCE_COMMIT\.txt)$ - [F,L,NC]

    # Redirect trailing slash when target is not a real directory.
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]

    # Existing static files/assets are served directly; everything else goes Laravel.
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>

<FilesMatch "^\.env">
    Require all denied
</FilesMatch>
HTACCESS

cat > "$RELEASE/public-storage.php" <<'PHP'
<?php
$base = realpath(__DIR__ . '/storage/app/public');
$requested = isset($_GET['path']) ? rawurldecode((string) $_GET['path']) : '';
$requested = str_replace('\\', '/', $requested);

if ($base === false || $requested === '' || str_contains($requested, "\0")) {
    http_response_code(404);
    exit;
}

$target = realpath($base . '/' . ltrim($requested, '/'));
if ($target === false || !is_file($target) || !str_starts_with($target, $base . DIRECTORY_SEPARATOR)) {
    http_response_code(404);
    exit;
}

$mime = function_exists('mime_content_type') ? mime_content_type($target) : 'application/octet-stream';
header('Content-Type: ' . ($mime ?: 'application/octet-stream'));
header('Content-Length: ' . filesize($target));
header('Cache-Control: public, max-age=86400');
readfile($target);
PHP

cat > "$RELEASE/UPLOAD_README.txt" <<'TXT'
BDNSI SHARED-HOSTING DEPLOYMENT PACKAGE

1. Extract the CONTENTS of this package directly into public_html.
2. Import BDNSI_database.sql (or database.sql inside this package) into a fresh MySQL database.
3. Edit only the deployment values in .env: APP_URL, DB_HOST, DB_DATABASE, DB_USERNAME, DB_PASSWORD.
4. Open the site. No Composer, npm, SSH, terminal command, storage:link or document-root change is required.
5. Use FIRST_LOGIN.txt for the fresh admin login, then change that password immediately.

This package was generated from the exact Git commit recorded in SOURCE_COMMIT.txt.
TXT

# Strip development-only documentation from the hosting package.
find "$RELEASE" -type f \( -name '*.md' -o -name '*.markdown' \) -delete
rm -rf "$RELEASE/.github" "$RELEASE/.agents" "$RELEASE/.ai" "$RELEASE/.cursor" "$RELEASE/.vscode" "$RELEASE/tests" "$RELEASE/node_modules" "$RELEASE/screenshots" "$RELEASE/brain" "$RELEASE/extract_test" "$RELEASE/PROJECT_DOCUMENTATION"

# Contract checks: the archive must be directly extractable into public_html.
test -f "$RELEASE/index.php"
test -f "$RELEASE/.htaccess"
test -f "$RELEASE/.env"
test -f "$RELEASE/vendor/autoload.php"
test -d "$RELEASE/build/assets"
test -f "$RELEASE/database.sql"
test -f "$RELEASE/FIRST_LOGIN.txt"
test -f "$RELEASE/public-storage.php"
test ! -d "$RELEASE/public"
grep -q '^DB_DATABASE=CHANGE_ME$' "$RELEASE/.env"
grep -q '^DB_USERNAME=CHANGE_ME$' "$RELEASE/.env"
grep -q '^DB_PASSWORD=CHANGE_ME$' "$RELEASE/.env"
grep -q 'usePublicPath(__DIR__)' "$RELEASE/index.php"

cd "$OUT"
zip -qry -y BDNSI_PUBLIC_HTML_READY.zip public_html/.
cp "$RELEASE/database.sql" BDNSI_database.sql
sha256sum BDNSI_PUBLIC_HTML_READY.zip > BDNSI_PUBLIC_HTML_READY.sha256
sha256sum BDNSI_database.sql > BDNSI_database.sha256
unzip -tq BDNSI_PUBLIC_HTML_READY.zip

# Verify the ZIP is flat (index.php at archive root), not wrapped in another directory.
unzip -Z1 BDNSI_PUBLIC_HTML_READY.zip | grep -qx 'index.php'
unzip -Z1 BDNSI_PUBLIC_HTML_READY.zip | grep -qx '.htaccess'
unzip -Z1 BDNSI_PUBLIC_HTML_READY.zip | grep -qx 'vendor/autoload.php'
unzip -Z1 BDNSI_PUBLIC_HTML_READY.zip | grep -qx 'database.sql'

ls -lh BDNSI_PUBLIC_HTML_READY.zip BDNSI_database.sql BDNSI_PUBLIC_HTML_READY.sha256 BDNSI_database.sha256
