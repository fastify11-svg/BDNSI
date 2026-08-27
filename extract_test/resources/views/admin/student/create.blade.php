<x-admin-app-layout>
    <x-slot name="header">
        <div class="w-full flex justify-between">
            <div class="text-xl">{{ __('Create Student') }}</div>
            @can('student-read')
            <div>
                <a
                    class="border border-slate-500 py-1 px-4 rounded text-slate-700 text-sm hover:text-white hover:bg-slate-700"
                    href="{{ route('admin.student.index') }}">{{ __('Students') }}</a>
            </div>
            @endcan
        </div>
    </x-slot>

    <form action="{{ route('admin.student.store') }}" method="POST" enctype="multipart/form-data">
        @csrf
        <div class="flex flex-wrap justify-center w-full bg-white p-4" x-data="centerRequestData">
            <x-labeled-select name="center_id" label="Institute Name" required class="w-full p-1 md:w-1/2 lg:w-1/3">
                @foreach($centers as $center)
                    <option value="{{ $center->id }}" @selected(old('center_id') == $center->id)>{{ $center->name }}</option>
                @endforeach
            </x-labeled-select>
            <x-labeled-input name="name" required class="w-full p-1 md:w-1/2 lg:w-1/3"/>
            <x-labeled-input value="{{$roll}}" name="roll" class="w-full p-1 md:w-1/2 lg:w-1/3"/>
            <x-labeled-input value="{{$registration}}" name="registration" class="w-full p-1 md:w-1/2 lg:w-1/3"/>
            <x-passport-input name="passport" label="Passport Number" class="w-full p-1 md:w-1/2 lg:w-1/3"/>
            <x-labeled-input name="fathers_name" required class="w-full p-1 md:w-1/2 lg:w-1/3"/>
            <x-labeled-input name="mothers_name" required class="w-full p-1 md:w-1/2 lg:w-1/3"/>
            <x-labeled-input name="date_of_birth" type="text" class="w-full p-1 md:w-1/2 lg:w-1/3"/>
            <x-labeled-select name="gender" required class="w-full p-1 md:w-1/2 lg:w-1/3">
                @foreach(\App\Enums\Gender::getInstances() as $gender)
                    <option value="{{ $gender->value }}" @selected(old('gender') == $gender->value)>{{ $gender->key }}</option>
                @endforeach
            </x-labeled-select>

            <x-labeled-select name="religion" required class="w-full p-1 md:w-1/2 lg:w-1/3">
                @foreach(\App\Enums\Religion::getInstances() as $religion)
                    <option value="{{ $religion->value }}" @selected(old('religion') == $religion->value)>{{ $religion->key }}</option>
                @endforeach
            </x-labeled-select>
            <input type="hidden" name="present_address" x-bind:value="present_address">

            <x-labeled-select class="w-full p-1 md:w-1/2 lg:w-1/3" x-model="district"   name="district" required>
                <option value="">Select District</option>
                @foreach( $districts as  $district)
                    <option value="{{ $district->id }}">{{ $district->name??''}}</option>
                @endforeach
            </x-labeled-select>

            <x-labeled-select class="w-full p-1 md:w-1/2 lg:w-1/3" x-model="upazilla" name="permanent_address" label="Upazila" required>
                <option value="">Select Upazila</option>
                <template x-for="upazilla in upazillas" :key="upazilla.id">
                    <option :value="upazilla.name" x-text="upazilla.name"></option>
                </template>
            </x-labeled-select>


            <x-labeled-input required label="Mobile No" name="phone" pattern="\d{11}" x-data x-on:input="$event.target.setCustomValidity($event.target.validity.patternMismatch ? 'Phone number should be 11 digits' : '')"   class="w-full p-1 md:w-1/2 lg:w-1/3"/>

            <x-select2 name="session_id" label="Session" required class="w-full p-1 md:w-1/2 lg:w-1/3">
                @foreach($sessions as $session)
                    <option value="{{ $session->id }}" @selected(old('session_id') == $session->id)>{{ $session->name }}</option>
                @endforeach
            </x-select2>

            <x-select2 name="subject_id" label="Course Name" required class="w-full p-1 md:w-1/2 lg:w-1/3">
                @foreach($subjects as $subject)
                    <option value="{{ $subject->id }}" @selected(old('subject_id') == $subject->id)>{{ $subject->name }}</option>
                @endforeach
            </x-select2>

            <x-select2 name="course_type" label="Course Type" required class="w-full p-1 md:w-1/2 lg:w-1/3">
                @foreach(\App\Enums\CourseType::getInstances() as $type)
                    <option value="{{ $type->value }}"  >{{ $type->description }}</option>
                @endforeach
            </x-select2>


            <div class="w-full p-1 md:w-1/2 lg:w-1/3">
                <label for="course_duration" class="block font-medium text-sm text-gray-700 font-semibold py-2">Course Duration</label>
                <input    list="course_duration_options" required class="rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 w-full p-2 border-2 border-gray-400" name="course_duration" id="course_duration"   placeholder="Select or enter a duration">
                <datalist id="course_duration_options">
                    <option value="Two Month">
                    <option value="Three Month">
                    <option value="Six Month">
                    <option value="One Years">
                    <option value="Two Years">
                    <option value="Three Years">
                    <option value="Four Years">
                    <option value="Others">
                </datalist>
            </div>


            <x-labeled-select name="qualification" label="Qualification" required class="w-full p-1 md:w-1/2 lg:w-1/3">
                <option value="">--Select-- </option>
                <option value="Psc">Psc</option>
                <option value="Jsc">Jsc</option>
                <option value="Ssc">Ssc</option>
                <option value="Hsc">Hsc</option>
                <option value="Hon's">Hon's</option>
                <option value=Master's>Master's</option>
                <option value="Diploma Engineering">Diploma Engineering</option>
            </x-labeled-select>

            <x-labeled-select name="status" required class="w-full p-1 md:w-1/2 lg:w-1/3">
                @foreach(\App\Enums\StudentStatus::getInstances() as $status)
                    <option value="{{ $status->value }}" @selected(old('status') == $status->value)>{{ $status->key }}</option>
                @endforeach
            </x-labeled-select>

            <x-labeled-input name="picture" required type="file" accept="image/*" class="w-full p-1 md:w-1/2 lg:w-1/3"/>
            <div class="w-full py-8 flex justify-center">
                <x-button>{{ __('Create') }}</x-button>
            </div>
        </div>
    </form>



    <script>
        document.addEventListener('alpine:init', () => {
            Alpine.data('centerRequestData', () => ({
                district: '',
                present_address: '',
                upazillas: [],
                init() {
                    this.$watch('district', (value) => {
                        if (value) {
                            this.filterUpazillas(value);
                            this.updatePresentAddress(value);
                        } else {
                            this.upazillas = [];
                            this.present_address = '';
                        }
                    });
                },
                filterUpazillas(districtId) {
                    const upazillas = Object.entries(@js($upazilas)).map(([id, upazilla]) => ({
                        id: id,
                        name: upazilla.name,
                        district_id: upazilla.district_id
                    }));

                    this.upazillas = upazillas.filter(upazilla => upazilla.district_id == districtId);
                },
                updatePresentAddress(districtId) {
                    const districts = @js($districts_keys);
                    const selectedDistrict = districts[districtId];
                    if (selectedDistrict) {
                        this.present_address = selectedDistrict.name;
                    }
                }
            }));
        });
    </script>
</x-admin-app-layout>
