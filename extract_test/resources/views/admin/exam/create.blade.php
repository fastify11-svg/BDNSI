<x-admin-app-layout>
    <x-slot name="header">
        <div class="w-full flex justify-between">
            <div class="text-xl">{{ __('Exam') }}</div>
            <div>
                <a class="border border-slate-500 py-1 px-4 rounded text-slate-700 text-sm hover:text-white hover:bg-slate-700"
                   href="{{ route('admin.exam.index') }}">{{ __('  Exam List') }}</a>
            </div>
        </div>
    </x-slot>
    <div class="w-full mt-8">
             <div class="bg-white p-2">
                 <form action="{{route('admin.exam.store')}}" method="post">
                          @csrf
                         <div class="w-full flex flex-wrap">
                             <x-labeled-select name="subject_id"  label="Subject" class="w-full md:w-1/3 p-2">
                                 @foreach($subjects as $subject)
                                     <option value="{{$subject->id}}">{{$subject->name??''}}</option>
                                 @endforeach
                             </x-labeled-select>
                             <x-labeled-input name="name" label="Exam Name"  class="w-full md:w-1/3 p-2"/>
                             <x-labeled-input type="datetime-local" name="start_time" label="Start Time "  class="w-full md:w-1/3 p-2"/>
                             <x-labeled-input type="datetime-local" name="end_time" label="End Time "  class="w-full md:w-1/3 p-2"/>
                              <div class="w-full flex justify-center">
                                     <button class="px-3 py-1 bg-black text-white rounded-md">Submit</button>
                              </div>
                         </div>
                 </form>
             </div>
    </div>
</x-admin-app-layout>
