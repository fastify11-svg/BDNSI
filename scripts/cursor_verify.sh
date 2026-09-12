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

# CI parity: Playwright expects Laravel on APP_URL (default http://127.0.0.1:8000).
APP_URL_VALUE="$(get_env APP_URL)"
APP_URL_VALUE="${APP_URL_VALUE:-http://127.0.0.1:8000}"
SERVE_HOST="$(php -r "echo parse_url(getenv('APP_URL') ?: '${APP_URL_VALUE}', PHP_URL_HOST) ?: '127.0.0.1';")"
SERVE_PORT="$(php -r "echo parse_url(getenv('APP_URL') ?: '${APP_URL_VALUE}', PHP_URL_PORT) ?: 8000;")"
php artisan serve --host="${SERVE_HOST}" --port="${SERVE_PORT}" >/tmp/bdnsi-cursor-verify-serve.log 2>&1 &
SERVE_PID=$!
cleanup_serve() {
  if kill -0 "${SERVE_PID}" 2>/dev/null; then
    kill "${SERVE_PID}" 2>/dev/null || true
    wait "${SERVE_PID}" 2>/dev/null || true
  fi
}
trap cleanup_serve EXIT

for _ in $(seq 1 30); do
  if curl -fsS "${APP_URL_VALUE}/health" >/dev/null 2>&1; then
    break
  fi
  sleep 1
done
if ! curl -fsS "${APP_URL_VALUE}/health" >/dev/null 2>&1; then
  echo "REFUSING: Laravel server did not become ready at ${APP_URL_VALUE}" >&2
  cat /tmp/bdnsi-cursor-verify-serve.log >&2 || true
  exit 2
fi

export APP_URL="${APP_URL_VALUE}"
export ADMIN_EMAIL="${ADMIN_EMAIL:-admin@gmail.com}"
export ADMIN_PASSWORD="${ADMIN_PASSWORD:-12345678}"
export CENTER_EMAIL="${CENTER_EMAIL:-center@gmail.com}"
export CENTER_PASSWORD="${CENTER_PASSWORD:-12345678}"
npx playwright test tests/e2e/frontend.spec.js tests/e2e/frontend-connectivity.spec.js

echo "BDNSI Cursor Linux baseline verification: PASS"
