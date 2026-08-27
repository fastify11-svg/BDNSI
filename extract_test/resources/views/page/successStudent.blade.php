<x-frontend-layouts>


    <div class="bg-light">
        <!-- Breadcrumb -->
        <div class="d-flex align-items-center py-2  mt-3  px-4">
            <a href="#" class="text-secondary text-decoration-none">Home</a>
            <span class="mx-2 text-muted">/</span>
            <a href="#" class="text-secondary text-decoration-none">{{__t('Our Success Students')}}</a>
        </div>

        <!-- Main Content -->
        <div class="min-vh-100">
            <div class="container py-3">
                <div class="row">
                    @forelse($students as $student)
                        <div class="col-12 col-md-6 col-lg-4 col-xl-3 p-4">
                            <x-student :student="$student" />
                        </div>
                    @empty
                        <div class="col-12 text-center">
                            <strong class="text-danger">Not Found Institute</strong>
                        </div>
                    @endforelse
                </div>

                <!-- Pagination -->
                <div class="d-flex justify-content-center py-4">
                    {{$students->links()}}
                </div>
            </div>
        </div>
    </div>


</x-frontend-layouts>
