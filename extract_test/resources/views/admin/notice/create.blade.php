<x-admin-app-layout>
    <x-slot name="header">
        <div class="w-full flex justify-between">
            <div class="text-xl">{{ __('Notice') }}</div>
            <div>
                <a class="border border-slate-500 py-1 px-4 rounded text-slate-700 text-sm hover:text-white hover:bg-slate-700"
                   href="{{ route('admin.notice.index') }}">{{ __('notice List') }}</a>
            </div>
        </div>
    </x-slot>

    <div class="w-full mt-8">
        <form action="{{route('admin.notice.store')}}" method="post" enctype="multipart/form-data">
            @csrf
               <div class="w-full flex flex-wrap">
                      <x-labeled-textarea name="details" class="w-full"/>
                      <x-labeled-textarea name="bn_details" class="w-full"/>
                      <x-labeled-textarea name="ar_details" class="w-full"/>
                      <x-labeled-input type="file" name="image" class="w-full"/>
                   <div class="w-full py-2 flex justify-center">
                            <button class="px-3 py-1 border bg-blue-700 text-white rounded " type="submit">Submit</button>
                   </div>
               </div>
        </form>
    </div>

</x-admin-app-layout>
