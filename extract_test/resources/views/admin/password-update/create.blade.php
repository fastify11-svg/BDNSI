<x-admin-app-layout>
    <h2 class="w-full text-xl">
        {{ __('Update Password') }}
    </h2>
    <div class="w-full flex flex-wrap mt-4">
        <div class="w-full py-4 lg:w-1/4 lg:pr-4">
            <div class="w-full bg-white rounded">
                <div class="w-full p-4 flex justify-center items-center">
                    <img src="{{ auth()->user()->avatar }}" class="w-64" alt="Avatar"/>
                </div>
                <table class="w-full text-sm">
                    <tr>
                        <td class="p-2 border-t border-b font-semibold">{{ __('Name') }}</td>
                        <td class="p-2 border-t border-b">{{ auth()->user()->name }}</td>
                    </tr>
                    <tr>
                        <td class="p-2 border-t border-b font-semibold">{{ __('Email') }}</td>
                        <td class="p-2 border-t border-b">{{ auth()->user()->email }}</td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="w-full py-4 lg:w-3/4 lg:pl-4">
            <div class="w-full bg-white rounded">
                <div class="w-full border-b text-lg p-4">
                    {{ __('Update password') }}
                </div>
                <div class="w-full p-4">
                    <form action="{{ route('admin.password-update.store') }}" method="POST">
                        @csrf
                        <x-labeled-input type="password" class="mt-4" name="old_password" required/>
                        <x-labeled-input type="password" class="mt-4" name="password" autocomplete="new-password" required/>
                        <x-labeled-input type="password" class="mt-4" name="password_confirmation" required/>
                        <div class="w-full flex justify-center mt-8 mb-4">
                            <button class="bg-transparent border border-slate-600 py-2 px-4 text-slate-600 font-semibold rounded hover:bg-slate-600 hover:text-white">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</x-admin-app-layout>
