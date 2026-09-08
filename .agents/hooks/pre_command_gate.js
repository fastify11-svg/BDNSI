/**
 * BDNSI Agentic Workflow — Pre-Tool Safety Gate v2.0
 * 
 * Runs BEFORE every run_command to:
 *  1. Block obviously dangerous destructive commands
 *  2. Warn on migrate:fresh, truncate, maintenance mode
 *  3. Block broad rm -rf, DROP DATABASE, git force-push
 *  4. Auto-log command audit trail
 *  5. Require owner confirmation for production-affecting commands
 * 
 * Inspects actual command arguments, not just surface text.
 */

const fs   = require('fs');
const path = require('path');
const rl   = require('readline');

const ROOT      = path.resolve(__dirname, '..', '..');
const AUDIT_LOG = path.join(__dirname, '..', 'logs', 'command_audit.log');

// Ensure log dir exists
fs.mkdirSync(path.dirname(AUDIT_LOG), { recursive: true });

const reader = rl.createInterface({ input: process.stdin });
let raw = '';
reader.on('line', l => (raw += l));
reader.on('close', () => {
  let payload;
  try { payload = JSON.parse(raw); } catch { payload = {}; }

  const cmd = (payload?.toolCall?.args?.CommandLine || '').trim();
  const ts  = new Date().toISOString();

  // Audit log
  fs.appendFileSync(AUDIT_LOG, `[${ts}] CMD: ${cmd.slice(0, 300)}\n`);

  // ── HARD BLOCK — deny immediately ───────────────────────────────────────
  const HARD_BLOCK = [
    { re: /migrate:fresh.*--seed/i,           reason: 'migrate:fresh --seed drops all tables.' },
    { re: /db:wipe/i,                         reason: 'db:wipe destroys all tables.' },
    { re: /DROP\s+DATABASE/i,                 reason: 'DROP DATABASE is irreversible.' },
    { re: /rm\s+-rf\s+[\/\\](?!tmp)/i,       reason: 'Broad rm -rf is dangerous.' },
    { re: /git\s+push\s+.*--force/i,          reason: 'Force push rewrites shared history.' },
    { re: /git\s+push\s+.*-f(\s|$)/i,        reason: 'Force push rewrites shared history.' },
    { re: /git\s+reset\s+--hard\s+HEAD~[2-9]/, reason: 'Hard reset beyond 1 commit loses work.' },
    { re: /git\s+clean\s+-fdx/i,              reason: 'git clean -fdx deletes untracked files globally.' },
    { re: /format\s+[c-z]:/i,                reason: 'Disk format is irreversible.' },
    { re: /credential\s+dump|mimikatz|secretsdump/i, reason: 'Credential dumping is blocked.' },
  ];

  for (const { re, reason } of HARD_BLOCK) {
    if (re.test(cmd)) {
      process.stdout.write(JSON.stringify({
        decision: 'deny',
        reason:   `[Safety Gate] BLOCKED: ${reason}\nCommand: ${cmd.slice(0, 120)}`
      }));
      return;
    }
  }

  // ── ASK OWNER — confirm before proceeding ───────────────────────────────
  const ASK_PATTERNS = [
    { re: /migrate:fresh(?!\s+--seed)/i,   msg: 'migrate:fresh drops all tables. Confirm DB backup exists.' },
    { re: /truncate/i,                     msg: 'TRUNCATE is destructive. Verify the correct table.' },
    { re: /artisan\s+down/i,               msg: 'Putting app in maintenance mode.' },
    { re: /git\s+reset\s+--hard/i,         msg: 'Hard reset may lose committed work.' },
    { re: /deploy|ftp|ssh.*production/i,   msg: 'Production deployment detected. Confirm intent.' },
  ];

  for (const { re, msg } of ASK_PATTERNS) {
    if (re.test(cmd)) {
      process.stdout.write(JSON.stringify({
        decision: 'ask',
        reason:   `[Safety Gate] WARNING: ${msg}\nCommand: ${cmd.slice(0, 180)}`
      }));
      return;
    }
  }

  // Allow everything else
  process.stdout.write(JSON.stringify({ decision: 'allow' }));
});
