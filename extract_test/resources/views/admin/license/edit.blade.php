<x-admin-app-layout>
    <x-slot name="header">
        <div class="flex justify-between">
            <div class="text-xl">{{ __('Edit License') }}</div>
            <div>
                <a
                    class="border border-slate-500 py-1 px-4 rounded text-slate-700 text-sm hover:text-white hover:bg-slate-700"
                    href="{{ route('admin.license.index') }}">{{ __('License') }}</a>
            </div>
        </div>
    </x-slot>

    <form action="{{ route('admin.license.update', $license->id) }}" method="POST" enctype="multipart/form-data">
        @csrf
        @method('PUT')
        <div class="flex flex-wrap justify-center w-full bg-white p-4">

            <x-labeled-input name="cnic" required value="{{ old('cnic', $license->cnic) }}" class="w-full p-1 md:w-1/2 lg:w-1/3" placeholder="Enter CNIC"/>

            <x-labeled-input name="name" required value="{{ old('name', $license->name) }}" class="w-full p-1 md:w-1/2 lg:w-1/3" placeholder="Enter Full Name"/>

            <x-labeled-input name="father_name" required value="{{ old('father_name', $license->father_name) }}" class="w-full p-1 md:w-1/2 lg:w-1/3" placeholder="Enter Father's Name"/>

            <x-labeled-input name="city" required value="{{ old('city', $license->city) }}" class="w-full p-1 md:w-1/2 lg:w-1/3" placeholder="Enter City"/>

            <x-labeled-input name="state" value="{{ old('state', $license->state) }}" class="w-full p-1 md:w-1/2 lg:w-1/3" placeholder="Enter State (Optional)"/>

            <x-labeled-input name="image" type="file" accept="image/*" class="w-full p-1 md:w-1/2 lg:w-1/3"/>
            @if($license->image)
                <div class="w-full p-1 md:w-1/2 lg:w-1/3">
                    <label class="block text-sm font-medium text-gray-700">Current Image</label>
                    <img src="{{$license->image }}" alt="Current License Image" class="w-20 h-20 object-cover rounded">
                </div>
            @endif

            <x-labeled-input name="license_number" required value="{{ old('license_number', $license->license_number) }}" class="w-full p-1 md:w-1/2 lg:w-1/3" placeholder="Enter License Number"/>

            <x-labeled-input name="issue_date" required type="date" value="{{ old('issue_date', $license->issue_date ? $license->issue_date->format('Y-m-d') : '') }}" class="w-full p-1 md:w-1/2 lg:w-1/3"/>

            <x-labeled-input name="valid_from" required type="date" value="{{ old('valid_from', $license->valid_from ? $license->valid_from->format('Y-m-d') : '') }}" class="w-full p-1 md:w-1/2 lg:w-1/3"/>

            <x-labeled-input name="valid_to" required type="date" value="{{ old('valid_to', $license->valid_to ? $license->valid_to->format('Y-m-d') : '') }}" class="w-full p-1 md:w-1/2 lg:w-1/3"/>

            <div class="w-full p-1 md:w-1/2 lg:w-1/3">
                <label class="block text-sm font-medium text-gray-700 mb-2">Allowed Vehicle Types <span class="text-red-500">*</span></label>
                <div class="grid grid-cols-1 gap-2">
                    @php
                        $selectedVehicles = old('allowed_vehicles', is_array($license->allowed_vehicles) ? $license->allowed_vehicles : [$license->allowed_vehicles]);
                    @endphp
                    @foreach($vehicleOptions as $key => $value)
                        <label class="flex items-center space-x-2">
                            <input type="checkbox" name="allowed_vehicles[]" value="{{ $key }}"
                                   {{ in_array($key, $selectedVehicles) ? 'checked' : '' }}
                                   class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                            <span class="text-sm text-gray-700">{{ $value }}</span>
                        </label>
                    @endforeach
                </div>
                @error('allowed_vehicles')
                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>

            <div class="w-full py-8 flex justify-center">
                <x-button>{{ __('Update') }}</x-button>
            </div>
        </div>
    </form>
</x-admin-app-layout>
