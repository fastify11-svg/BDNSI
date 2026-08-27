<x-student-app-layout>
    <x-slot name="header">
        <div class="w-full flex justify-between">
            <div class="text-xl">{{ __('My Exam') }}</div>

        </div>
    </x-slot>

    <div class="max-w-7xl  mx-auto">


        <div class="w-full ">
            <div class="w-full mt-4">
                <div class="w-full bg-white shadow-lg border rounded-md p-5">
                    <div class="flex w-full justify-between">
                        <span class="text-center  font-bold">Exam question </span>
                        <div class="  ">
                            <h4 style="font-style: italic;" >Expired Time : <span id="demo">00</span> </h4>
                            <div id="timer">
                                <div id="days"></div>
                                <div id="hours"></div>
                                <div id="minutes"></div>
                                <div id="seconds"></div>
                            </div>

                        </div>
                    </div>
                    <div class="w-full">
                        <div class="w-full">
                            <div class="w-full">


                                    <form id="myForm" class="shadow p-4"   action="" method="post">
                                        @csrf
                                        <input type="hidden" value="{{$alldata->id??''}}" name="examId">
                                        <div class="w-full">
                                            <div class="w-full flex flex-wrap ">
                                                <div class="w-full">
                                                    <div class="w-full flex flex-wrap">
                                                        @php

                                                            $duration = \Carbon\Carbon::parse($alldata->start_time)->diff(\Carbon\Carbon::parse($alldata->end_time))
                                                        @endphp
                                                        <div class="w-full md:w-1/2"><h5>Exam
                                                                Name: {{$alldata->name??''}}</h5></div>
                                                        <div class="w-full md:w-1/2"><h6>Time: <span id="minutes"></span> minute
                                                                and <span id="seconds"></span> second</h6></div>
                                                        <div class="w-full md:w-1/2"><h5>Marks : </h5>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <hr>

                                        @foreach($alldata->questions as $data)
                                            <div class="w-full">
                                                <div class="w-full flex flex-wrap ">
                                                    <div class="w-full md:w-1/2 ">
                                                        <h5 class=""
                                                            style=" margin-left: 130px!important; color: #A23588;">{{$loop->iteration??''}}
                                                            . {{$data->body??''}} ?</h5>
                                                    </div>
                                                    <div class="w-full md:w-1/2 ">
                                                        <div class="form-group text-center">
                                                        <span><input type="radio" value="1" name="A{{$data->id??''}}"
                                                                     required><span
                                                                style="font-weight: bold; color: #228B22">  A. </span>{{$data->option_1??''}}</span>
                                                        </div>
                                                    </div>
                                                    <div class="w-full md:w-1/2 ">
                                                        <div class="form-group text-center">
                                                        <span><input type="radio" value="2" name="A{{$data->id??''}}"
                                                                     required> <span
                                                                style="font-weight: bold;color: #228B22"> B. </span>{{$data->option_2??''}}</span>
                                                        </div>
                                                    </div>
                                                    <div class="w-full md:w-1/2 ">
                                                        <div class="form-group text-center">
                                                        <span> <input type="radio" value="3" name="A{{$data->id??''}}"
                                                                      required> <span
                                                                style="font-weight: bold;color: #228B22"> C. </span> {{$data->option_3??''}}</span>
                                                        </div>
                                                    </div>
                                                    <div class="w-full md:w-1/2 ">
                                                        <div class="form-group text-center">
                                                        <span> <input type="radio" value="4" name="A{{$data->id??''}}"
                                                                      required><span
                                                                style="font-weight: bold;color: #228B22"> D. </span> {{$data->option_4??''}}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        @endforeach
                                        <div class="form-group text-center">
                                                <button type="submit" class="px-3 py-1 border rounded-md bg-green-600 text-white">Submit</button>

                                        </div>
                                    </form>
                                    {{--                                <script>--}}
                                    {{--                                    const start_time = {!! json_encode(\Carbon\Carbon::parse($alldata->start_time)->getTimestampMs()) !!};--}}
                                    {{--                                    const end_time = {!! json_encode(\Carbon\Carbon::parse($alldata->end_time)->getTimestampMs()) !!} - 1000 * 60;--}}
                                    {{--                                    const minutesElement = document.getElementById('minutes');--}}
                                    {{--                                    const secondsElement = document.getElementById('seconds');--}}
                                    {{--                                    let interval = setInterval(() => {--}}
                                    {{--                                        let remaining = end_time - (new Date()).getTime()--}}
                                    {{--                                        if (remaining <= 0) {--}}
                                    {{--                                            clearInterval(interval)--}}
                                    {{--                                            document.getElementById('myForm').submit();--}}
                                    {{--                                        }--}}
                                    {{--                                        let seconds = Math.round(remaining / 1000);--}}
                                    {{--                                        let minutes = Math.floor(seconds / 60)--}}
                                    {{--                                        seconds %= 60--}}
                                    {{--                                        minutesElement.innerText = minutes--}}
                                    {{--                                        secondsElement.innerText = seconds--}}
                                    {{--                                    }, 200)--}}
                                    {{--                                </script>--}}
                                    {{--                            @elseif(now() < \Carbon\Carbon::parse($alldata->start_time))--}}
                                    {{--                                Exam not started yet--}}
                                    {{--                                <script>--}}
                                    {{--                                    let time = {!! json_encode(\Carbon\Carbon::parse($alldata->start_time)->getTimestampMs()) !!};--}}
                                    {{--                                    let interval = setInterval(() => {--}}
                                    {{--                                        if ((new Date()).getTime() >= time) {--}}
                                    {{--                                            clearInterval(interval)--}}
                                    {{--                                            location.reload()--}}
                                    {{--                                        }--}}
                                    {{--                                    }, 200)--}}
                                    {{--                                </script>--}}
                                    {{--                            @elseif(\Carbon\Carbon::parse($alldata->end_time) < now())--}}
                                    {{--                                Exam finished--}}
                                    {{--                            @else--}}
                                    {{--                                Out of exam time--}}

                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </div>
        @php
            $time='1:1';
        @endphp


    </div>

</x-student-app-layout>
