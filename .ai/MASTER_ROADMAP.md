# MASTER_IMPLEMENTATION_ROADMAP.md
# BDNSI — Advanced AI-Agentic Development Roadmap

> **Single master roadmap:** Use this document as the one source of truth for taking the existing BDNSI project from its current audited state to a secure, reliable, automated, scalable and AI-assisted certificate/document business platform.

## 1. FINAL OBJECTIVE

### Phase B: Finish the Existing System
**STATUS:** IMPLEMENTED AND VERIFIED

Transform the existing system into one integrated platform covering:

**Centers → Students → Registration → Documents → Pricing → Payment/Credit → Results → Certificates → Online Verification → Sales → Commission → Finance → Automation → AI Intelligence**

The final platform must be secure, multi-center/tenant-isolated, financially auditable, payment-safe, scalable, highly automated and AI-assisted.

The core commercial objective is **certificate/document sales and online verification**. Centers are B2B customers; they register students and request certificate/document processing. Different Centers may have different negotiated prices.

## 2. CURRENT BASELINE

The supplied project audit reports approximately **70–75% completion**.

Current documented stack:
- Laravel 8.x / PHP 8.2
- React 19 / Inertia.js / Vite / Tailwind
- MySQL
- Sanctum / Laratrust RBAC
- QR generation
- Hostinger VPS / GitHub

Current documented inventory:
- 35+ modules
- 5 panels: Public, Admin, Staff, Student, Centre
- 70+ React pages
- 120+ routes
- 35 models
- 40+ database tables
- 75 migrations
- 4 auth guards
- 31 PHPUnit tests passing
- 16 Playwright E2E specifications

The current system has a solid core academic lifecycle, but important security, payment, queue, notification, permission, portal and automation gaps remain.

## 3. DEVELOPMENT PRINCIPLE

Do not rebuild the application from scratch.

Use this continuous sequence:

**Audit → Secure → Stabilize → Complete Current System → Build Business Engine → Automate → Add AI → Test → Optimize → Production Harden**

For every meaningful change:

**Understand → Plan → Implement → Test → Review → Integrate**

Inspect existing code first. Reuse valid architecture. Make the smallest safe change. Preserve data. Respect authorization and Center isolation.

## 4. PHASE A — SECURITY AND STABILITY FIRST

Before major new development:

### Phase N: Advanced Reporting & Analytics (`IMPLEMENTATION`)
**Goal:** Deliver data-driven insights through rich dashboards and exportable reports.

- [x] **N1:** Interactive Dashboard (Recharts integration for revenue trends).
- [x] **N2:** Custom Report Builder (filter by date, center, student status).
- [x] **N3:** Export capabilities (CSV/PDF) for ledger and result data.
- [x] **N4:** Agent Performance Metrics (Top performing centers, credit utilization).

- Remove the unauthenticated `/live_deploy` route.
- Remove unsafe debug/test routes from production.
- Remove hardcoded SSH credentials and move secrets to secure environment configuration.
- Protect/encrypt payment gateway credentials.
- Audit authentication and authorization.
- Audit CenterScope/tenant isolation.
- Audit private document/file access.
- Strengthen sub-admin permissions.
- Configure production queue worker.
- Configure reliable logging/error monitoring.
- Establish database and file backup strategy.
- Review production environment security.
- Fix any newly discovered critical vulnerabilities before continuing.

**Exit condition:** no known P0 security issue remains and the current system can be safely tested.

## 5. PHASE B — FINISH THE EXISTING SYSTEM

Complete and verify the existing unfinished areas:

- Staff password reset
- SMS event wiring
- Payment confirmation notifications
- Production queue
- Student document rendering
- SSLCommerz IPN/callback configuration
- Production payment verification/testing
- Online examination flow if retained in scope
- Sub-admin RBAC enforcement
- Student portal document access
- Centre portal data completeness
- CI/CD
- Automated backups
- Error monitoring
- Bengali/i18n gaps
- CAPTCHA/rate limiting where appropriate
- PDF system consolidation
- Safe frontend/controller refactoring

Do not refactor for appearance alone; refactor where it improves reliability, maintainability or performance.

## 6. PHASE C — BUSINESS DOMAIN FOUNDATION

Clearly model:

- Center
- Student
- Course/Program
- Registration
- Product/Document Type
- Order
- Pricing
- Required Documents
- Payment
- Financial Ledger
- Due
- Credit
- Result
- Certificate
- Verification
- Sales Lead
- Sales Agent
- Commission
- Notification
- Audit Log

Business rules should be centralized in reusable services/policies/domain components rather than scattered across controllers.

## 7. PHASE D — CENTER-SPECIFIC PRICING

Support:

- Default product price
- Center-specific price
- Negotiated price
- Product/document-specific price
- Discount
- Effective date
- Price history
- Authorized override
- Order-level final price

When an order is created, store the final agreed price with that order. Future price changes must never alter historical orders.

Admin must be able to see current price, negotiated price, history, discount, who changed it and when.

## 8. PHASE E — REGISTRATION + PAYMENT POLICY

Keep registration and payment as separate states.

Support:

