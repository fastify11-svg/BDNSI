<x-frontend-layouts>

   <div class="max-w-6xl mx-auto py-4 px-3">
       <div class="w-full mt-8">
           <table class="w-full text-center border">
               <thead class="w-full border">
               <th class="border-2 w-[10%]  border-gray-400">S/L</th>
               <th class="border-2 w-[60%] border-gray-400">{{__t('Details')}}</th>
               <th class="border-2 w-[30%] border-gray-400">{{__t('Download')}}</th>
               </thead>

               <tbody>
               @forelse($notices as $notice)
               <tr class="w-full bg-gray-200">
                   <td class="border border-black px-2 py-2">{{$loop->iteration}}</td>
                   <td class="border border-black px-2 py-2">{{\Illuminate\Support\Str::limit(translateField($notice,'details'),30,$end='...')}}</td>
                   <td class="border border-black px-2 py-2"><a href="{{$notice->image}}" target="_blank" class="bg-blue-700 text-white rounded-md px-3 py-1">Download</a></td>
               </tr>
               @empty
                   <tr class="w-full bg-gray-200">
                       <td class="border border-black px-2 py-2"></td>
                       <td class="border border-black px-2 py-2 text-red-500 font-bold" >{{__t('Not Found Notice')}}</td>

                   </tr>
               @endforelse
               </tbody>
           </table>
       </div>
   </div>

</x-frontend-layouts>
