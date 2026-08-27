<x-admin-app-layout>
    <style>
        .form-control{
            display: block;
            width: 100%;
            padding: 0.375rem 0.75rem;
            font-size: 1rem;
            font-weight: 400;
            line-height: 1.5;
            color: #212529;
            background-color: #fff;
            background-clip: padding-box;
            border: 1px solid #ced4da;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            border-radius: 0.25rem;
            transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;

        }
        .form-group{
            padding: 5px;
        }
    </style>
    <x-slot name="header">
        <div class="w-full flex justify-between">
            <div class="text-xl">{{ __('Question') }}</div>
            <div>
                <a class="border border-slate-500 py-1 px-4 rounded text-slate-700 text-sm hover:text-white hover:bg-slate-700"
                   href="{{ route('admin.exam.index') }}">{{ __('  Exam List') }}</a>
            </div>
        </div>
    </x-slot>

    <div class="m-2 p-2">
        <div class="bg-white rounded-lg shadow-md">
            <div class="bg-green-600 text-white p-4 flex justify-between items-center">
                <h4 class="text-xl font-bold">Question</h4>
                <h4 class="text-xl font-bold">Exam: <span class="text-lg">{{$alldata->name ?? ''}}</span></h4>
            </div>
            <div class="px-4 py-2">
                <div class="space-y-4">
                    @foreach($alldata->questions as $data)
                        <div class="border-b border-gray-200 pb-4">
                            <h4 class="text-green-600 text-lg">{{$loop->iteration ?? ''}}. {{$data->body ?? ''}} ?</h4>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                <div>
                                    <h6 class="font-bold">A. </h6>
                                    <p>{{$data->option_1 ?? ''}}</p>
                                </div>
                                <div>
                                    <h6 class="font-bold">B. </h6>
                                    <p>{{$data->option_2 ?? ''}}</p>
                                </div>
                                <div>
                                    <h6 class="font-bold">C. </h6>
                                    <p>{{$data->option_3 ?? ''}}</p>
                                </div>
                                <div>
                                    <h6 class="font-bold">D. </h6>
                                    <p>{{$data->option_4 ?? ''}}</p>
                                </div>
                            </div>
                            <div class="mt-2">
                                <p class="text-green-600 font-bold ">Answer:
                                    @if($data->answer==1)
                                        A
                                    @elseif ($data->answer==2)
                                        B
                                    @elseif($data->answer==3)
                                        C
                                    @elseif($data->answer==4)
                                        D
                                    @endif
                                </p>
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>
        </div>
    </div>

</x-admin-app-layout>