- Payment required
- Payment optional
- Paid
- Partially paid
- Unpaid
- Due
- Pending
- Failed

A registration may proceed without immediate payment only when Center/product policy permits it.

After registration, authorized users/students may receive access to Registration Card, Admit Card and ID Card. Access must be enforced server-side.

## 9. PHASE F — PAYMENT + FINANCIAL ENGINE

Track:

- Order amount
- Discount
- Payable amount
- Paid amount
- Due amount
- Payment status
- Partial payment
- Refund
- Adjustment
- Credit usage
- Commission

Payment rules:

- Never trust frontend payment status or amount.
- Verify gateway callbacks server-side.
- Match transaction/order identifiers.
- Make callbacks idempotent.
- Prevent duplicate processing.
- Use database transactions for financial state changes.
- Preserve auditable financial history.

## 10. PHASE G — CENTER CREDIT + DUE

Admin can configure per Center:

- Credit enabled
- Credit limit
- Current due
- Available credit
- Payment terms
- Allow registration without payment
- Allow result publishing without payment
- Allow certificate access without immediate payment
- Automatic restriction
- Admin override

Example:

**Credit Limit 20,000 BDT → Current Due 12,000 BDT → Available Credit 8,000 BDT**

Operational permission must never erase financial liability. Due must remain visible in Center dashboard, Admin dashboard, ledger, reports and reminders.

## 11. PHASE H — RESULT + CERTIFICATE CONTROL

Centralize rules such as:

- CanRegister
- CanActivateRegistration
- CanPublishResult
- CanAccessCertificate
- CanDownloadDocument
- CanUseCredit

Result lifecycle:

**Draft → Review → Approved → Published → Locked**

Certificate lifecycle:

**Registration → Documents → Validation → Pricing → Payment/Credit → Result → Approval → Certificate → Verification**

## 12. PHASE I — DOCUMENT MANAGEMENT

Build:

**Upload → Validate → Required-document check → Review → Approval → Processing → Secure storage → Authorized access**

Support different document requirements per product/course. Prevent unauthorized file access.

## 13. PHASE J — CERTIFICATE + ONLINE VERIFICATION

Certificate verification is a core business feature.

Each certificate should have:

- Unique certificate identity
- Verification number/code
- QR code where appropriate
- Status
- Issue date
- Audit trail

Public verification must expose only intentionally public information.

## 14. PHASE K — SALES CRM

B2B lifecycle:

**Lead → Contact → Negotiation → Price Agreement → Onboarding → First Sale → Active Center**

Track sales agent, lead source, communication, follow-up, negotiated price, orders, revenue, collection, due, conversion and customer value.

## 15. PHASE L — COMMISSION

Current business model is approximately 20%; make it configurable.

Lifecycle:

**Sale → Earned → Payable → Paid**

Track agent, order, sale amount, commission rate, commission amount, paid and remaining amounts. Keep commission separate from Center dues and company revenue.

## 16. PHASE M — AUTOMATION

Convert repetitive workflows into reliable event-driven automation.

Examples:

**Payment verified → payment update → ledger → registration → access → document generation → notification → dashboard**

**Result published → certificate workflow → verification → notification**

**Due created → balance → credit calculation → reminder → notification**

**Credit limit reached → risk status → configured restriction → Admin/Center alert**

Critical financial and academic decisions must remain deterministic and auditable.

## 17. PHASE N — ADVANCED REPORTING (✅ VERIFIED)

Provide reports for:

- Revenue (✅ implemented)
- Collection (✅ implemented)
- Due (✅ implemented)
- Overdue
- Center sales (✅ implemented)
- Certificate sales
- Product demand
- Center performance
- Sales agent performance (✅ implemented)
- Commission (✅ implemented)
- Payment history
- Credit exposure (✅ implemented)
- Result publishing
- Certificate issuance
- Verification (✅ implemented)

Respect authorization and tenant boundaries.

## 18. PHASE O — AI DOCUMENT INTELLIGENCE

Only after deterministic document workflows are stable.

AI may assist with:

- OCR
- Document classification
- Data extraction
- Missing-document detection
- Name/DOB/course mismatch
- Duplicate detection
- Cross-document consistency

AI must not independently approve or issue academic credentials.

## 19. PHASE P — AI SALES INTELLIGENCE

Add:

- Lead scoring
- Lead qualification
- Conversation summaries
- Follow-up recommendations
- Customer classification
- Opportunity detection
- Suggested next action

## 20. PHASE Q — AI PRICING INTELLIGENCE

Analyze Center history, order volume, product, negotiated prices, discounts, payment behavior and customer value.

Provide:

- Suggested price
- Historical range
- Suggested discount
- Customer value
- Risk-aware recommendation

AI must never silently override authorized pricing.

## 21. PHASE R — AI FINANCIAL INTELLIGENCE

The owner should be able to ask:

- Which Centers generate the most revenue?
- Which Centers owe the most?
- Which Centers are growing/declining?
- Which agents perform best?
- Which products sell most?
- What is expected collection?
- Where is financial risk?

Answers must come from actual authorized system data.

## 22. PHASE S — AI RISK / ANOMALY DETECTION

