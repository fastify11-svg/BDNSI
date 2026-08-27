<x-frontend-layouts>

    <div class="bg-light">
        <div class="py-5">
            <div class="container">
                <div class="card shadow-lg border-0 rounded-3">
                    <div class="row g-0">
                        <!-- Image Section -->
                        <div class="col-md-4 p-4 text-center">

                            <img src="{{$data->picture ?? ''}}"
                                 class="rounded-circle"
                                 alt="Director Image"
                                 style="border: 6px solid #6aa84f; width: 200px; height: 200px;">
                        </div>
                        <style>
                            .pr-2{
                                padding-right: 10px;
                            }
                        </style>
                        <div class="col-md-8 p-4">
                            <h3 class="text-center text-orange-500 fw-bold mb-4">{{__t('Student Information')}}</h3>
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item bg-c text-white rounded-2 mb-2 d-flex align-items-center">
                                    <div class="fw-bold w-50">{{__t('Student Name')}}</div>
                                    <div class="text-center w-10 pr-2">:  </div>
                                    <div class="w-50 pr-2">{{$data->name ?? 'N/A'}}</div>
                                </li>
                                <li class="list-group-item bg-c text-white rounded-2 mb-2 d-flex align-items-center">
                                    <div class="fw-bold w-50">Father Name</div>
                                    <div class="text-center w-10 pr-2">:  </div>
                                    <div class="w-50 pr-2">{{$data->fathers_name ?? 'N/A'}}</div>
                                </li>
                                <li class="list-group-item bg-c text-white rounded-2 mb-2 d-flex align-items-center">
                                    <div class="fw-bold w-50">Mother Name</div>
                                    <div class="text-center w-10 pr-2">:  </div>
                                    <div class="w-50">{{$data->mothers_name ?? 'N/A'}}</div>
                                </li>
                                <li class="list-group-item bg-c text-white rounded-2 mb-2 d-flex align-items-center">
                                    <div class="fw-bold w-50">Gender</div>
                                    <div class="text-center w-10 pr-2">:  </div>
                                    <div class="w-50">{{$data->gender->key ?? 'N/A'}}</div>
                                </li>
                                <li class="list-group-item bg-c text-white rounded-2 mb-2 d-flex align-items-center">
                                    <div class="fw-bold w-50">Student Thana</div>
                                    <div class="text-center w-10 pr-2">:  </div>
                                    <div class="w-50">{{$data->permanent_address ?? 'N/A'}}</div>
                                </li>
                                <li class="list-group-item bg-c text-white rounded-2 mb-2 d-flex align-items-center">
                                    <div class="fw-bold w-50">Student District</div>
                                    <div class="text-center w-10 pr-2">:  </div>
                                    <div class="w-50">{{$data->present_address ?? 'N/A'}}</div>
                                </li>



                                <li class="list-group-item bg-c text-white rounded-2 mb-2 d-flex align-items-center">
                                    <div class="fw-bold w-50">Institute Name</div>
                                    <div class="text-center w-10 pr-2">:  </div>
                                    <div class="w-50">{{$data->center->name ?? 'N/A'}}</div>
                                </li>
                                <li class="list-group-item bg-c text-white rounded-2 mb-2 d-flex align-items-center">
                                    <div class="fw-bold w-50">Course Name</div>
                                    <div class="text-center w-10 pr-2">:</div>
                                    <div class="w-50">{{$data->subject->name ?? 'N/A'}}</div>
                                </li>
                                <li class="list-group-item bg-c text-white rounded-2 mb-2 d-flex align-items-center">
                                    <div class="fw-bold w-50">Course Duration</div>
                                    <div class="text-center w-10 pr-2">:  </div>
                                    <div class="w-50">{{$data->course_duration ?? 'N/A'}}</div>
                                </li>
                                <li class="list-group-item bg-c text-white rounded-2 mb-2 d-flex align-items-center">
                                    <div class="fw-bold w-50">Session</div>
                                    <div class="text-center w-10 pr-2">:  </div>
                                    <div class="w-50">{{$data->session->name ?? 'N/A'}}</div>
                                </li>

                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</x-frontend-layouts>
