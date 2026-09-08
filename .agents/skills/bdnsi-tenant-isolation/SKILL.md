---
name: bdnsi-tenant-isolation
description: Verifies Center-to-Center data isolation (CenterScope).
---

# BDNSI Tenant Isolation

## Trigger
Use this skill to audit queries and routes returning Center-related data.

## Instructions
1. Verify `CenterScope` or equivalent global scope is applied to all relevant Eloquent models.
2. Ensure API endpoints check the authorized user's Center ID against the requested resource.
3. Never trust a client-supplied Center identity when a server-side relation exists.
