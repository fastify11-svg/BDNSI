@props(['type' => 'text','name', 'label' => null,'value' => null, 'required' => false, 'disabled' => false, 'extraAttributes' => []])

<div class="{{ $attributes['class'] }}">
    <label class="block font-medium text-sm text-gray-700 font-semibold py-2" for="{{ $name }}">{{ __($label ?? Str::of($name)->replace(['_','-'], ' ')->title().'') }}@if($required)<span class="ml-2 text-red-500">*</span>@endif</label>
    <input type="{{ $type }}" id="{{ $name }}" name="{{ $name }}" value="{{ $type === 'password' ? $value : old($name, $value) }}" {{ $disabled ? 'disabled' : '' }} {{ $required ? 'required' : '' }} {{ $attributes->filter(function ($value, $key) { return $key !== 'class'; })->merge($extraAttributes) }} class="rounded-lg shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 w-full p-2 border border-gray-400"/>
    @error($name)
    <span class="text-red-500 text-sm">{{ $message }}</span>
    @enderror
</div>
