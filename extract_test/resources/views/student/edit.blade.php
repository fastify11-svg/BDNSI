<x-app-layout>
    <x-slot name="header">
        <div class="flex justify-between">
            <div class="text-xl">{{ __('Edit Student') }}</div>
            <div>
                <a
                    class="border border-slate-500 py-1 px-4 rounded text-slate-700 text-sm hover:text-white hover:bg-slate-700"
                    href="{{ route('student.index') }}">{{ __('Students') }}</a>
            </div>
        </div>
    </x-slot>
    <div x-data="centerRequestData">
        <form action="{{ route('student.update', $student->id) }}" method="POST" enctype="multipart/form-data">
            @csrf
            @method('PUT')
            <div class="flex flex-wrap justify-center w-full bg-white p-4">
                <x-labeled-input name="name" :value="$student->name" required class="w-full p-1 md:w-1/2 lg:w-1/3"/>
                <x-labeled-input name="fathers_name" :value="$student->fathers_name" required class="w-full p-1 md:w-1/2 lg:w-1/3"/>
                <x-labeled-input name="mothers_name" :value="$student->mothers_name" required class="w-full p-1 md:w-1/2 lg:w-1/3"/>
                <x-labeled-input name="date_of_birth" :value="$student->date_of_birth" type="text" class="w-full p-1 md:w-1/2 lg:w-1/3"/>
                <x-labeled-select name="gender" required class="w-full p-1 md:w-1/2 lg:w-1/3">
                    @foreach(\App\Enums\Gender::getInstances() as $gender)
                        <option value="{{ $gender->value }}" @selected(old('gender', $student->gender->value) == $gender->value)>{{ $gender->key }}</option>
                    @endforeach
                </x-labeled-select>

                <x-labeled-select name="religion" required class="w-full p-1 md:w-1/2 lg:w-1/3">
                    @foreach(\App\Enums\Religion::getInstances() as $religion)
                        <option value="{{ $religion->value }}" @selected(old('religion', $student->religion->value) == $religion->value)>{{ $religion->key }}</option>
                    @endforeach
                </x-labeled-select>
                <!-- Hidden input field to store present_address -->
                <input type="hidden" name="present_address" x-bind:value="present_address">

                <!-- District Select -->
                <x-labeled-select class="w-full p-1 md:w-1/2 lg:w-1/3" x-model="district" name="district" required>
                    <option value="">Select District</option>
                    @foreach($districts as $district)
                        <option value="{{ $district->id }}" {{$student->present_address == $district->name ? 'selected' : ''}}>{{ $district->name??'' }}</option>
                    @endforeach
                </x-labeled-select>

                <!-- Upazila Select -->
                <x-labeled-select class="w-full p-1 md:w-1/2 lg:w-1/3" x-model="permanent_address" name="permanent_address" required>
                    <option value="">Select Upazila</option>
                    <template x-for="upazila in upazillas" :key="upazila.id">
                        <option :value="upazila.name" :selected="upazila.name === permanent_address" x-text="upazila.name"></option>
                    </template>
                </x-labeled-select>

                <x-passport-input name="passport" :value="$student->passport"  label="Passport Number"  class="w-full p-1 md:w-1/2 lg:w-1/3"/>
                <x-labeled-input label="Mobile No" name="phone" :value="$student->phone" pattern="\d{11}" x-data x-on:input="$event.target.setCustomValidity($event.target.validity.patternMismatch ? 'Phone number should be 11 digits' : '')"   class="w-full p-1 md:w-1/2 lg:w-1/3"/>
                <x-labeled-select name="session_id" label="Session" required class="w-full p-1 md:w-1/2 lg:w-1/3">
                    @foreach($sessions as $session)
                        <option value="{{ $session->id }}" @selected(old('session_id', $student->session_id) == $session->id)>{{ $session->name }}</option>
                    @endforeach
                </x-labeled-select>
                <x-select2 name="subject_id" label="Course Name" required class="w-full p-1 md:w-1/2 lg:w-1/3">
                    @foreach($subjects as $subject)
                        <option value="{{ $subject->id }}" @selected(old('subject_id', $student->subject_id) == $subject->id)>{{ $subject->name }}</option>
                    @endforeach
                </x-select2>



                <x-labeled-select name="qualification" label="Qualification" required class="w-full p-1 md:w-1/2 lg:w-1/3">
                    <option  value=" ">--Select-- </option>
                    <option {{$student->qualification =='Psc'  ? 'selected' : ''}} value="Psc">Psc</option>
                    <option {{$student->qualification =='Jsc'  ? 'selected' : ''}} value="Jsc">Jsc</option>
                    <option {{$student->qualification =='Ssc'  ? 'selected' : ''}} value="Ssc">Ssc</option>
                    <option {{$student->qualification =='Hsc' ? 'selected'  : ''}} value="Hsc">Hsc</option>
                    <option {{$student->qualification =='Hon\'s' ? 'selected'  : ''}} value="Hon's">Hon's</option>
                    <option {{$student->qualification =='Master\'s' ? 'selected'  : ''}} value=Master's>Master's</option>
                    <option {{$student->qualification =='Diploma Engineering' ? 'selected'  : ''}} value="Diploma Engineering">Diploma Engineering</option>
                </x-labeled-select>
                <x-labeled-input name="picture" type="file" accept="image/*" class="w-full p-1 md:w-1/2 lg:w-1/3"/>
                <div class="w-full py-8 flex justify-center">
                    <x-button>{{ __('Update') }}</x-button>
                </div>
            </div>
        </form>
    </div>

    <script>
        document.addEventListener('alpine:init', () => {
            Alpine.data('centerRequestData', () => ({
                district: @json( \App\Models\District::getDistrictIdByName($student->present_address) ?? ''),
                present_address: @json($student->present_address ?? ''),
                permanent_address: @json($student->permanent_address ?? ''),
                upazillas: [],
                init() {
                    if (this.district) {
                        this.filterUpazillas(this.district);
                    }
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
                    const upazillas = Object.entries(@js($upazilas)).map(([id, upazila]) => ({
                        id: id,
                        name: upazila.name,
                        district_id: upazila.district_id
                    }));

                    // Filter upazillas based on districtId
                    this.upazillas = upazillas.filter(upazila => upazila.district_id == districtId);

                    // Automatically pre-select the upazila if editing
                    if (this.permanent_address) {
                        const selectedUpazila = this.upazillas.find(u => u.name === this.permanent_address);
                        if (selectedUpazila) {
                            this.permanent_address = selectedUpazila.name; // Pre-select upazila
                        } else {
                            this.permanent_address = ''; // Reset if no match found
                        }
                    }
                },

                updatePresentAddress(districtId) {
                    const districts = @js($districts_keys);
                    const selectedDistrict = districts[districtId];
                    if (selectedDistrict) {
                        this.present_address = selectedDistrict.name; // Set the district name in the hidden field
                    }
                }
            }));
        });

    </script>
</x-app-layout>
