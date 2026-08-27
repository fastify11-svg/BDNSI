<x-frontend-layouts>
    <div class="container mt-4"x-data="centerData">

        <div class="row shadow-lg p-4">
            <div class="col-12 text-center  font-weight-bold h4 border-bottom mb-3" style="color:#6aa84f">
               {{__t(' Institute Apply Form')}}
            </div>

            <form action="{{ route('center-request.store') }}" method="POST" enctype="multipart/form-data">
                @csrf

                <!-- Success and Error messages -->
                @if($success = session(\App\Mixin\ResponseMixin::SUCCESS_MESSAGE_SESSION_KEY))
                    <div class="col-12 p-3 alert alert-success">{{ $success }}</div>
                @endif
                @if($error = session(\App\Mixin\ResponseMixin::ERROR_MESSAGE_SESSION_KEY))
                    <div class="col-12 p-3 alert alert-danger">{{ $error }}</div>
                @endif

                <!-- Validation Errors -->
                <div class="col-12">
                    <x-auth-validation-errors />
                </div>

                <div class="row">
                    <!-- Institute Name -->
                    <div class="col-12 col-md-6 mb-3">
                        <x-frontend.input class="form-control" name="name" label="Institute Name" required />
                    </div>

                    <!-- Director Name -->
                    <div class="col-12 col-md-6 mb-3">
                        <x-frontend.input class="form-control" label="Director Name" name="owner_name" required />
                    </div>

                    <!-- Director Photo -->
                    <div class="col-12 col-md-6 mb-3">
                        <x-frontend.input type="file" class="form-control" name="director_image" label="Institute Logo" required />
                    </div>

                    <!-- Father's Name -->
                    <div class="col-12 col-md-6 mb-3">
                        <x-frontend.input class="form-control" name="fathers_name" required />
                    </div>

                    <!-- Mother's Name -->
                    <div class="col-12 col-md-6 mb-3">
                        <x-frontend.input class="form-control" name="mothers_name" required />
                    </div>

                    <!-- Religion -->
                    <div class="col-12 col-md-6 mb-3">
                        <x-frontend.select class="form-control" name="religion" required>
                            @foreach(\App\Enums\Religion::getInstances() as $religion)
                                <option value="{{ $religion->value }}" @selected(old('religion') == $religion->value)>{{ $religion->key }}</option>
                            @endforeach
                        </x-frontend.select>
                    </div>

                    <!-- Gender -->
                    <div class="col-12 col-md-6 mb-3">
                        <x-frontend.select class="form-control " name="gender" required>
                            @foreach(\App\Enums\Gender::getInstances() as $gender)
                                <option value="{{ $gender->value }}" @selected(old('gender') == $gender->value)>{{ $gender->key }}</option>
                            @endforeach
                        </x-frontend.select>
                    </div>


                    <div class="col-12 col-md-6 mb-3 ">
                            <div class="border rounded p-2">
                                <label for="division" class="font-weight-bold label-name" style="color: #6aa84f">Division</label>
                                <select   class="form-control input-name" name="division" x-model="division" required aria-label="Division select" @change="filterDistricts()">
                                    <option value="" disabled>{{__t('Select Division')}}</option>
                                    @foreach($divisions as  $division)
                                        <option value="{{ $division->id }}" @selected(old('division') == $division->id)>{{ $division->name }}</option>
                                    @endforeach
                                </select>
                            </div>
                    </div>

                    <div class="col-12 col-md-6 p-2 mb-3 ">
                             <div class="border rounded p-2">
                                 <label for="district" class="font-weight-bold label-name " style="color: #6aa84f">{{__t('District')}}</label>
                                 <select class="form-control input-name" name="district" x-model="district" required aria-label="District select" @change="filterUpazillas()">
                                     <option value="" disabled>{{__t('Select District')}}</option>
                                     <template x-for="district in districts" :key="district.id">
                                         <option :value="district.id" x-text="district.name"></option>
                                     </template>
                                 </select>
                             </div>
                    </div>

                    <div class="col-12 col-md-6 mb-3 p-2 ">
                           <div class="border rounded p-2">
                               <label for="upazilla" class="font-weight-bold label-name" style="color: #6aa84f">{{__t('Upazilla')}}</label>
                               <select class="form-control input-name" name="upazilla" x-model="upazilla" required aria-label="Upazilla select">
                                   <option value="" disabled>{{__t('Select Upazilla')}}</option>
                                   <template x-for="upazilla in upazillas" :key="upazilla.id">
                                       <option :value="upazilla.id" x-text="upazilla.name"></option>
                                   </template>
                               </select>
                           </div>
                    </div>


                    <div class="col-12 col-md-6 mb-3">
                        <x-frontend.input class="form-control" name="post_office" required />
                    </div>

                    <!-- Address -->
                    <div class="col-12 col-md-6 mb-3">
                        <x-frontend.input class="form-control" name="address" required />
                    </div>

                    <!-- Mobile -->
                    <div class="col-12 col-md-6 mb-3">
                        <x-frontend.input class="form-control" type="number" required name="mobile" pattern="\d{11}" x-on:input="$event.target.setCustomValidity($event.target.validity.patternMismatch ? 'Phone number should be 11 digits' : '')" />
                    </div>

                    <!-- Email -->
                    <div class="col-12 col-md-6 mb-3">
                        <x-frontend.input class="form-control" name="email" required type="email" />
                    </div>

                    <!-- Institute Photo -->
                    <div class="col-12 col-md-6 mb-3">
                        <x-frontend.input class="form-control" label="Director Photo" name="photo" required type="file" accept="image/*" />
                    </div>

                    <!-- Director Signature -->
                    <div class="col-12 col-md-6 mb-3">
                        <x-frontend.input class="form-control" label="Director Signature" name="authority_signature" required type="file" accept="image/*" />
                    </div>

                    <!-- NID (Front) -->
                    <div class="col-12 col-md-6 mb-3">
                        <x-frontend.input class="form-control" label="Nid (Front Part)" name="nid_photo" required type="file" accept="image/*" />
                    </div>

                    <!-- NID (Back) -->
                    <div class="col-12 col-md-6 mb-3">
                        <x-frontend.input class="form-control" label="Nid (Back Part)" name="nid_back_photo" required type="file" accept="image/*" />
                    </div>

                    <!-- Submit Button -->
                    <div class="col-12 text-center py-4">
                        <button type="submit" class="btn text-white btn-lg" style="background: #6aa84f">{{ __t('Apply Now') }}</button>
                    </div>
                </div>
            </form>
        </div>
    </div>

    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>

    <script>
        $(document).ready(function () {
            setTimeout(() => {
                $('select').niceSelect('destroy');
            }, 1000);
        });


    </script>



    <script>
        document.addEventListener('alpine:init', () => {
            Alpine.data('centerData', () => ({
                division: '{{ old('division', '') }}',
                district: '{{ old('district', '') }}',
                upazilla: '{{ old('upazilla', '') }}',
                districts: [],
                upazillas: [],
                init() {
                    // Check if the division is already selected
                    if (this.division) {
                        this.filterDistricts();
                    }
                    // Check if the district is already selected
                    if (this.district) {
                        this.filterUpazillas();
                    }

                    // Watchers for changes to division and district
                    this.$watch('division', value => {
                        this.district = '';  // Reset district when division changes
                        this.upazilla = '';  // Reset upazilla when division changes
                        this.filterDistricts();
                    });

                    this.$watch('district', value => {
                        this.upazilla = '';  // Reset upazilla when district changes
                        this.filterUpazillas();
                    });
                },
                // Filter districts based on selected division
                filterDistricts() {
                    const allDistricts = @json($districts);
                    this.districts = Object.entries(allDistricts)
                        .map(([id, district]) => ({
                            id: id,
                            name: district.name,
                            division_id: district.division_id
                        }))
                        .filter(district => district.division_id == this.division);  // Filter by division
                },

                filterUpazillas() {
                    const allUpazillas = @json($upazilas);
                    console.log(allUpazillas)
                    this.upazillas = Object.entries(allUpazillas)
                        .map(([id, upazilla]) => ({
                            id: id,
                            name: upazilla.name,
                            district_id: upazilla.district_id
                        }))
                        .filter(upazilla => upazilla.district_id == this.district);  // Filter by district
                },
                resetFilters() {
                    // Reset all filters to initial state
                    this.division = '';
                    this.district = '';
                    this.upazilla = '';
                    this.districts = [];
                    this.upazillas = [];
                }
            }));
        });
    </script>


</x-frontend-layouts>
