---
name: rbac-tenant-security
description: Review or modify BDNSI authentication, Laratrust RBAC, CenterScope tenant isolation, policies, guards, admin/staff/center authorization, and protected resources. Use for permission bugs, IDOR risk, cross-center data access, route protection, or role changes.
paths:
  - "app/**/*.php"
  - "routes/**/*.php"
  - "tests/**/*.php"
---

# RBAC and Tenant Security

Frontend visibility is not authorization. Every protected read/write must be constrained server-side.

## Trace the access decision

1. Identify the active guard and authenticated actor.
2. Inspect route middleware, controller authorization, policy/gate/Laratrust checks and `CenterScope` behavior.
3. Trace how Center ownership is derived. Prefer the authenticated relationship/server-side record; never trust a request-supplied Center ID merely because it is hidden in the UI.
4. Inspect direct object lookups, downloads, exports, bulk actions and queued jobs for scope bypass.
5. Find tests for both allowed and denied actors.

## Required properties

- Admin/staff/center boundaries remain explicit.
- A Center must not read or mutate another Center's students, orders, documents, results, certificates or financial records.
- Sensitive documents require authorization at the actual download/stream endpoint.
- Role checks must cover backend actions even when the UI hides controls.
- Background jobs must carry enough trusted identity/context to enforce the same tenant rules.
- Error responses should not leak unnecessary sensitive data.

## Efficient verification matrix

Use the smallest representative matrix: authorized actor succeeds; wrong role fails; wrong Center/tenant fails; unauthenticated actor fails. Add only the cases relevant to the changed boundary before expanding to full RBAC regression.

## Prohibited shortcuts

Never disable middleware/policies/scopes to make tests pass, move authorization solely into React, accept client Center IDs as authoritative, or broaden a role because one endpoint is inconvenient. Permission-policy changes with business impact require owner approval.