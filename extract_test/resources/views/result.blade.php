<x-frontend-layouts>
    <link rel="stylesheet" href="{{mix('css/app.css')}}">
    <script src="{{mix('js/app.js')}}" ></script>
    <meta name="viewport" content="width=1024">
     <div class="container">
         <div class="w-full mx-auto  flex flex-wrap bg-white print:absolute print:inset-0 print:max-w-full">
             @if(!request('roll'))
                 <form class="w-full print:hidden" action="{{ route('result') }}" method="get">

                     @if($error = session(\App\Mixin\ResponseMixin::ERROR_MESSAGE_SESSION_KEY))
                         <div class="w-full flex flex-wrap">
                             <div class="w-full p-4 bg-red-300">{{ $error }}</div>
                         </div>
                     @endif
                     <div class="max-w-7xl mx-auto">
                         <div class="w-full flex flex-wrap py-8    px-2 md:px-4">
                             <div class="shadow-lg w-full  bg-gray-50 md:w-1/2 mx-auto rounded-md">
                                 <div class="font-bold text-sm md:text-lg text-red-800 text-center">  {{ __t('Student Result') }}</div>
                                 <div class="p-2">
                                     <label for="" class="font-bold">{{__t('Roll Number / Passport Number')}} </label>
                                     <input class="w-full  outline-none px-3 mx-auto p-1 border-[#7024A8] border-2 rounded-full " name="roll" required/>
                                 </div>
                                 <div class="w-full flex justify-center py-4 items-center">
                                     <button class="px-3 py-2 border bg-[#7024A8] rounded-md text-white">{{ __t('Get Result') }}</button>
                                 </div>
                             </div>
                         </div>
                     </div>
                 </form>
             @endif
             @if($student)
                 <div class="w-full my-4 p-2">
                     <x-result :student="$student" />
                 </div>
             @endif
         </div>
     </div>

    <x-slot name="script">
        <x-calculate-gpa-script />
    </x-slot>
</x-frontend-layouts>


