<x-frontend-layouts>

     <div class=" mt-4 md:mt-10 w-3/4 mx-auto flex items-center  justify-center">

         <div class="w-full  shadow bg-white border ">
               @if($about_us??'')
               <div class="border-b p-2 font-bold">{{__t('About Us')}}</div>
               <div class="p-2 text-justify">
                     {{$about_us??''}}
               </div>

                 @elseif($terms_and_condition??'')
               <div class="border-b p-2 font-bold">{{__t('Terms And Condition')}}</div>
               <div class="p-2 text-justify">
                     {{$terms_and_condition??''}}
               </div>

               @elseif($privacy_policy??'')
               <div class="border-b p-2 font-bold">{{__t('Privacy Policy')}}</div>
               <div class="p-2 text-justify">
                     {{$privacy_policy??''}}
               </div>
             @endif

         </div>

     </div>




</x-frontend-layouts>
