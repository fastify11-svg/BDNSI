@props(['name', 'label' => '', 'required' => false, 'disabled' => false])


<style>
    /* Style for the label */
    .label-name {
        font-weight: bold;!important;
        color: #6aa84f!important; /* Green color */
        display: block!important;
        margin-bottom: 8px!important; /* Space between label and input */
    }

    /* Style for the input */
    .input-name {
        width: 100%!important; /* Full width */
        padding: 0.5rem 1rem!important; /* Vertical and horizontal padding */
        border: 2px solid #6aa84f!important; /* Green border */
        border-radius: 0.5rem!important; /* Rounded corners */
        outline: none!important; /* Remove outline on focus */
        font-size: 1rem!important; /* Adjust font size */
        transition: border-color 0.3s ease!important; /* Smooth transition for border color */
    }

    .input-name:focus {
        border-color: #4a7f29!important; /* Darker green on focus */
    }

</style>


<div class="form-group {{ $attributes['class'] }}">
    <label for="{{ $name }}" class="label-name">
        {{ __(Str::of($label ?: $name)->replace(['_','-'], ' ')->title().'') }}
        @if($required)
            <span class="text-danger">*</span>
        @endif
    </label>

    <select id="{{ $name }}" name="{{ $name }}"
            class="input-name @error($name) is-invalid @enderror"
        {{ $disabled ? 'disabled' : '' }}
        {{ $required ? 'required' : '' }}
        {{ $attributes->filter(fn ($value, $key) => $key !== 'class') }}>
        {!! $slot !!}
    </select>

    @error($name)
    <div class="invalid-feedback">{{ $message }}</div>
    @enderror
</div>
