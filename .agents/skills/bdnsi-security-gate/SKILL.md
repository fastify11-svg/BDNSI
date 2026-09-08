---
name: bdnsi-security-gate
description: Security verification gatekeeper for new implementations.
---

# BDNSI Security Gate

## Trigger
Use this skill prior to Integration Acceptance to ensure no security vulnerabilities were introduced.

## Instructions
1. Verify Laratrust RBAC on all modified or new routes and controllers.
2. Perform static analysis for IDOR, mass assignment, and data exposure.
3. Call upon `bdnsi-tenant-isolation` skill if the feature touches Center-specific data.
4. Report finding as `PASS` or `REWORK`.
