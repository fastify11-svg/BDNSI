#!/usr/bin/env bash
set -Eeuo pipefail

export COMPOSER_ALLOW_SUPERUSER=1

REPO_ROOT="$(git rev-parse --show-toplevel)"
OUT_DIR="${1:-$REPO_ROOT/dist}"
SOURCE_COMMIT="$(git rev-parse HEAD)"
WORKDIR="$(mktemp -d)"
APP_DIR="$WORKDIR/app"
PACKAGE_DIR="$OUT_DIR/package"
ZIP_PATH="$OUT_DIR/BDNSI_PUBLIC_HTML_READY.zip"
MYSQL_CONTAINER="bdnsi-package-${GITHUB_RUN_ID:-local}-$$"
MYSQL_ROOT_PASSWORD="$(php -r 'echo bin2hex(random_bytes(18));')"
MYSQL_DATABASE="bdnsi_package"
MYSQL_PORT=""

cleanup() {
    docker rm -f "$MYSQL_CONTAINER" >/dev/null 2>&1 || true
    rm -rf "$WORKDIR"
}
trap cleanup EXIT INT TERM

required=(git php composer npm node docker zip openssl rsync)
for cmd in "${required[@]}"; do
    command -v "$cmd" >/dev/null 2>&1 || { echo "Missing required command: $cmd" >&2; exit 1; }
done

rm -rf "$OUT_DIR"
mkdir -p "$APP_DIR" "$PACKAGE_DIR"

git -C "$REPO_ROOT" archive "$SOURCE_COMMIT" | tar -x -C "$APP_DIR"
cd "$APP_DIR"

cp .env.example .env
set_env() {
    local key="$1" value="$2"
    if grep -qE "^${key}=" .env; then
        sed -i "s|^${key}=.*|${key}=${value}|" .env
    else
        printf '%s=%s\n' "$key" "$value" >> .env
    fi
}

set_env APP_ENV local
set_env APP_DEBUG false
set_env APP_URL http://127.0.0.1
set_env LOG_CHANNEL stack
set_env DB_CONNECTION mysql
set_env DB_HOST 127.0.0.1
set_env DB_DATABASE "$MYSQL_DATABASE"
set_env DB_USERNAME root
set_env DB_PASSWORD "$MYSQL_ROOT_PASSWORD"
set_env SESSION_DRIVER file
set_env CACHE_STORE file
set_env CACHE_DRIVER file
set_env QUEUE_CONNECTION sync

echo "Starting isolated MySQL 8 builder database..."
docker run -d --rm \
    --name "$MYSQL_CONTAINER" \
    -e MYSQL_ROOT_PASSWORD="$MYSQL_ROOT_PASSWORD" \
    -e MYSQL_DATABASE="$MYSQL_DATABASE" \
    -p 127.0.0.1::3306 \
    mysql:8.0 >/dev/null

MYSQL_PORT="$(docker port "$MYSQL_CONTAINER" 3306/tcp | awk -F: 'NR==1 { print $NF }')"
[[ "$MYSQL_PORT" =~ ^[0-9]+$ ]] || { echo "Could not resolve MySQL builder port" >&2; exit 1; }
set_env DB_PORT "$MYSQL_PORT"

for _ in $(seq 1 60); do
    if docker exec -e MYSQL_PWD="$MYSQL_ROOT_PASSWORD" "$MYSQL_CONTAINER" mysqladmin ping -uroot --silent >/dev/null 2>&1; then
        break
    fi
    sleep 2
done
docker exec -e MYSQL_PWD="$MYSQL_ROOT_PASSWORD" "$MYSQL_CONTAINER" mysqladmin ping -uroot --silent >/dev/null

echo "Installing production PHP dependencies..."
composer install \
    --no-dev \
    --no-scripts \
    --no-ansi \
    --no-interaction \
    --no-progress \
    --prefer-dist \
    --optimize-autoloader

php artisan key:generate --force --no-interaction >/dev/null
php artisan package:discover --ansi --no-interaction >/dev/null
APP_KEY="$(grep '^APP_KEY=' .env | head -n 1 | cut -d= -f2-)"
[[ -n "$APP_KEY" ]] || { echo "APP_KEY generation failed" >&2; exit 1; }

echo "Building frontend assets..."
npm ci --legacy-peer-deps --no-audit --no-fund
NODE_ENV=production npm run build

