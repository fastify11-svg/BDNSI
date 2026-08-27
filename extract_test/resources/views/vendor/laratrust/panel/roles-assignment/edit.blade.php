<x-admin-app-layout>
    <x-slot name="header">
        <div class="w-full flex justify-between">
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                {{ __('Edit '.$modelKey) }}
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
            <form
                method="POST"
                action="{{route('laratrust.roles-assignment.update', ['roles_assignment' => $user->getKey(), 'model' => $modelKey])}}"
                class="bg-white w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200 p-8"
            >
                @csrf
                @method('PUT')
                <label class="block">
                    <span class="text-slate-700 font-semibold">Name</span>
                    <input
                        class="form-input mt-1 block w-full p-2 border rounded bg-slate-200 border-slate-600"
                        name="name"
                        placeholder="this-will-be-the-code-name"
                        value="{{$user->name ?? 'The model doesn\'t have a `name` attribute'}}"
                        readonly
                        autocomplete="off"
                    >
                </label>
                <span class="block text-slate-700 font-semibold mt-4">Roles</span>
                <div class="flex flex-wrap justify-start mb-4">
                    @foreach ($roles as $role)
                        <label class="inline-flex items-center mr-6 my-2 text-sm" style="flex: 1 0 20%;">
                            <input
                                type="checkbox"
                                @if ($role->assigned && !$role->isRemovable)
                                class="form-checkbox focus:shadow-none focus:border-transparent text-gray-500 h-4 w-4"
                                @else
                                class="form-checkbox h-4 w-4"
                                @endif
                                name="roles[]"
                                value="{{$role->getKey()}}"
                                {!! $role->assigned ? 'checked' : '' !!}
                                {!! $role->assigned && !$role->isRemovable ? 'onclick="return false;"' : '' !!}
                            >
                            <span class="ml-2 {!! $role->assigned && !$role->isRemovable ? 'text-gray-600' : '' !!}">
                {{$role->display_name ?? $role->name}}
              </span>
                        </label>
                    @endforeach
                </div>
                @if ($permissions)
                    <span class="block text-slate-700 font-semibold mt-4">Permissions</span>
                    <div class="flex flex-wrap justify-start mb-4">
                        @foreach ($permissions as $permission)
                            <label class="inline-flex items-center mr-6 my-2 text-sm" style="flex: 1 0 20%;">
                                <input
                                    type="checkbox"
                                    class="form-checkbox h-4 w-4"
                                    name="permissions[]"
                                    value="{{$permission->getKey()}}"
                                    {!! $permission->assigned ? 'checked' : '' !!}
                                >
                                <span class="ml-2">{{$permission->display_name ?? $permission->name}}</span>
                            </label>
                        @endforeach
                    </div>
                @endif
                <div class="flex justify-end">
                    <a
                        href="{{route("laratrust.roles-assignment.index", ['model' => $modelKey])}}"
                        class="px-4 py-1 bg-slate-500 mr-4 rounded text-white"
                    >
                        Cancel
                    </a>
                    <button class="px-4 py-1 bg-blue-500 rounded text-white" type="submit">Save</button>
                </div>
            </form>
        </div>
    </div>
</x-admin-app-layout>
