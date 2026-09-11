# BDNSI FINAL FORM-STATE ROOT CAUSE AUDIT

## 1. Executive Summary
A comprehensive audit of the React/Inertia component tree, state management, and form lifecycle has been conducted for `/admin/center/create`, `/admin/student/create`, and `/admin/leads`. The data loss issues are **not caused by a single unified bug**, but rather three distinct, interrelated architectural defects in how state and Inertia lifecycle are handled across different components. 

Password-manager interference was analyzed but ruled out as the primary root cause for Center and Student components based on hard code evidence.

---

## 2. Component Trace & Root Cause Analysis

### A. Center Registration (`/admin/center/create`)
**Reported Issue:** Mobile Phone and Email Address lose entered value.
**Trace Path:**
1. **State:** Uses raw `useState({ mobile: '', email: '' })`
2. **Binding:** `value={form.mobile}`, `value={form.email}`
3. **onChange:** 
   - Mobile: `onChange={e => setForm({ ...form, mobile: e.target.value, phone: e.target.value })}`
   - Email: `onChange={e => setForm({ ...form, email: e.target.value })}`
   - Division (Safe example): `setForm(prev => ({ ...prev, division: divId }))`

**Root Cause (Stale Closure Batching):** 
The text input handlers utilize the direct closure state (`{ ...form }`) rather than functional state updates (`prev => ({...prev})`). If multiple fields are rapidly populated (e.g., via browser autofill or script batching), React batches the state updates within the same render cycle. The subsequent `onChange` events capture the *stale initial state* of `form`, causing the last updated field to overwrite and erase the data of previously filled fields in that batch.

### B. Student Registration (`/admin/student/create`)
**Reported Issue:** Mobile Number, DOB, and selected Photo do not persist.
**Trace Path:**
1. **State:** Uses `useState({ phone: '', date_of_birth: '', picture: null })`
2. **onChange:** 
   - Phone: `onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}`
   - DOB: `onChange={e => setForm(prev => ({ ...prev, date_of_birth: e.target.value }))}`
   - Photo: `onChange={handleFileChange}` -> `setForm(prev => ({ ...prev, picture: file }))`
3. **Submission:** `Inertia.post(getUrl('/admin/student'), payload, { onFinish: ... })`

**Root Cause (Missing Inertia State Preservation):** 
Unlike `Center/Create` which uses `preserveState: true`, the `Student/Create` submission call *omits* the `preserveState` directive. When the form is submitted and encounters a backend validation error (e.g., a required field is missed, or the photo size exceeds 2MB), Inertia returns a 422 Unprocessable Entity response and forces a full component remount. This completely destroys the React `useState` payload, reverting all manually entered fields (including the File object) back to their empty initial states.

### C. Leads CRM (`/admin/leads`)
**Reported Issue:** Phone loses entered value.
**Trace Path:**
1. **State:** Uses Inertia's `useForm({ phone: '' })`
2. **onChange:** `onChange={e => setData('phone', e.target.value)}`
3. **Submission:** Uses `preserveState: true`.
4. **Attribute:** `autoComplete="new-password"` is attached to the Phone input.

**Root Cause (Password Manager Hijacking via `new-password`):** 
The implementation here is structurally sound (`useForm` protects against stale closures, and `preserveState` protects against validation reloads). The data loss here is exclusively tied to the `autoComplete="new-password"` attribute. While intended to disable autofill, this attribute aggressively signals password managers (like Chrome Autofill or LastPass) to treat the field as a secure credential. Consequently, the browser may unilaterally clear, suppress, or overwrite the value upon modal interaction or form submission to prevent the "password" from being exposed in a non-standard login context.

---

## 3. Comparative Matrix (Why Nearby Fields Persist)

| Component | Failing Field | Working Field | Reason Working Field Persists |
|---|---|---|---|
| **Center** | Mobile, Email | Division, Name | `Division` uses functional update `prev =>`. `Name` survives if it's the last discrete input touched, or isn't part of an autofill batch. |
| **Student** | Phone, DOB, Photo | Name, Father's Name | `Name` and `Father's Name` are likely prefilled by `SmartScanner` OCR state injection, whereas Phone/DOB/Photo are manually entered post-scan. When the page reloads on validation error, users notice the manually entered data vanishing. |
| **Leads** | Phone | Name, Status | `Name` lacks the `autoComplete="new-password"` attribute, preventing password manager interception during submission. |

## 4. Required Remediation (For Next Phase)
1. Convert all `setForm({...form})` calls in `Center/Create.jsx` to `setForm(prev => ({...prev}))`.
2. Append `preserveState: true` to the `Inertia.post` configuration in `Student/Create.jsx`.
3. Remove `autoComplete="new-password"` from non-password fields like `phone` in `Leads/Index.jsx` and `Center/Create.jsx`, and replace with `autoComplete="off"` or randomized `name` attributes if strict autofill blocking is required.
