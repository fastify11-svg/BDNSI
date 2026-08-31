# Automated External AI Supervisor Bridge

This directory contains the bridge mechanism required for an external AI model (AgentRouter) to review roadmap progression without manual owner intervention.

## Components
- `SUPERVISOR_CONTRACT.md` - Definition of the external reviewer's strict responsibilities.
- `SUPERVISOR_PROMPT.md` - System prompt template injected into the AgentRouter API.
- `SUPERVISOR_INPUT_SCHEMA.md` - Required JSON payload sent to the external supervisor.
- `SUPERVISOR_OUTPUT_SCHEMA.md` - Strict JSON format returned by the external supervisor.
- `bridge-state.json` - Current operational readiness of the bridge.
- `review-input.json` / `review-output.json` - Ephemeral JSON data tracking the last review.
