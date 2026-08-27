<x-frontend-layouts>

    <div class="container mt-5">
        <div class="card shadow-lg border-0 rounded">
            <div class="row g-0">
                <!-- Image Section -->
                <div class="col-md-4 p-3">
                    <img src="{{$data->photo ?? ''}}" class="img-fluid rounded" alt="Course Image">
                </div>
                <!-- Details Section -->
                <div class="col-md-8 p-3">
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item bg-c text-white rounded d-flex align-items-center mb-2">
                            <div class="fw-bold w-50">{{__t('Course Name')}}</div>
                            <div class="text-center w-10 pr-2">:</div>
                            <div class="w-50 p-2">{{$data->name ?? 'N/A'}}</div>
                        </li>
                        <li class="list-group-item bg-c text-white rounded d-flex align-items-center mb-2">
                            <div class="fw-bold w-50">{{__t('Course Duration')}}</div>
                            <div class="text-center w-10 pr-2">: </div>
                            <div class="w-50 p-2">{{$data->duration ?? 'N/A'}}</div>
                        </li>
                        <li class="list-group-item bg-c text-white rounded d-flex align-items-center mb-2">
                            <div class="fw-bold w-50">{{__t('Course Rate')}}</div>
                            <div class="text-center w-10 pr-2">: </div>
                            <div class="w-50 p-2">{{$data->rate ?? 'N/A'}}</div>
                        </li>
                        <li class="list-group-item bg-c text-white rounded d-flex align-items-center mb-2">
                            <div class="fw-bold w-50">{{__t('Educational Qualification')}}</div>
                            <div class="text-center w-10 pr-2">: </div>
                            <div class="w-50 p-2">{{$data->education_qualification ?? 'N/A'}}</div>
                        </li>
                        <li class="list-group-item bg-c text-white rounded d-flex align-items-center">
                            <div class="fw-bold w-50">{{__t('Course Details')}}</div>
                            <div class="text-center w-10 pr-2">: </div>
                            <div class="w-50 p-2">{!! $data->course_details ?? 'N/A' !!}</div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

</x-frontend-layouts>
