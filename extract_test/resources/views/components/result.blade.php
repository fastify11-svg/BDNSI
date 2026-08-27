@props(['student'])


<div class="w-full">
    <div class="w-full m-auto flex items-center flex-col justify-between h-[90%] gap-3">
        <div class="text-center py-4">
            <h1 class="font-semibold text-3xl text-[#7024A8]">{{config('site.setting.name')}}</h1>
            <p class="text-lg font-medium text-orange-400">Govt. License No: {{config('site.setting.rj_no')}}</p>
        </div>
        <img style="border: 2px solid #7024A8!important;" class="h-52 w-52 object-center border-2 rounded-3xl " src="{{ $student->picture }}" alt="{{ $student->name }}" />
        <div class="w-full border-2 border-[#7024A8] rounded-md">
            <!-- Header Row -->
            <div class="w-full flex flex-wrap rounded-tl-md rounded-tr-md bg-[#BC96D8] text-white">
                <div class="w-4/12 md:w-2/12 border-r-2 border-b-2 border-[#7024A8] font-semibold text-sm flex items-center py-4 px-4">Name</div>
                <div class="w-8/12 md:w-4/12 md:border-r-2 border-b-2 border-[#7024A8] font-semibold text-sm flex items-center py-4 px-4">{{ $student->name ?? '' }}</div>
                <div class="w-4/12 md:w-2/12 border-r-2 border-b-2 border-[#7024A8] font-semibold text-sm flex items-center py-4 px-4">Roll</div>
                <div class="w-8/12 md:w-4/12 border-b-2 border-[#7024A8] font-semibold text-sm flex items-center py-4 px-4">{{ $student->roll ?? '' }}</div>
            </div>
            <!-- Row 2 -->
            <div class="w-full flex flex-wrap">
                <div class="w-4/12 md:w-2/12 border-r-2 border-b-2 border-[#7024A8] font-semibold text-sm flex items-center py-4 px-4">Father's Name</div>
                <div class="w-8/12 md:w-4/12 md:border-r-2 border-b-2 border-[#7024A8] font-semibold text-sm flex items-center py-4 px-4">{{ $student->fathers_name ?? '' }}</div>
                <div class="w-4/12 md:w-2/12 border-r-2 border-b-2 border-[#7024A8] font-semibold text-sm flex items-center py-4 px-4 text-center">Registration Number</div>
                <div class="w-8/12 md:w-4/12 md:border-r-2 border-b-2 border-[#7024A8] font-semibold text-sm flex items-center py-4 px-4">{{ $student->registration ?? '' }}</div>
            </div>
            <!-- Row 3 -->
            <div class="w-full bg-[#BC96D8] text-white flex flex-wrap">
                <div class="w-4/12 md:w-2/12 border-r-2 border-b-2 border-[#7024A8] font-semibold text-sm flex items-center py-4 px-4">Mother's Name</div>
                <div class="w-8/12 md:w-4/12 md:border-r-2 border-b-2 border-[#7024A8] font-semibold text-sm flex items-center py-4 px-4">{{ $student->mothers_name ?? '' }}</div>
                <div class="w-4/12 md:w-2/12 border-r-2 border-b-2 border-[#7024A8] font-semibold text-sm flex items-center py-4 px-4">Session</div>
                <div class="w-8/12 md:w-4/12 md:border-r-2 border-b-2 border-[#7024A8] font-semibold text-sm flex items-center py-4 px-4">{{ $student->session->name ?? '' }}</div>
            </div>
            <!-- Row 4 -->
            <div class="w-full flex flex-wrap">
                <div class="w-4/12 md:w-2/12 border-r-2 border-b-2 border-[#7024A8] font-semibold text-sm flex items-center py-4 px-4">Course Name</div>
                <div class="w-8/12 md:w-4/12 md:border-r-2 border-b-2 border-[#7024A8] font-semibold text-sm flex items-center py-4 px-4">{{ $student->subject->name ?? '' }}</div>
                <div class="w-4/12 md:w-2/12 border-r-2 border-b-2 border-[#7024A8] font-semibold text-sm flex items-center py-4 px-4">Course Duration</div>
                <div class="w-8/12 md:w-4/12 md:border-r-2 border-b-2 border-[#7024A8] font-semibold text-sm flex items-center py-4 px-4">{{ $student->course_duration ?? '' }}</div>
            </div>
            <!-- Row 5 -->
            <div class="w-full bg-[#BC96D8] text-white flex flex-wrap">
                <div class="w-4/12 md:w-2/12 border-r-2 border-b-2 border-[#7024A8] font-semibold text-sm flex items-center py-4 px-4">Institute Name</div>
                <div class="w-8/12 md:w-4/12 md:border-r-2 border-b-2 border-[#7024A8] font-semibold text-sm flex items-center py-4 px-4">{{ $student->center->name ?? '' }}</div>
                <div class="w-4/12 md:w-2/12 border-r-2 border-b-2 border-[#7024A8] font-semibold text-sm flex items-center py-4 px-4">Institute Code</div>
                <div class="w-8/12 md:w-4/12 md:border-b-2 border-[#7024A8] font-semibold text-sm flex items-center py-4 px-4">{{ $student->center->code ?? '' }}</div>
            </div>
            <!-- Footer Row -->
            <div class="w-full flex flex-wrap rounded-bl-md rounded-br-md">
                <div class="w-4/12 md:w-2/12 border-r-2 border-[#7024A8] font-semibold text-sm flex items-center py-4 px-4">Date of Birth</div>
                <div class="w-8/12 md:w-4/12 md:border-r-2 border-[#7024A8] font-semibold text-sm flex items-center py-4 px-4">{{ $student->date_of_birth ?? '' }}</div>
                <div class="w-4/12 md:w-2/12 border-r-2 border-[#7024A8] font-semibold text-sm flex items-center py-4 px-4">Passport No</div>
                <div class="w-8/12 md:w-4/12 border-[#7024A8] font-semibold text-sm flex items-center py-4 px-4">{{ $student->passport ?? '' }}</div>
            </div>
        </div>

        @if($student->result_publised !=null &&  $student->result)
            @php($result=optional($student->result))

            <div class="w-full border-2 border-[#7024A8] flex flex-col rounded-md mt-4">
                <div class="bg-[#BC96D8] text-white py-1 rounded-tl-md rounded-tr-md text-center">
                    <span class="font-bold">Marks</span>
                </div>
                <div class="w-full overflow-auto whitespace-nowrap">
                    <table class="min-w-full table-auto border-collapse border border-gray-200">
                        <thead>
                        <tr>
                            @foreach(['Written','Practical', 'Viva','Total','Total Mark','Grade', 'GPA'] as $header)
                                <th class="border border-gray-300 px-4 py-2 text-center font-medium">{{ $header }}</th>
                            @endforeach
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td class="border border-gray-300 text-center px-4 py-2">{{$result->written ??''}}</td>
                            <td class="border border-gray-300 text-center px-4 py-2">{{$result->practical ??''}}</td>
                            <td class="border border-gray-300 text-center px-4 py-2">{{$result->viva ??''}}</td>
                            <td class="border border-gray-300 text-center px-4 py-2">{{$result->written+ $result->practical +$result->viva }}</td>
                            <td class="border border-gray-300 text-center px-4 py-2">{{config('site.course_type.'.$student->course_type??'')}}</td>
                            <td class="border border-gray-300 text-center px-4 py-2">{{$student->t_written($result->written)}}</td>
                            <td class="border border-gray-300 text-center px-4 py-2">{{number_format($student->t_written_gpa($result->written),2)}}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        @else
            <div class="w-full p-2 border bg-gray-50 rounded text-center">Result Not Publish</div>
        @endif
    </div>
</div>
