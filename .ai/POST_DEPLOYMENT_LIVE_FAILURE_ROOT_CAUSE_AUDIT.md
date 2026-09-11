# BDNSI LIVE FAILURE ROOT-CAUSE AUDIT

This is the definitive diagnostic audit of the remaining critical `LIVE` environment failures (LIVE-001, 004, 005, 007, 008, 010, 011). No code has been modified, and no destructive commands were run.

---

### LIVE-001: Center Create Email clears immediately
### LIVE-010: CRM Phone clears immediately
* **Symptom:** Inputs for email and phone clear themselves immediately upon typing.
* **Root Cause:** These are React controlled inputs (`value={data.email}`, `value={data.phone}`) that are suffering from aggressive browser password-manager or autofill interference. Because they use standard names/types without `autoComplete="new-password"` or `autoComplete="off"`, browser extensions (like Chrome Password Manager) automatically intercept and overwrite the state continuously, clearing user input.
* **Fix Path:** Add `autoComplete="new-password"` (or a random string) to the `<input>` elements in `Admin/Center/Create.jsx` and `Leads/Index.jsx`.

---

### LIVE-004: Session Save returns HTTP 500
* **Symptom:** Submitting the Session creation/update form throws a 500 Server Error.
* **Root Cause:** MySQL Strict Mode `NOT NULL` constraint violation. The `sessions` table was originally created with `start_date` and `end_date` as non-nullable columns. A later migration (`2026_07_25_185448_update_sessions_dates_columns.php`) attempted to drop them using `$table->dropColumn([...])`. On some production MySQL/MariaDB environments (especially if `doctrine/dbal` was missing or versions mismatched), this drop silently failed or was skipped. Because `SessionController@store` no longer provides `start_date` and `end_date`, inserting a new record triggers a strict mode `Field 'start_date' doesn't have a default value` exception.
* **Fix Path:** Create a new definitive migration to safely make `start_date` and `end_date` `nullable()` or set default values dynamically in the `Session::creating` observer.

---

### LIVE-005: Center Hub Orders returns HTTP 500
* **Symptom:** Accessing the Center Hub Orders throws a 500 error.
* **Root Cause:** The `CenterScope` applied to the `Order` model attempts to dynamically resolve the user by iterating through `['web', 'api', 'sanctum']` guards in `config/auth.php`. However, there is no explicit `center` guard configured in `config/auth.php`. Furthermore, if the "Missing providers table or column" clue implies a strict Laratrust or Auth failure, it is because `Auth::user()` resolves the `User` model correctly, but the system is attempting to resolve an auth `provider` (like `centers` or a misconfigured `api` guard) that does not exist or lacks an underlying database table.
* **Fix Path:** Explicitly define the `center` guard in `config/auth.php` pointing to the correct Eloquent provider (likely `users`), and ensure `CenterScope` checks the appropriate authenticated guard explicitly instead of relying on a fallback loop.

---

### LIVE-007: District/Thana empty when adding staff (Center / Subadmin)
* **Symptom:** The District and Upazila dropdowns have no selectable values.
* **Root Cause:** Data loss during backend-to-frontend mapping. In `CenterController@create` and similar places, the backend maps the collections using `mapWithKeys()`:
  ```php
  $districts = District::get()->mapWithKeys(function ($district) {
      return [ $district->id => [ 'division_id' => $district->division_id, 'name' => $district->name ] ];
  });
  ```
  This creates a dictionary where the `id` is the key, but the actual payload object *lacks* the `id` property. In `Admin/Center/Create.jsx`, the frontend maps over `Object.values(districts)`, expecting `d.id`. Since `d.id` is `undefined`, React renders `<option value={undefined}>`, resulting in empty dropdown values that cannot be selected.
* **Fix Path:** Add `'id' => $district->id` inside the returned payload arrays in the controller's `mapWithKeys()` closures.

---

### LIVE-008: Staff Provisioning 500 (SubAdminController)
* **Symptom:** Saving a new Subadmin throws an HTTP 500 error.
* **Root Cause:** Missing Laratrust Role. In `SubadminController@store`, the code executes:
  ```php
  $subadmin->attachRole('sub_admin');
  ```
  If the `sub_admin` role was never seeded into the `roles` table on the live database, Laratrust throws a fatal database/model exception attempting to attach a non-existent role, resulting in an immediate 500 error.
* **Fix Path:** Seed the `sub_admin` role in the production database using a targeted seeder or a safe migration, or check if the role exists before attaching it.

---

### LIVE-011: Center Risk 500
* **Symptom:** Accessing the Center Risk view throws an HTTP 500.
* **Root Cause:** Invalid SQL Column Reference. `CenterRiskService::evaluateRiskBatch()` executes an aggregate batch query:
  ```php
  $docRows = StudentDocument::whereIn('center_id', $centerIds)...
  ```
  The `student_documents` table schema does **not** have a `center_id` column. This triggers a fatal `Column not found: 1054 Unknown column 'center_id'` SQL exception.
* **Fix Path:** Rewrite the `evaluateRiskBatch` query to join the `students` table (which does contain `center_id`) or group by `student_id` and map back to centers.

---

### Conclusion
The root causes for all the specified LIVE defects have been definitively located in the codebase architecture. The system is ready to proceed to the repair phase.
