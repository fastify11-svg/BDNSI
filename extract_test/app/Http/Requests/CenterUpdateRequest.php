<?php

namespace App\Http\Requests;

use App\Enums\CenterStatus;
use App\Enums\Gender;
use App\Enums\Religion;
use App\Lib\Geo;
use App\Lib\Helper;
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
            'photo' => 'nullable|image',
            'authority_signature' => 'nullable|image',
            'nid_photo' => 'nullable|image',
            'trade_license' => 'nullable|image',
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

        $validated['code'] = $validated['code'] ?? random_int(111111, 999999);

        if (User::where('center_id', $center->id)->count() > 0) {
            User::where('center_id', $center->id)->first()->update(['password' => Hash::make($this->password)]);
        }

        if ($center->status->is(CenterStatus::Pending())) {
            $message = 'Congratulations!! Dear, Your institute has been approved successfully by YTTC. Your institute Email: '.$center->email.' and password: '.$validated['password'].'. Please login to your institute portal here: '.route('login').'. Thanks for staying with YTTC.';
            Helper::sendSms($center->mobile, $message);
        }

        return $center->update($validated);
    }
}
