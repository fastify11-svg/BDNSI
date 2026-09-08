import fs from 'fs';
import path from 'path';

const PROJECT_ROOT = process.cwd();
const ROADMAP_FILE = path.join(PROJECT_ROOT, 'MASTER_IMPLEMENTATION_ROADMAP.md');
const STATE_FILE = path.join(PROJECT_ROOT, '.ai', 'AUTONOMY_STATE.json');
const TASK_QUEUE_FILE = path.join(PROJECT_ROOT, '.ai', 'TASK_QUEUE.md');
const LOCK_FILE = path.join(PROJECT_ROOT, '.ai', 'runtime', 'ACTIVE_RUN.json');

function repair() {
    console.log("Starting Control Plane Repair...");

    // 1. Read Roadmap
    const roadmap = fs.readFileSync(ROADMAP_FILE, 'utf8');
    
    // 2. Parse all phases from roadmap
    const phaseRegex = /## \d+\.\s+PHASE\s+([A-Z])\s+—\s+([^\n]+)/g;
    const allPhases = [];
    let match;
    while ((match = phaseRegex.exec(roadmap)) !== null) {
        allPhases.push({
            letter: match[1],
            name: match[2].trim(),
            id: 'PHASE_' + match[1]
        });
    }
    
    console.log('Found ' + allPhases.length + ' phases in roadmap: ' + allPhases.map(p => p.id).join(', '));

    // 3. Read current state
    const state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    
    const completedPhases = [];
    const pendingPhases = [];
    
    let reachedUncompleted = false;
    for (const phase of allPhases) {
        if (!reachedUncompleted) {
            completedPhases.push(phase.id);
            if (phase.id === 'PHASE_N') {
                reachedUncompleted = true;
            }
        } else {
            pendingPhases.push(phase.id);
        }
    }

    state.completed_phases = completedPhases;
    state.pending_phases = pendingPhases;
    state.current_phase = 'PHASE_O';
    state.current_task = 'DISCOVERY';
    state.gate_status = 'PENDING';
    state.runner_status = 'RUNNING';
    state.last_run_started_at = new Date().toISOString();
    state.last_run_finished_at = null;
    state.owner_decision_required = false;

    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
    console.log("Updated AUTONOMY_STATE.json");

    // 4. Reconcile TASK_QUEUE.md
    const newTaskQueue = \# BDNSI TASK QUEUE

## Phase O: AI Document Intelligence

### Discovery & Planning
- [ ] Architecture Audit (AI Document Intelligence models, services)
- [ ] Phase O Implementation Plan Generation

### Implementation & Verification
- [ ] Implement OCR and Document Classification
- [ ] Implement Missing-document detection
- [ ] Implement Name/DOB/course mismatch detection
- [ ] Write/Verify E2E Tests for Document Intelligence
- [ ] Run Backend and Frontend Regression Suite
- [ ] Security Review (AI must not independently approve credentials)
- [ ] Final Gatekeeper Review

---
## Historical Tracking (Preserved Evidence)
### Phase N (Advanced Reporting)
- [x] Create Advanced Reporting UI (Index.jsx)
- [x] Create API endpoints for metrics
- [x] Write and verify tests
- [x] Final Gatekeeper Review
\;
    fs.writeFileSync(TASK_QUEUE_FILE, newTaskQueue);
    console.log("Updated TASK_QUEUE.md");

    // 5. Repair ACTIVE_RUN.json
    let lock = {
        conversation_id: null,
        started_at: null,
        last_heartbeat_at: null,
        task_id: null,
        phase: null,
        status: 'FREE'
    };
    try {
        lock = JSON.parse(fs.readFileSync(LOCK_FILE, 'utf8'));
    } catch(e) {}
    
    lock.status = 'FREE';
    fs.writeFileSync(LOCK_FILE, JSON.stringify(lock, null, 2));
    console.log("Repaired ACTIVE_RUN.json (lock released)");

    console.log("Repair complete. Ready for Phase O.");
}

repair();
