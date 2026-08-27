<x-app-layout>
    <x-slot name="header">
        <div class="w-full flex justify-between">
            <div class="text-xl">{{ __('Student Result') }}</div>
        </div>
    </x-slot>

    <div class="flex flex-wrap print:hidden justify-center w-full bg-white p-4">
        <form class="w-full"  action="{{route('centerStudentResult')}} " method="GET">
            <div class="w-full flex flex-wrap">
                <x-select2 name="session_id" label="Session" required class="w-full p-1 md:w-1/2  ">
                    @foreach($sessions as $session)
                        <option
                            value="{{ $session->id }}" @selected(old('session_id', request('session_id')) == $session->id)>{{ $session->name }}</option>
                    @endforeach
                </x-select2>
                <x-select2 name="subject_id" label="Subject" required class="w-full p-1 md:w-1/2  ">
                    @foreach($subjects as $subject)
                        <option
                            value="{{ $subject->id }}" @selected(old('subject_id', request('subject_id')) == $subject->id)>{{ $subject->name }}</option>
                    @endforeach
                </x-select2>
                <div class="w-full pt-4 flex justify-center  ">
                    <x-button>{{ __('Search') }}</x-button>
                </div>
            </div>
        </form>
    </div>

     <div class=" w-full bg-white p-4">

         <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
             <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                 <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                 <tr>
                     <th scope="col" class="px-6 py-3">
                         Student Name
                     </th>
                     <th scope="col" class="px-6 py-3">
                          Session
                     </th>
                     <th scope="col" class="px-6 py-3">
                         Subject
                     </th>
                     <th scope="col" class="px-6 py-3">
                         Written
                     </th>
                     <th scope="col" class="px-6 py-3">
                         Practical
                     </th>
                     <th scope="col" class="px-6 py-3">
                         Viva
                     </th>

                 </tr>
                 </thead>
                 <tbody>
                 @forelse($students??[] as $student)
                 <tr class="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                     <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          {{$student->name??''}}
                     </th>
                     <td class="px-6 py-4">
                         {{$student->session->name??''}}
                     </td>
                     <td class="px-6 py-4">
                         {{$student->subject->name??''}}
                     </td>
                     <td class="px-6 py-4">
                         {{$student->result->written??''}}
                     </td>
                     <td class="px-6 py-4">
                         {{$student->result->practical??''}}
                     </td>
                     <td class="px-6 py-4">
                         {{$student->result->viva??''}}
                     </td>
                 </tr>
                 @empty
                      <tr>
                          <td> </td>
                          <td> </td>

                          <td class="text-red-500">Not Found Student</td>
                      </tr>
                 @endforelse

                 </tbody>
             </table>
         </div>

     </div>
</x-app-layout>
