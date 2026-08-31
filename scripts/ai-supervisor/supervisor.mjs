import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const AI_SUPERVISOR_API_KEY = process.env.AI_SUPERVISOR_API_KEY;
const AI_SUPERVISOR_BASE_URL = process.env.AI_SUPERVISOR_BASE_URL || 'https://agentrouter.org/v1';
const AI_SUPERVISOR_MODEL = process.env.AI_SUPERVISOR_MODEL; // Intentionally no default

const args = process.argv.slice(2);
const isMockPass = args.includes('--mock-pass');
const isMockRework = args.includes('--mock-rework');
const isConnectivityTest = args.includes('--test-connectivity');

function readFileSafely(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            return fs.readFileSync(filePath, 'utf8');
        }
    } catch (e) {}
    return "Not provided";
}

// Parse active task details from TASK_QUEUE.md
function parseTaskQueue() {
    const content = readFileSafely('.ai/TASK_QUEUE.md');
    const lines = content.split('\n');
    
    let activeTaskId = "UNKNOWN_TASK";
    let objective = "Unknown objective";
    let currentPhaseContext = "Unknown Phase";
    let lastPhaseHeader = "";
    
    for (const line of lines) {
        if (line.startsWith('## ')) {
            lastPhaseHeader = line.substring(3).trim();
        }
        // Look for in-progress or ready tasks. The most recent 'IMPLEMENTING' or top 'READY' is usually active.
        // Or if the project state says we're in a specific phase.
        if (line.match(/- \[[ /]\] TASK-/)) {
            const match = line.match(/TASK-[A-Z0-9-]+/);
            if (match) {
                activeTaskId = match[0];
                objective = line.split(': ')[1] || line;
                currentPhaseContext = lastPhaseHeader;
                break; // Take the first open task as active
            }
        }
    }
    return { activeTaskId, objective, currentPhaseContext };
}

// Ensure the parsed JSON output has the required fields
function validateOutputSchema(json) {
    const required = ['task_id', 'phase', 'verdict', 'risk_level', 'summary', 'issues'];
    for (const field of required) {
        if (!(field in json)) {
            throw new Error(`Invalid JSON schema: Missing required field '${field}'`);
        }
    }
    const allowedVerdicts = ['PASS', 'PASS_WITH_NOTES', 'REWORK_REQUIRED', 'BLOCKED'];
    if (!allowedVerdicts.includes(json.verdict)) {
        throw new Error(`Invalid JSON schema: verdict must be one of ${allowedVerdicts.join(', ')}`);
    }
}

