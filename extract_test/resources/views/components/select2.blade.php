@props(['name','multiple'=>null, 'label' => null, 'required' => false, 'disabled' => false, 'extraAttributes' => []])

<div class="{{ $attributes['class'] }}">
    <label class="block font-medium text-sm text-gray-700 font-semibold py-2" for="{{ $name }}">{{ __($label ?: Str::of($name)->replace(['_','-'], ' ')->title().'') }}@if($required)<span class="ml-2 text-red-500">*</span>@endif</label>
    <select {{$multiple}} id="{{ $name }}" name="{{ $name }}" {{ $disabled ? 'disabled' : '' }} {{ $required ? 'required' : '' }} {{ $attributes->filter(function($value, $key){ return $key !== 'class';})->merge($extraAttributes) }} class=" js-example-basic-multiple  rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 w-full p-2 border-2 border-gray-400">
        {!! $slot !!}
    </select>
    @error($name)
    <span class="text-red-500 text-sm">{{ $message }}</span>
    @enderror
</div>