echo "Creating fresh baseline database..."
php artisan migrate:fresh --force --no-interaction
php artisan db:seed --class='Database\Seeders\LaratrustSeeder' --force --no-interaction
php artisan db:seed --class='Database\Seeders\ConfigSeeder' --force --no-interaction
php artisan db:seed --class='Database\Seeders\SiteConfigSeeder' --force --no-interaction

ADMIN_EMAIL="admin@bdnsi.local"
ADMIN_PASSWORD="$(php -r 'echo substr(bin2hex(random_bytes(32)), 0, 24);')"
INSTALLER_ADMIN_EMAIL="$ADMIN_EMAIL" INSTALLER_ADMIN_PASSWORD="$ADMIN_PASSWORD" php artisan tinker --execute='
$admin = \App\Models\Admin::updateOrCreate(
    ["email" => getenv("INSTALLER_ADMIN_EMAIL")],
    ["name" => "Installer Administrator", "password" => getenv("INSTALLER_ADMIN_PASSWORD")]
);
$role = \App\Models\Role::whereIn("name", ["superadmin", "admin"])->first();
if ($role) { $admin->syncRoles([$role]); }
' >/dev/null

# Dump from inside the MySQL container so the runner does not need a local mysql client.
docker exec -e MYSQL_PWD="$MYSQL_ROOT_PASSWORD" "$MYSQL_CONTAINER" \
    mysqldump -uroot \
    --skip-comments \
    --no-tablespaces \
    --single-transaction \
    --set-gtid-purged=OFF \
    "$MYSQL_DATABASE" > "$APP_DIR/database.sql"
[[ -s "$APP_DIR/database.sql" ]] || { echo "database.sql is empty" >&2; exit 1; }

echo "Assembling flat shared-hosting package..."
rsync -a "$APP_DIR/" "$PACKAGE_DIR/" \
    --exclude='.git/' \
    --exclude='.github/' \
    --exclude='public/' \
    --exclude='node_modules/' \
    --exclude='.env' \
    --exclude='database.sql' \
    --exclude='storage/framework/cache/data/*' \
    --exclude='storage/framework/sessions/*' \
    --exclude='storage/framework/testing/*' \
    --exclude='storage/framework/views/*' \
    --exclude='storage/logs/*'

# Public web assets belong directly in public_html for this proven Hostinger layout.
rsync -a "$APP_DIR/public/" "$PACKAGE_DIR/" --exclude='storage'
cp "$APP_DIR/database.sql" "$PACKAGE_DIR/database.sql"

cat > "$PACKAGE_DIR/index.php" <<'PHP'
<?php

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

if (file_exists($maintenance = __DIR__.'/storage/framework/maintenance.php')) {
    require $maintenance;
}

require __DIR__.'/vendor/autoload.php';

(require_once __DIR__.'/bootstrap/app.php')
    ->handleRequest(Request::capture());
PHP

cat > "$PACKAGE_DIR/.htaccess" <<'HTACCESS'
Options -Indexes

<IfModule mod_rewrite.c>
    RewriteEngine On

    # Keep ACME/SSL challenges available.
    RewriteRule ^\.well-known/ - [L]

    # Never expose dotfiles or application internals.
    RewriteRule (^|/)\. - [F,L]
    RewriteRule ^(?:app|bootstrap|config|database|resources|routes|tests|vendor)(?:/|$) - [F,L,NC]

    # Serve Laravel public storage safely without requiring a symlink.
    RewriteRule ^storage/(.*)$ public-storage.php?path=$1 [L,QSA,NC]

    RewriteCond %{REQUEST_FILENAME} -f [OR]
    RewriteCond %{REQUEST_FILENAME} -d
    RewriteRule ^ - [L]

    RewriteRule ^ index.php [L,QSA]
</IfModule>

<FilesMatch "^(?:\.env(?:\..*)?|composer\.(?:json|lock)|package(?:-lock)?\.json|vite\.config\..*|phpunit\.xml|artisan|database\.sql|FIRST_LOGIN\.txt|SOURCE_COMMIT\.txt|UPLOAD_README\.txt)$">
    Require all denied
</FilesMatch>
HTACCESS

cat > "$PACKAGE_DIR/public-storage.php" <<'PHP'
<?php

$base = realpath(__DIR__.'/storage/app/public');
$requested = isset($_GET['path']) ? (string) $_GET['path'] : '';

if ($base === false || $requested === '' || str_contains($requested, "\0")) {
    http_response_code(404);
    exit;
}

