# POST-DEPLOYMENT LIVE REPAIR ROUND 2 WORKLOG

| Item | Authoritative live symptom | Diagnostic-audit claim | Initial confidence / treatment |
|---|---|---|---|
| LIVE-001 | Center Create email clears immediately; Center cannot be created | Browser password-manager/autofill interference | **CONFIRMED & FIXED.** Applied autoComplete="new-password". Tests passing. |
| LIVE-004 | Session Save returns HTTP 500 | Legacy `start_date` / `end_date` NOT NULL schema remains on live | **CONFIRMED & FIXED.** Generated safe forward-only migration to make them nullable. |
| LIVE-005 | Payment and SMS provider definitions are absent | Audit discusses Center Hub Orders/Auth guard 500 instead | **CONFIRMED & FIXED.** Seeders were skipped on live. Created a deployment migration to execute gateway seeders automatically. |
| LIVE-007 | Six policy switches visible; Center-specific pricing, dues, ledger navigation missing | Audit discusses District/Thana serialization | **CONFIRMED & FIXED.** Added Financial Ledger & Pricing UI section to `Admin/Center/Show.jsx` tracking `current_due`, `credit_limit`, and `available_credit`. Added missing `admin.orders` and `admin.prices` routes, and included them in the `AdminLayout` sidebar. |
| LIVE-008 | Sidebar clicks from `/admin/session` do not navigate | Audit discusses SubAdmin provisioning/role | **CONFIRMED & FIXED.** Symptom was a downstream effect of missing `@routes` and 500 errors in target pages, which crashed Inertia JS, making the sidebar appear broken. Fixed via Lane A and Lane C. |
| LIVE-010 | CRM Lead Phone clears immediately; Lead cannot be created | Browser password-manager/autofill interference | **CONFIRMED & FIXED.** Applied autoComplete="new-password". Tests passing. |
| LIVE-011 | `/admin/center-risk` returns HTTP 500 | `StudentDocument::whereIn('center_id', ...)` against table without `center_id` | **CONFIRMED & FIXED.** Rewrote batch query to join `students` and group by `students.center_id`. |
| Staff | Resolve restricted DEMO identity workflow and SubAdmin provisioning | Missing role mapping / UI blocking | **CONFIRMED & FIXED.** Migrated SubAdmin creation from legacy Blade views to Inertia React components (`Create.jsx`, `Edit.jsx`). Updated controller to route correctly. Fixed table action buttons. Laratrust role mapping verified successfully. |
| District/Thana blocker | Student/related forms expose unusable location options | `mapWithKeys()` payload omits `id` while frontend expects `d.id` | **CONFIRMED & FIXED.** Added missing `id` property in `CenterController` payload serialization. |
| Restricted Staff/SubAdmin blocker | No safe restricted DEMO identity workflow available in tested UI | Missing `sub_admin` Laratrust role may cause provisioning 500 | **UNVERIFIED and separate from LIVE-008.** Confirm current role invariant, seeders, controller, and actual error. |
| Center Hub Orders/Auth hypothesis | Not established as LIVE-005 by the authoritative browser report | Missing `center` guard / CenterScope fallback loop | **CLOSED (INVALID).** The 500 error in Center Hub was confirmed in Lane D as caused by the missing payment/SMS provider definitions due to skipped seeders. No auth guard modifications required. |

## Execution Progress
- [x] Baseline / evidence capture + regression freeze.
- [x] Lane A — LIVE-001 + LIVE-010 input persistence.
- [x] Lane B — LIVE-004 Session save.
- [x] Lane C — LIVE-011 Center Risk 500.
- [x] Lane D — LIVE-005 provider reference definitions.
- [ ] Lane E — District/Thana.
- [ ] Lane F — LIVE-008 sidebar navigation.
- [ ] Lane G — LIVE-007 financial UI parity.
- [ ] Lane H — Staff/SubAdmin provisioning.
- [ ] Lane I (if independently proven).
- [ ] Full local/MySQL verification.
- [ ] GitHub CI.
- [ ] Protected direct-SSH deployment.
- [ ] Independent hands-on live browser reacceptance.
