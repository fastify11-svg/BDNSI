<?php

namespace App\Http\Requests;

use App\Enums\CenterStatus;
use App\Lib\Image;
use App\Models\Center;
use Illuminate\Foundation\Http\FormRequest;

class CenterStoreRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'name' => $this->name ?? $this->center_name,
            'owner_name' => $this->owner_name ?? $this->director_name ?? $this->proprietor_name,
            'mobile' => $this->mobile ?? $this->phone,
        ]);

        if (! $this->hasFile('center_logo') && $this->hasFile('logo')) {
            $this->files->set('center_logo', $this->file('logo'));
        }
        if (! $this->hasFile('director_photo') && $this->hasFile('photo')) {
            $this->files->set('director_photo', $this->file('photo'));
        }
        if (! $this->hasFile('director_signature') && $this->hasFile('signature')) {
            $this->files->set('director_signature', $this->file('signature'));
        }
    }

    public function rules()
    {
        return [
            'name' => 'required|string',
            'owner_name' => 'required|string',
            'fathers_name' => 'nullable|string',
            'mothers_name' => 'nullable|string',
            'religion' => 'nullable',
            'gender' => 'nullable',
            'division' => 'nullable',
            'district' => 'nullable',
            'upazilla' => 'nullable',
            'post_office' => 'nullable|string',
            'address' => 'required|string',
            'center_location' => 'required|string',
            'mobile' => 'nullable|string',
            'phone' => 'nullable|string',
            'email' => 'required|email',
            'center_logo' => 'required|image|mimes:jpeg,jpg,png,webp|max:2048',
            'director_photo' => 'required|image|mimes:jpeg,jpg,png,webp|max:2048',
            'director_signature' => 'nullable|mimes:png|max:2048',
            'photo' => 'nullable',
            'director_image' => 'nullable',
            'authority_signature' => 'nullable',
            'nid_photo' => 'nullable',
            'nid_back_photo' => 'nullable',
            'team_id' => 'nullable|exists:teams,id',
        ];
    }

    public function store($status = null)
    {
        $validated = $this->validated();

        $validated['mobile'] = $validated['mobile'] ?? $validated['phone'] ?? '01711000000';
        $validated['fathers_name'] = $validated['fathers_name'] ?? 'N/A';
        $validated['mothers_name'] = $validated['mothers_name'] ?? 'N/A';
        $validated['division'] = $validated['division'] ?? 1;
        $validated['district'] = $validated['district'] ?? 1;
        $validated['upazilla'] = $validated['upazilla'] ?? 1;
        $validated['religion'] = $validated['religion'] ?? 1;
        $validated['gender'] = $validated['gender'] ?? 1;

        if ($this->hasFile('center_logo')) {
            $validated['center_logo'] = Image::storeFile($this->file('center_logo'), 'center/logo');
        }

        if ($this->hasFile('director_photo')) {
            $validated['director_photo'] = Image::storeFile($this->file('director_photo'), 'center/photo');
            $validated['director_image'] = $validated['director_photo'];
            $validated['photo'] = $validated['director_photo'];
        }

        if ($this->hasFile('director_signature')) {
            $validated['director_signature'] = Image::storeFile($this->file('director_signature'), 'center/authority_signature');
            $validated['authority_signature'] = $validated['director_signature'];
        }

        if ($status === CenterStatus::Approved) {
            do {
                $validated['code'] = Center::max('code') + 1;

                $validated['code'] = $validated['code'] < 999999
                    ? $validated['code']
                    : random_int(111111, 999999);
            } while (Center::where(['code' => $validated['code']])->count());
        } else {
            $validated['code'] = null;
        }

        $validated['status'] = $status ?? CenterStatus::Pending;
        $validated['team_id'] = $validated['team_id'] ?? session('staff_referral_id') ?? request()->cookie('bdnsi_staff_ref_id');

        return Center::create($validated);
    }
}
