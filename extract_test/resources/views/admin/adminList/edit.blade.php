<x-admin-app-layout>
    <x-slot name="header">
        <div class="w-full flex justify-between">
            <div class="text-xl">{{ __('Password Change') }}</div>

        </div>
    </x-slot>

    <form action="{{ route('admin.adminList.update',$admin->id) }}" method="POST" enctype="multipart/form-data">
        @csrf
        @method('put')
        <div class="flex flex-wrap justify-center w-full bg-white p-4">
            <x-labeled-input name="password"  class="w-full p-1 md:w-1/2 lg:w-1/3" required/>
            <x-labeled-input name="password_confirmation"  class="w-full p-1 md:w-1/2 lg:w-1/3" required/>
            <div class="w-full py-8 flex justify-center">
                <x-button>{{ __('Update') }}</x-button>
            </div>
        </div>
    </form>
</x-admin-app-layout>
