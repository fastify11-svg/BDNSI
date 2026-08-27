# 08 — Database Architecture

## Overview

- **Engine**: MySQL (production) / SQLite (testing)
- **ORM**: Laravel Eloquent
- **Total Migrations**: 75 files (2011–2026)
- **Estimated Tables**: 40+

---

## Core Authentication Tables

### `admins`
| Column | Type | Notes |
|---|---|---|
| id | bigint PK | |
| name | varchar | |
| email | varchar UNIQUE | |
| password | varchar | bcrypt hashed |
| avatar | varchar nullable | path to image |
| email_verified_at | timestamp nullable | |
| remember_token | varchar nullable | |
| created_at / updated_at | timestamp | |

**Relations**: Laratrust roles/permissions via `role_user`, `permission_user`

### `users` (Centre Users)
| Column | Type | Notes |
|---|---|---|
| id | bigint PK | |
| name | varchar | |
| email | varchar UNIQUE | |
| password | varchar | bcrypt |
| phone | varchar nullable | |
| center_id | FK → centers | tenant scoping |
| avatar | varchar nullable | |
| email_verified_at | timestamp nullable | |
| remember_token | varchar nullable | |
| created_at / updated_at | timestamp | |

### `teams` (Staff/Agents)
| Column | Type | Notes |
|---|---|---|
| id | bigint PK | |
| name | varchar | Display name |
| designation | varchar nullable | |
| email | varchar UNIQUE | Login email |
| password | varchar | bcrypt |
| phone | varchar nullable | |
| referral_code | varchar UNIQUE | Auto-generated `STF-XXXXXX` |
| image | varchar nullable | |
| description | text nullable | |
| status | varchar nullable | |
| is_active | boolean | default true |
| facebook_link / twitter_link / linkedin_link | varchar nullable | |
| order_index | int nullable | Sort order |
| bn_name / ar_name | varchar nullable | Multilingual |
| bn_designation / ar_designation | varchar nullable | |
| bn_description / ar_description | text nullable | |
| created_at / updated_at | timestamp | |

**Used as**: Staff login model (guard: `staff`)

---

## Academic Tables

### `centers`
| Column | Type | Notes |
|---|---|---|
| id | bigint PK | |
| code | varchar nullable | Auto: `178XXXX` if not set |
| name | varchar | Centre name |
| owner_name | varchar nullable | |
| director_name | varchar nullable | |
| director_image | varchar nullable | |
| fathers_name / mothers_name | varchar nullable | |
| religion | varchar nullable | enum cast |
| gender | varchar nullable | enum cast |
| division / district / upazilla / post_office | varchar nullable | Location |
| address / center_location | varchar nullable | |
| center_logo | varchar nullable | |
| director_photo / director_signature | varchar nullable | |
| mobile / email | varchar nullable | |
| photo / authority_signature | varchar nullable | |
| nid_photo / nid_back_photo | varchar nullable | |
| status | varchar | CenterStatus enum |
| team_id | FK → teams nullable | Assigned to staff |
| created_at / updated_at | timestamp | |

### `subjects` (Courses)
| Column | Type | Notes |
|---|---|---|
| id | bigint PK | |
| name | varchar | Course name |
| code | varchar nullable | Course code |
| type | varchar nullable | |
| details | text nullable | |
| team_id | FK → teams nullable | Staff-owned course |
| created_at / updated_at | timestamp | |

### `sessions`
| Column | Type | Notes |
|---|---|---|
| id | bigint PK | |
| name | varchar | Session label (e.g. Jan 2025) |
| duration | int nullable | In months |
| exam_date | date nullable | |
| result_published_date | date nullable | |
| status | varchar nullable | SessionStatus enum |
| team_id | FK → teams nullable | Staff-owned session |
| created_at / updated_at | timestamp | |

**Computed**: `course_type` (Regular/Short/Diploma based on duration)

### `students`
| Column | Type | Notes |
|---|---|---|
| id | bigint PK | |
| center_id | FK → centers | Tenant key |
| session_id | FK → sessions | |
| subject_id | FK → subjects | |
| team_id | FK → teams nullable | Recruited by staff |
| name | varchar | |
| fathers_name / mothers_name | varchar nullable | |
| roll | varchar | Auto-generated |
| registration | varchar | Auto-generated |
| passport | varchar nullable | |
| date_of_birth | date nullable | |
| gender | varchar | Gender enum |
| blood_group | varchar nullable | BloodGroup enum |
| religion | varchar nullable | Religion enum |
| present_address / permanent_address | text nullable | |
| phone | varchar nullable | |
| email | varchar nullable | Student login email |
| guardian_name | varchar nullable | |
| nid_or_birth | varchar nullable | |
| qualification | varchar nullable | |
| course_type | varchar nullable | CourseType enum |
| course_duration | int nullable | |
| picture | varchar nullable | |
| status | varchar | StudentStatus enum |
| exam_date | date nullable | |
| result_publised | datetime nullable | |
| due_amount | decimal nullable | |
| paid_amount | decimal nullable | |
| payment_status | varchar nullable | |
| password | varchar nullable | Student portal password |
| remember_token | varchar nullable | |
| created_at / updated_at | timestamp | |

