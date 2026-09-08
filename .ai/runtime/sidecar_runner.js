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
const STATE_FILE    = path.join(PROJECT_ROOT, '.ai', 'AUTONOMY_STATE.json');
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
  const ROADMAP_FILE = path.join(PROJECT_ROOT, 'MASTER_IMPLEMENTATION_ROADMAP.md');
  try {
    const state = readJson(STATE_FILE);
    const roadmap = fs.readFileSync(ROADMAP_FILE, 'utf8');
    
    // Parse Phases
    const phaseRegex = /## \d+\.\s+PHASE\s+([A-Z])\s+—\s+([^\n]+)/g;
    const allPhases = [];
    let match;
    while ((match = phaseRegex.exec(roadmap)) !== null) {
      allPhases.push('PHASE_' + match[1]);
    }
    
    const completedPhases = new Set(state.completed_phases || []);
    const truePendingPhases = allPhases.filter(p => !completedPhases.has(p));
    
    // Parse Closure Requirements (Sections 25-29)
    const closureRegex = /## (25|26|27|28|29)\.\s+([^\n]+)/g;
    const allClosureReqs = [];
    let cMatch;
    while ((cMatch = closureRegex.exec(roadmap)) !== null) {
      // Convert heading to internal constant format
      let reqName = cMatch[2].replace(/[^A-Z0-9]+/gi, '_').toUpperCase();
      if (reqName.endsWith('_')) reqName = reqName.slice(0, -1);
      allClosureReqs.push(reqName);
    }
    
    const completedClosure = new Set(state.completed_closure_requirements || []);
    const truePendingClosure = allClosureReqs.filter(p => !completedClosure.has(p));

    // Handle runner resuming if work exists
    if ((truePendingPhases.length > 0 || truePendingClosure.length > 0) && state.runner_status === 'COMPLETE') {
      state.runner_status = 'RUNNING';
      state.gate_status = 'PENDING';
      
      if (truePendingPhases.length > 0) {
        state.current_phase = truePendingPhases[0];
      } else {
        state.current_phase = 'CLOSURE_REQUIREMENTS';
        state.current_task = truePendingClosure[0];
      }
      log('Self-heal: Fixed false COMPLETE state. Resuming remaining work.');
    }

    if (completedPhases.has(state.current_phase) && truePendingPhases.length > 0) {
      state.current_phase = truePendingPhases[0];
      state.current_task = 'DISCOVERY';
      log(`Self-heal: Advanced phase to ${state.current_phase}`);
    } else if (truePendingPhases.length === 0 && completedClosure.has(state.current_task) && truePendingClosure.length > 0) {
      state.current_phase = 'CLOSURE_REQUIREMENTS';
      state.current_task = truePendingClosure[0];
      log(`Self-heal: Advanced closure task to ${state.current_task}`);
    }
    
    state.pending_phases = truePendingPhases;
    state.closure_requirements = allClosureReqs;
    state.pending_closure_requirements = truePendingClosure;
    
    writeJson(STATE_FILE, state);
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
  
  if (state.runner_status === 'BLOCKED' || state.runner_status === 'COMPLETE') {
    log(`State is ${state.runner_status}. Skipping active run.`);
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
  const isClosure = state.current_phase === 'CLOSURE_REQUIREMENTS';
  
  const prompt = `# BDNSI AUTONOMOUS RUNNER — SCHEDULED WAKE

**Triggered at:** ${new Date().toISOString()}
**Runner version:** 2.1.0

## Current State

- Phase: ${state.current_phase || 'UNKNOWN'}
- Task: ${state.current_task || 'UNKNOWN'}  
- Last verified phase: ${state.last_verified_phase || 'UNKNOWN'}
- Last verified commit: ${state.last_verified_commit || 'UNKNOWN'}
- Gate status: ${state.gate_status || 'UNKNOWN'}
- Pending Phases: ${(state.pending_phases || []).join(', ') || 'NONE'}
- Pending Closure Reqs: ${(state.pending_closure_requirements || []).join(', ') || 'NONE'}

## Your Mission

You are the BDNSI Autonomous Roadmap Runner. 

**DO NOT** ask the owner for permission to continue routine implementation work.

**DO NOT** produce a plan and wait for approval.

**DO** immediately:

1. Read this file: \`MASTER_IMPLEMENTATION_ROADMAP.md\`
2. Read \`.ai/AUTONOMY_STATE.json\`
3. Read \`.ai/PROJECT_STATE.md\`
4. Read \`.ai/TASK_QUEUE.md\`
5. Read \`.ai/EVIDENCE_INDEX.md\`
6. Check \`git status\` and \`git log --oneline -5\`
7. Determine the next dependency-safe unfinished task (Phase OR Closure Requirement)
8. Execute the full implementation → review → test → gate cycle
9. On PASS: commit, update state, advance to the next task
10. On REWORK: fix immediately and repeat gates
11. On genuine OWNER_DECISION_REQUIRED: record and exit
12. Do NOT stop after phase completion — continue to the next phase OR closure requirement

## Active Skill

Follow the complete protocol in:
\`.agents/skills/bdnsi-persistent-roadmap-runner/SKILL.md\`

## Safety Absolute Rules

- Never run \`migrate:fresh\` or \`db:wipe\` on local/production data
- Never force-push
- Never expose credentials
- Never self-approve (implementer ≠ gatekeeper)
- Never weaken tests to get PASS
- Never invent roadmap phases beyond MASTER_IMPLEMENTATION_ROADMAP.md

## Begin Now

Start with Step 1 of the WAKE SEQUENCE. Do not explain what you are about to do — just do it.
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
