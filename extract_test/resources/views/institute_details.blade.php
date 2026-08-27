<x-frontend-layouts>

    <div class="mt-5 bg-light">
        <div class="py-5">
            <div class="container">
                <div class="card shadow-lg border-0 rounded-lg">
                    <div class="row g-0">
                        <!-- Image Section -->
                        <div class="col-md-4 p-4 text-center">
                            <img src="{{$data->director_image ?? ''}}"
                                 class="rounded-circle"
                                 alt="Director Image"
                                 style="border: 6px solid #7024A8; width: 200px; height: 200px;">

                        </div>
                        <!-- Details Section -->
                        <div class="col-md-8 p-1">
                            <div class="text-center mb-4">
                                <h2 class="fw-bold">{{$data->name ?? ''}}</h2>
                            </div>
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item bg-c text-white rounded-2 mb-2 d-flex align-items-center">
                                    <span class="fw-bold w-50">{{__t('Email')}}</span>
                                    <span class="px-2">:</span>
                                    <span class="w-50">{{$data->email ?? 'N/A'}}</span>
                                </li>
                                <li class="list-group-item bg-c text-white rounded-2 mb-2 d-flex align-items-center">
                                    <span class="fw-bold w-50">{{__t('Director Name')}}</span>
                                    <span class="px-2">:</span>
                                    <span class="w-50">{{$data->owner_name ?? 'N/A'}}</span>
                                </li>
                                <li class="list-group-item bg-c text-white rounded-2 mb-2 d-flex align-items-center">
                                    <span class="fw-bold w-50">{{__t('Address')}}</span>
                                    <span class="px-2">:</span>
                                    <span class="w-50">{{$data->address ?? 'N/A'}}</span>
                                </li>
                                <li class="list-group-item bg-c text-white rounded-2 mb-2 d-flex align-items-center">
                                    <span class="fw-bold w-50">{{__t('District')}}</span>
                                    <span class="px-2">:</span>
                                    <span class="w-50">{{ \App\Lib\Geo::districts()[$data->district]['name'] ?? 'N/A' }}</span>
                                </li>
                                <li class="list-group-item bg-c text-white rounded-2 mb-2 d-flex align-items-center">
                                    <span class="fw-bold w-50">{{__t('Upazilla')}}</span>
                                    <span class="px-2">:</span>
                                    <span class="w-50">{{ \App\Lib\Geo::upazillas()[$data->upazilla]['name'] ?? 'N/A' }}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>



</x-frontend-layouts>
