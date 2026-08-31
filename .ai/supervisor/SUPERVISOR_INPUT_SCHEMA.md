# SUPERVISOR INPUT SCHEMA

The JSON payload sent to the supervisor follows this structure:

```json
{
  "project": "BDNSI",
  "phase": "Phase K",
  "task_id": "TASK-K-01",
  "objective": "Description of the goal",
  "files_changed": ["list of modified files"],
  "git_diff": "diff text",
  "reports": {
    "implementation": "content of IMPLEMENTATION_REPORT.md",
    "test": "content of TEST_REPORT.md",
    "security": "content of SECURITY_REPORT.md",
    "regression": "content of REGRESSION_REPORT.md",
    "integration": "content of INTEGRATION_REPORT.md"
  },
  "known_issues": "content of any known issues",
  "previous_verdict": "string or null"
}
```
