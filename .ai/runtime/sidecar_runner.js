#!/usr/bin/env node
/**
 * BDNSI Autonomous Roadmap Runner — Windows Task Scheduler Sidecar
 * 
 * This script is invoked by Windows Task Scheduler every 15 minutes.
 * It implements the full wake → lock → execute → heartbeat → release cycle
 * described in .agents/skills/bdnsi-persistent-roadmap-runner/SKILL.md
 * 
 * It uses the Antigravity IDE's /goal slash command mechanism by writing
 * a runner prompt to a known location that the IDE monitors.
 * 
 * Safe to run concurrently: lock prevents duplicate execution.
 */

const fs    = require('fs');
const path  = require('path');
const https = require('https');
const http  = require('http');

const PROJECT_ROOT  = path.resolve(__dirname, '..', '..');
const LOCK_FILE     = path.join(PROJECT_ROOT, '.ai', 'runtime', 'ACTIVE_RUN.json');
const STATE_FILE    = path.join(PROJECT_ROOT, '.ai', '84H_EXECUTION_STATE.json');
const ACTIVITY_LOG  = path.join(PROJECT_ROOT, '.ai', 'AGENT_ACTIVITY.md');
const RUNNER_PROMPT = path.join(PROJECT_ROOT, '.ai', 'PERSISTENT_RUNNER_PROMPT.md');

const STALE_LOCK_MINUTES = 30;

// ─── Helpers ────────────────────────────────────────────────────────────────

function readJson(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return {}; }
}

function writeJson(file, obj) {
  fs.writeFileSync(file, JSON.stringify(obj, null, 2));
}

function log(msg) {
  const ts = new Date().toISOString();
  const line = `\n[${ts}] RUNNER: ${msg}`;
  console.log(line.trim());
  try {
    fs.appendFileSync(ACTIVITY_LOG, line);
  } catch { /* non-fatal */ }
}

function isStale(lock) {
  if (!lock.last_heartbeat_at) return true;
  const age = (Date.now() - new Date(lock.last_heartbeat_at).getTime()) / 60000;
  return age > STALE_LOCK_MINUTES;
}

// ─── Lock Management ────────────────────────────────────────────────────────

function acquireLock() {
  const lock = readJson(LOCK_FILE);
  
  if (lock.status === 'RUNNING') {
    if (!isStale(lock)) {
      log(`NOOP_ACTIVE_RUN — active run found (conv: ${lock.conversation_id}, heartbeat: ${lock.last_heartbeat_at})`);
      process.exit(0);
    }
    log(`STALE_LOCK detected (last heartbeat: ${lock.last_heartbeat_at}). Recovering state.`);
  }

  const newLock = {
    conversation_id: `sidecar-${Date.now()}`,
    started_at: new Date().toISOString(),
    last_heartbeat_at: new Date().toISOString(),
    task_id: null,
    phase: null,
    status: 'RUNNING'
  };
  writeJson(LOCK_FILE, newLock);
  log(`Lock acquired: ${newLock.conversation_id}`);
  return newLock;
}

function releaseLock() {
  writeJson(LOCK_FILE, {
    conversation_id: null,
    started_at: null,
    last_heartbeat_at: null,
    task_id: null,
    phase: null,
    status: 'FREE'
  });
  log('Lock released.');
}

// ─── State Self-Healing ─────────────────────────────────────────────────────

function healState() {
  try {
    const state = readJson(STATE_FILE);
    
    // In 84H execution, we never stop until the deadline.
    // If we somehow entered a terminal state but the deadline hasn't passed, heal it back to RUNNING.
    if (state.status === 'COMPLETED' || state.status === 'IDLE' || state.status === 'COMPLETE') {
      const now = new Date();
      const deadline = new Date(state.window_deadline_at);
      if (now < deadline) {
        state.status = 'FINAL_ACCEPTED_MONITORING';
        log('Self-heal: Fixed false COMPLETE state. 84H window still active. Switching to FINAL_ACCEPTED_MONITORING.');
      } else {
        state.status = 'FINAL_COMPLETED';
      }
      writeJson(STATE_FILE, state);
    }
  } catch (e) {
    log('Self-heal failed: ' + e.message);
  }
}