async function runConnectivityTest() {
    console.log("Running AgentRouter Connectivity Test...");
    if (!AI_SUPERVISOR_API_KEY) {
        console.error("FATAL: AI_SUPERVISOR_API_KEY is missing. Cannot test connectivity.");
        process.exit(1);
    }
    if (!AI_SUPERVISOR_MODEL) {
        console.error("FATAL: AI_SUPERVISOR_MODEL is missing. Model must be explicitly configured.");
        process.exit(1);
    }
    
    try {
        const response = await fetch(`${AI_SUPERVISOR_BASE_URL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AI_SUPERVISOR_API_KEY}`
            },
            body: JSON.stringify({
                model: AI_SUPERVISOR_MODEL,
                messages: [
                    { role: "user", content: "Return exactly:\n{\"status\":\"ok\"}" }
                ],
                response_format: { type: "json_object" }
            })
        });
        
        if (!response.ok) {
            throw new Error(`AgentRouter API failed: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        const content = data.choices[0].message.content;
        const parsed = JSON.parse(content);
        
        if (parsed.status === 'ok') {
            console.log("Connectivity Test SUCCESS.");
            console.log("Authentication works. Base URL works. Model works. Response parsing works.");
            return true;
        } else {
            throw new Error("Parsed JSON did not contain {status: 'ok'}");
        }
    } catch (e) {
        console.error("Connectivity Test FAILED:", e.message);
        process.exit(1);
    }
}

function gatherEvidence() {
    console.log("Gathering repository evidence...");
    
    let projectState = readFileSafely('.ai/PROJECT_STATE.md');
    let implementation = readFileSafely('.ai/IMPLEMENTATION_REPORT.md');
    let test = readFileSafely('.ai/TEST_REPORT.md');
    let security = readFileSafely('.ai/SECURITY_REPORT.md');
    let regression = readFileSafely('.ai/REGRESSION_REPORT.md');
    let integration = readFileSafely('.ai/INTEGRATION_REPORT.md');
    
    const { activeTaskId, objective, currentPhaseContext } = parseTaskQueue();

    let gitDiff = "";
    try {
        gitDiff = execSync('git diff --staged').toString();
        if (!gitDiff) {
            gitDiff = execSync('git diff HEAD~1..HEAD').toString();
        }
    } catch (e) {
        gitDiff = "Failed to extract git diff.";
    }

    const payload = {
        project: "BDNSI",
        phase: projectState.match(/Current Phase: (.*)/)?.[1] || "Unknown",
        roadmap_context: currentPhaseContext,
        task_id: activeTaskId,
        objective: objective,
        acceptance_criteria: "Must pass all security, logic, integration, and UI tests. No regressions.",
        git_diff: gitDiff,
        reports: {
            implementation, test, security, regression, integration
        },
        previous_verdict: null
    };

    fs.writeFileSync('.ai/supervisor/review-input.json', JSON.stringify(payload, null, 2));
    return payload;
}

async function callSupervisorAPI(payload, isRetry = false) {
    console.log("Invoking external AI Supervisor...");
    
    if (isMockPass) {
        console.log("Executing MOCK PASS...");
        return {
            task_id: payload.task_id,
            phase: payload.phase,
            verdict: "PASS",
            risk_level: "LOW",
            summary: "All requirements met. Code is clean and secure.",
            issues: [],
            acceptance_criteria_status: [],
            security_status: "PASS",
            regression_status: "PASS",
            integration_status: "PASS",
            next_action: "Proceed to next roadmap task."
        };
    }

    if (isMockRework) {
        console.log("Executing MOCK REWORK...");
        return {
            task_id: payload.task_id,
            phase: payload.phase,
            verdict: "REWORK_REQUIRED",
            risk_level: "HIGH",
            summary: "Missing validation rules on financial transaction.",
            issues: [
                {
                    id: "ISSUE-MOCK-01",
                    severity: "HIGH",
                    category: "Security",
                    description: "No authorization check in controller.",
                    evidence: "diff lines 40-45",
                    required_fix: "Add Role middleware check.",
                    required_tests: ["Test authorization logic."]
                }
            ],
            acceptance_criteria_status: [],
            security_status: "FAIL",
            regression_status: "PASS",
            integration_status: "PASS",
            next_action: "Fix the identified issues and resubmit."
        };
    }
    
    if (args.includes('--mock-pass-notes')) {
        console.log("Executing MOCK PASS WITH NOTES...");
        return {
            task_id: payload.task_id,
            phase: payload.phase,
            verdict: "PASS_WITH_NOTES",
            risk_level: "MEDIUM",
            summary: "Code mostly works, but there is a security concern regarding SQL injection.",
            issues: [
                {
                    id: "ISSUE-MOCK-02",
                    severity: "MEDIUM",
                    category: "security",
                    description: "Potential SQL injection.",
                    evidence: "diff line 50",
                    required_fix: "Use parameterized queries.",
                    required_tests: ["Test SQL injection payloads."]
                }
            ],
            acceptance_criteria_status: [],
            security_status: "FAIL",
            regression_status: "PASS",
            integration_status: "PASS",
            next_action: "Review security note."
        };
    }
    
    if (args.includes('--mock-malformed-json')) {
        console.log("Executing MOCK MALFORMED JSON...");
        let rawContent = "```json\n{ \"verdict\": \"PASS\", \"missing_fields\": true \n```"; 
        
        let parsed;
        try {
            if (rawContent.startsWith('```json')) {
                rawContent = rawContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
            }
            parsed = JSON.parse(rawContent);
            validateOutputSchema(parsed);
        } catch (e) {
            if (!isRetry) {
                console.warn("Invalid JSON returned by Supervisor, retrying once...", e.message);
                return callSupervisorAPI(payload, true);
            } else {
                console.error("FATAL: Supervisor repeatedly returned invalid JSON or schema violations.");
                process.exit(1);
            }
        }
        return parsed;
    }

    if (args.includes('--mock-api-failure')) {
        console.log("Executing MOCK API FAILURE...");
        throw new Error("AgentRouter API failed: 500 Internal Server Error");
    }

    if (!AI_SUPERVISOR_API_KEY) {
        console.error("FATAL: AI_SUPERVISOR_API_KEY is missing. Halting supervisor bridge.");
        process.exit(1);
    }
    if (!AI_SUPERVISOR_MODEL) {
        console.error("FATAL: MODEL_NOT_CONFIGURED. AI_SUPERVISOR_MODEL must be explicitly set.");
        process.exit(1);
    }

    const prompt = readFileSafely('.ai/supervisor/SUPERVISOR_PROMPT.md');
    const systemInstruction = isRetry 
        ? prompt + "\n\nCRITICAL: Your previous response was invalid JSON. You MUST return strictly valid JSON according to the schema." 
        : prompt;

    const response = await fetch(`${AI_SUPERVISOR_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${AI_SUPERVISOR_API_KEY}`
        },
        body: JSON.stringify({
            model: AI_SUPERVISOR_MODEL,
            messages: [
                { role: "system", content: systemInstruction },
                { role: "user", content: JSON.stringify(payload) }
            ],
            response_format: { type: "json_object" }
        })
    });

    if (!response.ok) {
        throw new Error(`AgentRouter API failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    let rawContent = data.choices[0].message.content;
    
    if (rawContent.startsWith('```json')) {
        rawContent = rawContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    }

    let parsed;
    try {
        parsed = JSON.parse(rawContent);
        validateOutputSchema(parsed);
    } catch (e) {
        if (!isRetry) {
            console.warn("Invalid JSON returned by Supervisor, retrying once...", e.message);
            return callSupervisorAPI(payload, true);
        } else {
            console.error("FATAL: Supervisor repeatedly returned invalid JSON or schema violations.");
            process.exit(1);
        }
    }
    return parsed;
}

