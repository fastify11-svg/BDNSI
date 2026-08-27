<x-admin-app-layout :title="__('User Details')">
    <x-slot name="header">
        <div class="w-full flex justify-between">
            <div class="text-xl">{{ __('User Details') }}</div>
            <div>
                <a
                    class="border border-slate-500 py-1 px-4 rounded text-slate-700 text-sm hover:text-white hover:bg-slate-700"
                    href="{{ route('admin.user.index') }}">{{ __('Users') }}</a>
            </div>
        </div>
    </x-slot>

    <div class="w-full bg-white flex flex-wrap p-4">
        <div class="w-full md:w-1/2 lg:w-1/3 flex justify-center p-2">
            <img class="h-64 w-64" src="{{ $user->avatar }}" alt="Avatar of {{ $user->name }}"/>
        </div>
        <div class="w-full md:w-1/2 lg:w-1/3">
            <table>
                <tr>
                    <td class="p-2 font-semibold">{{ __('Username') }}</td>
                    <td class="p-2">{{ $user->username }}</td>
                </tr>
                <tr>
                    <td class="p-2 font-semibold">{{ __('Name') }}</td>
                    <td class="p-2">{{ $user->name }}</td>
                </tr>
                <tr>
                    <td class="p-2 font-semibold">{{ __('Phone') }}</td>
                    <td class="p-2">{{ $user->phone }}</td>
                </tr>
                <tr>
                    <td class="p-2 font-semibold">{{ __('Email') }}</td>
                    <td class="p-2">{{ $user->email }}</td>
                </tr>
                <tr>
                    <td class="p-2 font-semibold">{{ __('Email Verified') }}</td>
                    <td class="p-2 flex">
                        @if($user->hasVerifiedEmail())
                            <div class="rounded bg-green-300 py-1 px-2 text-xs font-semibold text-green-800">{{ __('Yes') }}</div>
                        @else
                            <div class="rounded bg-red-200 py-1 px-2 text-xs font-semibold text-red-800">{{ __('No') }}</div>
                        @endif
                    </td>
                </tr>
            </table>
        </div>
        <div class="w-full md:w-1/2 lg:w-1/3">
            <table>
                <tr>
                    <td class="p-2 font-semibold">{{ __('Center Code') }}</td>
                    <td class="p-2">{{ $user->center->code }}</td>
                </tr>
                <tr>
                    <td class="p-2 font-semibold">{{ __('Center Name') }}</td>
                    <td class="p-2">{{ $user->center->name }}</td>
                </tr>
            </table>
        </div>
    </div>
</x-admin-app-layout>
