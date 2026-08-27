<x-admin-app-layout>
    <x-slot name="header">
        <div class="w-full flex justify-between">
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                {{ __('Role details') }}
            </h2>
            <div class="text-sm text-blue-600">
                <a
                    href="{{ route('laratrust.roles-assignment.index') }}"
                    class="ml-4 {{ request()->is('*roles-assignment*') ? 'underline' : '' }}"
                >
                    Roles & Permissions Assignment
                </a>
                <a
                    href="{{route('laratrust.roles.index')}}"
                    class="ml-4 {{ request()->is('*roles') ? 'underline' : '' }}"
                >
                    Roles
                </a>
                <a
                    href="{{ route('laratrust.permissions.index') }}"
                    class="ml-4 {{ request()->is('*permissions*') ? 'underline' : '' }}"
                >
                    Permissions
                </a>
            </div>
        </div>
    </x-slot>
    @include('laratrust::panel.session-message')
    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div
                class="align-middle inline-block bg-white min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200 p-8"
            >
                <label class="flex justify-between w-4/12">
                    <span class="text-gray-900 font-bold">Name/Code:</span>
                    <span class="ml-4 text-gray-800">{{$role->name}}</span>
                </label>

                <label class="flex justify-between w-4/12 my-4">
                    <span class="text-gray-900 font-bold">Display Name:</span>
                    <span class="ml-4 text-gray-800">{{$role->display_name}}</span>
                </label>

                <label class="flex justify-between w-4/12 my-4">
                    <span class="text-gray-900 font-bold">Description:</span>
                    <span class="ml-4 text-gray-800">{{$role->description}}</span>
                </label>
                <span class="text-gray-900 font-bold">Permissions:</span>
                <ul class="grid grid-cols-1 md:grid-cols-4 list-inside">
                    @foreach ($role->permissions as $permission)
                        <li class="text-gray-800 list-disc" >{{$permission->display_name ?? $permission->name}}</li>
                    @endforeach
                </ul>
                <div class="flex justify-end">
                    <a
                        href="{{route("laratrust.roles.index")}}"
                        class="text-blue-600 hover:text-blue-900"
                    >
                        Back
                    </a>
                </div>
            </div>
        </div>
    </div>
</x-admin-app-layout>

