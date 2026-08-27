<x-admin-app-layout>
    <x-slot name="header">
        <div class="w-full flex justify-between">
            <div class="text-xl">{{ __('Upazila Store ') }}</div>
            <div>
                <a class="border border-slate-500 py-1 px-4 rounded text-slate-700 text-sm hover:text-white hover:bg-slate-700"
                   href="{{ route('admin.upazila-store.index') }}">{{ __('Upazila List') }}</a>
            </div>
        </div>
    </x-slot>

    <div class="w-full mt-8 p-2">
        <div class="bg-white p-5 rounded-md ">
            <form action="{{route('admin.upazila-store.store')}}" method="post" enctype="multipart/form-data">
                @csrf
                <div class="w-full flex flex-wrap">
                    <x-labeled-select name="district_id" label="District Name" class="w-full md:w-1/2 p-2" required>
                        @foreach($districts as $district)
                            <option value="{{$district->id}}">{{$district->name??''}}</option>
                        @endforeach
                    </x-labeled-select>
                    <x-labeled-input name="name" class="w-full md:w-1/2 p-1" required />
                    <div class="w-full py-2 flex justify-center">
                        <button class="px-3 py-1 border bg-blue-700 text-white rounded " type="submit">Submit</button>
                    </div>
                </div>
            </form>
        </div>
    </div>

</x-admin-app-layout>
