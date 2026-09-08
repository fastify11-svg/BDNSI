const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = process.cwd();
const ROADMAP_FILE = path.join(PROJECT_ROOT, 'MASTER_IMPLEMENTATION_ROADMAP.md');
const STATE_FILE = path.join(PROJECT_ROOT, '.ai', 'AUTONOMY_STATE.json');

// Reconstruct AUTONOMY_STATE.json dynamically from ROADMAP
function healState() {
    try {
        const state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
        const roadmap = fs.readFileSync(ROADMAP_FILE, 'utf8');
        
        const phaseRegex = /## \d+\.\s+PHASE\s+([A-Z])\s+—\s+([^\n]+)/g;
        const allPhases = [];
        let match;
        while ((match = phaseRegex.exec(roadmap)) !== null) {
            allPhases.push('PHASE_' + match[1]);
        }
        
        // Ensure pending_phases contains all uncompleted phases
        const completed = new Set(state.completed_phases || []);
        const truePending = allPhases.filter(p => !completed.has(p));
        
        // If state says COMPLETE but we have pending phases, fix it
        if (truePending.length > 0 && state.runner_status === 'COMPLETE') {
            state.runner_status = 'RUNNING';
            state.gate_status = 'PENDING';
            state.current_phase = truePending[0];
            state.current_task = 'DISCOVERY';
        }

        // If the current phase is in completed, move to the next uncompleted
        if (completed.has(state.current_phase) && truePending.length > 0) {
            state.current_phase = truePending[0];
            state.current_task = 'DISCOVERY';
        }
        
        state.pending_phases = truePending;
        fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
    } catch (e) {
        console.error("Self-heal failed", e);
    }
}
healState();
