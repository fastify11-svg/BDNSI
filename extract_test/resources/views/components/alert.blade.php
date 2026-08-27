@props(['type' => 'success'])

<div x-data="{open : true}" v-pre>
    <template x-if="open">
        <div
            x-show="open"
            x-transition:leave="transition ease-in duration-300"
            x-transition:leave-start="opacity-100 transform scale-100"
            x-transition:leave-end="opacity-0 transform scale-90"
            class="px-3 {{ $type === 'success' ? 'bg-green-300' : 'bg-red-300' }} relative flex"
        >
            <span class="bg-green-300 bg-red-300"></span>
            <div class="py-2 flex-grow">
                {{ $slot }}
            </div>
            <div x-on:click="open = false" class="text-xl px-2 cursor-pointer {{ $type === 'success' ? 'text-green-800' : 'text-red-800' }} hover:font-semibold self-center">&times;</div>
        </div>
    </template>
</div>
