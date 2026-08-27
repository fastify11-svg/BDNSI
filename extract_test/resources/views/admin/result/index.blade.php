<x-admin-app-layout>
    <x-slot name="header">
        <div class="w-full flex justify-between">
            <div class="text-xl">{{ __('Result') }}</div>
            @can('result-read')
                <div>
                    <a class="border border-slate-500 py-1 px-4 rounded text-slate-700 text-sm hover:text-white hover:bg-slate-700"
                       href="{{ route('admin.result.create') }}">{{ __('Create Result') }}</a>
                </div>
            @endcan
        </div>
    </x-slot>

    <div class="flex flex-wrap justify-center w-full bg-white p-4">
        <form class="w-full" action="{{ route('admin.result.index') }}" method="GET">
            <div class="w-full flex flex-wrap">
                <x-select2 name="center" required class="w-full p-1 md:w-1/2 lg:w-1/3">
                    @foreach($centers as $center)
                        <option value="{{ $center->id }}" @selected(old('center', request('center')) == $center->id)>{{ $center->name }}</option>
                    @endforeach
                </x-select2>
                <x-select2 name="session" label="Session" required class="w-full p-1 md:w-1/2 lg:w-1/3">
                    @foreach($sessions as $session)
                        <option value="{{ $session->id }}" @selected(old('sessions', request('sessions')) == $session->id)>{{ $session->name }}</option>
                    @endforeach
                </x-select2>
                <x-select2 name="subject" label="Subject" required class="w-full p-1 md:w-1/2 lg:w-1/3">
                    @foreach($subjects as $subject)
                        <option value="{{ $subject->id }}" @selected(old('subject', request('subject')) == $subject->id)>{{ $subject->name }}</option>
                    @endforeach
                </x-select2>
                <div class="w-full pt-4 flex justify-end">
                    <x-button>{{ __('Search') }}</x-button>
                </div>
            </div>
        </form>
    </div>

    <div class="flex flex-wrap justify-center w-full bg-white mt-8">
        <table class="w-full">
            <thead>
            <tr>
                <th class="p-2 border">Student</th>
                <th class="p-2 border">Roll</th>
                <th class="p-2 border">Registration</th>
                <th class="p-2 border">Written</th>
                <th class="p-2 border">Practical</th>
                <th class="p-2 border">Viva</th>
                <th class="p-2 border">C GPA</th>
                <th class="p-2 border">View</th>
            </tr>
            </thead>
            <tbody>
            @foreach($students as $student)
                <tr x-data="{ w: {{ optional($student->result)->written ?? 0 }}, p: {{ optional($student->result)->practical ?? 0 }}, v: {{ optional($student->result)->viva ?? 0 }} }">
                    <td class="p-1 border">{{ $student->name }}</td>
                    <td class="p-1 border">{{ $student->roll }}</td>
                    <td class="p-1 border">{{ $student->registration }}</td>
                    <td class="p-1 border w-28" x-html="w"></td>
                    <td class="p-1 border w-28" x-html="p"></td>
                    <td class="p-1 border w-28" x-html="v"></td>
                    <td class="p-1 border">
                        <div class="text-center" x-html="calculateGPA(parseInt(w)+parseInt(p)+parseInt(v))"></div>
                    </td>
                    <td class="p-1 border">{{ optional(optional($student->result)->created_at)->toDateString() }}</td>
                    <td class="p-1 border">
                        @if($student->result)
                        <div class="w-full flex justify-center">
                            <a href="{{ route('admin.result.show', $student->result->id) }}">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                    <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                                </svg>
                            </a>
                        </div>
                        @endif
                    </td>
                </tr>
            @endforeach
            </tbody>
        </table>
    </div>

    <x-slot name="beforeScript">
        <x-calculate-gpa-script />
    </x-slot>
</x-admin-app-layout>
