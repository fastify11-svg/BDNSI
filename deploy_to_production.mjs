#!/usr/bin/env node
/**
 * deploy_to_production.mjs
 * Antigravity Direct SSH Deployment Script
 *
 * Target: nenobet.live
 * SSH: u881397359@145.79.212.19 -p 65002
 * Key: .deploy_key (ED25519, generate with: node -e "..." or ssh-keygen)
 * Remote path: /home/u881397359/domains/nenobet.live/public_html
 *
 * SAFETY RULES:
 *   - NEVER runs migrate:fresh, db:wipe, or DROP DATABASE
 *   - NEVER overwrites production .env
 *   - NEVER deletes user uploads (storage/app/public)
 *   - Only runs: php artisan migrate --force (safe additive migrations)
 *
 * Usage:
 *   node deploy_to_production.mjs
 */

import { createRequire } from 'module';
import { existsSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SSH_HOST = '145.79.212.19';
const SSH_PORT = '65002';
const SSH_USER = 'u881397359';
const SSH_KEY  = resolve(__dirname, '.deploy_key');
const REMOTE_PATH = '/home/u881397359/domains/nenobet.live/public_html';
const REPO_URL = 'https://github.com/fastify11-svg/BDNSI.git';

// ── Pre-flight checks ─────────────────────────────────────────────────────────
if (!existsSync(SSH_KEY)) {
  console.error(`[DEPLOY ERROR] SSH key not found at: ${SSH_KEY}`);
  console.error('Generate it: node -e "require(\'child_process\').execFileSync(\'ssh-keygen\', [\'-t\', \'ed25519\', \'-C\', \'bdnsi-deploy\', \'-f\', \'.deploy_key\', \'-N\', \'\'])"');
  process.exit(1);
}

// Get current commit for verification
const currentCommit = execSync('git rev-parse HEAD', { cwd: __dirname }).toString().trim();
const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: __dirname }).toString().trim();
console.log(`[DEPLOY] Deploying commit: ${currentCommit} (${currentBranch})`);
console.log(`[DEPLOY] Target: ${SSH_USER}@${SSH_HOST}:${SSH_PORT} → ${REMOTE_PATH}`);

if (currentBranch !== 'main') {
  console.error(`[DEPLOY ERROR] Must deploy from main branch. Current branch: ${currentBranch}`);
  process.exit(1);
}

// ── SSH helper ────────────────────────────────────────────────────────────────
function ssh(command, label) {
  console.log(`\n[SSH] ${label || command.split('\n')[0].substring(0, 80)}`);
  try {
    const result = execSync(
      `ssh -i "${SSH_KEY}" -o BatchMode=yes -o StrictHostKeyChecking=no -p ${SSH_PORT} ${SSH_USER}@${SSH_HOST} "${command.replace(/"/g, '\\"')}"`,
      { cwd: __dirname, encoding: 'utf8', stdio: 'pipe', timeout: 120000 }
    );
    console.log(result);
    return result;
  } catch (e) {
    console.error(`[SSH ERROR] ${e.stderr || e.message}`);
    throw e;
  }
}

// ── Deployment steps ─────────────────────────────────────────────────────────
async function deploy() {
  console.log('\n══════════════════════════════════════════════════');
  console.log(' BDNSI → Antigravity Direct SSH Production Deploy');
  console.log('══════════════════════════════════════════════════\n');

  // Step 1: Test connection
  try {
    const whoami = ssh('whoami && hostname', 'Test SSH connection');
    console.log(`[OK] SSH connection established: ${whoami.trim()}`);
  } catch {
    console.error('[BLOCKED] Cannot connect to server. Ensure the SSH public key is added to Hostinger SSH Access.');
    console.error('Public key to add:');
    console.log(readFileSync(`${SSH_KEY}.pub`, 'utf8').trim());
    process.exit(1);
  }

  // Step 2: Backup current .env (safety)
  ssh(`if [ -f ${REMOTE_PATH}/.env ]; then cp ${REMOTE_PATH}/.env ${REMOTE_PATH}/.env.backup_$(date +%Y%m%d_%H%M%S) && echo "Production .env backed up"; fi`, 'Backup production .env');

  // Step 3: Git pull or clone
  ssh(`if [ -d ${REMOTE_PATH}/.git ]; then cd ${REMOTE_PATH} && git fetch origin && git reset --hard origin/main && echo "Git pull complete"; else cd ${REMOTE_PATH} && git init && git remote add origin ${REPO_URL} && git fetch origin && git reset --hard origin/main && echo "Git init and fetch complete"; fi`, 'Git fetch & reset');

  // Step 4: Restore .env (never overwrite production .env)
  ssh(`cd ${REMOTE_PATH} && LATEST_BACKUP=$(ls -t .env.backup_* 2>/dev/null | head -1) && if [ -n "$LATEST_BACKUP" ]; then cp "$LATEST_BACKUP" .env && echo "Production .env restored from backup"; elif [ ! -f .env ] && [ -f .env.example ]; then cp .env.example .env && echo "WARNING: No production .env found. Copied .env.example"; fi`, 'Restore production .env');

  // Step 5: Composer install (no-dev, production)
  ssh(`cd ${REMOTE_PATH} && composer install --no-dev --optimize-autoloader --no-interaction --ignore-platform-reqs --no-scripts 2>&1 | tail -5 && echo "Composer install complete"`, 'Composer install --no-dev');

  // Step 6: Safe migrations only
  ssh(`cd ${REMOTE_PATH} && php artisan migrate --force 2>&1 && echo "Migrations complete"`, 'php artisan migrate --force');

  // Step 7: Laravel cache clear & rebuild
  ssh(`cd ${REMOTE_PATH} && php artisan config:clear && php artisan cache:clear && php artisan route:clear && php artisan view:clear && php artisan config:cache && php artisan route:cache && php artisan view:cache && echo "Laravel caches rebuilt"`, 'Laravel cache:clear + cache:cache');

  // Step 8: Verify deployment
  const deployedCommit = ssh(`cd ${REMOTE_PATH} && git rev-parse HEAD`, 'Verify deployed commit');
  const appUrl = ssh(`cd ${REMOTE_PATH} && grep '^APP_URL' .env | head -1`, 'Check APP_URL in .env');

  console.log('\n══════════════════════════════════════════════════');
  console.log(' DEPLOYMENT COMPLETE');
  console.log('══════════════════════════════════════════════════');
  console.log(`Local commit:    ${currentCommit}`);
  console.log(`Deployed commit: ${deployedCommit.trim()}`);
  console.log(`App URL:         ${appUrl.trim()}`);
  console.log(`Timestamp:       ${new Date().toISOString()}`);
  console.log('══════════════════════════════════════════════════\n');

  if (deployedCommit.trim() !== currentCommit) {
    console.warn('[WARNING] Deployed commit differs from local. Verify manually.');
  }
}

deploy().catch(err => {
  console.error('[DEPLOY FAILED]', err.message);
  process.exit(1);
});
