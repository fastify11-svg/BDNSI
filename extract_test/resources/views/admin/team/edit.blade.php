<x-admin-app-layout>
    <script src="https://cdn.ckeditor.com/4.20.0/standard/ckeditor.js"></script>
    <x-slot name="header">
        <div class="w-full flex justify-between">
            <div class="text-xl">{{ __('Team') }}</div>
            <div>
                <a class="border border-slate-500 py-1 px-4 rounded text-slate-700 text-sm hover:text-white hover:bg-slate-700"
                   href="{{ route('admin.team.index') }}">{{ __('Team List') }}</a>
            </div>
        </div>
    </x-slot>


    <div class="p-5">
        <div class="bg-white p-3 rounded-md">
            <form action="{{route('admin.team.update',$data->id)}}" method="post" enctype="multipart/form-data">
                @csrf
                @method('put')
                <div class="border  mt-2">
                    <div class="border-b px-2">English </div>
                    <div class="w-full flex flex-wrap p-2">
                        <x-labeled-input value="{{$data->name??''}}" required name="name" class="w-full md:w-1/2 p-2"/>
                        <x-labeled-input value="{{$data->designation??''}}" required name="designation" class="w-full md:w-1/2 p-2"/>

                        <div class="w-full">
                            <div class="w-full">
                                <div class="font-bold">Description</div>
                                <div>
                                    <textarea   name="description" id="description"  class="w-full">{{$data->description??''}}</textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="border  mt-2">
                    <div class="border-b px-2">Bangla </div>
                    <div class="w-full flex flex-wrap p-2">
                        <x-labeled-input value="{{$data->bn_name??''}}" required name="bn_name" class="w-full md:w-1/2 p-2"/>
                        <x-labeled-input value="{{$data->bn_designation??''}}" required name="bn_designation" class="w-full md:w-1/2 p-2"/>

                        <div class="w-full">
                            <div class="w-full">
                                <div class="font-bold">Description</div>
                                <div>
                                    <textarea   name="bn_description" id="bn_description"  class="w-full">{{$data->bn_description??''}}</textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="border  mt-2">
                    <div class="border-b px-2 ">Arbic </div>
                    <div class="w-full flex flex-wrap p-2">
                        <x-labeled-input value="{{$data->ar_name??''}}" required name="ar_name" class="w-full md:w-1/2 p-2"/>
                        <x-labeled-input value="{{$data->ar_designation??''}}" required name="ar_designation" class="w-full md:w-1/2 p-2"/>

                        <div class="w-full">
                            <div class="w-full">
                                <div class="font-bold">Description</div>
                                <div>
                                    <textarea   name="ar_description" id="ar_description"  class="w-full">{{$data->ar_description??''}}</textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <x-labeled-input  required type="file" name="image" class="w-full   p-2"/>
                <div class="w-full flex justify-center py-3">
                    <button class="px-3 py-1 rounded-md bg-green-600 text-white ">Submit</button>
                </div>

            </form>



        </div>
    </div>

    <script>
        CKEDITOR.replace( 'description' );
        CKEDITOR.replace( 'bn_description' );
        CKEDITOR.replace( 'ar_description' );

    </script>
</x-admin-app-layout>
