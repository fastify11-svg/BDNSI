/**
 * BDNSI Pre-Invocation Reminder + Persistent Runner Prompt Injector
 * 
 * Runs before every agent invocation.
 * 1. Reminds the agent to read AGENTS.md, AGENT_OPERATING_SYSTEM.md, PROJECT_MEMORY.md
 * 2. If a pending runner prompt exists (.ai/PERSISTENT_RUNNER_PROMPT.md with content
 *    beyond the placeholder), injects it as additional context.
 * 3. Refreshes the heartbeat on ACTIVE_RUN.json if a run is active.
 */

const fs   = require('fs');
const path = require('path');

const ROOT         = path.resolve(__dirname, '..', '..');
const RUNNER_PROMPT = path.join(ROOT, '.ai', 'PERSISTENT_RUNNER_PROMPT.md');
const LOCK_FILE    = path.join(ROOT, '.ai', 'runtime', 'ACTIVE_RUN.json');

// ─── Heartbeat refresh ───────────────────────────────────────────────────────
try {
  const lock = JSON.parse(fs.readFileSync(LOCK_FILE, 'utf8'));
  if (lock.status === 'RUNNING') {
    lock.last_heartbeat_at = new Date().toISOString();
    fs.writeFileSync(LOCK_FILE, JSON.stringify(lock, null, 2));
  }
} catch { /* non-fatal */ }

// ─── Build context output ────────────────────────────────────────────────────
const lines = [];

lines.push('## BDNSI Agentic Context Reminder');
lines.push('');
lines.push('Before every task, read:');
lines.push('- `.agents/AGENTS.md` (master rules)');
lines.push('- `.agents/AGENT_OPERATING_SYSTEM.md`');
lines.push('- `.agents/PROJECT_MEMORY.md`');
lines.push('- `.ai/PROJECT_STATE.md` (current phase/task)');
lines.push('- `.ai/AUTONOMY_STATE.json` (runner state)');
lines.push('');
lines.push('Full PHP path: `C:\\xampp\\php\\php.exe artisan`');
lines.push('Full Composer: `C:\\xampp\\php\\composer.bat`');
lines.push('Project root:  `C:\\BDNSI`');
lines.push('');

// Inject runner prompt if it has real content (not just the placeholder)
try {
  const promptContent = fs.readFileSync(RUNNER_PROMPT, 'utf8');
  if (promptContent.includes('BDNSI AUTONOMOUS RUNNER — SCHEDULED WAKE')) {
    lines.push('---');
    lines.push('');
    lines.push('## SCHEDULED RUNNER WAKE — ACTION REQUIRED');
    lines.push('');
    lines.push(promptContent);
    lines.push('');
    
    // Clear the prompt after injection so it is not re-injected next time
    fs.writeFileSync(RUNNER_PROMPT, '# BDNSI Persistent Runner Prompt\n\nNo pending wake. Awaiting next scheduled trigger.\n');
  }
} catch { /* no runner prompt file — skip */ }

process.stdout.write(lines.join('\n'));
