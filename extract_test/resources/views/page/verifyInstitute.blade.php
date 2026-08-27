<x-frontend-layouts>

    <div class="container" x-data="centerData">
        <div class="branch-filter-wrap mt-4 py-4">
            <div class="text-center mb-3">
                <h5>{{__t('Filter Verified Branch')}}</h5>
            </div>
            <form action="{{ route('verifiedInstitute') }}" method="get">
                <div class="row gap-2 justify-content-center shadow-lg p-4">
                    <div class="col-md-3">
                        <select class="form-control" name="division" x-model="division" required aria-label="Division select">
                            <option value="" disabled selected>Select Division</option>
                            @foreach($divisions as  $division)
                                <option value="{{ $division->id }}" @selected(old('division') == $division->id)>{{ $division->name??'' }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="col-md-3">
                        <select class="form-control" name="district" x-model="district" required aria-label="District select">
                            <option value="" disabled selected>Select District</option>
                            <template x-for="district in districts" :key="district.id">
                                <option :value="district.id" x-text="district.name"></option>
                            </template>
                        </select>
                    </div>
                    <div class="col-md-3">
                        <select class="form-control" name="upazilla" x-model="upazilla" required aria-label="Upazilla select">
                            <option value="" disabled selected>Select Upazilla</option>
                            <template x-for="upazilla in upazillas" :key="upazilla.id">
                                <option :value="upazilla.id" x-text="upazilla.name"></option>
                            </template>
                        </select>
                    </div>
                    <div class="col-md-2">
                        <button type="submit" class="btn btn-success" >{{__t('Search')}}</button>
                        <button type="reset" class="btn btn-danger" x-on:click="resetFilters">{{__t('Reset')}}</button>
                    </div>
                </div>
            </form>
        </div>
        <div class="row w-100" id="branch_wrap">
            @forelse($centers as $center)
                <div class="col-lg-3 col-md-3 col-sm-6 col-6 p-3  ">
                    <x-institute :institute="$center"/>

                </div>
            @empty
                <div class="p-5 mb-4 bg-body-tertiary rounded-3">
                    <div class="container-fluid py-5 text-center">
                        <h1 class="display-5 fw-bold">{{__t('No Institute Found')}}</h1>
                    </div>
                </div>
            @endforelse
        </div>
        <div class="w-100 py-4 d-flex justify-content-end">
            {{ $centers->links('page.paginate') }}
        </div>
    </div>

    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js" integrity="sha512-v2CJ7UaYy4JwqLDIrZUI/4hqeoQieOmAZNXBeQyjo21dadnwR+8ZaIJVT8EE2iyI61OV8e6M8PP2/4hpQINQ/g==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>

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
                    // Fetch and set districts based on the initial division
                    if (this.division) {
                        this.filterDistricts();
                    }

                    // Fetch and set upazillas based on the initial district
                    if (this.district) {
                        this.filterUpazillas();
                    }

                    // Watchers for changes
                    this.$watch('division', value => {
                        this.district = '';
                        this.upazilla = '';
                        this.filterDistricts();
                    });

                    this.$watch('district', value => {
                        this.upazilla = '';
                        this.filterUpazillas();
                    });
                },
                filterDistricts() {
                    const allDistricts = @json($districts);
                    this.districts = Object.entries(allDistricts)
                        .map(([id, district]) => ({
                            id: id,
                            name: district.name,
                            division_id: district.division_id
                        }))
                        .filter(district => district.division_id == this.division);
                },
                filterUpazillas() {
                    const allUpazillas = @json($upazilas);
                    this.upazillas = Object.entries(allUpazillas)
                        .map(([id, upazilla]) => ({
                            id: id,
                            name: upazilla.name,
                            district_id: upazilla.district_id
                        }))
                        .filter(upazilla => upazilla.district_id == this.district);
                },
                resetFilters() {
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
