---
name: bdnsi-financial-integrity
description: Verifies all financial, payment, ledger, and commission invariants.
---

# BDNSI Financial Integrity

## Trigger
Use this skill to audit tasks touching financial modules.

## Instructions
1. Validate that gateway callbacks are idempotent.
2. Ensure database transactions are used for all monetary state changes.
3. Ensure the ledger correctly logs the transaction.
4. Verify that Frontend state is NEVER the source of truth for payment amounts or statuses.
5. Ensure discounts and commissions are calculated on backend correctly.