**Global Scope**: CenterScope (auto-filters to center_id when web user)

### `results`
| Column | Type | Notes |
|---|---|---|
| id | bigint PK | |
| student_id | FK → students | One-to-one |
| written | int | Marks |
| practical | int | Marks |
| viva | int | Marks |
| certificate | varchar nullable | Certificate path/number |
| created_at / updated_at | timestamp | |

**Computed**: `gpa()` dynamically from GradeScale rules

**Global Scope**: CenterScope (via student relationship)

### `semester_results`
| Column | Type | Notes |
|---|---|---|
| id | bigint PK | |
| student_id | FK → students | |
| semester_name | varchar | e.g. "1st Semester" |
| semester_gpa | decimal(8,2) | |
| subjects_data | json | Array of subject marks |
| created_at / updated_at | timestamp | |

---

## Examination Tables

### `exams`
| Column | Type | Notes |
|---|---|---|
| id | bigint PK | |
| name | varchar | Exam title |
| session_id | FK → sessions nullable | |
| subject_id | FK → subjects nullable | |
| status | varchar | ExamStatus enum |
| created_at / updated_at | timestamp | |

### `quations` (Questions — note typo in table name)
| Column | Type | Notes |
|---|---|---|
| id | bigint PK | |
| exam_id | FK → exams | |
| question | text | |
| option_a / option_b / option_c / option_d | varchar | MCQ options |
| answer | varchar | Correct option |
| marks | int nullable | |
| created_at / updated_at | timestamp | |

---

## Financial Tables

### `payments`
| Column | Type | Notes |
|---|---|---|
| id | bigint PK | |
| student_id | FK → students | |
| amount | decimal | |
| payment_type | varchar nullable | |
| payment_date | date nullable | |
| note | text nullable | |
| status | varchar nullable | |
| created_at / updated_at | timestamp | |

> ⚠️ This is a manual admin-recorded payment. Separate from online `transactions`.

### `transactions` (Online Payments)
| Column | Type | Notes |
|---|---|---|
| id | bigint PK | |
| payable_type | varchar | Polymorphic (Student/Center/User) |
| payable_id | bigint | |
| trx_id | varchar UNIQUE | Gateway transaction ID |
| amount | decimal(8,2) | |
| currency | varchar | default BDT |
| gateway | varchar | 'bkash' / 'sslcommerz' |
| status | varchar | pending/success/failed |
| purpose | varchar nullable | |
| gateway_response | json nullable | Full gateway API response |
| created_at / updated_at | timestamp | |

### `payment_gateways`
| Column | Type | Notes |
|---|---|---|
| id | bigint PK | |
| name | varchar | Display name |
| slug | varchar UNIQUE | 'bkash' / 'sslcommerz' |
| is_active | boolean | Toggle gateway |
| is_sandbox | boolean | Test mode flag |
| store_id / store_password | varchar nullable | SSLCommerz credentials |
| app_key / app_secret / username / password | varchar nullable | bKash credentials |
| created_at / updated_at | timestamp | |

### `sms_gateways`
| Column | Type | Notes |
|---|---|---|
| id | bigint PK | |
| name | varchar | |
| driver | varchar | 'reve' / 'twilio' |
| is_active | boolean | |
| config | json | Driver-specific credentials |
| created_at / updated_at | timestamp | |

### `team_sales_targets`
| Column | Type | Notes |
|---|---|---|
| id | bigint PK | |
| team_id | FK → teams | |
| month | varchar | e.g. '2026-08' |
| target_students | int | |
| target_revenue | decimal | |
| created_at / updated_at | timestamp | |

---

## Content / CMS Tables

### `site_configs` (Single Row)
| Column | Type | Notes |
|---|---|---|
| id | bigint PK | |
| portal_name | varchar | |
| tagline | varchar | |
| rjsc_id | varchar nullable | RJSC registration number |
| header_logo / main_logo / favicon | varchar | Image paths |
| hotline_phone / official_email | varchar | |
| headquarter_address | text nullable | |
| facebook_url / youtube_url / twitter_url / linkedin_url | varchar nullable | |
| marquee_notice | text nullable | Scrolling notice |
| about_short / about_full | text nullable | |
| terms_conditions / privacy_policy | text nullable | |
| footer_copyright | varchar nullable | |
| toggle_* | varchar | Feature flags (on/off) |
| primary_color / secondary_color / accent_color | varchar | Theme colors |
| footer_top_bg_image / footer_side_bg_image | varchar nullable | |
| footer_disclaimer_text / footer_planning_text / footer_tech_support_text | text nullable | |
| toggle_student_portal | varchar | Student portal on/off |
| created_at / updated_at | timestamp | |

### `sliders`
| Column | Type | Notes |
|---|---|---|
| id | bigint PK | |
| title | varchar | |
| subtitle | varchar nullable | |
| image | varchar nullable | |
| type | varchar | SliderType enum |
| video_url | varchar nullable | |
| button_text / button_url | varchar nullable | |
| is_active | boolean | |
| sort_order | int nullable | |
| created_at / updated_at | timestamp | |

