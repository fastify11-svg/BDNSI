#!/usr/bin/env bash
# Per-boot Cloud Agent startup for BDNSI: MySQL + disposable testing .env only.
# Never targets production databases or production secrets.
set -euo pipefail

export PATH="${HOME}/.local/bin:${HOME}/.nvm/versions/node/v24.21.0/bin:${PATH}"

# Start MySQL if not already running
if ! mysqladmin -h 127.0.0.1 -uroot -proot ping --silent 2>/dev/null; then
  sudo service mysql start >/dev/null 2>&1 || true
  sleep 2
fi

# Ensure disposable testing database/user (CI-parity credentials, local only).
# Local root password is the disposable cloud-agent credential set during image setup.
mysql -h 127.0.0.1 -uroot -proot <<'SQL'
CREATE DATABASE IF NOT EXISTS bdnsi_testing CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'bdnsi_test_user'@'localhost' IDENTIFIED BY 'safe_test_password';
CREATE USER IF NOT EXISTS 'bdnsi_test_user'@'127.0.0.1' IDENTIFIED BY 'safe_test_password';
GRANT ALL PRIVILEGES ON bdnsi_testing.* TO 'bdnsi_test_user'@'localhost';
GRANT ALL PRIVILEGES ON bdnsi_testing.* TO 'bdnsi_test_user'@'127.0.0.1';
FLUSH PRIVILEGES;
SQL

if [[ ! -f .env ]]; then
  cp .env.example .env
fi

# Force disposable testing MySQL config; never leave production-like defaults.
sed -i 's/^APP_ENV=.*/APP_ENV=testing/' .env
sed -i 's/^APP_DEBUG=.*/APP_DEBUG=true/' .env
sed -i 's#^APP_URL=.*#APP_URL=http://127.0.0.1:8000#' .env
sed -i 's/^DB_CONNECTION=.*/DB_CONNECTION=mysql/' .env
sed -i 's/^DB_HOST=.*/DB_HOST=127.0.0.1/' .env
sed -i 's/^DB_PORT=.*/DB_PORT=3306/' .env
sed -i 's/^DB_DATABASE=.*/DB_DATABASE=bdnsi_testing/' .env
sed -i 's/^DB_USERNAME=.*/DB_USERNAME=bdnsi_test_user/' .env
sed -i 's/^DB_PASSWORD=.*/DB_PASSWORD=safe_test_password/' .env
sed -i 's/^CACHE_DRIVER=.*/CACHE_DRIVER=file/' .env
sed -i 's/^SESSION_DRIVER=.*/SESSION_DRIVER=file/' .env
sed -i 's/^QUEUE_CONNECTION=.*/QUEUE_CONNECTION=sync/' .env
grep -q '^CI=' .env || echo 'CI=true' >> .env

DB_DATABASE_VALUE="$(grep -E '^DB_DATABASE=' .env | tail -1 | cut -d= -f2- | tr -d '\r' || true)"
case "$DB_DATABASE_VALUE" in
  *test*|*testing*|bdnsi_ci*) ;;
  *)
    echo "REFUSING: DB_DATABASE is not disposable/test-only (current: ${DB_DATABASE_VALUE:-unset})" >&2
    exit 2
    ;;
esac

if ! grep -q '^APP_KEY=base64:' .env; then
  php artisan key:generate --force >/dev/null
fi

php artisan package:discover --ansi >/dev/null || true

mysqladmin -h 127.0.0.1 -uroot -proot ping --silent
echo "BDNSI cloud-agent start: MySQL ready (bdnsi_testing)"
