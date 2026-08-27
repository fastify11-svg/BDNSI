@props(['type' => 'text','name', 'label' => '','value' => null, 'required' => false, 'disabled' => false])

<div class="{{ $attributes['class'] }}">
    <label class="block font-medium text-sm text-gray-700 font-semibold py-2" for="{{ $name }}">
        {{ __(Str::of($label ?: $name)->replace(['_','-'], ' ')->title().'') }}
        @if($required)<span class="ml-2 text-red-500">*</span>@endif
    </label>
    <input
        type="{{ $type }}"
        id="{{ $name }}"
        name="{{ $name }}"
        value="{{ $type === 'password' ? $value : old($name, $value) }}"
        {{ $disabled ? 'disabled' : '' }}
        {{ $required ? 'required' : '' }}
        {{ $attributes->filter(function ($value, $key) { return $key !== 'class'; }) }}
        class="rounded-md text_filed shadow-sm capitalize focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 w-full p-2 border-2 border-gray-400"
    />
    @error($name)
    <span class="text-red-500 text-sm">{{ $message }}</span>
    @enderror
</div>

<script>
    document.addEventListener('DOMContentLoaded', function () {
        // Function to capitalize the first letter of every word
        function capitalize(str) {
            return str.toLowerCase().replace(/\b\w/g, function (char) {
                return char.toUpperCase();
            });
        }

        // Apply the appropriate transformation to an input field by its ID
        function applyTransformation(inputId, transformFunction) {
            var input = document.getElementById(inputId);
            if (!input) return;

            // Initial transformation when the page loads
            input.value = transformFunction(input.value);

            // Transform dynamically as the user types
            input.addEventListener('input', function () {
                this.value = transformFunction(this.value);
            });
        }

        // Dynamically apply capitalization to this specific input field
        applyTransformation("{{ $name }}", capitalize); // Ensure the input ID is passed as a string
    });
</script>
