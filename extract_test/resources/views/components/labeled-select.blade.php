@props(['name', 'label' => '', 'required' => false, 'disabled' => false])

<div class="{{ $attributes['class'] }}">
    <label class="block font-medium text-sm text-gray-700 font-semibold py-2" for="{{ $name }}">{{ __(Str::of($label ?: $name)->replace(['_','-'], ' ')->title().'') }} @if($required)<span class="ml-2 text-red-500">*</span>@endif</label>
    <select id="{{ $name }}" name="{{ $name }}" {{ $disabled ? 'disabled' : '' }} {{ $required ? 'required' : '' }} {{ $attributes->filter(fn ($value, $key) => $key !== 'class') }} class="rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 w-full p-2 border-2 border-gray-400">
        {!! $slot !!}
    </select>
    @error($name)
    <span class="text-red-500 text-sm">{{ $message }}</span>
    @enderror
</div>
