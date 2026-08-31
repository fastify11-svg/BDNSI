# SUPERVISOR OUTPUT SCHEMA

The supervisor MUST return exactly one valid JSON object (no markdown code blocks around it). The schema is:

```json
{
  "task_id": "string",
  "phase": "string",
  "verdict": "PASS|PASS_WITH_NOTES|REWORK_REQUIRED|BLOCKED",
  "risk_level": "LOW|MEDIUM|HIGH|CRITICAL",
  "summary": "Detailed summary of the review.",
  "issues": [
    {
      "id": "ISSUE-001",
      "severity": "LOW|MEDIUM|HIGH|CRITICAL",
      "category": "Security|Architecture|Testing|Implementation|Roadmap",
      "description": "Description of the defect",
      "evidence": "Evidence from reports or diff",
      "required_fix": "What must be done to resolve it",
      "required_tests": ["Test 1", "Test 2"]
    }
  ],
  "acceptance_criteria_status": [
    {
      "criterion": "Requirement X",
      "met": true
    }
  ],
  "security_status": "PASS|FAIL",
  "regression_status": "PASS|FAIL",
  "integration_status": "PASS|FAIL",
  "next_action": "Instructions for the implementation agent."
}
```
