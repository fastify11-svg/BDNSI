<x-admin-app-layout title="Backup ">
   <div class="p-2">
       <div class="p-2 bg-white rounded-md ">
           <h1 class="text-xl font-bold mb-4">Backup List</h1>

           <table class="table-auto w-full border">
               <thead>
               <tr class="bg-gray-200 border ">
                   <th class="px-4 py-2 border text-center">File Name</th>
                   <th class="px-4 py-2 border text-center">Size (KB)</th>
                   <th class="px-4 py-2 border text-center">Date</th>
                   <th class="px-4 py-2 border text-center">Action</th>
               </tr>
               </thead>
               <tbody>
               @forelse($files as $file)
                   <tr class="border-t">
                       <td class="px-4 border py-2">{{ $file['name'] }}</td>
                       <td class="px-4 border py-2">{{ round($file['size'] / 1024, 2) }}</td>
                       <td class="px-4 border py-2">
                           {{ \Carbon\Carbon::createFromTimestamp($file['date'])->format('Y-m-d h:i A') }}
                       </td>
                       <td class="px-4 border py-3">
                           <form action="{{route('admin.backup.update',$file['name'])}}" method="post">
                               @csrf
                               @method('put')
                               <button onclick="return confirm('Do You Want to Download?')" type="submit"  class="px-2 py-2 rounded-md border bg-green-500">Download</button>
                           </form>

                       </td>

                   </tr>
               @empty
                   <tr>
                       <td colspan="4" class="px-4 py-2 text-center text-gray-500">Not Found</td>
                   </tr>
               @endforelse
               </tbody>
           </table>
       </div>
   </div>
</x-admin-app-layout>
