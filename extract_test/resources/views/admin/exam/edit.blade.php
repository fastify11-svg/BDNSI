<div  class="w-full"  x-data="{ isOpen: false }">
    <div  class=" w-full">
        <div x-show="isOpen" @click.away="isOpen = false" class="fixed z-50 inset-0 overflow-y-auto">
            <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <!-- Background overlay -->
                <div x-show="isOpen" class="fixed inset-0 transition-opacity" style="background: rgba(0,0,0,0.5);" x-cloak></div>

                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div x-show="isOpen" class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" x-cloak>
                    <!-- Modal content -->
                    <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <p class="text-lg">Exam Edit  </p>
                        <div class="  ">
                            <form action="{{route('admin.exam.update',$data->id)}}" method="post">
                                @csrf
                                @method('put')
                                <div class="w-full flex flex-wrap">
                                    <x-labeled-input value="{{$data->name}}" name="name" label="Exam Name"  class="w-full   p-2"/>
                                    <x-labeled-input value="{{$data->start_time}}" type="datetime-local" name="start_time" label="Start Time "  class="w-full   p-2"/>
                                    <x-labeled-input value="{{$data->end_time}}" type="datetime-local" name="end_time" label="End Time "  class="w-full   p-2"/>
                                    <x-labeled-select
                                        class="w-full    p-1"
                                        required
                                        name="status"
                                        label="Status"
                                    >
                                        @foreach(\App\Enums\ExamStatus::asArray()  as $key=> $value)
                                            @continue($value==\App\Enums\ExamStatus::Created)
                                            <option value="{{$value}}" {{$value==$data->status->is($value) ? 'selected' : ''}}>{{$key}}</option>
                                        @endforeach
                                    </x-labeled-select>

                                    <div class="w-full flex justify-center">
                                        <button class="px-3 py-1 bg-black text-white rounded-md">Submit</button>
                                    </div>
                                </div>
                            </form>
                        </div>

                    </div>
                    <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button type="button" @click="isOpen = false" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="flex justify-center  ">

           <button type="button"  class="px-2 py-1 bg-green-700 text-sm flex items-center text-gray-300 rounded-md border  " @click="isOpen = true">
               <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" >
                   <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
               </svg>

           </button>
    </div>
</div>
