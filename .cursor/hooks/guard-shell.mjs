import process from 'node:process';

let raw = '';
for await (const chunk of process.stdin) raw += chunk;

let payload = {};
try {
  payload = raw ? JSON.parse(raw) : {};
} catch {
  payload = {};
}

const command = String(
  payload.command ??
  payload.command_line ??
  payload.shell_command ??
  payload.input?.command ??
  raw
);

const blocked = [
  {
    pattern: /\bphp(?:\.exe)?\s+artisan\s+(?:migrate:fresh|migrate:refresh|db:wipe)\b/i,
    reason: 'Direct destructive database reset commands are blocked. Use the guarded disposable-test verification scripts instead.'
  },
  {
    pattern: /\b(?:drop\s+database|drop\s+table|truncate\s+table)\b/i,
    reason: 'Destructive SQL is owner-gated and must not be run autonomously.'
  },
  {
    pattern: /\bgit\s+push\b[^\n\r]*(?:--force|-f)\b/i,
    reason: 'Force-push is blocked for the BDNSI autonomous development lane.'
  },
  {
    pattern: /\bgit\s+reset\s+--hard\b/i,
    reason: 'Hard reset can destroy uncommitted work and is blocked.'
  },
  {
    pattern: /\bgit\s+clean\s+-[^\s]*f/i,
    reason: 'Forced git clean can destroy untracked work and is blocked.'
  },
  {
    pattern: /\bgit\s+(?:checkout\s+--\s+\.|restore\s+\.)/i,
    reason: 'Whole-worktree discard commands are blocked.'
  },
  {
    pattern: /\bgit\s+push\b[^\n\r]*\b(?:origin\s+)?main\b/i,
    reason: 'Cursor development must stay on cursor-development; main changes require the release gate.'
  },
  {
    pattern: /\bnpm\s+audit\s+fix\s+--force\b/i,
    reason: 'Forced dependency rewrites are blocked; triage the exact advisory and make the smallest compatible change.'
  },
  {
    pattern: /\bnode(?:\.exe)?\s+[^\n\r]*deploy_to_production\.mjs\b/i,
    reason: 'Production deployment is not a Cursor-lane action. Hand off the exact approved SHA to the Antigravity direct-SSH deployment path.'
  },
  {
    pattern: /\brm\s+-rf\s+\/(?:\s|$)/i,
    reason: 'Catastrophic filesystem deletion command blocked.'
  }
];

for (const rule of blocked) {
  if (rule.pattern.test(command)) {
    console.error(`[BDNSI Cursor Safety] BLOCKED: ${rule.reason}`);
    console.error(`[BDNSI Cursor Safety] Command: ${command.slice(0, 500)}`);
    process.exit(2);
  }
}

process.exit(0);
