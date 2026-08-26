# Audit Remediation Plan

## Goal

Repair the verified audit findings before Phase I proceeds, without changing production data, committing, pushing, or deploying.

## Affected Files

- Normalize order status values to the existing database enum.
- Correct financial reconciliation and health queries to use the ledger enum.
- Correct analytics to use Orders, Transactions, and Commissions as their authoritative sources.
- Add focused regression coverage for status, ledger, and analytics invariants.
- Make CI run the PHP suite, and remove autonomous commit/push/deploy instructions that conflict with explicit user approval.

## Data Safety

- No migration or production data rewrite is part of this remediation.
- Existing records using invalid historical order statuses will be reported separately before any data migration is considered.

## Verification

- Targeted feature tests.
- Full PHP test suite and frontend build only after the targeted tests pass.
- No Git commit, push, or deployment.