### `notices`
| Column | Type | Notes |
|---|---|---|
| id | bigint PK | |
| title | varchar | |
| description | text nullable | |
| lang | varchar | 'en' / 'bn' / 'ar' |
| is_active | boolean | |
| created_at / updated_at | timestamp | |

### `contact_us`
| Column | Type | Notes |
|---|---|---|
| id | bigint PK | |
| name / email / phone | varchar | |
| message | text | |
| is_seen | boolean | Admin read status |
| created_at / updated_at | timestamp | |

### `config_dictionaries`
| Column | Type | Notes |
|---|---|---|
| id | bigint PK | |
| key | varchar UNIQUE | |
| value | text | |
| created_at / updated_at | timestamp | |

### `translations`
| Column | Type | Notes |
|---|---|---|
| id | bigint PK | |
| key | varchar | |
| en / bn / ar | text nullable | |
| created_at / updated_at | timestamp | |

---

## Document System Tables

### `document_templates`
| Column | Type | Notes |
|---|---|---|
| id | bigint PK | |
| name | varchar | Template name |
| type | varchar | id_card / certificate / marksheet |
| background_image | varchar nullable | |
| background_color | varchar nullable | |
| width / height | int | Canvas dimensions (px) |
| status | varchar | active/inactive |
| is_builtin | boolean | System built-in template |
| blade_view | varchar nullable | Blade template path |
| created_at / updated_at | timestamp | |

### `document_fields`
| Column | Type | Notes |
|---|---|---|
| id | bigint PK | |
| document_template_id | FK → document_templates | |
| label | varchar | Field name |
| type | varchar | text/image/qrcode |
| x / y | decimal | Position on canvas |
| width / height | decimal | Dimensions |
| font_size | int nullable | |
| font_color | varchar nullable | |
| font_weight | varchar nullable | |
| font_family | varchar nullable | |
| text_align | varchar nullable | |
| data_key | varchar nullable | Maps to student data field |
| created_at / updated_at | timestamp | |

---

## Licensing & Verification Tables

### `licenses`
| Column | Type | Notes |
|---|---|---|
| id | bigint PK | |
| cnic | varchar | ID number |
| name | varchar | Holder name |
| father_name | varchar nullable | |
| city / state | varchar nullable | |
| image | varchar nullable | |
| license_number | varchar UNIQUE | |
| issue_date / valid_from / valid_to | datetime | |
| credential_type | varchar | Vocational/Professional/etc. |
| created_at / updated_at | timestamp | |

---

## Other Tables

### `grade_scales`
| Column | Type | Notes |
|---|---|---|
| id | bigint PK | |
| course_type | int | 0=Regular, 1=Short, 2=Diploma |
| max_marks | int | Total marks cap |
| rules | json | Array of {min_percent, max_percent, grade_name} |
| created_at / updated_at | timestamp | |

### `whatapp_links`
| Column | Type | Notes |
|---|---|---|
| id | bigint PK | |
| phone | varchar | WhatsApp number |
| message | text | Pre-filled message |
| created_at / updated_at | timestamp | |

### `youtube_videos`
| Column | Type | Notes |
|---|---|---|
| id | bigint PK | |
| title | varchar nullable | |
| url | varchar | YouTube URL |
| is_active | boolean | |
| created_at / updated_at | timestamp | |

### `footer_links`
| Column | Type | Notes |
|---|---|---|
| id | bigint PK | |
| label / url | varchar | |
| group | varchar nullable | Footer column group |
| is_active | boolean | |
| sort_order | int nullable | |
| created_at / updated_at | timestamp | |

### `footer_partner_logos`
| Column | Type | Notes |
|---|---|---|
| id | bigint PK | |
| name | varchar nullable | |
| image | varchar | |
| url | varchar nullable | |
| is_active | boolean | |
| created_at / updated_at | timestamp | |

### Laratrust Tables
- `roles` — RBAC roles
- `permissions` — RBAC permissions
- `role_user` — pivot (admin↔roles)
- `permission_user` — pivot (admin↔permissions)
- `permission_role` — pivot (role↔permissions)

---

## ER Relationship Summary

```
Team (Staff)
  ├── has many Centers        (team_id FK)
  ├── has many Students       (team_id FK)
  ├── has many Subjects       (team_id FK)
  ├── has many Sessions       (team_id FK)
  └── has many TeamSalesTargets

Center
  ├── belongs to Team
  ├── has many Users          (center users)
  └── has many Students

Session
  └── belongs to Team

Subject
  └── belongs to Team

Student
  ├── belongs to Center       (tenant scoped)
  ├── belongs to Session
  ├── belongs to Subject
  ├── belongs to Team
  ├── has one Result
  ├── has many SemesterResults
  └── morphMany Transactions  (payable)

Result
  └── belongs to Student

SemesterResult
  └── belongs to Student

Transaction
  └── morphTo (Student or Center or User)

DocumentTemplate
  └── has many DocumentFields

Exam
  └── has many Quations (Questions)
```
