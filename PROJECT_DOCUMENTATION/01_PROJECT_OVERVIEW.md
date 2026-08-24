# 01 — Project Overview

## Project Identity

| Field | Value |
|---|---|
| **Project Name** | BDNSI — Bangladesh National Skills Institute Management System |
| **Live Domain** | nenobet.live (Hostinger VPS: 145.79.212.19) |
| **GitHub** | https://github.com/fastify11-svg/BDNSI |
| **Architecture** | Monolithic Laravel 8 + React (Inertia.js) SPA |
| **Completion Estimate** | ~70-75% |
| **Production Status** | Live (Hostinger shared + VPS) |

---

## Core Purpose

BDNSI is a **multi-tenant Institute Management System** designed for vocational training institutes in Bangladesh. It combines:

1. **Public-facing website** — course listings, result verification, notice board, contact form, verified centres.
2. **Admin Panel** — superadmin and sub-admin management of every data entity.
3. **Staff Portal** — decentralised course/session/student management for individual staff agents.
4. **Student Portal** — self-service academic portal for enrolled students.
5. **Centre/User Portal** — registered training centres manage their own students.

The system supports three course types:
- **Regular** (1–3 months)
- **Short Course** (4–24 months)
- **Diploma** (25–48 months)

Each has its own mark limits, grading scales, and document templates.

---

## Business Context

The platform enables:
- Training centres (offline agents) to enrol students
- Admins to manage results, exams, certificates
- Students to access their academic documents online
- Staff (sales agents) to be tracked via a KPI / referral system
- Online payment collection via bKash and SSLCommerz

---

## Current Completion Status (High-Level)

| Area | Status |
|---|---|
| Public Frontend | 🟢 85% Complete |
| Admin Panel | 🟢 80% Complete |
| Student Portal | 🟡 65% Complete |
| Staff Portal | 🟡 60% Complete |
| Centre/User Portal | 🟡 55% Complete |
| Payment System | 🟡 70% — integrated, not battle-tested |
| SMS Notifications | 🔴 30% — drivers exist, not fully wired |
| Online Examination | 🔴 40% — models + UI exist, flow incomplete |
| Document Builder | 🟢 75% — template engine + bulk PDF done |
| Laravel Telescope | 🟢 100% — just installed and secured |
| CI/CD Pipeline | 🟡 60% — SFTP + SSH scripts, no GitHub Actions |
