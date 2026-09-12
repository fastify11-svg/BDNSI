#!/usr/bin/env node
/**
 * BDNSI direct-SSH production deployment.
 * GitHub Actions remains CI-only.
 *
 * Required release gates:
 *   BDNSI_DEPLOY_APPROVED=1
 *   BDNSI_RELEASE_BACKUP_CONFIRMED=1
 *
 * Safety:
 * - deploys only a clean local main that exactly matches origin/main
 * - requires strict SSH host-key verification
 * - requires an existing production .env
 * - never runs migrate:fresh/db:wipe/DROP
 * - deploys and verifies one exact commit SHA
 * - never deletes user uploads
 */

import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { homedir } from 'os';
import { execFileSync } from 'child_process';

const PROJECT_ROOT = resolve('.');
const SSH_HOST = process.env.BDNSI_SSH_HOST || '145.79.212.19';
const SSH_PORT = process.env.BDNSI_SSH_PORT || '65002';
const SSH_USER = process.env.BDNSI_SSH_USER || 'u881397359';
const SSH_KEY = resolve(process.env.BDNSI_SSH_KEY || '.deploy_key');
const KNOWN_HOSTS = resolve(process.env.BDNSI_SSH_KNOWN_HOSTS || `${homedir()}/.ssh/known_hosts`);
const REMOTE_PATH = process.env.BDNSI_REMOTE_PATH || '/home/u881397359/domains/nenobet.live/public_html';
const REPO_URL = 'https://github.com/fastify11-svg/BDNSI.git';
const HEALTH_URL = process.env.BDNSI_HEALTH_URL || 'https://nenobet.live/health';

function fail(message) {
  console.error(`[DEPLOY BLOCKED] ${message}`);
  process.exit(1);
}

