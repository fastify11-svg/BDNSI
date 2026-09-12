#!/usr/bin/env bash
# Idempotent Cloud Agent dependency bootstrap for BDNSI.
# Assumes base snapshot already has PHP 8.2, Composer, Node 24, MySQL 8 client/server.
set -euo pipefail

export PATH="${HOME}/.local/bin:${HOME}/.nvm/versions/node/v24.21.0/bin:${PATH}"

node -e "const m=Number(process.versions.node.split('.')[0]); if(m<24){console.error('Node 24+ required; current '+process.version);process.exit(2)}"
php -v | head -1
composer -V

composer install --no-scripts --no-ansi --no-interaction --no-progress --prefer-dist
npm ci --legacy-peer-deps
npx playwright install chromium --with-deps

echo "BDNSI cloud-agent install: OK"
