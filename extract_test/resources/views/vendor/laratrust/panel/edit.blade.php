<x-admin-app-layout>
    <x-slot name="header">
        <div class="w-full flex justify-between">
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                {{ __($model ? "Edit $type" : "New $type") }}
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
                x-data="laratrustForm()"
                x-init="{!! $model ? '' : '$watch(\'displayName\', value => onChangeDisplayName(value))'!!}"
                method="POST"
                action="{{$model ? route("laratrust.{$type}s.update", $model->getKey()) : route("laratrust.{$type}s.store")}}"
                class="bg-white w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200 p-6"
            >
                @csrf
                @if ($model)
                    @method('PUT')
                @endif
                <label class="block">
                    <span class="text-gray-700">Name/Code</span>
                    <input
                        class="p-2 mt-1 rounded w-full bg-gray-200 text-gray-600 @error('name') border-red-500 @enderror"
                        name="name"
                        placeholder="this-will-be-the-code-name"
                        :value="name"
                        readonly
                        autocomplete="off"
                    >
                    @error('name')
                    <div class="text-red-500 text-sm mt-1">{{ $message}} </div>
                    @enderror
                </label>

                <label class="block my-4">
                    <span class="text-gray-700">Display Name</span>
                    <input
                        class="p-2 mt-1 rounded border border-slate-600 w-full"
                        name="display_name"
                        placeholder="Edit user profile"
                        x-model="displayName"
                        autocomplete="off"
                    >
                </label>

                <label class="block my-4">
                    <span class="text-gray-700">Description</span>
                    <textarea
                        class="p-2 rounded mt-1 block w-full"
                        rows="3"
                        name="description"
                        placeholder="Some description for the {{$type}}"
                    >{{ $model->description ?? old('description') }}</textarea>
                </label>
                @if($type == 'role')
                    <span class="block text-gray-700">Permissions</span>
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
                        href="{{route("laratrust.{$type}s.index")}}"
                        class="p-2 px-4 bg-red-700 text-sm text-white rounded cursor-pointer mr-4"
                    >
                        Cancel
                    </a>
                    <button class="p-2 px-4 bg-blue-700 text-sm text-white rounded cursor-pointer" type="submit">Save</button>
                </div>
            </form>
        </div>
    </div>
    <script>
        window.laratrustForm =  function() {
            return {
                displayName: '{{ $model->display_name ?? old('display_name') }}',
                name: '{{ $model->name ?? old('name') }}',
                toKebabCase(str) {
                    return str &&
                        str
                            .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
                            .map(x => x.toLowerCase())
                            .join('-')
                            .trim();
                },
                onChangeDisplayName(value) {
                    this.name = this.toKebabCase(value);
                }
            }
        }
    </script>
</x-admin-app-layout>