function local(command, args = []) {
  return execFileSync(command, args, {
    cwd: PROJECT_ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function validateConfig() {
  if (process.env.BDNSI_DEPLOY_APPROVED !== '1') {
    fail('Explicit release approval missing. Set BDNSI_DEPLOY_APPROVED=1 only after owner approval.');
  }
  if (process.env.BDNSI_RELEASE_BACKUP_CONFIRMED !== '1') {
    fail('Database/upload rollback readiness has not been confirmed. Set BDNSI_RELEASE_BACKUP_CONFIRMED=1 only after verification.');
  }
  if (!/^[A-Za-z0-9.-]+$/.test(SSH_HOST)) fail('Invalid SSH host.');
  if (!/^\d{1,5}$/.test(SSH_PORT)) fail('Invalid SSH port.');
  if (!/^[A-Za-z0-9._-]+$/.test(SSH_USER)) fail('Invalid SSH user.');
  if (!/^\/[A-Za-z0-9._/-]+$/.test(REMOTE_PATH)) fail('Invalid remote path.');
  if (!existsSync(SSH_KEY)) fail(`SSH key not found: ${SSH_KEY}`);
  if (!existsSync(KNOWN_HOSTS)) fail(`known_hosts file not found: ${KNOWN_HOSTS}`);

  try {
    execFileSync('ssh-keygen', ['-F', `[${SSH_HOST}]:${SSH_PORT}`, '-f', KNOWN_HOSTS], { stdio: 'ignore' });
  } catch {
    fail(`SSH host key is not trusted in ${KNOWN_HOSTS}. Verify the Hostinger fingerprint before adding it.`);
  }
}

function ssh(command, label = command) {
  console.log(`\n[SSH] ${label}`);
  try {
    const out = execFileSync(
      'ssh',
      [
        '-i', SSH_KEY,
        '-o', 'BatchMode=yes',
        '-o', 'StrictHostKeyChecking=yes',
        '-o', `UserKnownHostsFile=${KNOWN_HOSTS}`,
        '-p', SSH_PORT,
        `${SSH_USER}@${SSH_HOST}`,
        command,
      ],
      { cwd: PROJECT_ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 180000 }
    );
    const text = out.trim();
    if (text) console.log(text);
    return text;
  } catch (error) {
    console.error(error.stderr?.toString() || error.message);
    throw error;
  }
}

async function checkHealth() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(HEALTH_URL, { redirect: 'follow', signal: controller.signal });
    if (response.status !== 200) throw new Error(`HTTP ${response.status}`);
    console.log(`[OK] Health check: ${HEALTH_URL} -> 200`);
  } finally {
    clearTimeout(timer);
  }
}

async function deploy() {
  validateConfig();

  const branch = local('git', ['rev-parse', '--abbrev-ref', 'HEAD']);
  if (branch !== 'main') fail(`Deploy only from main. Current branch: ${branch}`);

  if (local('git', ['status', '--porcelain'])) fail('Local worktree is not clean.');

  execFileSync('git', ['fetch', 'origin', 'main'], { cwd: PROJECT_ROOT, stdio: 'inherit' });
  const currentCommit = local('git', ['rev-parse', 'HEAD']);
  const originMain = local('git', ['rev-parse', 'origin/main']);
  if (currentCommit !== originMain) {
    fail(`Local main ${currentCommit} does not exactly match origin/main ${originMain}.`);
  }

  console.log(`\nBDNSI exact-SHA direct SSH deploy`);
  console.log(`Release SHA: ${currentCommit}`);
  console.log(`Target: ${SSH_USER}@${SSH_HOST}:${SSH_PORT}${REMOTE_PATH}`);

  ssh('whoami && hostname', 'Verify SSH connection');
  ssh(`test -d ${REMOTE_PATH} && test -f ${REMOTE_PATH}/.env`, 'Require existing production path and .env');

  let previousCommit = 'UNKNOWN';
  try {
    previousCommit = ssh(`cd ${REMOTE_PATH} && git rev-parse HEAD`, 'Record rollback SHA');
  } catch {
    console.warn('[WARN] Existing remote Git SHA could not be read; continue only because release approval and backup confirmation were explicit.');
  }

  ssh(`cp ${REMOTE_PATH}/.env ${REMOTE_PATH}/.env.backup_$(date +%Y%m%d_%H%M%S)`, 'Back up production .env');

  ssh(
    `cd ${REMOTE_PATH} && ` +
    `if git remote get-url origin >/dev/null 2>&1; then git remote set-url origin ${REPO_URL}; else git remote add origin ${REPO_URL}; fi && ` +
    `git fetch origin main && ` +
    `REMOTE_MAIN=$(git rev-parse origin/main) && ` +
    `test "$REMOTE_MAIN" = "${currentCommit}" && ` +
    `git reset --hard ${currentCommit}`,
    'Fetch and reset to exact approved SHA'
  );

  ssh(`cd ${REMOTE_PATH} && test -f .env`, 'Verify production .env survived code update');

  ssh(
    `cd ${REMOTE_PATH} && composer install --no-dev --optimize-autoloader --no-interaction --no-scripts`,
    'Install production Composer dependencies'
  );
  ssh(`cd ${REMOTE_PATH} && php artisan package:discover --ansi`, 'Discover Laravel packages');
  ssh(`cd ${REMOTE_PATH} && php artisan migrate --force`, 'Run reviewed forward migrations');
  ssh(
    `cd ${REMOTE_PATH} && php artisan optimize:clear && php artisan config:cache && php artisan route:cache && php artisan view:cache`,
    'Rebuild Laravel caches'
  );

  const deployedCommit = ssh(`cd ${REMOTE_PATH} && git rev-parse HEAD`, 'Verify deployed SHA');
  if (deployedCommit !== currentCommit) {
    throw new Error(`SHA mismatch: expected ${currentCommit}, deployed ${deployedCommit}`);
  }

  await checkHealth();

  console.log('\nDEPLOYMENT VERIFIED');
  console.log(`Previous SHA: ${previousCommit}`);
  console.log(`Deployed SHA: ${deployedCommit}`);
  console.log(`Health: ${HEALTH_URL}`);
  console.log('If rollback is required, review migrations/data compatibility before resetting code to the previous SHA.');
}

deploy().catch((error) => {
  console.error(`\n[DEPLOY FAILED] ${error.message}`);
  process.exit(1);
});
