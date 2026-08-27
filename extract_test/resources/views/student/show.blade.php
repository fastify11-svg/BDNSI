<x-app-layout>
    <x-slot name="header">
        <div class="w-full flex justify-between">
            <div class="text-xl">{{ __('Student Details') }}</div>
            <div>
                <a
                    class="border border-slate-500 py-1 px-4 rounded text-slate-700 text-sm hover:text-white hover:bg-slate-700"
                    href="{{ route('student.index') }}">{{ __('Students') }}</a>
            </div>
        </div>
    </x-slot>

    <div class="w-full bg-white flex flex-wrap p-4">
        @if(is_null($student->result_publised) && $student->created_at->diffInDays(now()) >= 30)
        <div class="w-full mb-4">
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong class="font-bold">Result Overdue Warning!</strong>
                <span class="block sm:inline">Registration is {{ $student->created_at->diffInDays(now()) }} days old but result is not published yet. If it exceeds 45 days, this student record will be auto-deleted by the system.</span>
            </div>
        </div>
        @endif
        <div class="w-full md:w-1/2 lg:w-1/3 flex justify-center p-2">
            <img class="h-64 w-64" src="{{ $student->picture??'' }}" alt="Avatar of {{ $student->picture }}"/>
        </div>
        <div class="w-full md:w-1/2 lg:w-1/3">
            <table>
                <tr>
                    <td class="p-2 font-semibold">{{ __('Name') }}</td>
                    <td class="p-2">{{ $student->name??'' }}</td>
                </tr>
                <tr>
                    <td class="p-2 font-semibold">{{ __('Fathers Name') }}</td>
                    <td class="p-2">{{ $student->fathers_name??'' }}</td>
                </tr>
                <tr>
                    <td class="p-2 font-semibold">{{ __('Mothers Name') }}</td>
                    <td class="p-2">{{ $student->mothers_name??'' }}</td>
                </tr>
                <tr>
                    <td class="p-2 font-semibold">{{ __('Date of Birth') }}</td>
                    <td class="p-2">{{ $student->date_of_birth??'' }}</td>
                </tr>
                <tr>
                    <td class="p-2 font-semibold">{{ __('Gender') }}</td>
                    <td class="p-2">{{ $student->gender->key??'' }}</td>
                </tr>
                <tr>
                    <td class="p-2 font-semibold">{{ __('Blood Group') }}</td>
                    <td class="p-2">{{ $student->blood_group??'' }}</td>
                </tr>
                <tr>
                    <td class="p-2 font-semibold">{{ __('Religion') }}</td>
                    <td class="p-2">{{ $student->religion->key??'' }}</td>
                </tr>
                <tr>
                    <td class="p-2 font-semibold">{{ __('District') }}</td>
                    <td class="p-2">{{ $student->present_address??'' }}</td>
                </tr>
                <tr>
                    <td class="p-2 font-semibold">{{ __('Upazila') }}</td>
                    <td class="p-2">{{ $student->permanent_address??'' }}</td>
                </tr>
                <tr>
                    <td class="p-2 font-semibold">{{ __('Guardian Name') }}</td>
                    <td class="p-2">{{ $student->guardian_name??'' }}</td>
                </tr>
            </table>
        </div>
        <div class="w-full md:w-1/2 lg:w-1/3">
            <table>
                <tr>
                    <td class="p-2 font-semibold">{{ __('Center Code') }}</td>
                    <td class="p-2">{{ $student->center->code??'' }}</td>
                </tr>
                <tr>
                    <td class="p-2 font-semibold">{{ __('Center Name') }}</td>
                    <td class="p-2">{{ $student->center->name??'' }}</td>
                </tr>
                <tr>
                    <td class="p-2 font-semibold">{{ __('Roll') }}</td>
                    <td class="p-2">{{ $student->roll ??'Pending' }}</td>
                </tr>
                <tr>
                    <td class="p-2 font-semibold">{{ __('Registration') }}</td>
                    <td class="p-2">{{ $student->registration??'Pending' }}</td>
                </tr>
                <tr>
                    <td class="p-2 font-semibold">{{ __('Passport Number') }}</td>
                    <td class="p-2">{{ $student->passport??'' }}</td>
                </tr>
                <tr>
                    <td class="p-2 font-semibold">{{ __('Course Duration') }}</td>
                    <td class="p-2">{{ $student->course_duration??'' }}</td>
                </tr>

                <tr>
                    <td class="p-2 font-semibold">{{ __('Session') }}</td>
                    <td class="p-2">{{ $student->session->name??'' }}</td>
                </tr>
                <tr>
                    <td class="p-2 font-semibold">{{ __('Subject') }}</td>
                    <td class="p-2">{{ $student->subject->name??'' }}</td>
                </tr>
                <tr>
                    <td class="p-2 font-semibold">{{ __('Status') }}</td>
                    <td class="p-2">{{ $student->status->key??'' }}</td>
                </tr>
                <tr>
                    <td class="p-2 font-semibold">{{ __('NID or Birth.') }}</td>
                    <td class="p-2">{{ $student->nid_or_birth??'' }}</td>
                </tr>
                <tr>
                    <td class="p-2 font-semibold">{{ __('Phone') }}</td>
                    <td class="p-2">{{ $student->phone??'' }}</td>
                </tr>
                <tr>
                    <td class="p-2 font-semibold">{{ __('Email') }}</td>
                    <td class="p-2">{{ $student->email??'' }}</td>
                </tr>
            </table>
        </div>
    </div>
</x-app-layout>
