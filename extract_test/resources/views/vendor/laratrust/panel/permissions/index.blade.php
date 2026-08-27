<x-admin-app-layout>
    <x-slot name="header">
        <div class="w-full flex justify-between">
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                {{ __('Permissions') }}
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
            @if (config('laratrust.panel.create_permissions'))
                <a
                    href="{{route('laratrust.permissions.create')}}"
                    class="self-end bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                >
                    + New Permission
                </a>
            @endif
            <div
                class="mt-8 w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
                <table class="min-w-full">
                    <thead>
                    <tr>
                        <th class="p-3 text-left text-sm bg-slate-200 text-slate-800 uppercase">Id</th>
                        <th class="p-3 text-left text-sm bg-slate-200 text-slate-800 uppercase">Name/Code</th>
                        <th class="p-3 text-left text-sm bg-slate-200 text-slate-800 uppercase">Display Name</th>
                        <th class="p-3 text-left text-sm bg-slate-200 text-slate-800 uppercase">Description</th>
                        <th class="p-3 text-left text-sm bg-slate-200 text-slate-800 uppercase"></th>
                    </tr>
                    </thead>
                    <tbody class="bg-white text-sm">
                    @foreach ($permissions as $permission)
                        <tr>
                            <td class="p-3 border-b border-gray-200">
                                {{$permission->getKey()}}
                            </td>
                            <td class="p-3 border-b border-gray-200">
                                {{$permission->name}}
                            </td>
                            <td class="p-3 border-b border-gray-200">
                                {{$permission->display_name}}
                            </td>
                            <td class="p-3 border-b border-gray-200">
                                {{$permission->description}}
                            </td>
                            <td class="flex justify-end p-3 whitespace-no-wrap text-right border-b border-gray-200 text-sm leading-5 font-medium">
                                <a href="{{route('laratrust.permissions.edit', $permission->getKey())}}" class="text-blue-600 hover:text-blue-900">Edit</a>
                            </td>
                        </tr>
                    @endforeach
                    </tbody>
                </table>
            </div>
            {{ $permissions->links() }}
        </div>
    </div>
</x-admin-app-layout>

