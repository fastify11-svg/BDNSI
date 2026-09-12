#!/usr/bin/env bash
set -euo pipefail

# Safe release-level verifier for Cursor Cloud/Linux.
# Refuses migrate:fresh unless APP_ENV=testing and the DB name is clearly disposable.

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

node -e "const m=Number(process.versions.node.split('.')[0]); if(m<24){console.error('Node 24+ required; current '+process.version);process.exit(2)}"

composer validate --no-check-publish
composer install --no-scripts --no-ansi --no-interaction --no-progress --prefer-dist
php artisan key:generate --force
php artisan package:discover --ansi
php artisan tinker --execute="if (DB::connection()->getDriverName() !== 'mysql') { throw new RuntimeException('Database driver must be mysql'); } echo 'DB driver: mysql'.PHP_EOL;"
php artisan migrate:fresh --seed --force
php artisan test
npm ci --legacy-peer-deps
npm run build

if [[ -n "$(git status --porcelain -- public/build)" ]]; then
  echo "REFUSING release verification: committed public/build differs from fresh build." >&2
  git status --short -- public/build
  exit 2
fi

node --check deploy_to_production.mjs
npx playwright install chromium --with-deps
npx playwright test tests/e2e/frontend.spec.js tests/e2e/frontend-connectivity.spec.js

echo "BDNSI Cursor Linux baseline verification: PASS"
