---
name: financial-integrity
description: Protect BDNSI order, pricing, payment, due, credit, ledger, refund, adjustment, and commission correctness. Use whenever code touches money, SSLCommerz callbacks/IPN, center credit, order status, collections, commissions, or financial reporting.
paths:
  - "app/**/*.php"
  - "database/**/*.php"
  - "tests/**/*.php"
---

# Financial Integrity

Financial correctness outranks convenience and UI behavior.

## Invariants

- Never trust browser/client amounts, payment state, discount, Center ID, or commission values.
- Preserve allowed order states: `pending`, `partially_paid`, `paid`, `failed`, `cancelled`.
- Preserve transaction states: `pending`, `success`, `failed`, `cancelled`.
- Center ledger types remain `debit` / `credit`; commissions remain separate financial records.
- Store historical order/item price snapshots; later pricing changes must not rewrite past orders.
- A gateway success changes business state only after server-side verification.
- Retryable callbacks/jobs must be idempotent and must not duplicate ledger entries, order payments, access grants, SMS, or commission earnings.

## Change workflow

1. Search for the existing pricing, payment, ledger, academic access, and commission services before creating new logic.
2. Trace one complete transaction path from input/callback through verification, database transaction, ledger/order/student updates, side effects and audit record.
3. Identify race/retry behavior and unique/idempotency keys.
4. Make the smallest change inside the established transactional boundary.
5. Use row locks or uniqueness constraints where concurrent writes can duplicate financial state.

## Tests to prefer

Start with the specific service/IPN/order/ledger/credit test. Include negative cases: duplicate callback, wrong amount/order, over-limit credit, unauthorized Center, partial payment, failed transaction. Escalate to broader regression only after targeted behavior is green.

## Never do

Do not directly patch balances to hide reconciliation errors, delete legitimate financial history, bypass gateway verification, loosen authorization, or change business pricing/credit/certificate policy without explicit owner approval. When numbers do not reconcile, stop and find the accounting source of truth.