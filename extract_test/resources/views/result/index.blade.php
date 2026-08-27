<x-app-layout>
    <style>
        .textDeg{
            text-transform: capitalize!important;
        }
    </style>
    <x-slot name="header">
        <div class="w-full flex justify-between">
            <div class="text-xl">{{ __t('Submit Student') }}</div>
        </div>
    </x-slot>

    <div class="flex flex-wrap justify-center w-full bg-white p-4">
        <form class="w-full" action="{{ route('student-submission.create') }}" method="GET">
            <div class="w-full flex flex-wrap">
                <x-select2 name="session" label="Session" required class="w-full p-1 md:w-1/2 lg:w-1/3">
                    @foreach($sessions as $session)
                        <option
                            value="{{ $session->id }}" @selected(old('sessions', request('sessions')) == $session->id)>{{ $session->name }}</option>
                    @endforeach
                </x-select2>
                <x-select2 name="subject" label="Subject" required class="w-full p-1 md:w-1/2 lg:w-1/3">
                    @foreach($subjects as $subject)
                        <option
                            value="{{ $subject->id }}" @selected(old('subject', request('subject')) == $subject->id)>{{ $subject->name }}</option>
                    @endforeach
                </x-select2>
                <div class="w-full pt-4 flex justify-end lg:w-1/3">
                    <x-button>{{ __t('Search') }}</x-button>
                </div>
            </div>
        </form>
    </div>
    <form class="w-full" action="{{ route('student-submission.store') }}" method="POST">
        @csrf
        <div class="w-full flex flex-wrap justify-center w-full textDeg bg-white mt-8" x-data>
            <table class="w-full">
                <thead>
                <tr>
                    <th class="p-2 border">
                        <input type="checkbox"
                               x-on:input="Array.from(document.querySelectorAll('.checkbox')).forEach(checkbox => checkbox.checked = $event.target.checked)"/>
                    </th>
                    <th class="p-2 border">Name</th>
                    <th class="p-2 border">Father's Name</th>
                    <th class="p-2 border">Mother's Name</th>
                    <th class="p-2 border">Roll</th>
                    <th class="p-2 border">Registration</th>
                </tr>
                </thead>
                <tbody>
                @foreach($students as $student)
                    <tr>
                        <td class="p-2 border text-center w-8">
                            <input type="checkbox" class="checkbox" name="id[]" id="checkbox[{{ $loop->iteration }}]"
                                   value="{{ $student->id }}"/>
                        </td>
                        <td class="p-1 border">
                            <label for="checkbox[{{ $loop->iteration }}]">{{ $student->name }}</label>
                        </td>
                        <td class="p-1 border">{{ $student->fathers_name }}</td>
                        <td class="p-1 border">{{ $student->mothers_name }}</td>
                        <td class="p-1 border">{{ $student->roll }}</td>
                        <td class="p-1 border">{{ $student->registration }}</td>
                    </tr>
                @endforeach
                </tbody>
            </table>
            <div class="w-full p-4 flex justify-end">
                <x-button>{{ __t('Submit') }}</x-button>
            </div>
    </div>
    </form>
</x-app-layout>
