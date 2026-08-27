<x-admin-app-layout>
    <x-slot name="header">
        <div class="w-full flex justify-between">
            <div class="text-xl">{{ __('Create User') }}</div>
            @can('user-read')
            <div>
                <a
                    class="border border-slate-500 py-1 px-4 rounded text-slate-700 text-sm hover:text-white hover:bg-slate-700"
                    href="{{ route('admin.user.index') }}">{{ __('Users') }}</a>
            </div>
            @endcan
        </div>
    </x-slot>

    <form action="{{ route('admin.user.store') }}" method="POST" enctype="multipart/form-data">
        @csrf
        <div class="flex flex-wrap justify-center w-full bg-white p-4">
            <x-labeled-input name="username" required class="w-full p-1 md:w-1/2 lg:w-1/3"/>
            <x-labeled-input name="name" required class="w-full p-1 md:w-1/2 lg:w-1/3"/>
            <x-labeled-input name="phone" required class="w-full p-1 md:w-1/2 lg:w-1/3"/>
            <x-labeled-input name="email" class="w-full p-1 md:w-1/2 lg:w-1/3"/>
            <x-labeled-input type="password" name="password" required class="w-full p-1 md:w-1/2 lg:w-1/3"/>
            <x-labeled-input type="password" name="password_confirmation" required class="w-full p-1 md:w-1/2 lg:w-1/3"/>
            <x-labeled-select name="center_id" required class="w-full p-1 md:w-1/2 lg:w-1/3">
                @foreach($centers as $center)
                    <option value="{{ $center->id }}">{{ $center->name }}</option>
                @endforeach
            </x-labeled-select>
            <div class="w-full py-8 flex justify-center">
                <x-button>{{ __('Create') }}</x-button>
            </div>
        </div>
    </form>
</x-admin-app-layout>
