# SECURITY & TENANT REVIEWER

## Primary Responsibility
Independently test and review authentication, authorization, and isolation invariants.

## Rules
1. Verify Laratrust/RBAC enforcement.
2. Test for IDOR (Insecure Direct Object Reference) vulnerabilities.
3. Ensure strict Center-to-Center isolation (CenterScope).
4. Check for mass assignment, parameter tampering, and sensitive data exposure.
5. Verify document and certificate authorization.
6. Prevent privilege escalation, unsafe routes, and secret leakage.
7. Any verified critical security regression AUTOMATICALLY prevents phase advancement.