Detect unusual:

- Certificate volume
- Order volume
- Pricing
- Payment behavior
- Duplicate students/documents
- Center activity

AI creates alerts/recommendations. It must not autonomously delete data, revoke certificates, punish Centers or alter financial records.

## 23. PHASE T — OWNER COMMAND CENTER

Create one business dashboard showing:

**Money:** revenue, collection, due, overdue, credit exposure

**Centers:** new, active, inactive, high-value, high-risk

**Certificates:** orders, pending, published, blocked, verification

**Sales:** leads, conversions, agent sales, commission

**Operations:** documents, registrations, results, payments

**AI:** insights, alerts, recommendations, anomalies

The owner should understand the entire business from one place.

## 24. PHASE U — AI AGENTIC DEVELOPMENT

Use a controlled internal agent team when useful:

- Orchestrator
- Codebase/Architecture Agent
- Backend Agent
- Frontend Agent
- Database Agent
- Security Agent
- QA Agent
- DevOps Agent
- Automation Agent
- AI Agent
- Documentation Agent

The Orchestrator coordinates dependencies. Agents must inspect existing code before editing and must not blindly overwrite overlapping work.

## 25. SAFE DEVELOPMENT LOOP

Before changing code:

- Inspect affected files.
- Inspect related models/routes/controllers/components.
- Check CenterScope.
- Check permissions.
- Check database impact.
- Check payment/financial impact.
- Check existing tests.

After changing code:

- Run relevant tests.
- Run regression tests for critical changes.
- Build frontend.
- Verify routes.
- Verify database behavior.
- Verify authorization.
- Verify Center isolation.
- Verify the complete user workflow.

A feature is complete only when the end-to-end behavior works.

## 26. ARCHITECTURE CLEANUP + PERFORMANCE

After correctness is stable:

- Split oversized React components.
- Extract oversized controllers into services.
- Consolidate duplicate PDF systems.
- Replace redundant DataTables/jQuery where safe.
- Remove N+1 queries.
- Add appropriate indexes.
- Optimize dashboard queries.
- Add caching where useful.
- Use queues for heavy PDF/SMS work.
- Consider Redis only when infrastructure supports it.
- Preserve Laravel + Inertia unless a real requirement proves otherwise.
- Do not introduce microservices or a separate REST API without a real need.

## 27. CI/CD + OPERATIONS

Establish:

**Code → Tests → Build → Security checks → Staging → Smoke test → Production**

Also implement:

- Automated database backups
- File/document backups
- Restore testing
- Error monitoring
- Queue monitoring
- Health checks
- Rollback procedure
- Environment separation
- Secure secret management

## 28. FINAL END-TO-END TESTING

Verify complete journeys:

### Paid Center
Center → Student → Registration → Payment → Verification → Result → Certificate

### Credit Center
Center → Registration → Due → Authorized Result → Certificate → Due tracking

### Student
Login → Registration → Documents → Result → Certificate

### Public
Certificate/Result → Verification → Safe public information

### Sales
Lead → Negotiation → Center → Sale → Commission

### Finance
Order → Payment → Ledger → Due → Credit → Collection → Commission

Every critical journey must pass end-to-end.

## 29. FINAL ACCEPTANCE

The project is complete only when:

- Critical security issues are resolved.
- Existing valid functionality still works.
- Center isolation is verified.
- Payment is server-verified and tested.
- Financial records are auditable.
- Center-specific pricing works.
- Registration/payment policy works.
- Credit/due works.
- Result rules work.
- Certificate generation works.
- Online verification works.
- Sales and commission work.
- Notifications and queues work.
- Current incomplete features are finished.
- Automated tests cover critical workflows.
- CI/CD and backups exist.
- AI features operate safely on top of deterministic business rules.
- Owner dashboard provides a complete business view.
- Documentation matches the real implementation.

## 30. GOLDEN RULES

1. Do not rebuild the project from scratch.
2. Do not destroy existing data.
3. Fix verified critical problems before adding advanced features.
4. Never bypass security for convenience.
5. Never trust frontend financial values.
6. Never trust client-supplied Center IDs.
7. Never allow Center-to-Center data leakage.
8. Never silently change historical financial records.
9. Never let AI autonomously issue/approve credentials.
10. Do not create duplicate architecture unnecessarily.
11. Do not continue through a critical regression.
12. Keep documentation synchronized with actual code.
13. Prefer reliable, testable automation.
14. Use deterministic rules for money, permissions, results and certificates.
15. Use AI for intelligence, recommendations, detection and assistance—not uncontrolled authority.

## 31. EXECUTION COMMAND

Use this document as the **single master implementation roadmap**.

Start from the actual current project state.

Determine the safest dependency order automatically.

**Preserve what is correct. Fix what is broken. Complete what is missing. Upgrade what needs to be advanced. Automate repetitive operations. Add AI only after the deterministic business system is reliable. Test continuously. Keep the implementation and documentation synchronized.**

The final result must be a stable, secure, scalable, automated and AI-assisted BDNSI certificate/document business platform.

**Do not create a conflicting second roadmap unless the owner explicitly approves a new business requirement.**
