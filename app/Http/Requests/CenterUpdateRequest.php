<?php

namespace App\Http\Requests;

use App\Enums\CenterStatus;
use App\Enums\Gender;
use App\Enums\Religion;
use App\Lib\Geo;
use App\Models\Center;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class CenterUpdateRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'code' => ['required', 'string', Rule::unique('centers')->ignore($this->route('center')->id)],
            'name' => 'required|string',
            'owner_name' => 'required|string',
            'fathers_name' => 'required|string',
            'mothers_name' => 'required|string',
            'religion' => 'required|numeric|enum_value:'.Religion::class.',false',
            'gender' => 'required|numeric|enum_value:'.Gender::class.',false',
            'nationality' => 'nullable|string',
            'division' => ['required', 'numeric', Rule::in(array_keys(Geo::divisions()))],
            'district' => ['required', 'numeric', Rule::in(array_keys(Geo::districts()))],
            'upazilla' => ['required', 'numeric', Rule::in(array_keys(Geo::upazillas()))],
            'post_office' => 'nullable|string',
            'address' => 'required|string',
            'mobile' => 'required|string|max:11|min:11',
            'email' => 'nullable|email',
            'status' => 'required|numeric|enum_value:'.CenterStatus::class.',false',
            'photo' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:2048',
            'authority_signature' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:2048',
            'nid_photo' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:2048',
            'trade_license' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:2048',
            'password' => 'nullable|confirmed|min:6',
            'team_id' => 'nullable|exists:teams,id',
            'credit_enabled' => 'nullable|boolean',
            'credit_limit' => 'nullable|numeric|min:0',
            'allow_registration_without_payment' => 'nullable|boolean',
            'allow_result_without_payment' => 'nullable|boolean',
            'allow_certificate_without_payment' => 'nullable|boolean',
            'auto_restriction' => 'nullable|boolean',
        ];
    }

    public function update(Center $center)
    {
        $validated = $this->validated();
        $password = $validated['password'] ?? null;

        // Password belongs to the portal user, not the centers table.
        unset($validated['password']);

        // Normalize checkbox values so both HTML/FormData and JSON submissions
        // persist an explicit false instead of silently retaining old values.
        foreach ([
            'credit_enabled',
            'allow_registration_without_payment',
            'allow_result_without_payment',
            'allow_certificate_without_payment',
            'auto_restriction',
        ] as $field) {
            $validated[$field] = $this->boolean($field);
        }

        $updated = $center->update($validated);

        // An empty optional password must never reset an existing portal password.
        if ($password) {
            User::where('center_id', $center->id)
                ->first()?->update(['password' => Hash::make($password)]);
        }

        // Approval notifications are handled by the explicit approval flow.
        // Generic profile/financial edits must remain side-effect free.
        return $updated;
    }
}
