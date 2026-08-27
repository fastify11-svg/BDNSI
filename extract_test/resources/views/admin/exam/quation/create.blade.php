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

    <div class="w-full mt-8">
        <div class="bg-white p-2">
              <div class="font-bold text-red-500">
                      @foreach($errors->all() as $e)
                            <div>{{$e}}</div>
                  @endforeach
              </div>
            <form action="{{route('admin.question.store')}}" method="post">
                @csrf
                <div class="w-full">
                        <x-labeled-select name="exam_id" id="" label="Exam Name" class="form-control">
                            @foreach($exams as $data)
                                <option value="{{$data->id}}">{{$data->name??''}}</option>
                            @endforeach
                        </x-labeled-select>

                    <div class="w-full p-4" x-data="{ contents: [0] }">
                        <template x-for="i in contents" x-bind:key="i">
                            <div class="w-full flex flex-wrap">
                                <div class="w-full flex justify-end">
                                    <button class="px-1   rounded-md  text-white bg-red-500 "   type="button" x-on:click="contents.splice(contents.indexOf(i), 1)">&times;</button>
                                </div>
                                <div class="w-full ">
                                    <div class="form-group">
                                        <label class="w-full font-bold text-green-600" for="">Body</label>
                                        <textarea name="body[]" id=""  cols="120" rows="2" class="form-control"></textarea>
                                    </div>
                                </div>
                                <div class="w-full md:w-1/2">
                                    <div class="form-group">
                                        <label class="w-full font-bold" for="">A</label>
                                        <input x-bind:name="'answer['+i+']'" type="radio" value="1"><input type="text" name="option_1[]" class="form-control">
                                    </div>
                                </div>
                                <div class="w-full md:w-1/2">
                                    <div class="form-group">
                                        <label class="w-full font-bold" for="">B</label>
                                        <input x-bind:name="'answer['+i+']'" type="radio" value="2"><input type="text" name="option_2[]" class="form-control">
                                    </div>
                                </div>
                                <div class="w-full md:w-1/2">
                                    <div class="form-group">
                                        <label class="w-full font-bold" for="">C</label>
                                        <input x-bind:name="'answer['+i+']'" type="radio" value="3"><input type="text" name="option_3[]" class="form-control">
                                    </div>
                                </div>
                                <div class="w-full md:w-1/2">
                                    <div class="form-group">
                                        <label class="w-full font-bold" for="">D</label>
                                        <input x-bind:name="'answer['+i+']'" type="radio" value="4"><input type="text" name="option_4[]" class="form-control">
                                    </div>
                                </div>
                            </div>
                        </template>
                       <div class="p-2">
                           <button  type="button" class="bg-green-600 text-white px-2 py-1 text-xs rounded-md" x-on:click="contents.push(contents.length)">Add</button>
                       </div>
                    </div>
                    <div class="w-full flex justify-center">
                        <button type="submit" class="px-3 py-1 rounded-md bg-black text-white">Submit</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</x-admin-app-layout>