function processPassWithNotes(verdictJson) {
    if (verdictJson.verdict !== 'PASS_WITH_NOTES') return verdictJson;

    const criticalCategories = [
        'acceptance criteria', 'security', 'data integrity', 
        'financial correctness', 'authorization', 'regression', 'integration'
    ];

    let isCritical = false;
    
    // Check if any issue falls into critical categories
    if (verdictJson.issues && Array.isArray(verdictJson.issues)) {
        for (const issue of verdictJson.issues) {
            const cat = (issue.category || "").toLowerCase();
            if (criticalCategories.some(c => cat.includes(c))) {
                isCritical = true;
                break;
            }
        }
    }
    
    // Also check summary text just in case
    const summary = (verdictJson.summary || "").toLowerCase();
    if (!isCritical && criticalCategories.some(c => summary.includes(c))) {
        // We will be strict: if the notes mention critical areas, force REWORK
        isCritical = true;
    }

    if (isCritical) {
        console.log("PASS_WITH_NOTES escalated to REWORK_REQUIRED due to critical category involvement.");
        verdictJson.verdict = 'REWORK_REQUIRED';
    }
    return verdictJson;
}

function generateReports(verdictJson) {
    verdictJson = processPassWithNotes(verdictJson);

    fs.writeFileSync('.ai/supervisor/review-output.json', JSON.stringify(verdictJson, null, 2));

    const reviewReport = `# SUPERVISOR REVIEW REPORT
**Verdict:** ${verdictJson.verdict}
**Risk Level:** ${verdictJson.risk_level}
**Summary:** ${verdictJson.summary}

## Component Status
- Security: ${verdictJson.security_status}
- Regression: ${verdictJson.regression_status}
- Integration: ${verdictJson.integration_status}

## Next Action
${verdictJson.next_action}
`;
    fs.writeFileSync('.ai/REVIEW_REPORT.md', reviewReport);

    if (verdictJson.verdict === 'REWORK_REQUIRED') {
        let fixRequest = `# FIX REQUEST\n\nGenerated by Supervisor Bridge.\n\n`;
        verdictJson.issues.forEach(issue => {
            fixRequest += `## [${issue.severity}] ${issue.id} - ${issue.category}\n`;
            fixRequest += `**Problem:** ${issue.description}\n`;
            fixRequest += `**Evidence:** ${issue.evidence}\n`;
            fixRequest += `**Required Fix:** ${issue.required_fix}\n`;
            fixRequest += `**Required Tests:**\n`;
            if (issue.required_tests) {
                issue.required_tests.forEach(test => fixRequest += `- ${test}\n`);
            }
            fixRequest += `\n`;
        });
        fs.writeFileSync('.ai/FIX_REQUEST.md', fixRequest);
        
        let state = readFileSafely('.ai/PROJECT_STATE.md');
        state = state.replace(/Status: .*/, "Status: REWORK_REQUIRED");
        fs.writeFileSync('.ai/PROJECT_STATE.md', state);
        
        console.log("Verdict: REWORK_REQUIRED. Fix request generated.");
    } else if (verdictJson.verdict === 'PASS') {
        let state = readFileSafely('.ai/PROJECT_STATE.md');
        state = state.replace(/Status: .*/, "Status: VERIFIED");
        fs.writeFileSync('.ai/PROJECT_STATE.md', state);
        
        if (fs.existsSync('.ai/FIX_REQUEST.md')) {
            fs.unlinkSync('.ai/FIX_REQUEST.md');
        }
        console.log("Verdict: PASS. Ready for next task.");
    } else if (verdictJson.verdict === 'PASS_WITH_NOTES') {
        let state = readFileSafely('.ai/PROJECT_STATE.md');
        state = state.replace(/Status: .*/, "Status: VERIFIED (WITH NOTES)");
        fs.writeFileSync('.ai/PROJECT_STATE.md', state);
        console.log("Verdict: PASS_WITH_NOTES (non-blocking). Review notes in REVIEW_REPORT.md.");
    } else if (verdictJson.verdict === 'BLOCKED') {
        let state = readFileSafely('.ai/PROJECT_STATE.md');
        state = state.replace(/Status: .*/, "Status: BLOCKED");
        fs.writeFileSync('.ai/PROJECT_STATE.md', state);
        console.log("Verdict: BLOCKED. Halting roadmap progression.");
    }
}

async function main() {
    try {
        if (isConnectivityTest) {
            await runConnectivityTest();
            process.exit(0);
        }

        const payload = gatherEvidence();
        const verdict = await callSupervisorAPI(payload);
        generateReports(verdict);
        
        fs.writeFileSync('.ai/supervisor/bridge-state.json', JSON.stringify({
            status: AI_SUPERVISOR_API_KEY ? "READY_FOR_LIVE_SUPERVISION" : "READY_FOR_CREDENTIALS",
            last_run: new Date().toISOString(),
            last_verdict: verdict.verdict
        }, null, 2));
        
    } catch (e) {
        console.error("Supervisor Bridge encountered an error:", e.message);
        process.exit(1);
    }
}

main();
