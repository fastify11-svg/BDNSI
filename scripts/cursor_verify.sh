#!/usr/bin/env bash
set -euo pipefail

# Safe disposable-environment verifier for Cursor Cloud/Linux.
# Refuses migrate:fresh unless APP_ENV=testing and DB name looks test-only.

if [[ ! -f .env ]]; then
  cp .env.example .env
fi

get_env() {
  local key="$1"
  grep -E "^${key}=" .env | tail -1 | cut -d= -f2- | tr -d '\r' || true
}

APP_ENV_VALUE="$(get_env APP_ENV)"
DB_CONNECTION_VALUE="$(get_env DB_CONNECTION)"
DB_DATABASE_VALUE="$(get_env DB_DATABASE)"

if [[ "$APP_ENV_VALUE" != "testing" ]]; then
  echo "REFUSING: APP_ENV must equal testing (current: ${APP_ENV_VALUE:-unset})" >&2
  exit 2
fi

if [[ "$DB_CONNECTION_VALUE" != "mysql" ]]; then
  echo "REFUSING: DB_CONNECTION must be mysql (current: ${DB_CONNECTION_VALUE:-unset})" >&2
  exit 2
fi

case "$DB_DATABASE_VALUE" in
  *test*|*testing*|bdnsi_ci*) ;;
  *)
    echo "REFUSING migrate:fresh: DB_DATABASE does not look disposable/test-only (current: ${DB_DATABASE_VALUE:-unset})" >&2
    exit 2
    ;;
esac

composer install --no-scripts --no-ansi --no-interaction --no-progress --prefer-dist
php artisan key:generate --force
php artisan package:discover --ansi
php artisan tinker --execute="if (DB::connection()->getDriverName() !== 'mysql') { throw new RuntimeException('Database driver must be mysql'); } echo 'DB driver: mysql'.PHP_EOL;"
php artisan migrate:fresh --seed --force
php artisan test
npm install --legacy-peer-deps
npm run build
npx playwright install chromium --with-deps
npx playwright test tests/e2e/frontend.spec.js tests/e2e/frontend-connectivity.spec.js

echo "BDNSI Cursor baseline verification: PASS"