$file = realpath($base.DIRECTORY_SEPARATOR.ltrim($requested, '/\\'));
$prefix = rtrim($base, DIRECTORY_SEPARATOR).DIRECTORY_SEPARATOR;

if ($file === false || !is_file($file) || !str_starts_with($file, $prefix)) {
    http_response_code(404);
    exit;
}

$mime = function_exists('mime_content_type') ? mime_content_type($file) : false;
if (is_string($mime) && $mime !== '') {
    header('Content-Type: '.$mime);
}
header('Content-Length: '.filesize($file));
header('X-Content-Type-Options: nosniff');
readfile($file);
PHP

mkdir -p \
    "$PACKAGE_DIR/bootstrap/cache" \
    "$PACKAGE_DIR/storage/app/public" \
    "$PACKAGE_DIR/storage/framework/cache/data" \
    "$PACKAGE_DIR/storage/framework/sessions" \
    "$PACKAGE_DIR/storage/framework/testing" \
    "$PACKAGE_DIR/storage/framework/views" \
    "$PACKAGE_DIR/storage/logs"

cat > "$PACKAGE_DIR/.env" <<ENV
APP_NAME=BDNSI
APP_ENV=production
APP_KEY=$APP_KEY
APP_DEBUG=false
APP_URL=https://YOUR-DOMAIN.COM

LOG_CHANNEL=stack
LOG_LEVEL=warning

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=CHANGE_ME
DB_USERNAME=CHANGE_ME
DB_PASSWORD=CHANGE_ME

SESSION_DRIVER=file
CACHE_STORE=file
CACHE_DRIVER=file
QUEUE_CONNECTION=sync
ENV

cat > "$PACKAGE_DIR/FIRST_LOGIN.txt" <<EOF
BDNSI fresh-install administrator
Email: $ADMIN_EMAIL
Password: $ADMIN_PASSWORD

Change this password immediately after first login.
Delete this file from hosting after recording the credentials securely.
EOF

cat > "$PACKAGE_DIR/SOURCE_COMMIT.txt" <<EOF
$SOURCE_COMMIT
EOF

cat > "$PACKAGE_DIR/UPLOAD_README.txt" <<'EOF'
BDNSI — SHARED HOSTING / HOSTINGER READY PACKAGE

This archive is intentionally self-contained. Do NOT run Composer or npm on hosting.

Install:
1. Upload/extract ALL files from this archive directly into public_html.
2. Create/select a MySQL database and import database.sql.
3. Edit only the required deployment values in .env:
   APP_URL, DB_HOST (if your host differs), DB_DATABASE, DB_USERNAME, DB_PASSWORD.
4. Ensure storage/ and bootstrap/cache/ are writable by PHP.
5. Open the site and sign in using FIRST_LOGIN.txt.
6. Change the administrator password immediately, then delete FIRST_LOGIN.txt and database.sql from hosting.

The package already contains production Composer dependencies and compiled frontend assets.
EOF

# Strict package contract.
required_paths=(
    .env
    .htaccess
    index.php
    public-storage.php
    database.sql
    FIRST_LOGIN.txt
    UPLOAD_README.txt
    SOURCE_COMMIT.txt
    vendor/autoload.php
    build/manifest.json
)
for path in "${required_paths[@]}"; do
    [[ -e "$PACKAGE_DIR/$path" ]] || { echo "Missing required package path: $path" >&2; exit 1; }
done

for forbidden in .git .github node_modules; do
    [[ ! -e "$PACKAGE_DIR/$forbidden" ]] || { echo "Forbidden package path present: $forbidden" >&2; exit 1; }
done

# Ensure the package .env contains placeholders, never builder DB credentials.
grep -q '^DB_DATABASE=CHANGE_ME$' "$PACKAGE_DIR/.env"
grep -q '^DB_USERNAME=CHANGE_ME$' "$PACKAGE_DIR/.env"
grep -q '^DB_PASSWORD=CHANGE_ME$' "$PACKAGE_DIR/.env"
! grep -q "$MYSQL_ROOT_PASSWORD" "$PACKAGE_DIR/.env"

rm -f "$ZIP_PATH"
(
    cd "$PACKAGE_DIR"
    zip -qr "$ZIP_PATH" .
)
unzip -tq "$ZIP_PATH" >/dev/null

printf 'Package ready: %s\n' "$ZIP_PATH"
printf 'Source commit: %s\n' "$SOURCE_COMMIT"
printf 'Package SHA-256: '
sha256sum "$ZIP_PATH" | awk '{print $1}'
