<x-admin-app-layout>
    <x-slot name="header">
        <div class="w-full flex justify-between">
            <div class="text-xl">{{ __('Update Center') }}</div>
            <div>
                <a
                    class="border border-slate-500 py-1 px-4 rounded text-slate-700 text-sm hover:text-white hover:bg-slate-700"
                    href="{{ route('admin.center.index') }}">{{ __('Centers') }}
                </a>
            </div>
        </div>
    </x-slot>

    <form action="{{ route('admin.center.update', $center->id) }}" method="POST" enctype="multipart/form-data">
        @csrf
        @method('PUT')
        <div class="flex flex-wrap justify-center w-full bg-white p-4" x-data="centerData">
            <x-labeled-input class="w-full lg:w-1/2 p-1" name="code" :value="old('code', $center->code)" required/>
            <x-labeled-input class="w-full lg:w-1/2 p-1" name="name" label="Institute Name" :value="old('name', $center->name)" required/>
            <x-labeled-input class="w-full lg:w-1/2 p-1" name="owner_name" :value="old('owner_name', $center->owner_name)" required/>
            <x-labeled-input class="w-full lg:w-1/2 p-1" name="fathers_name" :value="old('fathers_name', $center->fathers_name)" required/>
            <x-labeled-input class="w-full lg:w-1/2 p-1" name="mothers_name" :value="old('mothers_name', $center->mothers_name)" required/>
            <x-labeled-select class="w-full lg:w-1/2 p-1" name="religion" required>
                @foreach(\App\Enums\Religion::getInstances() as $religion)
                    <option value="{{ $religion->value }}" @selected(old('religion', $center->religion->value) == $religion->value)>{{ $religion->key }}</option>
                @endforeach
            </x-labeled-select>
            <x-labeled-select class="w-full lg:w-1/2 p-1" name="gender" required>
                @foreach(\App\Enums\Gender::getInstances() as $gender)
                    <option value="{{ $gender->value }}" @selected(old('gender', $center->gender->value) == $gender->value)>{{ $gender->key }}</option>
                @endforeach
            </x-labeled-select>
            <x-labeled-select class="w-full lg:w-1/2 p-1" name="division" x-model="division" x-ref="division" required>
                @foreach($divisions as   $division)
                    <option value="{{ $division->id }}" @selected(old('division', $center->division) == $division->id)>{{ $division->name }}</option>
                @endforeach
            </x-labeled-select>
            <x-labeled-select class="w-full lg:w-1/2 p-1" x-model="district"   x-ref="district" name="district" required>
                <template x-for="_district in districts">
                    <option x-bind:value="_district.id" x-html="_district.name"></option>
                </template>
            </x-labeled-select>
            <x-labeled-select class="w-full lg:w-1/2 p-1" x-model="upazilla"  name="upazilla" required>
                <template x-for="upazill in upazillas">
                    <option x-bind:value="upazill.id"  x-html="upazill.name"></option>
                </template>
            </x-labeled-select>
            <x-labeled-input class="w-full lg:w-1/2 p-1"  name="nationality" :value="old('nationality', $center->nationality)"  />
            <x-labeled-input class="w-full lg:w-1/2 p-1" name="post_office" :value="old('post_office', $center->post_office)"  />

            <x-labeled-input class="w-full lg:w-1/2 p-1" name="address" :value="old('address', $center->address)" required/>
            <x-labeled-input class="w-full lg:w-1/2 p-1" name="mobile" :value="old('mobile', $center->mobile)" pattern="\d{11}" x-on:input="$event.target.setCustomValidity($event.target.validity.patternMismatch ? 'Phone number should be 11 digits' : '')" required/>
            <x-labeled-input class="w-full lg:w-1/2 p-1" name="email" :value="old('email', $center->email)"   type="email"/>
            <x-labeled-select class="w-full lg:w-1/2 p-1" name="status" required>
                @foreach(\App\Enums\CenterStatus::getInstances() as $status)
                    <option value="{{ $status->value }}" @selected(old('status', $center->status->value) == $status->value)>{{ $status->key }}</option>
                @endforeach
            </x-labeled-select>
            <x-labeled-input class="w-full lg:w-1/2 p-1" name="photo" :value="old('photo', $center->photo)" type="file" accept="image/*"/>
            <x-labeled-input class="w-full lg:w-1/2 p-1" name="authority_signature" :value="old('authority_signature', $center->authority_signature)" type="file" accept="image/*"/>
            <x-labeled-input class="w-full lg:w-1/2 p-1" name="nid_photo" :value="old('nid_photo', $center->nid_photo)" type="file" accept="image/*"/>
            <x-labeled-input class="w-full lg:w-1/2 p-1" name="trade_license" :value="old('trade_license', $center->trade_license)" type="file" accept="image/*"/>

            <x-labeled-input class="w-full lg:w-1/2 p-1" name="password"    label="Password" type="password"/>
            <x-labeled-input class="w-full lg:w-1/2 p-1" name="password_confirmation"   label="Confirm Password" type="password"/>

            <div class="w-full pt-4 flex justify-end">
                <x-button>{{ __('Update') }}</x-button>
            </div>
        </div>
    </form>

    <x-slot name="beforeScript">
        <script>
            document.addEventListener('alpine:init', () => {
                Alpine.data('centerData', () => ({
                    division: @js(old('division', $center->division)),
                    district: @js(old('district', $center->district)),
                    upazilla:  @js(old('upazilla', $center->upazilla)),
                    districts: [],
                    upazillas: [],
                    init(){
                        this.filterDistricts(this.division ?? this.$refs.division.value)
                        this.$watch('division', this.filterDistricts.bind(this))
                        this.$watch('district', this.filterUpazillas.bind(this))
                    },

                    filterDistricts(division){
                        const districts = Object.entries(@js($districts)).map(item => ({
                            id: item[0],
                            name: item[1].name,
                            division_id: item[1].division_id,
                        }))
                        this.districts = districts.filter(district => district.division_id == division)

                        setTimeout(() => {
                            this.district = parseInt(this.district) + '';
                            this.filterUpazillas(this.district ?? this.$refs.district.value)
                        }, 10)
                    },
                    filterUpazillas(district){
                        const upazillas = Object.entries(@js($upazilas)).map(item => ({
                            id: item[0],
                            name: item[1].name,
                            district_id: item[1].district_id,
                        }))
                        this.upazillas = upazillas.filter(upazilla => upazilla.district_id == district)
                        setTimeout(() => {
                            this.upazilla = parseInt(this.upazilla) + '';
                        }, 10)
                    }
                }))
            })
        </script>
    </x-slot>
</x-admin-app-layout>
