<x-admin-app-layout>
    <x-slot name="header">
        <div class="w-full flex justify-between">
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                {{ __('Role assignment') }}
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
                x-data="{ model: @if($modelKey) '{{$modelKey}}' @else 'initial' @endif }"
                x-init="$watch('model', value => value != 'initial' ? window.location = `?model=${value}` : '')"
                class="bg-white mt-4 align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b p-8"
            >
                <span class="text-gray-700">User model to assign roles/permissions</span>
                <label class="block w-3/12">
                    <select class="form-select block w-full mt-1" x-model="model">
                        <option value="initial" disabled selected>Select a user model</option>
                        @foreach ($models as $model)
                            <option value="{{$model}}">{{ucwords($model)}}</option>
                        @endforeach
                    </select>
                </label>
                <div class="flex mt-8 align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg ">
                    <table class="min-w-full">
                        <thead>
                        <tr>
                            <th class="p-3 text-left text-sm bg-slate-200 text-slate-800 uppercase">Id</th>
                            <th class="p-3 text-left text-sm bg-slate-200 text-slate-800 uppercase">Name</th>
                            <th class="p-3 text-left text-sm bg-slate-200 text-slate-800 uppercase">Roles</th>
                            @if(config('laratrust.panel.assign_permissions_to_user'))
                                <th class="p-3 text-left text-sm bg-slate-200 text-slate-800 uppercase">Permissions</th>
                            @endif
                            <th class="p-3 text-left text-sm bg-slate-200 text-slate-800 uppercase"></th>
                        </tr>
                        </thead>
                        <tbody class="bg-white text-sm">
                        @foreach ($users as $user)
                            <tr>
                                <td class="p-3 border-b border-gray-200">
                                    {{$user->getKey()}}
                                </td>
                                <td class="p-3 border-b border-gray-200">
                                    {{$user->name ?? 'The model doesn\'t have a `name` attribute'}}
                                </td>
                                <td class="p-3 border-b border-gray-200">
                                    {{$user->roles_count}}
                                </td>
                                @if(config('laratrust.panel.assign_permissions_to_user'))
                                    <td class="p-3 border-b border-gray-200">
                                        {{$user->permissions_count}}
                                    </td>
                                @endif
                                <td class="p-3 border-b border-gray-200">
                                    <a
                                        href="{{route('laratrust.roles-assignment.edit', ['roles_assignment' => $user->getKey(), 'model' => $modelKey])}}"
                                        class="text-blue-600 hover:text-blue-900"
                                    >Edit</a>
                                </td>
                            </tr>
                        @endforeach
                        </tbody>
                    </table>
                </div>
                @if ($modelKey)
                    {{ $users->appends(['model' => $modelKey]) }}
                @endif

            </div>
        </div>
    </div>
</x-admin-app-layout>