// ─── State Inspection ───────────────────────────────────────────────────────

function checkOwnerDecisionOrBlocked() {
  const state = readJson(STATE_FILE);
  
  if (state.owner_decision_required === true) {
    log('State is OWNER_DECISION_REQUIRED. Skipping run to avoid spam.');
    releaseLock();
    process.exit(0);
  }
  
  if (state.status === 'BLOCKED' || state.status === 'FINAL_COMPLETED') {
    log(`State is ${state.status}. Skipping active run.`);
    releaseLock();
    process.exit(0);
  }
  
  return state;
}

// ─── Runner Prompt Delivery ─────────────────────────────────────────────────
// The Antigravity IDE monitors .ai/PERSISTENT_RUNNER_PROMPT.md via its hooks
// system. When a new run is triggered, we write the prompt here and the
// pre_invocation hook delivers it as context to the next agent invocation.
// This is the bridge between the Windows scheduler and the IDE.

function writeRunnerPrompt(state) {
  const prompt = `# BDNSI 84H AUTONOMOUS WAKE

**Triggered at:** ${new Date().toISOString()}
**Runner version:** 3.0.0 (84H)

## Current State

- Mode: ${state.mode || 'UNKNOWN'}
- Phase: ${state.current_phase || 'UNKNOWN'}
- Task: ${state.current_task || 'UNKNOWN'}
- Last verified phase: ${state.last_verified_phase || 'UNKNOWN'}
- Last verified commit: ${state.last_verified_commit || 'UNKNOWN'}
- Gate status: ${state.gate_status || 'UNKNOWN'}

BDNSI 84H AUTONOMOUS WAKE

Read BDNSI_84H_NONSTOP_AUTONOMOUS_EXECUTION_MASTER.md and .ai/84H_EXECUTION_STATE.json.

Do not return only a status report.

Recover the real local state, reconcile Git/CI/runtime evidence, and execute the next highest-value safe action.

If the previous task passed, close it and immediately select the next task.
If CI failed, enter REWORK and fix the root cause.
If backlog is empty, start a fresh rotating audit cycle.
If one task is blocked, record it and continue an independent task.
If final acceptance already passed but the 84-hour window is still active, remain in FINAL_ACCEPTED_MONITORING and continue verification/audit work.

Do not stop for routine commit, push, CI, or safe non-destructive deployment to nenobet.live; standing owner authorization is already granted by the master file.

Only pause for:
- destructive/irreversible production operation
- real production-data mutation
- unavailable credential/secret
- unresolved business-policy decision
- materially risky major platform migration

GitHub Actions = CI only.
Deployment = Antigravity Direct SSH.
Target = nenobet.live.

Execute now.
`;

  fs.writeFileSync(RUNNER_PROMPT, prompt);
  log(`Runner prompt written to ${RUNNER_PROMPT}`);
}

// ─── Main ───────────────────────────────────────────────────────────────────

function main() {
  log('=== BDNSI Autonomous Runner WAKE ===');
  
  // Ensure directories exist
  fs.mkdirSync(path.dirname(LOCK_FILE), { recursive: true });
  
  // Heal state to prevent false complete
  healState();
  
  // Acquire lock (exits if another run is active)
  const lock = acquireLock();
  
  // Check for no-spam conditions
  const state = checkOwnerDecisionOrBlocked();
  
  // Write the runner prompt for the IDE to pick up
  writeRunnerPrompt(state);
  
  // Update state to reflect scheduled wake
  const updatedState = { ...state, last_run_started_at: new Date().toISOString() };
  writeJson(STATE_FILE, updatedState);
  
  log('Runner prompt delivered. Antigravity IDE will pick up on next invocation.');
  log('=== BDNSI Runner WAKE complete ===');
  
  // Release lock — the actual IDE agent will re-acquire via heartbeat
  // This sidecar only triggers the wake; the IDE agent owns execution
  releaseLock();
}

main();
