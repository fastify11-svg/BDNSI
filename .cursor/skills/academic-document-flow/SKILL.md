---
name: academic-document-flow
description: Work on BDNSI student registration, ID/admit/registration cards, results, transcripts, certificates, QR/public verification, and payment/credit access gates without breaking academic policy. Use for document generation/download, result publication, certificate issuance, or verification flows.
paths:
  - "app/**/*.php"
  - "routes/**/*.php"
  - "resources/js/**/*.js"
  - "resources/js/**/*.jsx"
  - "tests/**/*.php"
  - "tests/e2e/**/*.js"
---

# Academic Document Flow

Preserve the lifecycle and separate eligibility from presentation.

## Canonical journey

`Registration -> Documents -> Pricing/Payment/Credit -> Result -> Approval -> Certificate -> Verification`

Registration card, admit card and ID card have their own access rules and must not be conflated with result/certificate release.

## Procedure

1. Identify the exact artifact/state being changed and the actor requesting it.
2. Search existing access policy/service logic before adding controller conditions. Reuse centralized academic/payment gates when present.
3. Trace data from student/registration/course/session through template/PDF/QR or public verification response.
4. Verify authorization and Center ownership at the final download/view endpoint.
5. For result/certificate changes, verify payment/credit/due policy and approval state independently; do not infer eligibility from a button or frontend flag.
6. Public verification should reveal only intentionally public fields and should handle invalid/revoked/not-found states safely.

## Regression checks

Test the minimum relevant cases: eligible user succeeds; unauthorized actor fails; blocked payment/credit state is enforced; correct document belongs to the correct student/Center; public verification does not expose private fields. For generation changes, inspect one representative rendered artifact before running broad E2E.

## Do not

Do not bypass financial or approval policy, auto-approve results/certificates with AI, expose private files through predictable public paths, duplicate existing PDF/certificate systems without evidence, or rewrite completed document flows for styling alone.